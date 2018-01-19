import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalCrearContribuyenteComponent } from '../../_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { NotificationsService } from 'angular2-notifications';
import { UploadXmlComponent } from '../../_catalog/upload-xml/upload-xml.component';

@Component({
  selector: 'app-inicio-contador',
  templateUrl: './inicio-contador.component.html',
  styleUrls: ['./inicio-contador.component.css']
})
export class InicioContadorComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Contribuyente', prop: 'name', default: '' },
    { name: 'RFC', prop: 'rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Régimen fiscal', prop: 'fiscal_regime', default: '' },
  ];
  selectedTaxpayer: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(
    private router: Router,
    private dialogCtrl: MatDialog,
    private notification: NotificationsService) { }

  ngOnInit() {
    this.loadData();
    this.setBgCard('card1');
  }
  onTaxpayerSelected(ev) {
    this.selectedTaxpayer = ev.data;
  }
  onView(ev) {
    this.stopPropagation(ev);
    this.taxpayerModal(this.selectedTaxpayer, true, 'Detalle contribuyente');
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
          type: 'warn'
        }
      });
      // tslint:disable-next-line:no-shadowed-variable
      dialogRef.afterClosed().subscribe((data) => {
        this.notification.success('Acción exitosa', `El contribuyente se guardó correctamente`);
      });
    });
  }

  filtrar(card: string) {
    this.setBgCard(card);
    console.log('filtrar en tabla');
  }
  private setBgCard(card: string) {
    const numCards = 4;
    for (let i = 1; i <= numCards; i++) {
      document.getElementById('card' + i).style.background = 'lightgrey';
    }

    document.getElementById(card).style.background = 'lightgreen';
  }
  taxpayerDetail(page: string) {
    this.router.navigate([page], {queryParams: { name: 'Jessica' }});
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

  loadData() {
    this.data = [
      {
        name: 'Saúl Jimenez',
        rfc: 'VECJ880326XXX',
        fiscal_regime: 'Incorporación Fiscal',
        password: '1234',
        suspension_date: new Date('1/4/2018'),
        regimen_change: new Date('6/10/2018'),
        vigencia_fiel: new Date('8/12/2018'),
        vigencia_sellos: new Date('10/02/2018'),
        statement: [
          {
            _id: 1,
            year: '2015',
            bimester: 'ENE/FEB',
            type: 'Presentada',
            file1: 'declaracion_1',
            file2: 'otra_declaracion_1',
          },
          {
            _id: 2,
            year: '2016',
            bimester: 'MAR/ABR',
            type: 'Pagada',
            file1: 'declaracion_2',
            file2: 'otra_declaracion_2',
          },
          {
            _id: 3,
            year: '2017',
            bimester: 'MAY/JUN',
            type: 'Pendiente',
            file1: 'declaracion_3',
            file2: 'otra_declaracion_3',
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
            _id: 1,
            year: '2017',
            bimester: 'JUL/AGO',
            type: 'Presentada',
            file1: 'declaracion_1',
            file2: 'otra_declaracion_1',
          },
          {
            _id: 2,
            year: '2017',
            bimester: 'JUL/AGO',
            type: 'Pagada',
            file1: 'declaracion_2',
            file2: 'otra_declaracion_2',
          },
          {
            _id: 3,
            year: '2017',
            bimester: 'JUL/AGO',
            type: 'Pendiente',
            file1: 'declaracion_3',
            file2: 'otra_declaracion_3',
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
        file: 'hola.html',
        statement: [
          {
            _id: 1,
            year: '2017',
            bimester: 'SEP/OCT',
            type: 'Presentada',
            file1: 'declaracion_1',
            file2: 'otra_declaracion_1',
          },
          {
            _id: 2,
            year: '2017',
            bimester: 'NOV/DIC',
            type: 'Pagada',
            file1: 'declaracion_2',
            file2: 'otra_declaracion_2',
          },
          {
            _id: 3,
            year: '2018',
            bimester: 'ENE/FEB',
            type: 'Pendiente',
            file1: 'declaracion_3',
            file2: 'otra_declaracion_3',
          }
        ]
      },
    ];
  }
}
