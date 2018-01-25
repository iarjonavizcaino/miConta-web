import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-conceptos',
  templateUrl: './modal-conceptos.component.html',
  styleUrls: ['./modal-conceptos.component.scss']
})
export class ModalConceptosComponent implements OnInit {
  readonly: boolean;

  title: string;
  concept: any;
  conceptForm: FormGroup;
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalConceptosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.conceptForm = fb.group({
      'code': [null, Validators.required],
      'concept': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.title = this.data.title || 'Título del modal';
    this.readonly = this.data.readonly;
    console.log(this.data);
    if (this.data.concept) {  // data: info from table
      this.concept = this.data.concept;
    } else {
      this.concept = {
        code: '',
        concept: ''
      };
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close(this.concept);
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}// class
