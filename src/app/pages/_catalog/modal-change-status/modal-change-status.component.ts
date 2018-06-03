import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatSidenav, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-modal-change-status',
  templateUrl: './modal-change-status.component.html',
  styleUrls: ['./modal-change-status.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'esp-ESP' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModalChangeStatusComponent implements OnInit {
  statusForm: FormGroup;

  status = ['Presentada', 'Pagada', 'Pendiente'];
  title: string;
  statement: string;
  inputDate = false;
  datePay = '';

  constructor(
    private adapter: DateAdapter<any>,
    private fb: FormBuilder,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.statusForm = fb.group({
      'status': [null, Validators.required]
    });
    this.adapter.setLocale('esp');
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
          disableClose: true,
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
