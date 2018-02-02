import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
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
    _id: 0,
    code: '',
    name: '',
    quantity: '',
    price: '',
    amount: ''
  };
  constructor(private conceptProv: ConceptProvider, private fb: FormBuilder, private dialogRef: MatDialogRef<NewItemProductComponent>) {
    this.itemForm = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      amount: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.conceptProv.getAll().subscribe(data => {
      this.concepts = data.concepts;
    });
  }
  key(ev: any) {
    if (ev.keyCode === 13 && this.itemForm.valid) {
      this.onSave(ev);
    }
  }
  onSave(ev: any) {
    this.stopPropagation(ev);
    this.newItem._id = this.getRandom(1, 1000);
    this.dialogRef.close(this.newItem); // send data
  }
  onClose(ev: any) {
    this.stopPropagation(ev);
    this.dialogRef.close();
  }
  private stopPropagation(ev: Event) {
    if (ev) { return ev.stopPropagation(); }
  }
  private getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}// class
