import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader, RtCheckEvent } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../../_catalog/billing-catalog/billing-catalog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NewBillComponent } from '../../_catalog/new-bill/new-bill.component';
import { ModalFechaComponent } from '../../_catalog/modal-fecha/modal-fecha.component';
import { NotificationsService } from 'angular2-notifications';
import { BillProvider } from '../../../providers/providers';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';

@Component({
  selector: 'app-resumen-contribuyente',
  templateUrl: './resumen-contribuyente.component.html',
  styleUrls: ['./resumen-contribuyente.component.scss']
})
export class ResumenContribuyenteComponent implements OnInit, OnDestroy {

  headersIngresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'bill.createdDate', default: 'No date', moment: true },  // from xml file
    { name: 'Cliente', prop: 'bill.customer_provider.name', default: 'No customer' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'bill.total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo de factura', prop: 'bill.captureMode', align: 'center', chip: true },
    { name: 'Cobrada', prop: 'bill.cobrada_pagada', input: 'toggleFec' },
    { name: 'Fec Cobrada', prop: 'bill.cobrada_pagadaDate', default: '', align: 'center', moment: true },
    { name: 'Público General', prop: 'bill.general_public', default: false, align: 'center', input: 'toggleGeneralPublic' }
  ];
  headersEgresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'bill.createdDate', default: 'No date', moment: true },
    // { name: 'Estado', prop: 'status', default: 'Pendiente', chip: true },
    { name: 'Proveedor', prop: 'bill.customer_provider.name', default: 'No customer' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'bill.total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo de factura', prop: 'bill.captureMode', default: '', align: 'center', chip: true },
    { name: 'Pagada', prop: 'bill.cobrada_pagada', input: 'toggleFec' },
    { name: 'Fec Pago', prop: 'bill.cobrada_pagadaDate', default: '', align: 'center', moment: true }
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

  currentBimester = 'ENE-FEB 2018';
  selectedYear = '';
  selectedBimester = '';

  currentTaxpayer: any;
  // to hadle breadcrumb
  roleUp = '';
  users = [];
  constructor(
    private billProv: BillProvider,
    private notify: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private route: ActivatedRoute) { }

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
          this.headersIngresos.splice(0, 0, { name: 'Seleccionar', prop: 'bill.checked', input: 'checkbox', align: 'center' });
          this.headersEgresos.splice(0, 0, { name: 'Seleccionar', prop: 'bill.checked', input: 'checkbox', align: 'center' });
          // tslint:disable-next-line:max-line-length
          this.headersEgresos.splice(this.headersEgresos.length - 1, 0, { name: 'Deducible', prop: 'bill.deducible', input: 'toggleDeducible', width: '12', align: 'center' });
        }
      });
    this.loadUsers();
    this.loadBills();
    this.loadBimesters();
  }
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
      this.actionEgresos.next({ name: RtActionName.CREATE, newItem: { bill: newBill } });
      this.billProv.create({ taxpayer: this.currentTaxpayer._id, bill: newBill }).subscribe((res) => {
        this.notify.success('Registro exitoso', 'Se ha creado la nueva factura');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factural');
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
      this.actionIngresos.next({ name: RtActionName.CREATE, newItem: { bill: newBill } });

      // use provier and notify
      this.billProv.create({ taxpayer: this.currentTaxpayer._id, bill: newBill }).subscribe((res) => {
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
  onEgresosChecked(ev: any, type: string) {
    console.log(type);
    if (type === 'check') {
      if (!ev.item.checked) {
        this.checkedEgresos++;
        ev.item.checked = !ev.item.checked;
      } else {
        this.checkedEgresos--;
      }
    }
  }
  toggleDeducible(ev: any) {  // update OK
    this.selectedEgresos = ev.item;
    this.selectedEgresos.bill.deducible = !this.selectedEgresos.bill.deducible;
    this.update(this.selectedEgresos._id, { bill: this.selectedEgresos.bill });
    this.actionEgresos.next({ name: RtActionName.UPDATE, itemId: this.selectedEgresos._id, newItem: this.selectedEgresos.bill });
  }
  onToggleFec(ev: any) {
    const updateBill = ev.item;
    if (!updateBill.bill.cobrada_pagada) {
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
        if (!result) { return; }
        updateBill.bill.cobrada_pagadaDate = result;
        updateBill.bill.cobrada_pagada = true;
        console.log(updateBill);
        this.update(updateBill._id, { bill: updateBill.bill });
      });
    } else {
      // already in true past to false
      updateBill.bill.cobrada_pagada = false;
      updateBill.bill.cobrada_pagadaDate = '';
      this.update(updateBill._id, { bill: updateBill.bill });
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
    this.selectedIngresos = ev.item;
    this.selectedIngresos.bill.general_public = !this.selectedIngresos.bill.general_public;
    this.update(this.selectedIngresos._id, { bill: this.selectedIngresos.bill });
    this.actionIngresos.next({ name: RtActionName.UPDATE, itemId: this.selectedIngresos._id, newItem: this.selectedIngresos.bill });
  }
  onIngresosSelected(ev) {
    if (ev.data) {
      this.selectedIngresos = ev.data;
    }
  }
  onIngresosChecked(ev: any, type: string) {
    if (type === 'check') {
      if (!ev.item.checked) {
        this.checkedIngresos++;
        ev.item.checked = !ev.item.checked;
      } else {
        this.checkedIngresos--;
      }
    } else if (type === 'toggle') {
      const bill: any = ev.item;
      if (!bill.active) {
        const dialogRef = this.dialogCtrl.open(ModalFechaComponent, {
          data: {
            config: {
              title: 'Fecha de cobro',
              placeholder: 'Seleccionar fecha'
            }
          }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (!res) { bill.active = !bill.active; return; }
          bill.endDate = res;
          // Make HTTP request to change date
        });
      } else {
        bill.endDate = null;
      }
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
    this.billModal(this.selectedIngresos, true, 'Datos de Factura');
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

  private loadBills() {
    this.billProv.getByTaxPayer(this.currentTaxpayer._id).subscribe(bills => {
      if (bills) {
        this.dataIngresos = bills.ingresos;
        this.dataEgresos = bills.egresos;
      }
    });
  }
  private update(_id: string, bill: any) {
    this.billProv.update(_id, bill).subscribe((res) => {
      this.notify.success('Acción Exitosa', 'Factura actualizada correctamente');
    }, err => {
      this.notify.error('Error', 'No se pudo actualizar la factura');
      console.log(err);
    });
  }
  loadEgresosData() {
    this.dataEgresos = [
      {
        bill: {
          type: 'Egresos',
          checked: false,
          createdDate: '09/19/1995',
          cobrada_pagada: true,
          cobrada_pagadaDate: '09/19/1995',
          deducible: true,
          captureMode: 'Manual',

          taza: 0,
          taxes: 1234,
          subtotal: 321,
          total: 1325,
          customer_provider: {
            name: 'Master Clean',
            rfc: 'XXXX-XXX-XXXX',
            phone: '3111905402',
            email: 'master_clean@example.com',
            address: {
              street: 'Sanchez Tahuada',
              number: '29',
              neighborhood: 'Centro',
              zipcode: '63175',
              city: 'Tepic',
              municipality: 'Tepic',
              state: 'Nayarit'
            }
          },
          products: [
            {
              code: '710183',
              concept: 'Equipo de limpieza y suministros',
              product: 'Escobas',
              quantity: '12',
              price: '38',
              amount: '456',
            },
            {
              code: '812718',
              concept: 'Herramientas y maquinaría general',
              product: 'Sierra eléctrica',
              quantity: '50',
              price: '250',
              amount: '12500',
            },
            {
              code: '719281',
              concept: 'Materiales y productos de papel',
              product: 'Cuadernos',
              quantity: '10',
              price: '7',
              amount: '70',
            }
          ]
        }
      }];
  }

  loadBimesters() {
    const year = new Date().getFullYear();
    for (let i = 2014; i <= year; i++) {
      this.years.push(i);
    }
    this.bimesters = [
      {
        name: 'ENE-FEB'
      },
      {
        name: 'MAR-ABR'
      },
      {
        name: 'MAY-JUN'
      },
      {
        name: 'JUL-AGO'
      },
      {
        name: 'SEPT-OCT'
      },
      {
        name: 'NOV-DIC'
      }
    ];
  }

  getBimesterInfo(ev: any) {
    this.currentBimester = this.selectedBimester + ' ' + this.selectedYear;
  }
}// class
