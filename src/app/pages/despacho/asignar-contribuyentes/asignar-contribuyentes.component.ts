import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalAsignarContribComponent } from '../../_catalog/modal-asignar-contrib/modal-asignar-contrib.component';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { OfficeProvider, AccountantProvider } from '../../../providers/providers';
import { TaxpayerProvider } from '../../../providers/taxpayer.prov';
@Component({
  selector: 'app-asignar-contribuyentes',
  templateUrl: './asignar-contribuyentes.component.html',
  styleUrls: ['./asignar-contribuyentes.component.css']
})
export class AsignarContribuyentesComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Seleccionar', prop: 'checked', input: 'checkbox' },
    { name: 'Contador Asociado', prop: 'name', default: '' },
    { name: 'Contribuyente', prop: 'taxpayer', default: 'Sin nombre' },
    { name: 'Razón Social', prop: 'socialReason', default: 'XXXX-XXX-XXXX' },
    { name: 'Régimen Fiscal', prop: 'regimen_fiscal', default: 'Sin régimen' },
  ];
  selectedItem: any;
  // currentOffice = '5a724aaa9b3e2d36e2d9917c';
  currentOffice = '5a75f084057460690aa2d833';  // ids static because  we didn't have login
  data = [];
  checkedItems = 0;
  allChecked = false; // this is for change the icon 'check' in table
  action = new Subject<RtAction>();
  office: any;

  // tslint:disable-next-line:max-line-length
  constructor(
    private notify: NotificationsService,
    private officeProv: OfficeProvider,
    private taxpayerProv: TaxpayerProvider,
    private accountantProv: AccountantProvider,
    private notification: NotificationsService,
    private router: Router,
    private dialogCtrl: MatDialog) { }


  ngOnInit() {
    this.loadData();
  }
  private loadData() {
    this.officeProv.getById(this.currentOffice).subscribe(data => {
      data.office.accountants.forEach(accountant => {
        accountant.taxpayers.forEach(id => {
          this.taxpayerProv.getById(id).subscribe(res => { // get taxpayer by id
            const taxpayer = res.taxpayer;
            // tslint:disable-next-line:max-line-length
            this.data.push({ checked: false, _idAccountant: accountant._id, _idTaxpayer: taxpayer._id, name: accountant.name, taxpayer: taxpayer.name, socialReason: taxpayer.socialReason, regimen_fiscal: taxpayer.fiscalRegime });
          });
        });
      });
      // console.log(data);
    });
  }// loadData()

  onItemSelected(ev) {
    if (ev.data) {
      if (ev.data.checked) {
        ev.data.checked = false;
        this.checkedItems = this.checkedItems - 1 === 0 ? 0 : this.checkedItems - 1;
      } else {
        ev.data.checked = true;
        this.checkedItems++;
      }
      this.selectedItem = ev.data;
    }
  }

  onItemChecked(ev) {
    if (!ev.item.checked) {
      this.checkedItems++;
      ev.item.checked = !ev.item.checked;
      this.selectedItem = ev.item;
    } else {
      this.checkedItems--;
    }
  }

  onCheckAll(ev) {
    this.allChecked = !this.allChecked;
    if (this.allChecked) {
      this.data.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.data.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedItems = this.data.length;
    } else {
      this.checkedItems = 0;
      this.data.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }
  onChange(ev) {
    this.stopPropagation(ev);
    const newAccountant = this.dialogCtrl.open(ModalAsignarContribComponent, {
      disableClose: false,
      data: {
        todayAccontant: this.selectedItem ? this.selectedItem.accountant : '',
        selectedAll: this.allChecked,
        office: this.currentOffice,
        accountant: this.selectedItem._idAccountant
      }
    });
    const newTaxpayers = [];
    newAccountant.afterClosed().subscribe((data) => {
      if (!data) { return; }
      const res = this.data.slice();
      res.forEach((element) => {
        if (element.checked) {
          newTaxpayers.push(element._idTaxpayer);
          // element.accountant = data;
          // this.action.next({name: RtActionName.DELETE, itemId: element._id });
        }
        element.checked = false;
      });
      // tslint:disable-next-line:no-shadowed-variable
      // tslint:disable-next-line:no-shadowed-variable
      this.accountantProv.reasignTaxpayers(newTaxpayers, this.selectedItem._idAccountant, data._id).subscribe(data => {
        this.data = data.accountant.taxpayers;
        this.notify.success('Acción Exitosa', 'Los contribuyentes se ha reasignado correctamente');
      }, err => {
        console.log(err);
        this.notify.error('Error', 'Ocurrió un error al reasignar los contribuyentes');
      });
    });
  }
  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}// class

