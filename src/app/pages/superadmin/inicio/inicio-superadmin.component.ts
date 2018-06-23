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
import { OfficeProvider, CredentialsProvider, SendMailProvider } from '../../../providers/providers';

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
    { name: 'MircoRIF', prop: 'microRif', align: 'center', input: 'toggle' }
  ];
  despachoSelected: any;
  data = [];
  action = new Subject<RtAction>();
  private users = [];
  totalTaxpayer = 0;
  totalAccountant = 0;

  constructor(
    private sendMailProv: SendMailProvider,
    private credentialsProv: CredentialsProvider,
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private officeProv: OfficeProvider) { }

  ngOnInit() {
    this.officeProv.getAll().subscribe(data => {
      this.data = data.offices;
      this.data.forEach(office => {

        office.accountants.forEach(accountant => {
          this.totalAccountant += accountant.totalTaxpayer;
          this.totalTaxpayer += accountant.taxpayers.length;
        });
      });
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
        // create credentials
        // tslint:disable-next-line:max-line-length
        this.credentialsProv.create({ 'email': office.email, 'user': office.account.user, 'password': office.account.password, 'role': '5a728f43b15f741695e35c95' }).subscribe(cred => {
          this.sendMailProv.send({ email: office.email, subject: 'Credenciales de Acceso' }).subscribe(res => {
            this.action.next({ name: RtActionName.CREATE, newItem: office });
            const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
              data: {
                title: 'Creedenciales de Acceso',
                message: `Usuario: ${office.account.user}, Contraseña: ${office.account.password}`,
                type: 'success'
              }
            });
            // tslint:disable-next-line:no-shadowed-variable
            dialogRef2.afterClosed().subscribe((data) => {
              this.notification.success('Acción exitosa', `Nuevo despacho creado: ${office.name}`);
            });
          });
        }, err => console.log('err creating credentials', err));
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
      const updateCredentials = {
        old: {
          user: this.despachoSelected.account.user,
          password: this.despachoSelected.account.password
        },
        new: {
          user: office.account.user,
          password: office.account.password
        }
      };
      this.officeProv.update(office).subscribe(data => {
        this.credentialsProv.update(updateCredentials).subscribe(res => {
          office = data.office;
          this.action.next({ name: RtActionName.UPDATE, itemId: office._id, newItem: office });
          this.notification.success('Acción exitosa', `Despacho modificado: ${this.despachoSelected.name}`);
          this.despachoSelected = office;
        }, err => {
          console.log(err);
        });
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
        message: `Está seguro de eliminar el despacho ${this.despachoSelected.name}?`,
        type: 'danger'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      if (this.despachoSelected.accountants.length) {
        this.notification.warn('Error', `El despacho ${this.despachoSelected.name} tiene contadores, no se puede eliminar`);
        return;
      }
      this.officeProv.delete(this.despachoSelected._id).subscribe(data => {
        res = data.office;
        // remove credentials
        this.credentialsProv.delete({ user: data.office.account.user, password: data.office.account.password }).subscribe(deleted => {
          this.notification.success('Acción exitosa', `Despacho ${this.despachoSelected.name} eliminado`);
          this.action.next({ name: RtActionName.DELETE, itemId: this.despachoSelected._id });
          this.despachoSelected = null;
        });
      }, err => {
        this.notification.error('Error', 'No se pudo eliminar el despacho');
      });
    });
  }

  modalDespacho(title: string, despacho: any) {
    return this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: true,
      data: {
        title: title,
        accountant: JSON.parse(JSON.stringify(despacho)),
        office: true
      }
    });
  }

  onDespachoDetail(ev: any) {
    this.stopPropagation(ev);
    this.users.push({ 'role': 'Despacho', 'name': this.despachoSelected.name });
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

  activateMicroRif(ev: any) {
    // this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡Atención!',
        // tslint:disable-next-line:max-line-length
        message: ev.item.microRif ? '¿Estás seguro de deshabilitar los contribuyentes de éste despacho como MICRO-RIF?' : '¿Estás seguro de habilitar los contribuyentes de éste despacho como MICRO-RIF?',
        type: 'danger'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { ev.item.microRif = !ev.item.microRif; return; }
      this.officeProv.updateMicroRif(ev.item._id).subscribe(data => {
        this.despachoSelected = data.office;
        ev.item = data.office;
        this.action.next({ name: RtActionName.UPDATE, itemId: this.despachoSelected._id, newItem: this.despachoSelected });
        this.notification.success('Acción exitosa', `Los contribuyentes del despacho ${this.despachoSelected.name} se han actualizado.`);
      }, err => {
        ev.item.microRif = !ev.item.microRif;
        this.action.next({ name: RtActionName.UPDATE, itemId: ev.item._id, newItem: ev.item });
        this.notification.error('Error', `Los contribuyentes del despacho ${this.despachoSelected.name} no se actualizaron.`);
      });
    });
  }

  private setBgCard(card: string) {
    const numCards = 3;
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
