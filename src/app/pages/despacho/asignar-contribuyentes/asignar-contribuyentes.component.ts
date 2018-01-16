import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalAsignarContribComponent } from '../../_catalog/modal-asignar-contrib/modal-asignar-contrib.component';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-asignar-contribuyentes',
  templateUrl: './asignar-contribuyentes.component.html',
  styleUrls: ['./asignar-contribuyentes.component.css']
})
export class AsignarContribuyentesComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Seleccionar', prop: 'checked', input: 'checkbox' },
    { name: 'Contador Asociado', prop: 'accountant', default: '' },
    { name: 'Contribuyente', prop: 'taxpayer', default: '' },
    { name: 'RFC', prop: 'rfc', default: '####' },
    { name: 'Régimen Fiscal', prop: 'regimen_fiscal', default: 'Sin régimen' },
  ];
  selectedItem: any;
  data = [];
  checkedItems = 0;
  allChecked = false; // this is for change the icon 'check' in table
  action = new Subject<RtAction>();
  constructor(private notification: NotificationsService, private router: Router, private dialogCtrl: MatDialog) { }


  ngOnInit() {
    this.loadData();
  }
  private loadData() {
    this.data = [
      {
        checked: false,
        accountant: 'Denis Adrian Jiménez Ortiz',
        taxpayer: 'Saúl Jiménez',
        rfc: 'VECJ880326XXX',
        regimen_fiscal: 'RIF'
      },
      {
        checked: false,
        accountant: 'Roberto Herrera Ortiz',
        taxpayer: 'Manuel Perez',
        rfc: 'JCVE880326XXX',
        regimen_fiscal: 'RIF'
      },
      {
        checked: false,
        accountant: 'Guadalupe Alcaraz Tizando',
        taxpayer: 'Ernesto de la Cruz',
        rfc: 'ANAS81636XXX',
        regimen_fiscal: 'RIF'
      }
    ];
  }

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
    const newAccountant = this.dialogCtrl.open(ModalAsignarContribComponent, {
      disableClose: false,
      data: {
        todayAccontant: this.selectedItem ? this.selectedItem.accountant : '',
        options: this.data,
        selectedAll: this.allChecked
      }
    });
    newAccountant.afterClosed().subscribe((data) => {
      if (!data) { return; }
      this.data.forEach((element) => {
        if (element.checked) {
          element.accountant = data;
        }
        element.checked = false;
      });
    });
  }
}

