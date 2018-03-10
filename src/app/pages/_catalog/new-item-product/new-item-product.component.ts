import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { ConceptProvider } from '../../../providers/concept.prov';

@Component({
  selector: 'app-new-item-product',
  templateUrl: './new-item-product.component.html',
  styleUrls: ['./new-item-product.component.scss']
})
export class NewItemProductComponent implements OnInit {

  itemForm: FormGroup;
  concepts = [];
  newItem = {
    delete: 0,
    code: 0,
    concept: '',
    product: '',
    quantity: '',
    price: '',
    amount: ''
  };
  selectedConcept: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private conceptProv: ConceptProvider,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewItemProductComponent>) {
    this.itemForm = this.fb.group({
      code: [null, Validators.required],
      product: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      amount: [null, Validators.required]
    });
  }

  ngOnInit() {
    if (!this.data) { return; }
    if (this.data.ingresos) {
      // ingresos, see all
      this.conceptProv.getAll().subscribe(data => {
        this.concepts = data.concepts;
      });
    } else {
      // egresos, only concept which below to profile
      this.concepts = JSON.parse(localStorage.getItem('taxpayer')).profile.concepts;
    }
  }
  key(ev: any) {
    if (ev.keyCode === 13 && this.itemForm.valid) {
      this.onSave(ev);
    }
  }
  onSave(ev: any) {
    this.stopPropagation(ev);
    this.newItem.delete = this.getRandom(1, 1000);
    this.dialogRef.close(this.newItem); // send data
  }
  onClose(ev: any) {
    this.stopPropagation(ev);
    this.dialogRef.close();
  }
  onChangeConcept(ev: any) {
    // tslint:disable-next-line:radix
    this.newItem.code = parseInt(ev.value.code);
    this.newItem.concept = ev.value.concept;
  }
  private stopPropagation(ev: Event) {
    if (ev) { return ev.stopPropagation(); }
  }
  private getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}// class
