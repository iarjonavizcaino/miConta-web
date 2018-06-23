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
import { TaxpayerProvider, AccountantProvider, BillProvider, HistoricalProvider, BitacoraProvider, FirebaseProvider, CredentialsProvider, SendMailProvider } from '../../../providers/providers';
import { ModalBitacoraComponent } from '../../_catalog/modal-bitacora/modal-bitacora.component';
import { ResumenXmlComponent } from '../../_catalog/resumen-xml/resumen-xml.component';

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
    private sendMailProv: SendMailProvider,
    private credentialProv: CredentialsProvider,
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
      if (this.role === 'Superadmin') {
        if (this.users.length > 2) {
          this.users.length = 2;
        }
      } else if (this.role === 'Despacho') {
        if (this.users.length > 1) {
          this.users.length = 1;
        }
      } else if (this.role === 'Contador') {
        this.users.length = 0;
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
      console.log('taxpayer', taxpayer.taxpayer);
      const updateCredentials = {
        old: {
          user: this.selectedTaxpayer.account.user,
          password: this.selectedTaxpayer.account.password
        },
        new: {
          user: taxpayer.taxpayer.account.user,
          password: taxpayer.taxpayer.account.password
        }
      };
      this.taxpayerProv.update(taxpayer.taxpayer).subscribe(data => {
        this.credentialProv.update(updateCredentials).subscribe(res => {
          taxpayer = data.taxpayer;
          this.action.next({ name: RtActionName.UPDATE, itemId: taxpayer._id, newItem: taxpayer });
          this.notify.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} modificado`);
          this.selectedTaxpayer = taxpayer;
        }, err => console.log(err));
      }, err => {
        console.log(err);
        this.notify.error('Error', 'No se pudo modificar el contribuyente');
      });
    });

  }

  onCreate(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.taxpayerModal(null, false, 'Nuevo contribuyente');
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      const sailsFile = data.sailsFile ? data.sailsFile : [];
      // tslint:disable-next-line:no-shadowed-variable
      this.taxpayerProv.create(data.taxpayer).subscribe(res => {
        data.taxpayer = res.taxpayer;
        // save sailsFile
        for (let i = 0; i < sailsFile.length; i++) {
          const name = data.taxpayer._id + '-' + new Date();
          // tslint:disable-next-line:no-shadowed-variable
          this.firebaseProv.uploadFile('sellos/', name, 'txt', sailsFile[i]).then(sailsFile => {
            data.taxpayer.sailsFile.push({ fileName: name, link: sailsFile.downloadURL });
          }, err => { console.log(err); });
        } // OK
        console.log('before upload fiel');
        // save loyalFile in firebase storage
        if (data.sailsFile.length !== 0) {
          console.log('run this?');
          this.firebaseProv.uploadFile('fiel/', data.taxpayer._id + '-' + new Date(), 'txt', data.loyalFile).then(loyalFile => {
            data.taxpayer.loyalFile = loyalFile.downloadURL;  // save URL
            console.log('before', data.taxpayer.sailsFile);
            // update taxpayer with loyal and sails files
            this.taxpayerProv.update(data.taxpayer).subscribe(update => {
              console.log('after', update);
            }, err => {
              console.log(err);
            });
          }, err => {
            console.log(err);
          });
        }

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

        this.sendMailProv.send({ email: res.taxpayer.email, subject: 'Credenciales de Acceso' }).subscribe(res2 => {
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
        });
      }, err => {
        console.log(err);
        this.notify.error('Error', 'No se pudo crear el contribuyente');
      });
    });
  } // onCreate()

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
        this.credentialProv.delete({ user: data.taxpayer.account.user, password: data.taxpayer.account.password }).subscribe(deleted => {
          // tslint:disable-next-line:no-shadowed-variable
          this.accountantProv.addTaxpayer(res._id, this.currentAccountant).subscribe(data => {
            this.accountant = data.accountant;
          });
          this.notify.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.socialReason} eliminado`);
          this.action.next({ name: RtActionName.DELETE, itemId: this.selectedTaxpayer._id });
        });
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
      const sumaryBills = {
        billSuccessfully: [],
        billsWithErrors: []
      };
      // save link to download file
      data.forEach(element => {
        // use provier and notify
        this.billProv.create(element.bill).subscribe((res) => {
          // this.notify.success('Acción exitosa', 'La factura se ha guardado correctamente');
          // save in firebase storage
          this.firebaseProv.uploadFile('xml/', res.bill.uuid, 'xml', element.file).then(storage => {
            res.bill.xmlFile = storage.downloadURL;
            this.billProv.update(res.bill._id, res.bill).subscribe(update => {
              sumaryBills.billSuccessfully.push(update.bill);
            }, err => { console.log(err); }); // update bill with xmlFile
          }, err => { console.log(err); });  // save in firebase
        }, err => { // create bill
          // this.notify.error('Error', JSON.parse(err._body).message);
          console.log('cannot create', element.bill);
          sumaryBills.billsWithErrors.push(element.bill);
        });
      });

      // show sumary
      this.dialogCtrl.open(ResumenXmlComponent, {
        disableClose: true,
        data: {
          title: 'Resumen de Facturas',
          bills: sumaryBills
        }
      });

    });
  }

  showBitacora(ev: any) {
    this.stopPropagation(ev);
    this.bitacoraProv.getByTaxpayer(this.selectedTaxpayer._id).subscribe(res => {
      this.dialogCtrl.open(ModalBitacoraComponent, {
        disableClose: true,
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
      disableClose: true,
      data: {
        title: title,
        readonly: readonly,
        taxPayer: JSON.parse(JSON.stringify(taxPayer))
      }
    });
  }

  xmlModal(title: string) {
    return this.dialogCtrl.open(UploadXmlComponent, {
      disableClose: true,
      data: {
        title: title,
        taxpayer: this.selectedTaxpayer
      }
    });
  }
}
