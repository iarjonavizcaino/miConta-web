import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  placeholder = 'asd';
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
    private dialogRef: MatDialogRef<CrearNotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    if (!this.data) { return; }
    this.placeholder = this.data;
    // this.placeholder = this.data.placeholder;
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.notification.date = '01/01/2018';
    this.dialogRef.close(this.notification); // return data to save
  }
}// class
