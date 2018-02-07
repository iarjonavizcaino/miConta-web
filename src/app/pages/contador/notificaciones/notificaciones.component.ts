import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { CrearNotificacionComponent } from '../../_catalog/crear-notificacion/crear-notificacion.component';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})

export class NotificacionesComponent implements OnInit {
  moment = moment;
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: 'Sin asunto' },
    { name: 'Contribuyente', prop: 'name', default: 'Sin destinatario' },
    { name: 'Fecha', prop: 'date', moment: true, default: 'Sin fecha' },
  ];
  selectedMessage: any;
  data = [];
  action = new Subject<RtAction>();

  // users that role can send message
  destinataries = [
    { checked: false, name: 'Saúl Jiménez', type: 'Contribuyente' },
    { checked: false, name: 'Manuel Pérez', type: 'Contribuyente' },
    { checked: false, name: 'Ernesto de la Cruz', type: 'Contribuyente' }
  ];
  constructor(private noti: NotificationsService, private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.data = [
      {
        subject: 'PAGO ATRASADO',
        name: 'Saúl Jimenez',
        date: '09-19-1995',
        // tslint:disable-next-line:max-line-length
        message: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi dolores expedita cumque eligendi ratione, fugit, fuga consequatur autem quas soluta,.',
        type_msg: 'Informativas'
      },
      {
        subject: 'PRODUCTO NO VALIDO',
        name: 'Manuel Pérez',
        date: '01-12-2015',
        message: 'El producto facturado no es válido',
        type_msg: 'Informativas'
      },
      {
        subject: 'FECHA DEL SIGUIENTE CORTE',
        name: 'Ernesto de la Cruz',
        date: '01-22-2018',
        message: '02 MAR 18',
        type_msg: 'Informativas'
      }
    ];
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(CrearNotificacionComponent, {
      disableClose: false,
      data: this.destinataries, // placeholder to auto-complete in select user
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create employee
      console.log(this.moment(data.date).format('l'));
      data.destinatary.forEach(element => {
        // tslint:disable-next-line:max-line-length
        this.action.next({ name: RtActionName.CREATE, newItem: { subject: data.subject, name: element.name, date: this.moment(data.date).format('L'), message: element.message }, order: '-1' });
      });

      // show notifications success
      this.selectedMessage = data;
      this.noti.success('Acción exitosa', 'La notificación se envió correctamente');
    });
  }

  onMessageSelected(ev) {
    this.selectedMessage = ev.data;
  }

  onView(ev) {
    this.stopPropagation(ev);
    this.showMessage(this.selectedMessage, true, 'Detalle notificación');
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }

  showMessage(message: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(ShowMessageCatalogComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        message: this.selectedMessage
      }
    });
  }
}
