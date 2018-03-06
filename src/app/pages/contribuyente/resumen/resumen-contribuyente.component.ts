import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader, RtCheckEvent } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../../_catalog/billing-catalog/billing-catalog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NewBillComponent } from '../../_catalog/new-bill/new-bill.component';
import { ModalFechaComponent } from '../../_catalog/modal-fecha/modal-fecha.component';
import { NotificationsService } from 'angular2-notifications';
import { BillProvider, TaxesProvider, HistoricalProvider } from '../../../providers/providers';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ModalImpuestosComponent } from '../../_catalog/modal-impuestos/modal-impuestos.component';
import { ModalCierreBimestreComponent } from '../../_catalog/modal-cierre-bimestre/modal-cierre-bimestre.component';

@Component({
  selector: 'app-resumen-contribuyente',
  templateUrl: './resumen-contribuyente.component.html',
  styleUrls: ['./resumen-contribuyente.component.scss']
})
export class ResumenContribuyenteComponent implements OnInit, OnDestroy {
  updateGeneralPublic: boolean;

  headersIngresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'createdDate', default: 'No date', moment: true },  // from xml file
    { name: 'Cliente', prop: 'customer_provider.name', default: 'No customer', width: '20' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Subtotal', prop: 'subtotal', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo fact.', prop: 'captureMode', align: 'center', chip: true },
    { name: 'Fecha cobro', prop: 'cobrada_pagadaDate', default: '', align: 'center', moment: true },
    { name: 'Cobrada', prop: 'cobrada_pagada', input: 'toggleFec' },
    { name: 'Público Gral', prop: 'general_public', default: false, align: 'center', input: 'toggleGeneralPublic' },
  ];
  headersEgresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'createdDate', default: 'No date', moment: true },
    // { name: 'Estado', prop: 'status', default: 'Pendiente', chip: true },
    { name: 'Proveedor', prop: 'customer_provider.name', default: 'No customer', width: '20' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo fact.', prop: 'captureMode', default: '', align: 'center', chip: true },
    { name: 'Fecha pago', prop: 'cobrada_pagadaDate', default: '', align: 'center', moment: true },
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

  // taxes
  ISR = {
    isrNetoAPagar: 0
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

  sumEgresos = 0;
  egresosPagados = 0;
  egresosPorPagar = 0;

  // progress all year
  progressYear = 0;
  constructor(
    private taxProv: TaxesProvider,
    private billProv: BillProvider,
    private notify: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private route: ActivatedRoute,
    private historicalProv: HistoricalProvider) { }

  ngOnInit() {
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name.toString().toLowerCase();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log('params', params);
        // tslint:disable-next-line:triple-equals
        if (params.name) {
          this.contribuyente = params.name;
          this.office = params.office;
          this.accountant = params.accountant;
          this.headersIngresos.splice(0, 0, { name: 'Seleccionar', prop: 'checked', input: 'checkbox', align: 'center' });
          this.headersEgresos.splice(0, 0, { name: 'Seleccionar', prop: 'checked', input: 'checkbox', align: 'center' });
          // tslint:disable-next-line:max-line-length
          this.headersEgresos.splice(this.headersEgresos.length - 1, 0, { name: 'Deducible', prop: 'deducible', input: 'toggleDeducible', width: '12', align: 'center' });
        }
      });

    this.loadUsers();
    this.loadBimesters();

    this.historicalProv.getActive(this.currentTaxpayer._id).subscribe(data => {
      this.currentPeriod = data;
      this.loadBills({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
      this.loadTaxes({ year: this.currentPeriod.exercise, bimester: this.currentPeriod.period.num });
      this.selectedYear = this.currentPeriod.exercise;
      this.selectedBimester = this.bimesters[--this.currentPeriod.period.num];
      this.currentBimester = this.selectedBimester.name + ' ' + this.selectedYear;
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
      if (this.users.length > 3) {
        this.users.length = 3;
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
    const dialogRef = this.manualBill(false);
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      console.log('new bill', newBill);
      newBill.taxpayer = this.currentTaxpayer._id;
      this.actionEgresos.next({ name: RtActionName.CREATE, newItem: newBill });
      this.billProv.create(newBill).subscribe((res) => {
        this.notify.success('Registro exitoso', 'Se ha creado la nueva factura');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factura');
        console.log(err);
      });
    });
  }

  onManualBillIngresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.manualBill(true);
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      console.log('new bill', newBill);
      newBill.taxpayer = this.currentTaxpayer._id;
      this.actionIngresos.next({ name: RtActionName.CREATE, newItem: newBill });

      // use provier and notify
      this.billProv.create(newBill).subscribe((res) => {
        this.notify.success('Registro exitoso', 'Se ha creado la nueva factura');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factural');
        console.log(err);
      });
    });
  }

  private manualBill(type: boolean) {
    return this.dialogCtrl.open(NewBillComponent, {
      disableClose: false,
      data: {
        ingresos: type
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
        console.log(result);
        if (!result) { ev.item.cobrada_pagada = !ev.item.cobrada_pagada; return; }
        updateBill.cobrada_pagadaDate = result;
        updateBill.cobrada_pagada = true;
        console.log(updateBill);
        this.update(updateBill._id, updateBill);  // without _id?
      });
    } else {
      // already in true past to false
      updateBill.cobrada_pagada = false;
      updateBill.cobrada_pagadaDate = '';
      this.update(updateBill._id, updateBill);
    }
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
    if (ev.data) {
      this.selectedIngresos = ev.data;
    }
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
    const dialogRef = this.billModal(this.selectedIngresos, true, 'Datos de Factura');
    dialogRef.afterClosed().subscribe(res => {
      this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
      if (!res) { return; }
    });
  }

  onViewBillEgresos(ev: any) {
    this.stopPropagation(ev);
    this.billModal(this.selectedEgresos, true, 'Datos de Factura');
  }

  billModal(bill: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(BillingCatalogComponent, {
      disableClose: false,
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

  onDownloadPDF(ev: any) {
    this.stopPropagation(ev);
  }

  onDeleteStatementEgresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalConfirm();
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) { return; } // confirm yes: true, cancel: false
      this.billProv.delete(this.selectedEgresos._id).subscribe((res) => {
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
      console.log(res);
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
          console.log(res);
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
      disableClose: false,
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
      this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num });
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
    const dialogRef1 = this.dialogCtrl.open(ModalCierreBimestreComponent, {
      disableClose: true,
      data: {
        ISR: this.ISR,
        IVA: this.IVA
      }
    });


    // const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
    //   disableClose: true,
    //   data: {
    //     title: '¡ATENCIÓN!',
    //     message: `¿Está seguro que desea cerrar el periodo ${this.currentPeriod.period.name}?`,
    //     type: 'danger'
    //   }
    // });

    // dialogRef2.afterClosed().subscribe((res) => {
    //   if (!res) { return; }
    //   const taxes = {
    //     taxes: {
    //       isr: this.ISR.isrNetoAPagar,
    //       esta no iva: this.IVA.ivaCargo !== 0 ? this.IVA.ivaCargo : this.IVA.ivaFavor
    //      iva: this.IVA.ivaCargo
    //     }
    //   };

    //   this.historicalProv.closePeriod(taxes, this.currentPeriod._id).subscribe(data => {
    //     console.log(data);
    //     this.currentBimester = this.bimesters[this.selectedBimester.num].name + ' ' + this.selectedYear;
    //     this.loadBills({ year: this.selectedYear, bimester: ++this.selectedBimester.num });
    //     this.loadTaxes({ year: this.selectedYear, bimester: ++this.selectedBimester.num });

    //   });
    // });
  } // closePeriod

  loadBimesters() {
    const year = new Date().getFullYear();
    for (let i = 2014; i <= year; i++) {
      this.years.push(i);
    }
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

  getBimesterInfo(ev: any) {
    this.currentBimester = this.selectedBimester.name + ' ' + this.selectedYear;
    this.loadBills({ year: this.selectedYear, bimester: this.selectedBimester.num });

    this.loadTaxes({ year: this.selectedYear, bimester: this.selectedBimester.num });
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
