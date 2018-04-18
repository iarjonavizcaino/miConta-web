import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalAsignarContribComponent } from '../modal-asignar-contrib/modal-asignar-contrib.component';
import { AccountantProvider } from '../../../providers/providers';

@Component({
  selector: 'app-taxpayer-catalog',
  templateUrl: './taxpayer-catalog.component.html',
  styleUrls: ['./taxpayer-catalog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TaxpayerCatalogComponent implements OnInit {
  allChecked: boolean;
  taxpayers = [];
  checkedTaxpayers = 0;
  selectedTaxpayer: any;
  currentAccountant: string;

  headers: Array<RtHeader> = [
    { name: 'Seleccionar', prop: 'checked', input: 'checkbox', width: '17' },
    { name: 'Contribuyente', prop: 'socialReason', default: 'Sin nombre', width: '20' },
    { name: 'RFC', prop: 'rfc', default: '####', width: '20' },
    { name: 'Régimen Fiscal', prop: 'fiscalRegime', default: 'Sin régimen', width: '20' }
  ];
  action = new Subject<RtAction>();
  title: string;

  constructor(
    private notify: NotificationsService,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<TaxpayerCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private accountantProv: AccountantProvider
  ) { }

  ngOnInit() {
    this.title = this.data.title || 'Título del modal';
    this.currentAccountant = this.data.accountant;
    if (this.data.taxpayer) {
      this.taxpayers = this.data.taxpayer;
    }
  }

  onTaxpayerSelected(ev) {
    if (ev.data) {
      if (ev.data.checked) {
        ev.data.checked = false;
        this.checkedTaxpayers = this.checkedTaxpayers - 1 === 0 ? 0 : this.checkedTaxpayers - 1;
      } else {
        ev.data.checked = true;
        this.checkedTaxpayers++;
      }
      this.selectedTaxpayer = ev.data;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onTaxpayerChecked(ev) {
    if (!ev.item.checked) {
      this.checkedTaxpayers++;
      ev.item.checked = !ev.item.checked;
      this.selectedTaxpayer = ev.item;
    } else {
      this.checkedTaxpayers--;
    }
  }

  onCheckAll(ev) {
    this.allChecked = !this.allChecked;
    if (this.allChecked) {
      this.taxpayers.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.taxpayers.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedTaxpayers = this.taxpayers.length;
    } else {
      this.checkedTaxpayers = 0;
      this.taxpayers.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }

  onChange(ev) {
    this.stopPropagation(ev);
    const newTaxpayers = [];
    const dialogRef = this.reasignModal('Contribuyentes asociados');
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      const res = this.taxpayers.slice();
      res.forEach((element) => {
        if (element.checked) {
          newTaxpayers.push(element._id);
          // element.accountant = data;
          // this.action.next({name: RtActionName.DELETE, itemId: element._id });
        }
        element.checked = false;
      });
      // tslint:disable-next-line:no-shadowed-variable
      this.accountantProv.reasignTaxpayers(newTaxpayers, this.currentAccountant, data._id).subscribe(data => {
        newTaxpayers.forEach(taxpayer => {
          this.action.next({ name: RtActionName.DELETE, itemId: taxpayer });
        });
        this.notify.success('Acción Exitosa', 'Los contribuyentes se ha reasignado correctamente');
      }, err => {
        this.notify.error('Error', 'Ocurrió un error al reasignar los contribuyentes');
      });
    });
  }

  reasignModal(title: string) {
    return this.dialogCtrl.open(ModalAsignarContribComponent, {
      disableClose: true,
      data: {
        title: title,
        todayAccontant: this.selectedTaxpayer ? this.selectedTaxpayer.accountant : '',
        selectedAll: this.allChecked,
        office: this.data.office,
        accountant: this.currentAccountant
      }
    });
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
