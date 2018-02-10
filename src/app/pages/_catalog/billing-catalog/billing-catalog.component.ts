import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// import { Sale } from '../../../types/types';
// import { SaleProvider, ProductProvider, CutProvider } from '../../../providers/providers';
import * as accounting from 'accounting-js';
import * as moment from 'moment';
import { ModalFechaComponent } from '../modal-fecha/modal-fecha.component';

@Component({
  selector: 'app-billing-catalog',
  templateUrl: './billing-catalog.component.html',
  styleUrls: ['./billing-catalog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BillingCatalogComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Código', prop: 'code', default: '', width: '14'},
    { name: 'Concepto', prop: 'name', default: 'No name', width: '32'},
    { name: 'Cant', prop: 'quantity', default: '0', align: 'right', width: '8' },
    { name: 'Precio unitario', prop: 'price', default: '$ 0.00', align: 'right', accounting: true, width: '17' },
    { name: 'Importe', prop: 'amount', default: '$ 0.00', align: 'right', accounting: true, width: '17' }
  ];

  action = new Subject<RtAction>();
  title: string;
  products = [];
  bill: any;
  total = 0;
  taxes = 0;
  subtotal = 0;
  infoBill: any = {
    date: '',
    total: 0,
    active: false,
    customer: {
      name: '',
      rfc: '',
      phone: '',
      email: '',
    },
    address: {
      street: '',
      number: '',
      neighborhood: '',
      zipcode: '',
      city: '',
      state: '',
      municipality: ''
    }
  };
  // now = moment(new Date).format('LL');

  constructor(
    // private saleProv: SaleProvider,
    private notify: NotificationsService,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<BillingCatalogComponent>,
    // private productProv: ProductProvider,
    // private cutProv: CutProvider,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title || 'Título del modal';
    if (this.data) {  // data: info from table
      console.log(this.data);
      this.infoBill = this.data.bill;
      this.infoBill.customer.phone = this.formatPhone(this.infoBill.customer.phone);
      // this.infoBill.date = moment(this.infoBill.date).format('L');
      this.products = this.data.bill.products;
      this.getTotal(this.products);
    }
  }
  formatPhone(text: string) {
    text = text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return text;
  }
  onClose() {
    this.dialogRef.close();
  }

  getTotal(data) {
    let subTotal = 0, iva = 0;
    data.forEach(product => {
      subTotal += Number(product.amount);
      iva += Number(product.amount * 0.16);
    });
    this.subtotal = subTotal;
    this.taxes = iva;
    this.total = this.subtotal + this.taxes;
  }

  changeStatus(ev) {
    console.log(ev);
    if (ev) {
      const dialogRef = this.dialogCtrl.open(ModalFechaComponent, {
        data: {
          config: {
            title: 'Fecha',
            placeholder: 'Seleccionar fecha'
          }
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) { this.infoBill.active = !this.infoBill.active; return; }
        this.infoBill.endDate = res;
        // Make HTTP request to change date
      });
    } else {
      this.infoBill.endDate = null;
    }
  }

  onSave() {
    console.log('Guardar');
    this.dialogRef.close(this.infoBill);
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
