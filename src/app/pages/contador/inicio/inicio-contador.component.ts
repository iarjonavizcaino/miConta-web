import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalCrearContribuyenteComponent } from '../../_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { NotificationsService } from 'angular2-notifications';
import { UploadXmlComponent } from '../../_catalog/upload-xml/upload-xml.component';
// tslint:disable-next-line:max-line-length
import { TaxpayerProvider, AccountantProvider, BillProvider, HistoricalProvider, BitacoraProvider, FirebaseProvider } from '../../../providers/providers';
import { ModalBitacoraComponent } from '../../_catalog/modal-bitacora/modal-bitacora.component';

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
  usersBackup = [];
  office: string;
  constructor(
    private firebaseProv: FirebaseProvider,
    private router: Router,
    private dialogCtrl: MatDialog,
    private notify: NotificationsService,
    private route: ActivatedRoute,
    private bitacoraProv: BitacoraProvider,
    private taxpayerProv: TaxpayerProvider,
    private accountantProv: AccountantProvider,
    private billProv: BillProvider,
    private historicalProv: HistoricalProvider
  ) { }

  ngOnInit() {
    let idAccountant;
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name.toString().toLowerCase();
    // this.updateUsers();
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

    if (this.role === 'Superadmin' || this.role === 'Despacho') {
      this.currentAccountant = idAccountant;
    } else {
      // this.currentAccountant = '5a74d57a4782953e679e8097';
      this.currentAccountant = JSON.parse(localStorage.getItem('user'))._id;
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
      if (this.users.length > 2) {
        this.users.length = 2;
      }
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
        this.notify.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} modificado`);
        this.selectedTaxpayer = taxpayer;
      }, err => {
        this.notify.error('Error', 'No se pudo modificar el contribuyente');
      });
    });

  }

  onCreate(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.taxpayerModal(null, false, 'Nuevo contribuyente');
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }

      // tslint:disable-next-line:no-shadowed-variable
      this.taxpayerProv.create(data.taxpayer).subscribe(res => {
        data.taxpayer = res.taxpayer;

        // save file in firebase storage
        this.firebaseProv.uploadFile('fiel/', data.taxpayer._id, 'txt', data.loyalFile).then(storage => {
          data.taxpayer.loyalFile = storage.downloadURL;  // save URL

          this.taxpayerProv.update(data.taxpayer).subscribe(update => {
            console.log(update);
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });

        // tslint:disable-next-line:no-shadowed-variable
        this.accountantProv.addTaxpayer(data.taxpayer._id, this.currentAccountant).subscribe(data => {
          this.accountant = data.accountant;
        });
        const currentBim = Math.trunc((new Date().getMonth() / 2) + 1);

        const bimesters = [
          {
            name: 'ENE-FEB',
            num: 1
          },
          {
            name: 'MAR-ABR',
            num: 2
          },
          {
            name: 'MAY-JUN',
            num: 3
          },
          {
            name: 'JUL-AGO',
            num: 4
          },
          {
            name: 'SEPT-OCT',
            num: 5
          },
          {
            name: 'NOV-DIC',
            num: 6
          }
        ];

        const index = bimesters.findIndex(bimester => bimester.num === currentBim);

        const historical = {
          taxpayer: data.taxpayer._id,
          exercise: (new Date()).getFullYear(),
          active: true,
          ingresosAnt: data.taxpayer.yearBefore,
          periods: [{
            name: bimesters[index].name,
            num: bimesters[index].num,
            active: true,
            debtSAT: 0,
            bills: []
          }]
        };
        // tslint:disable-next-line:no-shadowed-variable
        this.historicalProv.create(historical).subscribe(data => {
          console.log(data.historical);
        });
        this.action.next({ name: RtActionName.CREATE, newItem: data.taxpayer });
        const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
          data: {
            title: 'Creedenciales de Acceso',
            message: `Usuario: ${data.taxpayer.account.user}, Contraseña: ${data.taxpayer.account.password}`,
            type: 'success'
          }
        });
        // tslint:disable-next-line:no-shadowed-variable
        dialogRef2.afterClosed().subscribe((data) => {
          this.notify.success('Acción exitosa', `Nuevo contribuyente creado: ${data.taxpayer.socialReason}`);
        });
      }, err => {
        console.log(err);
        this.notify.error('Error', 'No se pudo crear el contribuyente');
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
          this.accountant = data.accountant;
        });
        this.notify.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.selectedTaxpayer._id });
      });
    }, err => {
      this.notify.error('Error', 'No se pudo modificar el contribuyente');
    });
  }

  filtrar(card: string) {
    this.setBgCard(card);
  }

  private setBgCard(card: string) {
    const numCards = 1;
    for (let i = 1; i <= numCards; i++) {
      document.getElementById('card' + i).style.background = '#F5F5F5';
      document.getElementById('div' + i).style.background = '#E0E0E0';
    }

    document.getElementById('card' + card).style.background = '#98FB98';
    document.getElementById('div' + card).style.background = '#7bea7b';
  }

  taxpayerDetail(page: string) {
    this.users.push({ 'role': 'Contribuyente', 'name': this.selectedTaxpayer.name });
    localStorage.setItem('taxpayer', JSON.stringify(this.selectedTaxpayer));
    localStorage.setItem('users', JSON.stringify(this.users));
    this.router.navigate([page], {
      queryParams: {
        name: this.selectedTaxpayer.socialReason,
        office: this.office, accountant: this.accountant._id
      }
    });
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
      // use provier and notify
      this.billProv.create(data).subscribe((res) => {
        this.notify.success('Acción exitosa', 'Las facturas se han guardado correctamente');
      }, err => {
        this.notify.error('Error', 'No se pudo guardar la factura');
      });
    });
  }
  showBitacora(ev: any) {
    this.stopPropagation(ev);
    this.bitacoraProv.getByTaxpayer(this.selectedTaxpayer._id).subscribe(res => {
      this.dialogCtrl.open(ModalBitacoraComponent, {
        disableClose: false,
        data: {
          bitacoras: res,
          name: this.selectedTaxpayer.socialReason
        }
      });
    }, err => {
      console.log(err);
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
        title: title,
        taxpayer: this.selectedTaxpayer
      }
    });
  }
}
