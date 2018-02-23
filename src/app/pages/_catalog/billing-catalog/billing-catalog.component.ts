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
  moment = moment;
  headers: Array<RtHeader> = [
    { name: 'Código', prop: 'code', default: '', width: '14' },
    { name: 'Concepto', prop: 'product', default: 'No name', width: '32' },
    { name: 'Cant', prop: 'quantity', default: '0', align: 'right', width: '8' },
    { name: 'Precio unitario', prop: 'price', default: '$ 0.00', align: 'right', accounting: true, width: '17' },
    { name: 'Importe', prop: 'amount', default: '$ 0.00', align: 'right', accounting: true, width: '17' }
  ];

  action = new Subject<RtAction>();
  title: string;

  // bill: any;
  infoBill: any = {
    taxes: 0,
    total: 0,
    subtotal: 0,
    createdDate: '',
    cobrada_pagada: false,
    payMethod: {},
    customer_provider: {
      name: '',
      rfc: '',
      phone: '',
      email: '',
      address: {
        street: '',
        number: '',
        neighborhood: '',
        zipcode: '',
        city: '',
        state: '',
        municipality: '',
      }
    },
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
      console.log(this.infoBill);
      // formats
      this.infoBill.customer_provider.phone = this.formatPhone(this.infoBill.customer_provider.phone);
      this.infoBill.createdDate = this.moment(this.infoBill.createdDate).format('L');
    }
  }
  formatPhone(text: string) {
    console.log(text);
    text = text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return text;
  }
  onClose() {
    this.dialogRef.close();
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
        if (!res) { this.infoBill.cobrada_pagada = !this.infoBill.cobrada_pagada; return; }
        this.infoBill.cobrada_pagadaDate = res;
        // Make HTTP request to change date
      });
    } else {
      this.infoBill.cobrada_pagadaDate = '';
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
