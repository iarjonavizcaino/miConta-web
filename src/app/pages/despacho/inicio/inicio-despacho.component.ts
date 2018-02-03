import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader, RtCheckEvent } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModalContadorComponent } from '../../_catalog/modal-contador/modal-contador.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ModalAsignarContribComponent } from '../../_catalog/modal-asignar-contrib/modal-asignar-contrib.component';
import { TaxpayerCatalogComponent } from '../../_catalog/taxpayer-catalog/taxpayer-catalog.component';
import { AccountantProvider, OfficeProvider } from '../../../providers/providers';

@Component({
  selector: 'app-inicio-despacho',
  templateUrl: './inicio-despacho.component.html',
  styleUrls: ['./inicio-despacho.component.css']
})
export class InicioDespachoComponent implements OnInit, OnDestroy {

  headers: Array<RtHeader> = [
    { name: 'Contador', prop: 'name', default: 'Sin nombre', width: '20' },
    { name: 'Contribuyentes', prop: 'totalTaxpayer', default: '0', align: 'center', width: '15' },
    { name: 'Declarados', prop: 'declaredTaxpayer', default: '0', align: 'center', width: '15' },
    { name: 'No Declarados', prop: 'undeclaredTaxpayer', default: '0', align: 'center', width: '15' },
    { name: 'Fuera de Límite', prop: 'outLimitTaxpayer', default: '0', align: 'center', width: '15' },
    { name: 'Activo', prop: 'active', input: 'toggle', width: '12' }
  ];
  selectedAccountant: any;
  sub: any; // this is for superadmin view into despacho
  despacho: string; // this is for superadmin view into despacho
  data = [];
  action = new Subject<RtAction>();
  roleUp = '';
  currentOffice: string;
  office: any;
  role = JSON.parse(localStorage.getItem('user')).role.name;

  constructor(
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog,
    private route: ActivatedRoute,
    private accountantProv: AccountantProvider,
    private officeProv: OfficeProvider
  ) { }

  ngOnInit() {
    let idDespacho;
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // tslint:disable-next-line:triple-equals
        if (params.name != 0) {
          this.despacho = params.name;
          idDespacho = params._id;
        }
      });

    if (this.role === 'superadmin') {
      this.currentOffice = idDespacho;
    } else {
      // this.currentOffice = '5a729092c341ec187cee82f3';
      this.currentOffice = '5a724aaa9b3e2d36e2d9917c';
    }

    this.officeProv.getById(this.currentOffice).subscribe(data => {
      this.office = data.office;
      this.data = this.office.accountants;
    });

    // this.accountantProv.getAll().subscribe(data => {
    //   this.data = data.accountants;
    // });
    this.setBgCard('1');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onCreate(ev) {
    this.stopPropagation(ev);
    // call modal to register new Contador
    const dialogRef = this.accountantModal(null, false, 'Nuevo Contador');
    dialogRef.afterClosed().subscribe((accountant) => {
      if (!accountant) { return; }
      // Make HTTP request to create contadores
      this.accountantProv.create(accountant).subscribe(data => {
        accountant = data.accountant;
        // tslint:disable-next-line:no-shadowed-variable
        this.officeProv.addAccountant(accountant._id, this.currentOffice).subscribe(data => {
          console.log(data.office);
        });
        // accountant.taxpayer = { total: 0, declarados: 0, no_declarados: 0, fuera_de_limite: 0 };
        this.action.next({ name: RtActionName.CREATE, newItem: accountant }); // save data
        const dialogRef2 = this.dialogCtrl.open(ConfirmComponent, {
          data: {
            title: 'Creedenciales de Acceso',
            message: `Usuario: ${accountant.account.user}, Contraseña: ${accountant.account.password}`,
            type: 'warn'
          }
        });
        // tslint:disable-next-line:no-shadowed-variable
        dialogRef2.afterClosed().subscribe((data) => {
          this.notification.success('Acción exitosa', `Contador creado correctamente: ${accountant.name}`);
        });
      }, err => {
        this.notification.error('Error', 'No se pudo crear el contador');
      });
    });
  }

  onReasignTaxpayer(ev) {
    this.stopPropagation(ev);
    this.taxPayersListModal(this.selectedAccountant.taxpayers, 'Contribuyentes asociados');
  }

  onRowChecked(ev: RtCheckEvent) {
    let accountant: any = ev.item;
    if (accountant.totalTaxpayer > 0 && ev.item.active) {
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
      this.accountantProv.update(accountant).subscribe(data => {
        accountant = data.accountant;
        if (accountant.active) {
          this.notification.success('Acción exitosa', `El contador ${accountant.name} se activó correctamente.`);
          this.action.next({ name: RtActionName.UPDATE, itemId: accountant._id, newItem: accountant });
          this.selectedAccountant = accountant;
        } else {
          this.notification.success('Acción exitosa', `El contador ${accountant.name} se desactivó correctamente.`);
          this.action.next({ name: RtActionName.UPDATE, itemId: accountant._id, newItem: accountant });
          this.selectedAccountant = accountant;
        }
      }, err => {
        accountant.active = !accountant.active;
        this.notification.error('Error', `Estaus del contador ${accountant.name} no actualizado`);
        this.action.next({ name: RtActionName.UPDATE, itemId: accountant._id, newItem: accountant });
      });
    }
  }

  onView(ev) {
    this.stopPropagation(ev);
    // call modal to see Contador personal info
    const dialogRef = this.accountantModal(this.selectedAccountant, true, 'Detalle contador');

    dialogRef.afterClosed().subscribe((accountant) => {
      if (!accountant) { return; }
      this.accountantProv.update(accountant).subscribe(data => {
        accountant = data.accountant;
        this.action.next({ name: RtActionName.UPDATE, itemId: accountant._id, newItem: accountant });
        this.notification.success('Acción exitosa', `Contador ${this.selectedAccountant.name} modificado`);
        this.selectedAccountant = accountant;
      }, err => {
        this.notification.error('Error', 'No se pudo modificar el contador');
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `¿Está seguro de eliminar el contador ${this.selectedAccountant.name}?`
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      this.accountantProv.delete(this.selectedAccountant._id).subscribe(data => {
        res = data.accountant;
        // tslint:disable-next-line:no-shadowed-variable
        this.officeProv.addAccountant(res._id, this.currentOffice).subscribe(data => {
          console.log(data.office);
        });
        this.notification.success('Acción exitosa', `Contador ${this.selectedAccountant.name} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.selectedAccountant._id });
      }, err => {
        this.notification.error('Error', 'No se pudo eliminar el contador');
      });
    });
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
    // this.stopPropagation(ev);
    // see page as Contador
    console.log(this.selectedAccountant.name);
    this.router.navigate(['/contador/inicio'], { queryParams: { _id: this.selectedAccountant._id, name: this.selectedAccountant.name } });
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
      document.getElementById('card' + i).style.background = '#F5F5F5';
      document.getElementById('div' + i).style.background = '#E0E0E0';
    }
    document.getElementById('card' + card).style.background = '#98FB98';
    document.getElementById('div' + card).style.background = '#7bea7b';
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
