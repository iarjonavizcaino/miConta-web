import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { CrearNotificacionComponent } from '../../_catalog/crear-notificacion/crear-notificacion.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-notificaciones-despacho',
  templateUrl: './notificaciones-despacho.component.html',
  styleUrls: ['./notificaciones-despacho.component.css']
})
export class NotificacionesDespachoComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: 'Sin asunto' },
    { name: 'Contador', prop: 'destinatary.name', default: 'Sin destinatario' },
    { name: 'Fecha', prop: 'date', moment: true, default: 'Sin fecha' },
  ];
  selectedMessage: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(private noti: NotificationsService, private dialogCtrl: MatDialog) { }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.data = [
      {
        subject: 'PAGO ATRASADO',
        destinatary: {name: 'Saúl Jimenez'},
        date: '09-19-1995',
        // tslint:disable-next-line:max-line-length
        message: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi dolores expedita cumque eligendi ratione, fugit, fuga consequatur autem quas soluta,.'
      },
      {
        subject: 'PRODUCTO NO VALIDO',
        destinatary: {name: 'Manuel Pérez'},
        date: '01-12-2015',
        message: 'El producto facturado no es válido'
      },
      {
        subject: 'FECHA DEL SIGUIENTE CORTE',
        destinatary: {name: 'Ernesto de la Cruz'},
        date: '01-22-2018',
        message: '02 MAR 18'
      }
    ];
  }
  onCreate() {
    const dialogRef = this.dialogCtrl.open(CrearNotificacionComponent, {
      disableClose: false,
      data: 'Contador'
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create notification
      console.log(data);
      this.action.next({name: RtActionName.CREATE, newItem: data, order: '-1'});
      this.noti.success('Exito', 'Se envió correctamente');
    });
  }
  onMessageSelected(ev) {
    this.selectedMessage = ev.data;
  }
  onView(ev) {
    this.stopPropagation(ev);
    this.showMessage(this.selectedMessage, true, 'Notificación');
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

}// class
