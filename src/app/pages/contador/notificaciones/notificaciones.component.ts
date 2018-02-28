import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { CrearNotificacionComponent } from '../../_catalog/crear-notificacion/crear-notificacion.component';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { NotificationProvider, AccountantProvider, TaxpayerProvider, OfficeProvider } from '../../../providers/providers';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})

export class NotificacionesComponent implements OnInit {
  moment = moment;
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: 'Sin asunto' },
    { name: 'Tipo', prop: 'type_msg', default: 'Sin tipo' },
    // { name: 'Contribuyente', prop: 'destinataryName', default: 'Sin destinatario' },
    { name: 'Fecha', prop: 'date', moment: true, default: 'Sin fecha' }
  ];
  selectedMessage: any;
  data = [];
  action = new Subject<RtAction>();
  role = JSON.parse(localStorage.getItem('user')).role.name;

  // users that role can send message
  destinataries = [];
  received = [];

  constructor(
    private noti: NotificationsService,
    private dialogCtrl: MatDialog,
    private notificationProv: NotificationProvider,
    private taxpayerProv: TaxpayerProvider,
    private accountantProv: AccountantProvider
  ) { }

  ngOnInit() {
    // this.loadData();
    let user;
    if (this.role !== 'Contador') {
      user = localStorage.getItem('accountant');
    } else {
      user = JSON.parse(localStorage.getItem('user'))._id;
    }

    this.notificationProv.getByDestinatary(user).subscribe(data => {
      this.received = data.notifications;
    });

    this.notificationProv.getByEmisor(user).subscribe(data => {
      this.data = data.notifications;
    });

    this.accountantProv.getTaxpayers(user).subscribe(data => {
      this.destinataries = data.taxpayers.taxpayers;
    });
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(CrearNotificacionComponent, {
      disableClose: false,
      data: this.destinataries, // placeholder to auto-complete in select user
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }

      // Make HTTP request to create notification
      this.notificationProv.create(data).subscribe(res => {
        data = res.notification;
        this.action.next({ name: RtActionName.CREATE, newItem: data, order: '-1' });
        this.noti.success('Acción exitosa', 'La notificación se envió correctamente');
      }, err => {
        this.noti.error('Error', 'La notificación no se pudo enviar');
      });
    });
  }

  onMessageSelected(ev) {
    this.selectedMessage = ev.data;
  }

  onView(ev) {
    this.stopPropagation(ev);
    this.showMessage(this.selectedMessage, this.selectedMessage.destinatary, true, 'Detalle notificación');
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }

  showMessage(message: any, destinataries: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(ShowMessageCatalogComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        message: this.selectedMessage,
        destinataries: this.selectedMessage.destinatary
      }
    });
  }
}
