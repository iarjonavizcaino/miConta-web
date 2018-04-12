import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
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
  inputDate = false;
  datePay = '';

  constructor(
    private fb: FormBuilder,
    private dialogCtrl: MatDialog,
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
  onChangeStatus(ev: any) {
    this.inputDate = ev.value === 'Pagada' ? true : false;
  }
  onSave() {
    // validate date if inputDate is true (must have a value)
    if (this.inputDate) {
      if (this.datePay !== '') {
        // send date here
        this.dialogRef.close(this.statusForm.get('status').value);
      } else {
        this.dialogCtrl.open(ConfirmComponent, {
          disableClose: false,
          data: {
            title: 'Atención!',
            message: 'El campo de fecha no puede estár vacío',
            type: 'danger'
          }
        });
      }
    } else {
      // just send the new status, in this point must be: Pendiente or Presentada
      this.dialogRef.close(this.statusForm.get('status').value);
    }
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
