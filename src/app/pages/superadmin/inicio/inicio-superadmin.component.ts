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
import { OfficeProvider } from '../../../providers/providers';

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
    { name: 'Contadores', prop: 'totalAccountant', default: '0', align: 'center' },
    { name: 'Contribuyentes', prop: 'totalTaxpayer', default: '0', align: 'center' },
  ];
  despachoSelected: any;
  data = [];
  action = new Subject<RtAction>();
  private users = [];
  constructor(
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private officeProv: OfficeProvider) { }

  ngOnInit() {
    this.officeProv.getAll().subscribe(data => {
      this.data = data.offices;
    });
    this.setBgCard('1');
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalDespacho('Nuevo despacho', null);
    dialogRef.afterClosed().subscribe((office) => {
      if (!office) { return; }
      this.officeProv.create(office).subscribe(data => {
        office = data.office;
        // office = { name: office.name, accountant: 0, taxpayer: 0 };
        this.action.next({ name: RtActionName.CREATE, newItem: office });
        const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
          data: {
            title: 'Creedenciales de Acceso',
            message: `Usuario: ${office.account.user}, Contraseña: ${office.account.password}`,
            type: 'warn'
          }
        });
        // tslint:disable-next-line:no-shadowed-variable
        dialogRef2.afterClosed().subscribe((data) => {
          this.notification.success('Acción exitosa', `Nuevo despacho creado: ${office.name}`);
        });
      }, err => {
        this.notification.error('Error', 'No se pudo crear el despacho');
      });
    });
  }

  onView(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.modalDespacho('Detalle despacho', this.despachoSelected);
    dialogRef.afterClosed().subscribe((office) => {
      if (!office) { return; }

      this.officeProv.update(office).subscribe(data => {
        office = data.office;
        this.action.next({ name: RtActionName.UPDATE, itemId: office._id, newItem: office });
        this.notification.success('Acción exitosa', `Despacho modificado: ${this.despachoSelected.name}`);
        this.despachoSelected = office;
      }, err => {
        this.notification.error('Error', 'No se pudo modificar el despacho');
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `Está seguro de eliminar el despacho ${this.despachoSelected.name}?`
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }

      this.officeProv.delete(this.despachoSelected._id).subscribe(data => {
        res = data.office;
        this.notification.success('Acción exitosa', `Despacho ${this.despachoSelected.name} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.despachoSelected._id });
        this.despachoSelected = null;
      }, err => {
        this.notification.error('Error', 'No se pudo eliminar el despacho');
      });
    });
  }

  modalDespacho(title: string, despacho: any) {
    return this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: false,
      data: {
        title: title,
        accountant: despacho,
        office: true
      }
    });
  }

  onDespachoDetail(ev: any) {
    this.stopPropagation(ev);
    this.users.push({'role': 'Despacho', 'name': this.despachoSelected.name});
    localStorage.setItem('users', JSON.stringify(this.users));
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/despacho/inicio'], { queryParams: { _id: this.despachoSelected._id, name: this.despachoSelected.name } });
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
