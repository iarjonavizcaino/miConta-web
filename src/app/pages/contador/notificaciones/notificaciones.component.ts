import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { CrearNotificacionComponent } from '../../_catalog/crear-notificacion/crear-notificacion.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})

export class NotificacionesComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: '' },
    { name: 'Contribuyente', prop: 'taxpayer', default: '' },
    { name: 'Fecha', prop: 'date', moment: true, default: 'No date' },
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
        taxpayer: 'Saúl Jimenez',
        date: '09-19-1995',
        // tslint:disable-next-line:max-line-length
        message: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi dolores expedita cumque eligendi ratione, fugit, fuga consequatur autem quas soluta,.'
      },
      {
        subject: 'PRODUCTO NO VALIDO',
        taxpayer: 'Manuel Pérez',
        date: '01-12-2015',
        message: 'El producto facturado no es válido'
      },
      {
        subject: 'FECHA DEL SIGUIENTE CORTE',
        taxpayer: 'Ernesto de la Cruz',
        date: '01-22-2018',
        message: '02 MAR 18'
      }
    ];
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(CrearNotificacionComponent, {
      disableClose: false,
      data: 'Contribuyente', // placeholder to auto-complete in select user
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create employee
      // console.log(data);
      // this.data.push(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data, order: '-1' });
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
