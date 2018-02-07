import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';

@Component({
  selector: 'app-modal-fecha',
  templateUrl: './modal-fecha.component.html',
  styleUrls: ['./modal-fecha.component.scss']
})
export class ModalFechaComponent implements OnInit {
  dateSelected = '';
  config = {
    title: '',
    placeholder: ''
  };
  dateForm: FormGroup;
  constructor(private dialogRef: MatDialogRef<ModalFechaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder, private dialogCtrl: MatDialog
  ) {
    this.dateForm = fb.group({
      'date': [null, Validators.required]
    });
   }

  ngOnInit() {
    if (!this.data) { return; }
    this.config = this.data;
  }

  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close(this.dateSelected);
  }
}// class
