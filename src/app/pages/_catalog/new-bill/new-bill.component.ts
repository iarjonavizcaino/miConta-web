import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { NewItemProductComponent } from '../../_catalog/new-item-product/new-item-product.component';
import { _global } from '../../../services/global';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { states } from '../../../../states';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ModalFechaComponent } from '../modal-fecha/modal-fecha.component';
import { PayMethodProvider } from '../../../providers/providers';

const RFC_REGEX = /^([A-ZÑ]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.scss']
})

export class NewBillComponent implements OnInit {
  moment = moment;
  headers: Array<RtHeader> = [
    { name: 'Concepto', prop: 'code', default: '' },
    { name: 'Producto', prop: 'product', default: 'No name' },
    { name: 'Cant.', prop: 'quantity', default: '0', align: 'right' },
    { name: 'Precio unitario', prop: 'price', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Importe', prop: 'amount', default: '$ 0.00', align: 'right', accounting: true }
  ];

  action = new Subject<RtAction>();
  statustasa: boolean;
  allMethods = [];
  title: string;
  bill: any;
  billForm: FormGroup;
  // for autocomplete: States
  currentState: any;
  filteredStates: Observable<any[]>;
  states = states;

  ingresos = true;   // true: is for Ingresos, false: Egresos
  selectedItem: any;
  currentPayMethod: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<NewBillComponent>,
    private payMethod: PayMethodProvider
  ) {
    this.billForm = fb.group({
      status: '',
      // date: [null, Validators.required],
      name: [null, Validators.required],
      rfc: [null, Validators.compose([Validators.required, Validators.pattern(RFC_REGEX)])],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      street: [null, Validators.required],
      number: [null, Validators.required],
      neighborhood: [null, Validators.required],
      zipcode: ['', Validators.required],
      city: [null, Validators.required],
      municipality: [null, Validators.required],
      state: [null, Validators.required],
      payMethod: [null, Validators.required],
      general_public: null,
      createdDate: null
    });
  }

  ngOnInit() {
    this.ingresos = this.data.ingresos;
    this.title = this.data.title;

    if (this.data.bill) {
      this.bill = this.data.bill;
      const index = this.states.findIndex(state => state.name === this.bill.customer_provider.address.state);
      this.currentState = this.states[index];
      this.currentPayMethod = this.bill.payMethod.key;
    } else {

      this.bill = {
        type: '', // ingresos o egresos
        checked: false, // for check in other table
        createdDate: new Date(),  // date when this bill was created
        cobrada_pagada: false,  // toggle button
        cobrada_pagadaDate: '', // date when taxpayer mark as cobrada(ingresos) or pagada(egresos)
        captureMode: 'Manual',  // Manual, XML, Automática
        deducible: true,
        general_public: false,
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
            municipality: '',
            state: ''
          },
        },
        tasa: 0,
        taxes: 0,
        subtotal: 0,
        total: 0,
        products: []
      };
    }

    this.filteredStates = this.billForm.get('state').valueChanges
      .startWith(null)
      .map(state => state && typeof state === 'object' ? state.name : state)
      .map(name => name ? this.filterState(name) : this.states.slice());

    this.payMethod.getAll().subscribe(res => {
      this.allMethods = res.payMethods;
    }, err => {
      console.log(err);
    });
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(NewItemProductComponent, {
      disableClose: false,
      data: {
        ingresos: this.ingresos
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // tslint:disable-next-line:max-line-length
      // this.bill.products.push(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data });
      this.calc(data, true);  // true for add
    });
  }

  onSelected(ev: any) {
    // this.stopPropagation(ev);
    this.selectedItem = ev.data;
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    this.calc(this.selectedItem, false);
    this.action.next({ name: RtActionName.DELETE, itemId: this.selectedItem.delete, newItem: this.selectedItem });
  }

  key(ev: any) {
    if (ev.keyCode === 13 && this.billForm.valid) {
      this.onSave(ev);
    }
  }

  onSave(ev: any) {
    this.stopPropagation(ev);
    if (this.bill.products.length === 0) {
      this.dialogCtrl.open(ConfirmComponent, {
        disableClose: true,
        data: {
          title: 'Atención!',
          message: 'No se han registrado productos/servicio para la factura',
          type: 'danger'
        }
      });
    } else {
      this.bill.type = this.ingresos ? 'Ingresos' : 'Egresos';
      this.bill.customer_provider.address.state = this.currentState.name;
      const index = this.allMethods.findIndex(method => method.key === this.currentPayMethod);
      this.bill.payMethod = this.allMethods[index];
      this.dialogRef.close(this.bill);  // return bill data
    }
  }

  onClose(ev: any) {
    this.dialogRef.close();
  }

  displayFnState(state: any): any {
    this.currentState = state ? state.name : state;
    return state ? state.name : state;
  }

  filterState(name: string): any[] {
    return this.states.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  toggle(ev: any) {
    if (ev.checked) {
      const dialogRef = this.dialogCtrl.open(ModalFechaComponent, {
        disableClose: true,
        data: {
          config: {
            title: 'Fecha de Pago',
            placeholder: 'Fecha'
          }
        }
      });
      dialogRef.afterClosed().subscribe((date) => {
        if (!date) {
          this.bill.cobrada_pagada = false;
          return;
        }
        this.bill.cobrada_pagadaDate = date;
      });
    } else {
      this.bill.cobrada_pagadaDate = '';
    }
  }

  matchRFC(ev: any) {
    this.bill.customer_provider.rfc.toUpperCase();
    if (this.bill.customer_provider.rfc === 'XAXX010101000') {
      this.bill.general_public = true;
    } else {
      this.bill.general_public = false;
    }
  }

  private calc(newItem: any, add: boolean) {
    if (add) {
      this.bill.subtotal += parseFloat(newItem.amount);
      this.bill.taxes = this.bill.subtotal * this.bill.tasa;
      this.bill.total = this.bill.subtotal + this.bill.taxes;
    } else {
      this.bill.subtotal -= newItem.amount;
      this.bill.taxes = this.bill.subtotal * this.bill.tasa;
      this.bill.total = this.bill.subtotal + this.bill.taxes;
    }
  }

  tasaToggle(ev: any) {
    if (ev.checked) {
      // IVA for 16%
      this.bill.tasa = _global.IVA;
    } else {
      // IVA for 0
      this.bill.tasa = 0;
    }
    this.bill.taxes = this.bill.subtotal * this.bill.tasa;
    this.bill.total = this.bill.subtotal + this.bill.taxes;
  }

  onChangeDate(ev: any) {
    this.bill.createdDate = ev.value;
  }

  private stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}// class
