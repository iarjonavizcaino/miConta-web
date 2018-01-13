import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../_catalog/show-message-catalog/show-message-catalog.component';

@Component({
  selector: 'app-notificaciones-contribuyente',
  templateUrl: './notificaciones-contribuyente.component.html',
  styleUrls: ['./notificaciones-contribuyente.component.css']
})
export class NotificacionesContribuyenteComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: ''},
    { name: 'Fecha', prop: 'date', moment: true, default: 'No date' },
  ];
  selectedMessage: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.data = [
      {
        subject: 'PAGO ATRASADO',
        date: '09-19-1995',
        // tslint:disable-next-line:max-line-length
        message: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi dolores expedita cumque eligendi ratione, fugit, fuga consequatur autem quas soluta,.'
      },
      {
        subject: 'PRODUCTO NO VALIDO',
        date: '01-12-2015',
        message: 'El producto facturado no es válido'
      },
      {
        subject: 'FECHA DEL SIGUIENTE CORTE',
        date: '01-22-2018',
        message: '02 MAR 18'
      }
    ];
  }// ngOnInit

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
