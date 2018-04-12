import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.scss']
})
export class CrearNotificacionComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Seleccionar', prop: 'checked', input: 'checkbox', default: '' },
    { name: 'Usuario', prop: 'name', default: '' },
    { name: 'Tipo', prop: 'role.name', default: '' },
  ];
  action = new Subject<RtAction>();
  dataUsers = [];
  numDestinataries = 0;

  notificationForm: FormGroup;

  // moment = moment;
  notification: any = {
    destinatary: [],
    subject: '',
    date: '',
    message: '',
    type_msg: '',
    emisor: {
      _id: '',
      name: '',
      role: {
        _id: '',
        name: ''
      }
    }
  };

  constructor(
    private dialogRef: MatDialogRef<CrearNotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder, private dialogCtrl: MatDialog
  ) {
    this.notificationForm = fb.group({
      'subject': [null, Validators.required],
      'message': [null, Validators.required],
      'type': [null, Validators.required]
    });
  }

  ngOnInit() {
    if (!this.data) { return; }
    this.dataUsers = this.data;
    this.dataUsers.forEach(user => {
      user.checked = false;
    });
  }

  onChecked(ev: any) {
    if (!ev.item.checked) {
      this.numDestinataries++;
      ev.item.checked = !ev.item.checked;
    } else {
      this.numDestinataries--;
    }
  }

  onClose() {
    this.numDestinataries = 0;
    this.dialogRef.close();
  }
  onSave() {
    if (this.numDestinataries > 0) {  // user has check
      this.dataUsers.forEach((user) => {
        if (user.checked) {
          this.notification.destinatary.push(user);
        }
      });
      this.notification.emisor._id = JSON.parse(localStorage.getItem('user'))._id;
      this.notification.emisor.name = JSON.parse(localStorage.getItem('user')).name;
      this.notification.emisor.role = JSON.parse(localStorage.getItem('user')).role;
      this.notification.date = new Date();
      this.dialogRef.close(this.notification); // return data to save
    } else {
      // show warning. Need to select a least a person
      this.dialogCtrl.open(ConfirmComponent, {
        disableClose: false,
        data: {
          title: 'Atención!',
          message: 'Debes seleccionar al menos 1 usuario',
          type: 'danger'
        }
      });
    }
  }
  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}// class
