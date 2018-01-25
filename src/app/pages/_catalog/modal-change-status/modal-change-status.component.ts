import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-change-status',
  templateUrl: './modal-change-status.component.html',
  styleUrls: ['./modal-change-status.component.scss']
})
export class ModalChangeStatusComponent implements OnInit {
  statusForm: FormGroup;

  status = ['Presentada', 'Pagada', 'Pendiente'];
  title: string;
  statement: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.statusForm = fb.group({
      'status': [null, Validators.required]
    });
  }
  ngOnInit() {
    this.title = this.data.title;
    this.statement = this.data.status;
  }

  onSave() {
    this.dialogRef.close(this.statusForm.get('status').value);
  }

  onClose() {
    this.dialogRef.close();
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}
