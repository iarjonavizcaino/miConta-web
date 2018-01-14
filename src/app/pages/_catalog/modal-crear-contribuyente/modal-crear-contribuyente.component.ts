import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-modal-crear-contribuyente',
  templateUrl: './modal-crear-contribuyente.component.html',
  styleUrls: ['./modal-crear-contribuyente.component.scss']
})
export class ModalCrearContribuyenteComponent implements OnInit {
  action = new Subject<RtAction>();
  title: string;
  taxPayer: any = {
    name: '',
    rfc: '',
    fiscal_regime: '',
    suspension_date: '',
    regimen_change: '',
    vigencia_fiel: '',
    vigencia_sellos: '',
    password: '',
  };
  statement: any = [];
  selectedStatement: any;
  headers: Array<RtHeader> = [
    { name: 'Año', prop: 'year', default: '' },
    { name: 'Bimestre', prop: 'bimester', default: 'XXXX-XXX-XXXX' },
    { name: 'Estatus', prop: 'type', default: '' },
    { name: 'Archivo', prop: 'file', default: 'No archivo' }
  ];
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalCrearContribuyenteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    // no esta trabajando bien esto
    if (this.data.taxPayer == null) {  // data: info from table
      // new taxpayer
      this.title = this.data.title;
      console.log('Nuevo');
    } else { // detail
      this.title = this.data.title;
      this.taxPayer = this.data.taxPayer;
      this.statement = this.data.taxPayer.statement;
      console.log('detalle', this.data);
    }
  }

  onSelected(ev) {
    this.selectedStatement = ev.data;
  }
  onClose() {
    this.dialogRef.close();
  }
  printSelected() {
    console.log(this.selectedStatement);
  }
}
