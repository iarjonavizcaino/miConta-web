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

@Component({
  selector: 'app-billing-catalog',
  templateUrl: './billing-catalog.component.html',
  styleUrls: ['./billing-catalog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BillingCatalogComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Producto', prop: 'name', default: 'No name', width: '32' },
    { name: 'Cantidad', prop: 'quantity', default: '0', width: '20', align: 'right' },
    { name: 'Precio unitario', prop: 'price', default: '$ 0.00', align: 'right', accounting: true, width: '20' },
    { name: 'Importe', prop: 'amount', default: '$ 0.00', align: 'right', accounting: true, width: '20' }
  ];

  action = new Subject<RtAction>();
  title: string;
  products = [];
  bill: any;
  infoBill: any = {
    date: '',
    total: 0,
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
      this.infoBill = this.data.bill;
      this.infoBill.customer.phone = this.formatPhone(this.infoBill.customer.phone);
      // this.infoBill.date = moment(this.infoBill.date).format('LL');
      this.products = this.data.bill.products;
    }
  }
  formatPhone(text: string) {
    text = text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return text;
  }
  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    console.log('Guardar');
    this.dialogRef.close(this.data.bill);
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
