import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  form: FormGroup;
  type = '';
  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      'amount': [null, Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.type = this.data.type;
    }
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onConfirmWithData() {
    this.dialogRef.close(this.form.get('amount').value);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
