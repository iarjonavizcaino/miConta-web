import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { RtAction, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';

@Component({
  selector: 'app-show-message-catalog',
  templateUrl: './show-message-catalog.component.html',
  styleUrls: ['./show-message-catalog.component.scss']
})
export class ShowMessageCatalogComponent implements OnInit {
  title: string;
  message: any;
  moment = moment;
  action = new Subject<RtAction>();
  role = JSON.parse(localStorage.getItem('user')).role.name;

  headers: Array<RtHeader> = [
    { name: 'Usuario', prop: 'name', default: '' },
  ];

  destinataries = [];

  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ShowMessageCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title || 'Título del modal';
    if (this.data) {  // data: info from table
      console.log(this.data);
      this.destinataries = this.data.destinataries;
      this.message = this.data.message;
    }

    if (this.role !== 'Contador') {
      this.headers.push({ name: 'Tipo', prop: 'role.name', default: '' });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
