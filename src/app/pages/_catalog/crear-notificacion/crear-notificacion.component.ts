import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.scss']
})
export class CrearNotificacionComponent implements OnInit {
  filteredDestinataries: Observable<any[]>;
  notificationForm: FormGroup;

  currentDestinatary: any;
  moment = moment;
  placeholder = 'asd';
  notification: any = {
    destinatary: '',
    subject: '',
    date: '',
    message: ''
  };
  destinataries = [
    { name: 'Saúl Jiménez' },
    { name: 'Manuel Pérez' },
    { name: 'Ernesto de la Cruz' }
   ];

  constructor(
    private dialogRef: MatDialogRef<CrearNotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.notificationForm = fb.group({
      'destinatary': [null, Validators.required],
      'subject': [null, Validators.required],
      'message': [null, Validators.required]
    });
   }

  ngOnInit() {
    if (!this.data) { return; }
    this.placeholder = this.data;
    // this.placeholder = this.data.placeholder;

    this.filteredDestinataries = this.notificationForm.get('destinatary').valueChanges
      .startWith(null)
      .map(destinatary => destinatary && typeof destinatary === 'object' ? destinatary.name : destinatary)
      .map(name => name ? this.filterDestinatary(name) : this.destinataries.slice());
  }

  displayFn(destinatary: any): any {
    this.currentDestinatary = destinatary ? destinatary : destinatary;
    return destinatary ? destinatary.name : destinatary;
  }

  filterDestinatary(name: string): any[] {
    return this.destinataries.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.notification.destinatary = this.currentDestinatary;
    this.notification.date = new Date();
    this.dialogRef.close(this.notification); // return data to save
  }
  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}// class
