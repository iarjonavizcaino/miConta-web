import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader, RtCheckEvent } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalContadorComponent } from '../../_catalog/modal-contador/modal-contador.component';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ModalAsignarContribComponent } from '../../_catalog/modal-asignar-contrib/modal-asignar-contrib.component';
import { TaxpayerCatalogComponent } from '../../_catalog/taxpayer-catalog/taxpayer-catalog.component';

@Component({
  selector: 'app-inicio-superadmin',
  templateUrl: './inicio-superadmin.component.html',
  styleUrls: ['./inicio-superadmin.component.css']
})
export class InicioSuperadminComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Despacho', prop: 'name', default: 'Sin nombre', width: '20' },
    { name: 'Contadores', prop: 'accountant', default: '0', align: 'center', width: '15' },
    { name: 'Contribuyentes', prop: 'taxpayer', default: '0', align: 'center', width: '15' },
  ];
  despachoSelected: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.data = [
      {
        name: 'Andrea Ramírez',
        accountant: 42,
        taxpayer: 45,
        email: '',
        phone: '',
        address: {
          street: '',
          number: '',
          neighborhood: '',
          zipcode: '',
          city: '',
          state: '',
          municipality: ''
        }
      }
    ];
  }
  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: false,
      data: {
        title: 'Nuevo Despacho'
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      this.action.next({ name: RtActionName.CREATE, newItem: {name: data.name, accountant: 0, taxpayer: 0} });
      this.notification.success('Exito', 'Despacho creado');
    });
  }
  onView(ev: any) {
    this.stopPropagation(ev);
    this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: false,
      data: {
        title: 'Detalle Despacho',
        accountant: this.despachoSelected
      }
    });
  }
  onDespachoDetail(ev: any) {
    this.stopPropagation(ev);
    this.router.navigate(['/despacho/inicio'], {queryParams: { name: this.despachoSelected.name }});
  }
  onDespachoSelected(ev: any) {
    this.despachoSelected = ev.data;
  }

  filtrar(card: string) {
    this.setBgCard(card);
    console.log('filtrar en tabla');
  }

  private setBgCard(card: string) {
    const numCards = 8;
    for (let i = 1; i <= numCards; i++) {
      document.getElementById('card' + i).style.background = '#F5F5F5';
      document.getElementById('div' + i).style.background = '#E0E0E0';
    }
    document.getElementById('card' + card).style.background = '#98FB98';
    // document.getElementById('div' + card).style.background = '#7bea7b';
  }
  private stopPropagation(ev: Event) {
    if (ev) {
      ev.stopPropagation();
    }
  }
}// class
