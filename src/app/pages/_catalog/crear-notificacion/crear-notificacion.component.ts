import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.scss']
})
export class CrearNotificacionComponent implements OnInit {
  myControl: FormControl = new FormControl();
  moment = moment;
  notification: any = {
    taxpayer: '',
    subject: '',
    date: '',
    message: ''
  };
  options = [
    'Saúl Jiménez',
    'Manuel Pérez',
    'Ernesto de la Cruz'
   ];

  constructor(
    // private saleProv: SaleProvider,
    private notify: NotificationsService,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<CrearNotificacionComponent>,
    // private productProv: ProductProvider,
    // private cutProv: CutProvider,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.notification.date = '01/01/2018';
    this.dialogRef.close(this.notification); // return data to save
  }
}// class
