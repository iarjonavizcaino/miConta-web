import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { CrearNotificacionComponent } from '../../_catalog/crear-notificacion/crear-notificacion.component';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { OfficeProvider, AccountantProvider, NotificationProvider, TaxpayerProvider } from '../../../providers/providers';

@Component({
  selector: 'app-notificaciones-superadmin',
  templateUrl: './notificaciones-superadmin.component.html',
  styleUrls: ['./notificaciones-superadmin.component.css']
})
export class NotificacionesSuperadminComponent implements OnInit {
  moment = moment;
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: 'Sin asunto' },
    // { name: 'Usuario', prop: 'destinataryName', default: 'Sin destinatario' },
    { name: 'Tipo', prop: 'type_msg', default: 'Sin tipo' },
    { name: 'Fecha', prop: 'date', moment: true, default: 'Sin fecha' },
  ];
  selectedMessage: any;
  data = [];
  action = new Subject<RtAction>();
  // users that role can send message
  destinataries = [];
  constructor(
    private noti: NotificationsService,
    private dialogCtrl: MatDialog,
    private officeProv: OfficeProvider,
    private accountantProv: AccountantProvider,
    private taxpayerProv: TaxpayerProvider,
    private notificationProv: NotificationProvider
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'))._id;

    this.notificationProv.getByEmisor(user).subscribe(data => {
      this.data = data.notifications;
    });

    this.officeProv.getAll().subscribe(data => {
      this.destinataries = data.offices;
      this.destinataries.forEach(office => {
        this.destinataries = this.destinataries.concat(office.accountants);
      });
    });

    this.taxpayerProv.getAll().subscribe(data => {
      this.destinataries = this.destinataries.concat(data.taxpayers);
    });

  }
  
  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(CrearNotificacionComponent, {
      disableClose: true,
      data: this.destinataries
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
      disableClose: true,
      data: {
        title: title,
        readonly: readonly,
        message: this.selectedMessage,
        destinataries: this.selectedMessage.destinatary
      }
    });
  }
}// class
