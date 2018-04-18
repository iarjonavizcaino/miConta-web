import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader, RtCheckEvent } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../../_catalog/billing-catalog/billing-catalog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NewBillComponent } from '../../_catalog/new-bill/new-bill.component';
import { ModalFechaComponent } from '../../_catalog/modal-fecha/modal-fecha.component';
import { NotificationsService } from 'angular2-notifications';
import { BillProvider, TaxesProvider, HistoricalProvider, TaxpayerProvider } from '../../../providers/providers';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ModalImpuestosComponent } from '../../_catalog/modal-impuestos/modal-impuestos.component';
import { ModalCierreBimestreComponent } from '../../_catalog/modal-cierre-bimestre/modal-cierre-bimestre.component';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import * as accounting from 'accounting-js';
import { BidiModule } from '@angular/cdk/bidi';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xls';

@Component({
  selector: 'app-resumen-contribuyente',
  templateUrl: './resumen-contribuyente.component.html',
  styleUrls: ['./resumen-contribuyente.component.scss']
})
export class ResumenContribuyenteComponent implements OnInit, OnDestroy {
  updateGeneralPublic: boolean;

  headersIngresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'createdDate', default: 'No date', moment: true, align: 'center' },  // from xml file
    { name: 'Cliente', prop: 'customer_provider.name', default: 'No customer', width: '15' },
    { name: 'Subtotal', prop: 'subtotal', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'IVA', prop: 'taxes', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo fact.', prop: 'captureMode', align: 'center', chip: true, width: '7' },
    { name: 'Fecha cobro', prop: 'cobrada_pagadaDate', default: 'Sin fecha', align: 'center', moment: true },
    { name: 'Público Gral', prop: 'general_public', default: false, align: 'center', input: 'toggleGeneralPublic' },
    { name: 'Cobrada', prop: 'cobrada_pagada', input: 'toggleFec' },
  ];
  headersEgresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'createdDate', default: 'No date', moment: true, align: 'center' },
    { name: 'Proveedor', prop: 'customer_provider.name', default: 'No customer', width: '15' },
    { name: 'Subtotal', prop: 'subtotal', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'IVA', prop: 'taxes', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    // { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo fact.', prop: 'captureMode', default: '', align: 'center', chip: true, width: '7' },
    { name: 'Fecha pago', prop: 'cobrada_pagadaDate', default: 'Sin fecha', align: 'center', moment: true },
    { name: 'Pagada', prop: 'cobrada_pagada', input: 'toggleFec' },
  ];

  // ingresos
  allIngresosChecked = false;
  checkedIngresos = 0;
  selectedIngresos: any;
  dataIngresos = [];
  actionIngresos = new Subject<RtAction>();

  // egresos
  allEgresosChecked = false;
  checkedEgresos = 0;
  selectedEgresos: any;
  dataEgresos = [];
  actionEgresos = new Subject<RtAction>();

  sub: any;
  contribuyente: string;
  accountant: string;
  office: string;
  years = [];
  bimesters = [];
  updateDate: boolean;
  updateDeducible: boolean;

  currentBimester = 'ENE-FEB 2018';
  selectedYear;
  selectedBimester: any;
  currentPeriod: any;

  currentTaxpayer: any;
  // to hadle breadcrumb
  roleUp = '';
  users = [];
  usersBackup = [];
  allPeriods: boolean;

  // taxes
  ISR = {
    isrNetoAPagar: 0,
    debtSAT: 0
  };
  IVA = {
    ivaCargo: 0,
    ivaFavor: 0
  };
  totalTax: 0;

  // suma ingresos&egresos
  sumIngresos = 0;
  ingresosCobrados = 0;
  ingresosPorCobrar = 0;
  ingresosIVA16 = 0;

  sumEgresos = 0;
  egresosPagados = 0;
  egresosPorPagar = 0;
  egresosIVA16 = 0;
  periodActive = true;

  // progress all year
  progressYear = 0;

  buttonPeriod: any = {
    text: '',
    color: ''
  };
  constructor(
    private taxProv: TaxesProvider,
    private billProv: BillProvider,
    private taxpayerProv: TaxpayerProvider,
    private notify: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private route: ActivatedRoute,
    private historicalProv: HistoricalProvider) { }

  ngOnInit() {
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name.toString().toLowerCase();
    console.log(this.roleUp);
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // tslint:disable-next-line:triple-equals
        if (params.name) {
          this.contribuyente = params.name;
          this.office = params.office;
          this.accountant = params.accountant;
          this.headersIngresos.splice(0, 0, { name: 'Selec.', prop: 'checked', input: 'checkbox', width: '8' });
          this.headersEgresos.splice(0, 0, { name: 'Selec.', prop: 'checked', input: 'checkbox', width: '8' });
          // tslint:disable-next-line:max-line-length
          this.headersEgresos.splice(this.headersEgresos.length - 1, 0, { name: 'Deducible', prop: 'deducible', input: 'toggleDeducible', width: '12', align: 'center' });
        }
      });

    this.loadUsers();

    this.historicalProv.getActive(this.currentTaxpayer._id).subscribe(data => {
      this.currentPeriod = data;
      this.selectedYear = this.currentPeriod.exercise;
      this.loadBimesters();
      const num = this.currentPeriod.period.num - 1;
      this.selectedBimester = this.bimesters[num];
      this.currentBimester = this.selectedBimester.name + ' ' + this.selectedYear;
      this.periodActive = !this.currentPeriod.period.active ? false : true;
      if (this.periodActive) {
        this.buttonPeriod = {
          text: 'Cerrar Periodo',
          color: 'warn'
        };
        this.loadBills({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num, active: 1 });
        this.loadTaxes({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
      } else {
        this.buttonPeriod = {
          text: 'Consultar Periodo',
          color: 'primary'
        };
        this.loadBills({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num, active: 0 });
        this.loadTaxes({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
      }
    });

    // const bimesterNum = Math.trunc((new Date().getMonth() / 2) + 1);
    // const index = this.bimesters.findIndex(bimester => bimester.num === bimesterNum);
    // if (index !== -1) {
    //   this.selectedBimester = this.bimesters[index];
    // }

    // console.log(this.selectedBimester);
  }// ngOnInit()

  private loadUsers() {
    const isTax = JSON.parse(localStorage.getItem('user'));
    if (isTax.role.name === 'Contribuyente') {
      this.currentTaxpayer = isTax; // only get login the taxpayer
    } else {  // take other
      this.currentTaxpayer = JSON.parse(localStorage.getItem('taxpayer'));
    }
    const users = JSON.parse(localStorage.getItem('users'));
    if (users) {
      this.users = users;
      if (isTax.role.name === 'Superadmin') {
        if (this.users.length > 3) {
          this.users.length = 3;
        }
      } else if (isTax.role.name === 'Despacho') {
        if (this.users.length > 2) {
          this.users.length = 2;
        }
      } else if (isTax.role.name === 'Contador') {
        if (this.users.length > 1) {
          this.users.length = 1;
        }
      } else {
        this.users.length = 0;
      }
    }
  }

  updateUsers() {
    this.users.pop();
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onManualBillEgresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.manualBill(null, false, 'Nueva factura');
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      newBill.taxpayer = this.currentTaxpayer._id;
      this.billProv.create(newBill).subscribe((res) => {
        this.actionEgresos.next({ name: RtActionName.CREATE, newItem: newBill });
        console.log(res);
        this.notify.success('Registro exitoso', 'Se ha creado la nueva factura');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factura');
        console.log(err);
      });
    });
  }

  onManualBillIngresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.manualBill(null, true, 'Nueva factura');
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      newBill.taxpayer = this.currentTaxpayer._id;
      // use provier and notify
      this.billProv.create(newBill).subscribe((res) => {
        console.log(res);
        this.actionIngresos.next({ name: RtActionName.CREATE, newItem: newBill });
        this.notify.success('Registro exitoso', 'Se ha creado la nueva factura');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factural');
        console.log(err);
      });
    });
  }

  private manualBill(bill: any, type: boolean, title: string) {
    return this.dialogCtrl.open(NewBillComponent, {
      disableClose: true,
      data: {
        bill: bill,
        ingresos: type,
        title: title
      }
    });
  }

  onEgresosSelected(ev: any) {
    this.selectedEgresos = ev.data;
  }

  onEgresosChecked(ev: any) {
    if (!ev.item.checked) {
      this.checkedEgresos++;
      ev.item.checked = !ev.item.checked;
    } else {
      this.checkedEgresos--;
    }
  }

  toggleDeducible(ev: any) {  // update OK
    this.updateDeducible = true;
    this.selectedEgresos = ev.item;
    ev.item.checked = false;
    this.selectedEgresos.deducible = !this.selectedEgresos.deducible;
    this.update(this.selectedEgresos._id, this.selectedEgresos);
    this.actionEgresos.next({ name: RtActionName.UPDATE, itemId: this.selectedEgresos._id, newItem: this.selectedEgresos });
  }

  onToggleFec(ev: any) {
    this.updateDate = true;
    const updateBill = ev.item;
    if (!updateBill.cobrada_pagada) {
      // open a modal
      const dialogRef = this.dialogCtrl.open(ModalFechaComponent, {
        disableClose: true,
        data: {
          config: {
            title: 'Fecha de cobro',
            placeholder: 'Seleccionar fecha'
          }
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) { ev.item.cobrada_pagada = !ev.item.cobrada_pagada; return; }
        updateBill.cobrada_pagadaDate = result;
        updateBill.cobrada_pagada = true;
        this.update(updateBill._id, updateBill);  // without _id?
      });
    } else {
      // already in true past to false
      updateBill.cobrada_pagada = false;
      updateBill.cobrada_pagadaDate = '';
      this.update(updateBill._id, updateBill);
    }
  }

  onDownLoadExcelIngresos(ev: any) {
    this.stopPropagation(ev);
    if ((this.checkedIngresos === 0 && this.dataIngresos.length) || this.checkedIngresos === this.dataIngresos.length) {
      // let data = this.dataIngresos.slice();
      const data = this.dataIngresos.map(a => ({...a}));
      data.forEach(bill => {
        delete bill._id;
        delete bill.taxpayer;
        bill.Tipo = bill.type;
        delete bill.type;
        bill.Cobrada = bill.cobrada_pagada ? 'Sí' : 'No';
        delete bill.cobrada_pagada;
        bill.Tasa = bill.tasa + '%';
        delete bill.tasa;
        bill.Impuestos = bill.taxes ? accounting.formatMoney(bill.taxes) : 0;
        delete bill.taxes;
        bill.Retenciones = bill.retenciones ? accounting.formatMoney(bill.retenciones) : 0;
        delete bill.retenciones;
        bill.Subtotal = accounting.formatMoney(bill.subtotal);
        delete bill.subtotal;
        bill.Total = accounting.formatMoney(bill.total);
        delete bill.total;
        delete bill.__v;
        delete bill.products;
        bill.Cliente = bill.customer_provider.name;
        delete bill.customer_provider;
        bill.Publico_General = bill.general_public ? 'Sí' : 'No';
        delete bill.general_public;
        bill.Metodo_pago = bill.payMethod.method;
        delete bill.payMethod;
        delete bill.deducible;
        bill.Fecha_Cobro = moment(bill.cobrada_pagadaDate).format('DD/MMM/YYYY');
        delete bill.cobrada_pagadaDate;
        bill.Fecha_Emision = moment(bill.createdDate).format('DD/MMM/YYYY');
        delete bill.createdDate;
        delete bill.checked;
      });
      this.exportAsExcelFile(data, `ingresos`);
    }
  }

  onDownLoadExcelEgresos(ev: any) {
    this.stopPropagation(ev);
    if ((this.checkedEgresos === 0 && this.dataEgresos.length) || this.checkedEgresos === this.dataEgresos.length) {
      // let data = this.dataIngresos.slice();
      const data = this.dataEgresos.map(a => ({...a}));
      data.forEach(bill => {
        delete bill._id;
        delete bill.taxpayer;
        bill.Tipo = bill.type;
        delete bill.type;
        bill.Pagada = bill.cobrada_pagada ? 'Sí' : 'No';
        delete bill.cobrada_pagada;
        bill.Tasa = bill.tasa + '%';
        delete bill.tasa;
        bill.Impuestos = bill.taxes ? accounting.formatMoney(bill.taxes) : 0;
        delete bill.taxes;
        bill.Retenciones = bill.retenciones ? accounting.formatMoney(bill.retenciones) : 0;
        delete bill.retenciones;
        bill.Subtotal = accounting.formatMoney(bill.subtotal);
        delete bill.subtotal;
        bill.Total = accounting.formatMoney(bill.total);
        delete bill.total;
        delete bill.__v;
        delete bill.products;
        bill.Proveedor = bill.customer_provider.name;
        delete bill.customer_provider;
        bill.Publico_General = bill.general_public ? 'Sí' : 'No';
        delete bill.general_public;
        bill.Metodo_pago = bill.payMethod.method;
        delete bill.payMethod;
        bill.Deducible = bill.deducible ? 'Sí' : 'No';
        delete bill.deducible;
        bill.Fecha_Cobro = moment(bill.cobrada_pagadaDate).format('DD/MMM/YYYY');
        delete bill.cobrada_pagadaDate;
        bill.Fecha_Emision = moment(bill.createdDate).format('DD/MMM/YYYY');
        delete bill.createdDate;
        delete bill.checked;
      });
      this.exportAsExcelFile(data, `egresos`);
    }
  }

  private exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');
    XLSX.writeFile(workbook, `${excelFileName}_${this.currentBimester}_${this.currentTaxpayer.name}${EXCEL_EXTENSION}`);
  }

  onCheckAllEgresos(ev: any) {
    this.allEgresosChecked = !this.allEgresosChecked;
    if (this.allEgresosChecked) {
      this.dataEgresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.dataEgresos.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedEgresos = this.dataEgresos.length;
    } else {
      this.checkedEgresos = 0;
      this.dataEgresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }
  /************************************************************************************ */
  changeToGeneralPublic(ev: any) {
    this.updateGeneralPublic = true;
    this.selectedIngresos = ev.item;
    this.selectedIngresos.general_public = !this.selectedIngresos.general_public;
    this.update(this.selectedIngresos._id, this.selectedIngresos);
    this.actionIngresos.next({ name: RtActionName.UPDATE, itemId: this.selectedIngresos._id, newItem: this.selectedIngresos });
  }

  onIngresosSelected(ev) {
    this.selectedIngresos = ev.data;
  }

  onIngresosChecked(ev: any) {
    if (!ev.item.checked) {
      this.checkedIngresos++;
      ev.item.checked = !ev.item.checked;
    } else {
      this.checkedIngresos--;
    }
  }

  onCheckAllIngresos(ev: any) {
    this.allIngresosChecked = !this.allIngresosChecked;
    if (this.allIngresosChecked) {
      this.dataIngresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.dataIngresos.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedIngresos = this.dataIngresos.length;
    } else {
      this.checkedIngresos = 0;
      this.dataIngresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }
  /********************************************************************************* */
  onViewBillIngresos(ev) {
    this.stopPropagation(ev);
    let dialogRef;
    if (this.selectedIngresos.captureMode === 'M' && this.periodActive) {
      dialogRef = this.manualBill(this.selectedIngresos, true, 'Detalle de Factura');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) { return; }
        this.update(this.selectedIngresos._id, res);
      });
    } else {
      dialogRef = this.billModal(this.selectedIngresos, false, 'Detalle de Factura');
      dialogRef.afterClosed().subscribe(res => {
        this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
        if (!res) { return; }
      });
    }
  }

  onViewBillEgresos(ev: any) {
    this.stopPropagation(ev);
    let dialogRef;
    if (this.selectedEgresos.captureMode === 'M' && this.periodActive) {
      dialogRef = this.manualBill(this.selectedEgresos, false, 'Detalle de Factura');
      dialogRef.afterClosed().subscribe(res => {
        if (!res) { return; }
        this.update(this.selectedEgresos._id, res);
      });
    } else {
      dialogRef = this.billModal(this.selectedEgresos, false, 'Datos de Factura');
      dialogRef.afterClosed().subscribe(res => {
        this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
        if (!res) { return; }
      });
    }
  }

  billModal(bill: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(BillingCatalogComponent, {
      disableClose: true,
      data: {
        title: title,
        readonly: readonly,
        bill: bill
      }
    });
  }

  onDownloadXMLIngresos(ev: any) {
    this.stopPropagation(ev);
  }

  onDownloadXMLEgresos(ev: any) {
    this.stopPropagation(ev);
  }

  onDownloadPDFEgresos(ev: any) {
    this.stopPropagation(ev);
    this.billProv.generateBill(this.selectedEgresos._id);
  }

  onDownloadPDFIngresos(ev: any) {
    this.stopPropagation(ev);
    this.billProv.generateBill(this.selectedIngresos._id);
  }

  onDeleteStatementEgresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalConfirm();
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) { return; } // confirm yes: true, cancel: false
      this.billProv.delete(this.selectedEgresos._id).subscribe((res) => {
        this.loadBills({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num, active: 1 });
        this.loadTaxes({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
        this.actionEgresos.next({ name: RtActionName.DELETE, itemId: this.selectedEgresos._id, newItem: this.selectedEgresos });
        this.notify.success('Acción exitosa', 'La factura se ha eliminado');
      }, err => {
        this.notify.error('Error', 'No se pudo eliminar la factura');
        console.log(err);
      });
    });
  }

  onDeleteStatementIngresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalConfirm();
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) { return; }
      this.billProv.delete(this.selectedIngresos._id).subscribe((res) => {
        this.actionIngresos.next({ name: RtActionName.DELETE, itemId: this.selectedIngresos._id, newItem: this.selectedIngresos });
        this.notify.success('Acción exitosa', 'La factura se ha eliminado');
      }, err => {
        this.notify.error('Error', 'No se pudo eliminar la factura');
        console.log(err);
      });
    });
  }

  onIVA(ev: any) {
    if (!this.IVA) { return; }
    const dialogRef = this.dialogCtrl.open(ModalImpuestosComponent, {
      disableClose: true,
      data: {
        title: 'Detalle IVA',
        type: 'iva',
        tax: this.IVA,
        taxpayer: this.accountant ? false : true
      }
    });
    // tslint:disable-next-line:no-shadowed-variable
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { return; }
    }, err => {
      console.log(err);
    });
  }

  onISR(ev: any) {
    if (!this.ISR) {
      // this shit is when get login with storage in the method that read taxes doesn't run
      // this.loadBills({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
      const month = Math.trunc((new Date().getMonth() / 3) + 1);
      const year = this.currentPeriod.exercise;

      this.taxProv.getISR(this.currentTaxpayer._id, { year: this.selectedYear, bimester: this.selectedBimester.num }).subscribe(res => {
        this.ISR = res.ISR;
        const dialogRef = this.dialogCtrl.open(ModalImpuestosComponent, {
          disableClose: true,
          data: {
            title: 'Detalle ISR',
            type: 'isr',
            tax: this.ISR
          }
        });
        // tslint:disable-next-line:no-shadowed-variable
        dialogRef.afterClosed().subscribe(res => {
          if (!res) { return; }
        });
      }, err => {
        console.log(err);
      });

    } else {
      const dialogRef = this.dialogCtrl.open(ModalImpuestosComponent, {
        disableClose: true,
        data: {
          title: 'Detalle ISR',
          type: 'isr',
          tax: this.ISR
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) { return; }
      });
    }


  }
  private modalConfirm() {
    return this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        type: 'danger',
        title: 'Atención!',
        message: 'Estás seguro de eliminar la factura?'
      }
    });
  }

  private stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }

  private loadBills(filter: any) {
    this.billProv.getByTaxPayer(this.currentTaxpayer._id, filter).subscribe(bills => {
      // bills
      this.dataIngresos = bills.ingresos;
      this.dataEgresos = bills.egresos;

      // total
      this.sumIngresos = bills.sumIngresos;
      this.sumEgresos = bills.sumEgresos;
      this.ingresosIVA16 = bills.ingresosIVA16;
      this.egresosIVA16 = bills.egresosIVA16;

      // ingresos cobrados y por cobrar
      this.ingresosCobrados = bills.ingresosCobrados;
      this.ingresosPorCobrar = bills.ingresosPorCobrar;

      // egresos pagados y por pagar
      this.egresosPagados = bills.egresosPagados;
      this.egresosPorPagar = bills.egresosPorPagar;

    }, err => {
      console.log(err);
    });
  }

  private update(_id: string, bill: any) {
    this.billProv.update(_id, bill).subscribe((res) => {
      this.notify.success('Acción Exitosa', 'Factura actualizada correctamente');
      this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num }); // when the user mark a bill as payed
      this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num, active: 1 });
    }, err => {
      this.notify.error('Error', 'No se pudo actualizar la factura');
      if (this.updateDate) {
        bill.cobrada_pagada = false;
        bill.cobrada_pagadaDate = '';
        this.updateDate = false;
      } else if (this.updateDeducible) {
        this.selectedEgresos.deducible = !this.selectedEgresos.deducible;
        this.updateDeducible = false;
      } else if (this.updateGeneralPublic) {
        this.selectedIngresos.general_public = !this.selectedIngresos.general_public;
      }
    });
  }

  closePeriod() {
    const dialogRef = this.dialogCtrl.open(ModalCierreBimestreComponent, {
      disableClose: true,
      data: {
        ISR: this.ISR,
        IVA: this.IVA,
        debtSAT: this.ISR.debtSAT,
        debtIVA: this.currentTaxpayer.ivaFavor,
        periodName: this.currentPeriod.period.name,
        extraData: null
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      // formato del objeto que recibe la api al cerrar el periodo
      const earnings = [];
      const expenses = [];

      this.dataIngresos.forEach(ingreso => {
        if (ingreso.cobrada_pagada) {
          earnings.push(ingreso._id);
        }
      });

      this.dataEgresos.forEach(ingreso => {
        if (ingreso.cobrada_pagada) {
          expenses.push(ingreso._id);
        }
      });

      const data = {
        debtSAT: res.debtSAT,
        debtIVA: res.debtIVA,
        earnings: this.sumIngresos - this.sumEgresos, // ganancias periodo
        expenses: this.sumEgresos, // gastos periodo
        taxes: {
          isr: this.ISR.isrNetoAPagar,
          iva: this.IVA.ivaCargo
        },
        historico: res.historico,
        earningsBills: earnings,
        expensesBills: expenses
      };
      console.log('dataaa', data);
      this.historicalProv.closePeriod(data, this.currentPeriod._id).subscribe(response => {
        const difference = { debtSAT: data.debtSAT, ivaFavor: data.debtIVA };
        this.taxpayerProv.updateSATDebtIvaFavor(this.currentTaxpayer._id, difference).subscribe(debt => {
          this.currentTaxpayer = debt.taxpayer;
        });
        this.currentPeriod = response.historical;
        // const currentBim = Math.trunc((new Date().getMonth() / 2) + 1);
        // if (currentBim !== this.currentPeriod.period.num) {
        //   const bim = { name: this.currentPeriod.period.name, num: this.currentPeriod.period.num };
        //   this.bimesters.push(bim);
        // }
        this.bimesters.push({ name: this.currentPeriod.period.name, num: this.currentPeriod.period.num });
        this.selectedBimester = this.bimesters[this.bimesters.length - 1];
        this.currentBimester = this.bimesters[this.bimesters.length - 1].name + ' ' + this.selectedYear;
        this.periodActive = !this.currentPeriod.period.active ? false : true;
        if (this.periodActive) {
          this.buttonPeriod = {
            text: 'Cerrar Periodo',
            color: 'warn'
          };
          this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num + 1, active: 1 });
          this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num + 1 });
        } else {
          this.buttonPeriod = {
            text: 'Consultar Periodo',
            color: 'primary'
          };
          this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num + 1, active: 0 });
          this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num + 1 });
        }

      });
    });
  } // closePeriod

  showPeriod() {
    this.historicalProv.getPastPeriod(this.selectedYear, this.selectedBimester.num).subscribe(data => {
      const historical = data.historical;
      console.log(historical);
      const dialogRef = this.dialogCtrl.open(ModalCierreBimestreComponent, {
        disableClose: true,
        data: {
          readonly: true,
          ISR: historical.period.historico.miConta.ISR,
          IVA: historical.period.historico.miConta.IVA,
          debtSAT: historical.period.historico.accountant.debtSAT,
          debtIVA: historical.period.historico.accountant.debtIVA,
          periodName: historical.period.name,
          extraData: {
            ISR: {
              subtotal: historical.period.historico.accountant.ISR.subtotal,
              updates: historical.period.historico.accountant.ISR.updates,
              surcharges: historical.period.historico.accountant.ISR.surcharges,
              amount: historical.period.historico.accountant.ISR.amount,
            },
            IVA: {
              subtotal: historical.period.historico.accountant.IVA.amount,
              updates: historical.period.historico.accountant.IVA.updates,
              surcharges: historical.period.historico.accountant.IVA.surcharges,
              amount: historical.period.historico.accountant.IVA.amount,
            },
            accesories: historical.period.historico.accountant.accesories,
            totalTaxes: historical.period.historico.accountant.totalTaxes
          }
        }
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) { return; }
      });
    });
  }

  loadBimesters() {
    const year = new Date().getFullYear();
    for (let i = 2014; i <= year; i++) {
      this.years.push(i);
    }
    // const currentBim = Math.trunc((new Date().getMonth() / 2) + 1);

    this.bimesters = [
      {
        name: 'ENE-FEB',
        num: 1
      },
      {
        name: 'MAR-ABR',
        num: 2
      },
      {
        name: 'MAY-JUN',
        num: 3
      },
      {
        name: 'JUL-AGO',
        num: 4
      },
      {
        name: 'SEPT-OCT',
        num: 5
      },
      {
        name: 'NOV-DIC',
        num: 6
      }
    ];
    if (this.selectedYear === this.currentPeriod.exercise) {
      this.allPeriods = false;
      const index = this.bimesters.findIndex(bimester => bimester.num === this.currentPeriod.period.num);
      this.bimesters.splice(index + 1);
    } else {
      this.allPeriods = true;
      this.bimesters = [
        {
          name: 'ENE-FEB',
          num: 1
        },
        {
          name: 'MAR-ABR',
          num: 2
        },
        {
          name: 'MAY-JUN',
          num: 3
        },
        {
          name: 'JUL-AGO',
          num: 4
        },
        {
          name: 'SEPT-OCT',
          num: 5
        },
        {
          name: 'NOV-DIC',
          num: 6
        }
      ];
    }
  }

  getBimesterInfo(ev: any) {
    this.loadBimesters();
    if (!this.allPeriods) {
      if (this.currentPeriod.period.num < this.selectedBimester.num) {
        this.selectedBimester = this.bimesters[this.currentPeriod.period.num - 1];
      } else {
        this.selectedBimester = this.bimesters[this.selectedBimester.num - 1];
      }
    } else {
      this.selectedBimester = this.bimesters[this.selectedBimester.num - 1];
    }
    if (this.selectedBimester.num !== this.currentPeriod.period.num ||
      this.selectedYear !== this.currentPeriod.exercise) {
      this.periodActive = false;
    } else {
      this.periodActive = !this.currentPeriod.period.active ? false : true;
    }
    this.currentBimester = this.selectedBimester.name + ' ' + this.selectedYear;
    if (this.periodActive) {  // active period
      this.buttonPeriod = {
        text: 'Cerrar Periodo',
        color: 'warn'
      };
      this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num, active: 1 });
      this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
    } else {
      this.buttonPeriod = {
        text: 'Consultar Periodo',
        color: 'primary'
      };
      this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num, active: 0 });
      this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
      // past period: get data from historical
      // make request to historical and get info: ISR, IVA, bills, etc
      // use loadBill & loadTaxes, and someway modify to do not get bills in wrong period
    }
  }

  private loadTaxes(filter: any) {
    this.totalTax = 0;
    this.taxProv.getISR(this.currentTaxpayer._id, filter).subscribe(res => {
      this.ISR = res.ISR;
      this.totalTax += this.ISR.isrNetoAPagar;
    }, err => {
      console.log(err);
    });

    this.taxProv.getIVA(this.currentTaxpayer._id, filter).subscribe(res => {
      this.IVA = res.IVA;
      // this.totalTax += this.IVA.ivaCargo ? this.IVA.ivaCargo : this.IVA.ivaFavor;
      this.totalTax += this.IVA.ivaCargo;
    }, err => {
      console.log(err);
    });
  }
}// class
