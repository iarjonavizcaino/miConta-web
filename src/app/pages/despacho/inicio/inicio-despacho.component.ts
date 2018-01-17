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
  selector: 'app-inicio-despacho',
  templateUrl: './inicio-despacho.component.html',
  styleUrls: ['./inicio-despacho.component.css']
})
export class InicioDespachoComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Contador', prop: 'name', default: '' },
    { name: 'Total de Contribuyentes', prop: 'taxpayer.total', default: '0', align: 'center' },
    { name: 'Contribuyentes Declarados', prop: 'taxpayer.declarados', default: '0', align: 'center' },
    { name: 'Contrib. No Declarados', prop: 'taxpayer.no_declarados', default: '0', align: 'center' },
    { name: 'Fuera de Límite', prop: 'taxpayer.fuera_de_limite', default: '0', align: 'center' },
    { name: 'Activo', prop: 'active', input: 'toggle' }
  ];
  selectedAccountant: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
    this.setBgCard('card1');
  }
  private loadData() {
    this.data = [
      {
        _id: '1',
        name: 'Denis Adrian Jiménez Ortiz',
        email: 'denis_jim@gmail.com',
        phone: '3111979297',
        active: true,
        address: {
          street: 'Sánchez Tahuada',
          number: '75',
          neighborhood: 'Cantarranas',
          zipcode: '68139',
          city: 'Tepic',
          state: 'Nayarit',
          municipality: 'Tepic'
        },
        taxpayer: {
          taxpayers: [
            {
              _id: '1',
              name: 'Juan Ramírez',
              rfc: 'VECJ880326XXX',
              fiscal_regime: 'Incorporación Fiscal'
            },
            {
              _id: '2',
              name: 'Manuel López',
              rfc: 'JCVE880326XXX',
              fiscal_regime: 'Servicios Profesionales'
            },
            {
              _id: '3',
              name: 'Amalia de la Cruz',
              rfc: 'ANAS81636XXX',
              fiscal_regime: 'Intereses'
            },
          ],
          total: 40,
          declarados: 20,
          no_declarados: 18,
          fuera_de_limite: 2
        }
      },
      {
        _id: '2',
        name: 'Roberto Herrera Ortiz',
        email: 'bertho@ricosuave.com',
        phone: '3111108525',
        active: false,
        address: {
          street: 'Av. Mato Lópe',
          number: '31',
          neighborhood: 'Pueblo Nuevo',
          zipcode: '46511',
          city: 'Tepic',
          state: 'Nayarit',
          municipality: 'Tepic'
        },
        taxpayer: {
          taxpayers: [
            {
              _id: '1',
              name: 'Lorena Jimenez',
              rfc: 'VECJ880326XXX',
              fiscal_regime: 'Incorporación Fiscal'
            },
            {
              _id: '2',
              name: 'Joaquín Lugo',
              rfc: 'JCVE880326XXX',
              fiscal_regime: 'Servicios Profesionales'
            },
            {
              _id: '3',
              name: 'Ana González',
              rfc: 'ANAS81636XXX',
              fiscal_regime: 'Intereses'
            },
          ],
          total: 50,
          declarados: 25,
          no_declarados: 5,
          fuera_de_limite: 20
        }
      },
      {
        _id: '3',
        name: 'Guadalupe Alcaraz Tizando',
        email: 'lupe_tizanado@gmail.com',
        phone: '3111632141',
        active: true,
        address: {
          street: 'Av. Orozco',
          number: '96',
          neighborhood: 'Oriental',
          zipcode: '92318',
          city: 'Tepic',
          state: 'Nayarit',
          municipality: 'Tepic'
        },
        taxpayer: {
          taxpayers: [
            {
              _id: '1',
              name: 'Enrique Vera',
              rfc: 'VECJ880326XXX',
              fiscal_regime: 'Incorporación Fiscal'
            },
            {
              _id: '2',
              name: 'Jose Manuel Martínez',
              rfc: 'JCVE880326XXX',
              fiscal_regime: 'Servicios Profesionales'
            },
            {
              _id: '3',
              name: 'Francisco Zavala',
              rfc: 'ANAS81636XXX',
              fiscal_regime: 'Intereses'
            },
          ],
          total: 10,
          declarados: 8,
          no_declarados: 1,
          fuera_de_limite: 1
        },
      }
    ];
  }

  onCreate(ev) {
    this.stopPropagation(ev);
    // call modal to register new Contador
    const accountant = this.accountantModal(null, false, 'Nuevo Contador');
    accountant.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create contadores
      data.taxpayer = { total: 0, declarados: 0, no_declarados: 0, fuera_de_limite: 0 };
      this.action.next({ name: RtActionName.CREATE, newItem: data }); // save data
      const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
        data: {
          title: 'Creedenciales de Acceso',
          message: 'usuario: 123, password: 123',
          type: 'warn'
        }
      });
      // tslint:disable-next-line:no-shadowed-variable
      dialogRef.afterClosed().subscribe((data) => {
        this.notification.success('Acción exitosa', `El contador se guardó correctamente`);
      });
    });
  }

  onReasignTaxpayer(ev) {
    this.stopPropagation(ev);
    this.taxPayersListModal(this.selectedAccountant.taxpayer.taxpayers, 'Contribuyentes asociados');
  }

  onRowChecked(ev: RtCheckEvent) {
    const accountant: any = ev.item;
    if (accountant.taxpayer.total > 0 && ev.item.active) {
      const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
        data: {
          title: '¡Atención!',
          message: `El contador ${accountant.name} tiene contribuyentes asociados. No se puede desactivar`,
          type: 'warn',
          input: false,
          alert: true
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        accountant.active = true;
        this.action.next({ name: RtActionName.UPDATE, itemId: accountant._id, newItem: accountant });
      });
    } else {
      accountant.active = !accountant.active;
      if (accountant.active) {
        this.notification.success('Acción exitosa', `El contador ${accountant.name} se activó correctamente.`);
      } else {
        this.notification.success('Acción exitosa', `El contador ${accountant.name} se desactivó correctamente.`);
      }
    }
  }

  onView(ev) {
    this.stopPropagation(ev);
    // call modal to see Contador personal info
    this.accountantModal(this.selectedAccountant, true, 'Detalle');
  }

  accountantModal(accountant: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(ModalContadorComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        accountant: accountant
      }
    });
  }

  taxPayersListModal(taxpayer: any, title: string) {
    return this.dialogCtrl.open(TaxpayerCatalogComponent, {
      disableClose: false,
      data: {
        title: title,
        taxpayer: taxpayer
      }
    });
  }

  onContadorDetail(ev) {
    this.stopPropagation(ev);
    // see page as Contador
    this.router.navigate(['/contador/incio', { contador: this.selectedAccountant.name }]);
  }

  onContadorSelected(ev) {
    this.selectedAccountant = ev.data;
  }

  filtrar(card: string) {
    this.setBgCard(card);
    console.log('filtrar en tabla');
  }
  private setBgCard(card: string) {
    const numCards = 7;
    for (let i = 1; i <= numCards; i++) {
      document.getElementById('card' + i).style.background = 'lightgrey';
    }
    document.getElementById(card).style.background = 'lightgreen';
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
