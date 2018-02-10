import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalCrearContribuyenteComponent } from '../../_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-crud-contribuyentes',
  templateUrl: './crud-contribuyentes.component.html',
  styleUrls: ['./crud-contribuyentes.component.css']
})
export class CrudContribuyentesComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Nombre o Razón social', prop: 'name', default: '' },
    { name: 'RFC', prop: 'rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Régimen fiscal', prop: 'fiscal_regime', default: '' },
  ];
  selectedTaxpayer: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(
    private dialogCtrl: MatDialog,
    private notification: NotificationsService) { }

  ngOnInit() {
    this.data = [
      {
        name: 'Saúl Jimenez',
        rfc: 'VECJ880326XXX',
        fiscal_regime: 'Incorporación Fiscal',
        password: '1234',
        suspension_date: new Date('1/4/2018'),
        regimen_change: new Date('6/10/2018'),
        statement: [
          {
            year: '2015',
            bimester: '1',
            type: 'Presentada'
          },
          {
            year: '2016',
            bimester: '2',
            type: 'Pagada'
          },
          {
            year: '2017',
            bimester: '3',
            type: 'Pendiente'
          }
        ]
      },
      {
        name: 'Manuel Perez',
        rfc: 'JCVE880326XXX',
        fiscal_regime: 'Servicios Profesionales',
        password: '1234',
        suspension_date: new Date('10/15/2014'),
        regimen_change: new Date('11/10/2015'),
        statement: [
          {
            year: '2017',
            bimester: '4',
            type: 'Presentada'
          },
          {
            year: '2017',
            bimester: '4',
            type: 'Pagada'
          },
          {
            year: '2017',
            bimester: '4',
            type: 'Pendiente'
          }
        ]
      },
      {
        name: 'Ernesto de la Cruz',
        rfc: 'ANAS81636XXX',
        fiscal_regime: 'Intereses',
        password: '1234',
        suspension_date: new Date('09/21/2018'),
        regimen_change: new Date('07/13/2018'),
        statement: [
          {
            year: '2017',
            bimester: '5',
            type: 'Presentada'
          },
          {
            year: '2017',
            bimester: '6',
            type: 'Pagada'
          },
          {
            year: '2018',
            bimester: '1',
            type: 'Pendiente'
          }
        ]
      },
    ];
  }// ngOnInit

  onTaxpayerSelected(ev) {
    this.selectedTaxpayer = ev.data;
  }
  onView(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.taxpayerModal(this.selectedTaxpayer, true, 'Detalle contribuyente');

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      this.action.next({ name: RtActionName.UPDATE, itemId: data._id, newItem: data });
      this.notification.success('Acción exitosa', `Contribuyente ${this.selectedTaxpayer.name} modificado`);
      this.selectedTaxpayer = data;
    });

  }

  onDelete(ev) {

  }

  onEdit(ev) {
    this.stopPropagation(ev);
  }

  onCreate(ev) {
    this.stopPropagation(ev);
    const taxpayer = this.taxpayerModal(null, false, 'Nuevo contribuyente');
    taxpayer.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create contadores
      this.action.next({ name: RtActionName.CREATE, newItem: data }); // save data
      const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
        data: {
          title: 'Creedenciales de Acceso',
          message: 'usuario: 123, password: 123',
          type: 'success'
        }
      });
      // tslint:disable-next-line:no-shadowed-variable
      dialogRef.afterClosed().subscribe((data) => {
        this.notification.success('Acción exitosa', `Nuevo contribuyente creado: ${this.selectedTaxpayer.name}`);
      });
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
}// class
