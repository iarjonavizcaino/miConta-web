import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalContadorComponent } from '../../_catalog/modal-contador/modal-contador.component';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

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
  ];
  selectedAccountant: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(private notification: NotificationsService, private router: Router, private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
    this.setBgCard('card1');
  }
  private loadData() {
    this.data = [
      {
        name: 'Denis Adrian Jiménez Ortiz',
        email: 'denis_jim@gmail.com',
        phone: '3111979297',
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
          total: 40,
          declarados: 20,
          no_declarados: 18,
          fuera_de_limite: 2
        }
      },
      {
        name: 'Roberto Herrera Ortiz',
        email: 'bertho@ricosuave.com',
        phone: '3111108525',
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
          total: 50,
          declarados: 25,
          no_declarados: 5,
          fuera_de_limite: 20
        }
      },
      {
        name: 'Guadalupe Alcaraz Tizando',
        email: 'lupe_tizanado@gmail.com',
        phone: '3111632141',
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
          total: 10,
          declarados: 8,
          no_declarados: 1,
          fuera_de_limite: 1
        }
      }
    ];
  }
  onCreate(ev) {
    // call modal to register new Contador
    const accountant = this.accountantModal(this.selectedAccountant, false, 'Nuevo Contador');
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
        this.notification.success('Exito', 'Se guardo correctamente');
      });
    });
  }
  onView(ev) {
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
  onContadorDetail() {
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

}
