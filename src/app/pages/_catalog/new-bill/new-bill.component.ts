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
    { name: 'Producto', prop: 'name', default: 'No name' },
    { name: 'Cant.', prop: 'quantity', default: '0', align: 'right' },
    { name: 'Precio unitario', prop: 'price', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Importe', prop: 'amount', default: '$ 0.00', align: 'right', accounting: true }
  ];
  action = new Subject<RtAction>();
  bill = {
    payDay: '',
    status: '', // Cobrado o Pendiente
    active: false,  // switch
    provider: true, //
    type: 'Manual',
    date: '',
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
      municipality: '',
      state: ''
    },
    subtotal: 0,
    taxes: 0,
    total: 0,
    products: []
  };
  billForm: FormGroup;
  currentState: any;
  filteredStates: Observable<any[]>;
  states = states;
  ingresos = true;
  selectedItem: any;
  // tslint:disable-next-line:max-line-length
  constructor( @Inject(MAT_DIALOG_DATA) private data: any, private fb: FormBuilder, private dialogCtrl: MatDialog, private dialogRef: MatDialogRef<NewBillComponent>) {
    this.billForm = fb.group({
      status: '',
      date: [null, Validators.required],
      name: [null, Validators.required],
      rfc: ['VECJ880326', Validators.compose([Validators.required, Validators.pattern(RFC_REGEX)])],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      street: [null, Validators.required],
      number: [null, Validators.required],
      neighborhood: [null, Validators.required],
      zipcode: ['', Validators.required],
      city: [null, Validators.required],
      municipality: [null, Validators.required],
      state: [null, Validators.required],
    });
  }

  ngOnInit() {
    if (!this.data) { return; }
    this.ingresos = this.data.ingresos;
    this.bill.date = moment(new Date()).format('L');
    this.filteredStates = this.billForm.get('state').valueChanges
      .startWith(null)
      .map(state => state && typeof state === 'object' ? state.name : state)
      .map(name => name ? this.filterState(name) : this.states.slice());
  }
  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(NewItemProductComponent, {
      disableClose: false,
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
    console.log(this.selectedItem);
    this.calc(this.selectedItem, false);
    this.action.next({ name: RtActionName.DELETE, itemId: this.selectedItem._id, newItem: this.selectedItem });
  }
  key(ev: any) {
    if (ev.keyCode === 13 && this.billForm.valid) {
      this.onSave(ev);
    }
  }
  onSave(ev: any) {
    console.log(this.bill.active);
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
        if (!date) { return; }
        console.log(date);
        this.bill.payDay = date;
      });
    } else {
      this.bill.payDay = '';
    }
  }
  private calc(newItem: any, add: boolean) {
    console.log('calc', newItem);
    if (add) {
      this.bill.subtotal += parseFloat(newItem.amount);
      this.bill.taxes = this.bill.subtotal * _global.IVA;
      this.bill.total = this.bill.subtotal + this.bill.taxes;
    } else {
      this.bill.subtotal -= newItem.amount;
      this.bill.taxes = this.bill.subtotal * _global.IVA;
      this.bill.total = this.bill.subtotal + this.bill.taxes;
    }
  }
  private stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
  changeStatus(ev: any) {
    console.log(ev, this.bill.status);
  }
}// class
