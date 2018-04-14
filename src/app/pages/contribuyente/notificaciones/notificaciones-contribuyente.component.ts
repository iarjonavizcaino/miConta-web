import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ShowMessageCatalogComponent } from '../../_catalog/show-message-catalog/show-message-catalog.component';
import { ActivatedRoute } from '@angular/router';
import { NotificationProvider } from '../../../providers/providers';

@Component({
  selector: 'app-notificaciones-contribuyente',
  templateUrl: './notificaciones-contribuyente.component.html',
  styleUrls: ['./notificaciones-contribuyente.component.css']
})
export class NotificacionesContribuyenteComponent implements OnInit, OnDestroy {
  headers: Array<RtHeader> = [
    { name: 'Asunto', prop: 'subject', default: ''},
    { name: 'Fecha', prop: 'date', moment: true, default: 'No date' },
  ];
  selectedMessage: any;
  data = [];
  sub: any;
  contribuyente: any;
  action = new Subject<RtAction>();
  role = JSON.parse(localStorage.getItem('user')).role.name;

  constructor(
    private dialogCtrl: MatDialog,
    private route: ActivatedRoute,
    private notificationProv: NotificationProvider
  ) { }

  ngOnInit() {

    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // tslint:disable-next-line:triple-equals
      if (params.name) {
        this.contribuyente = params.name;
      }
    });

    let user;
    if (this.role !== 'Contribuyente') {
      user = JSON.parse(localStorage.getItem('taxpayer'))._id;
    } else {
      user = JSON.parse(localStorage.getItem('user'))._id;
    }

    this.notificationProv.getByDestinatary(user).subscribe(data => {
      this.data = data.notifications;
    });
  }// ngOnInit

  ngOnDestroy() {
    this.sub.unsubscribe();
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
      disableClose: true,
      data: {
        title: title,
        readonly: readonly,
        message: this.selectedMessage
      }
    });
  }

}// class
