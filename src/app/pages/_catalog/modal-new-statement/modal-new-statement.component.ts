import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-new-statement',
  templateUrl: './modal-new-statement.component.html',
  styleUrls: ['./modal-new-statement.component.scss']
})
export class ModalNewStatementComponent implements OnInit {
  title: string;

  years = ['2018', '2017', '2016', '2015', '2014'];
  bimesters = ['ENE/FEB', 'MAR/ABR', 'MAY/JUN', 'JUL/AGO', 'SEP/OCT', 'NOV/DIC'];
  statementForm: FormGroup;

  statement: any =  {
    year: '',
    bimester: '',
    type: 'Pendiente'
  };

  constructor(
    private dialogRef: MatDialogRef<ModalNewStatementComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.statementForm = fb.group({
      year: [null, Validators.required],
      bimester: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.title = this.data.title;
  }

  onClose () {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.statement);
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}
