import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalCrearContribuyenteComponent } from '../../_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { NotificationsService } from 'angular2-notifications';
import { UploadXmlComponent } from '../../_catalog/upload-xml/upload-xml.component';
import { TaxpayerProvider, AccountantProvider } from '../../../providers/providers';

@Component({
  selector: 'app-inicio-contador',
  templateUrl: './inicio-contador.component.html',
  styleUrls: ['./inicio-contador.component.css']
})
export class InicioContadorComponent implements OnInit, OnDestroy {

  headers: Array<RtHeader> = [
    { name: 'Contribuyente', prop: 'socialReason', default: '' },
    { name: 'RFC', prop: 'rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Perfil', prop: 'profile.name', default: 'Sin perfil' },
    { name: 'Régimen fiscal', prop: 'fiscalRegime', default: 'RIF' },
  ];
  selectedTaxpayer: any;
  data = [];
  action = new Subject<RtAction>();
  sub: any;
  contador: string;
  roleUp = '';
  accountant: any;
  currentAccountant: string;
  role = JSON.parse(localStorage.getItem('user')).role.name;
  users = [];
  office: string;
  constructor(
    private router: Router,
    private dialogCtrl: MatDialog,
    private notification: NotificationsService,
    private route: ActivatedRoute,
    private taxpayerProv: TaxpayerProvider,
    private accountantProv: AccountantProvider) { }

  ngOnInit() {
    let idAccountant;
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // tslint:disable-next-line:triple-equals
        if (params.name != 0) {
          this.contador = params.name;
          idAccountant = params._id;
          this.office = params.office;
        }
      });

    if (this.role === 'superadmin' || this.role === 'despacho') {
      this.currentAccountant = idAccountant;
    } else {
      // this.currentAccountant = '5a74d57a4782953e679e8097';
      // this.currentAccountant = '5a75dff5938abf6cf488412b';
      this.currentAccountant = '5a77ce6d24e4c0072dfed691';
    }

    this.accountantProv.getById(this.currentAccountant).subscribe(data => {
      this.accountant = data.accountant;
      this.data = this.accountant.taxpayers;
    });
    this.setBgCard('1');
    this.loadUsers();
  }
  private loadUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    if (users) {
      this.users = users;
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onTaxpayerSelected(ev) {
    this.selectedTaxpayer = ev.data;
  }

  onView(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.taxpayerModal(this.selectedTaxpayer, true, 'Detalle contribuyente');
    dialogRef.afterClosed().subscribe((taxpayer) => {
      if (!taxpayer) { return; }
      this.taxpayerProv.update(taxpayer).subscribe(data => {
        taxpayer = data.taxpayer;
        this.action.next({ name: RtActionName.UPDATE, itemId: taxpayer._id, newItem: taxpayer });
        this.notification.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} modificado`);
        this.selectedTaxpayer = taxpayer;
      }, err => {
        this.notification.error('Error', 'No se pudo modificar el contribuyente');
      });
    });

  }

  onCreate(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.taxpayerModal(null, false, 'Nuevo contribuyente');
    dialogRef.afterClosed().subscribe((taxpayer) => {
      if (!taxpayer) { return; }
      console.log('new', taxpayer);
      // Make HTTP request to create contadores
      this.taxpayerProv.create(taxpayer).subscribe(data => {
        taxpayer = data.taxpayer;
        // tslint:disable-next-line:no-shadowed-variable
        this.accountantProv.addTaxpayer(taxpayer._id, this.currentAccountant).subscribe(data => {
          console.log(data.accountant);
          this.accountant = data.accountant;
        });
        console.log(taxpayer);
        this.action.next({ name: RtActionName.CREATE, newItem: taxpayer });
        console.log('after');
        const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
          data: {
            title: 'Creedenciales de Acceso',
            message: `Usuario: ${taxpayer.account.user}, Contraseña: ${taxpayer.account.password}`,
            type: 'success'
          }
        });
        console.log('hola');
        // tslint:disable-next-line:no-shadowed-variable
        dialogRef2.afterClosed().subscribe((data) => {
          this.notification.success('Acción exitosa', `Nuevo contribuyente creado: ${taxpayer.socialReason}`);
        });
      }, err => {
        console.log(err);
        this.notification.error('Error', 'No se pudo crear el contribuyente');
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `¿Está seguro de eliminar el contribuyente ${this.selectedTaxpayer.socialReason}?`,
        type: 'danger'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      this.taxpayerProv.delete(this.selectedTaxpayer._id).subscribe(data => {
        res = data.taxpayer;
        this.accountant.totalTaxpayer -= 1;
        // tslint:disable-next-line:no-shadowed-variable
        this.accountantProv.addTaxpayer(res._id, this.currentAccountant).subscribe(data => {
          console.log(data.office);
        });
        this.notification.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.selectedTaxpayer._id });
      });
    }, err => {
      this.notification.error('Error', 'No se pudo modificar el contribuyente');
    });
  }

  filtrar(card: string) {
    this.setBgCard(card);
    console.log('filtrar en tabla');
  }
  private setBgCard(card: string) {
    const numCards = 4;
    for (let i = 1; i <= numCards; i++) {
      document.getElementById('card' + i).style.background = '#F5F5F5';
      document.getElementById('div' + i).style.background = '#E0E0E0';
    }

    document.getElementById('card' + card).style.background = '#98FB98';
    document.getElementById('div' + card).style.background = '#7bea7b';
  }
  taxpayerDetail(page: string) {
    this.users.push({'role': 'Contribuyente', 'name': this.selectedTaxpayer.name});
    localStorage.setItem('users', JSON.stringify(this.users));
    this.router.navigate([page], { queryParams: { name: this.selectedTaxpayer.socialReason,
      office: this.office, accountant: this.accountant._id } });
  }
  updateUsers() {
    this.users.pop();
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  onUploadXML(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.xmlModal('Subir archivo XML');

    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      this.notification.success('Acción exitosa', 'El archivo se subió correctamente');
      console.log(data);
    });
  }
  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
  taxpayerModal(taxPayer: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(ModalCrearContribuyenteComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        taxPayer: taxPayer
      }
    });
  }

  xmlModal(title: string) {
    return this.dialogCtrl.open(UploadXmlComponent, {
      disableClose: false,
      data: {
        title: title
      }
    });
  }
}
