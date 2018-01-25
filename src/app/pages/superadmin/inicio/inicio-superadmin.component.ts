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
    { name: 'Despacho', prop: 'name', default: 'Sin nombre' },
    { name: 'Teléfono', prop: 'phone', default: 'sin teléfono' },
    { name: 'Email', prop: 'email', default: 'Sin email' },
    { name: 'Contadores', prop: 'accountant', default: '0', align: 'center' },
    { name: 'Contribuyentes', prop: 'taxpayer', default: '0', align: 'center' },
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
    this.setBgCard('1');
  }

  loadData() {
    this.data = [
      {
        _id: '1',
        name: 'Andrea Ramírez',
        accountant: 42,
        taxpayer: 45,
        email: 'andrea@gmail.com',
        phone: '3114598725',
        address: {
          street: 'Calle 6',
          number: '57',
          neighborhood: 'El Rodeo',
          zipcode: '63117',
          city: 'Tepic',
          state: 'Nayarit',
          municipality: 'Tepic'
        }
      }
    ];
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalDespacho('Nuevo despacho', null);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      data = { name: data.name, accountant: 0, taxpayer: 0 };
      this.action.next({ name: RtActionName.CREATE, newItem: data });
      this.despachoSelected = data;
      this.notification.success('Acción exitosa', `Nuevo despacho creado: ${ this.despachoSelected.name }`);
    });
  }

  onView(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalDespacho('Detalle despacho', this.despachoSelected);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      this.action.next({ name: RtActionName.UPDATE, itemId: data._id, newItem: data });
      this.notification.success('Acción exitosa', `Nuevo despacho creado: ${ this.despachoSelected.name }`);
      this.despachoSelected = data;
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `Está seguro de eliminar el despacho ${ this.despachoSelected.name }?`
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      console.log(data);
      // DO IT
      this.action.next({ name: RtActionName.DELETE, itemId: this.despachoSelected._id, newItem: data });
      this.notification.success('Acción exitosa', `Despacho ${ this.despachoSelected.name } eliminado`);
      this.despachoSelected = null;
    });
  }

  modalDespacho(title: string, despacho: any) {
    return this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: false,
      data: {
        title: title,
        accountant: despacho
      }
    });
  }

  onDespachoDetail(ev: any) {
    this.stopPropagation(ev);
    this.router.navigate(['/despacho/inicio'], { queryParams: { name: this.despachoSelected.name } });
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
    document.getElementById('div' + card).style.background = '#7bea7b';
  }

  private stopPropagation(ev: Event) {
    if (ev) {
      ev.stopPropagation();
    }
  }
}// class
