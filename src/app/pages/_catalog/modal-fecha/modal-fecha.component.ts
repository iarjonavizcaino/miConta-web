import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
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
  selector: 'app-modal-fecha',
  templateUrl: './modal-fecha.component.html',
  styleUrls: ['./modal-fecha.component.scss'],
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
export class ModalFechaComponent implements OnInit {
  dateSelected = '';
  config = {
    title: '',
    placeholder: ''
  };
  dateForm: FormGroup;
  constructor(
    private adapter: DateAdapter<any>,
    private dialogRef: MatDialogRef<ModalFechaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder, private dialogCtrl: MatDialog
  ) {
    this.dateForm = fb.group({
      'date': [null, Validators.required]
    });
    this.adapter.setLocale('esp');
   }

  ngOnInit() {
    if (!this.data) { return; }
    this.config = this.data.config;
  }

  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close(this.dateSelected);
  }
}// class
