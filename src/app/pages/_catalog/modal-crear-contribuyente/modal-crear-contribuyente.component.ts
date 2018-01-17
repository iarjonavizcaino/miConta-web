import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
const RFC_REGEX = /^([A-ZÑ]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

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

  taxpayerForm: FormGroup;
  readonly: boolean;
  statement: any = [];
  selectedStatement: any;
  regimen = 'RIF';
  headers: Array<RtHeader> = [
    { name: 'Año', prop: 'year', default: '' },
    { name: 'Bimestre', prop: 'bimester', default: 'XXXX-XXX-XXXX' },
    { name: 'Estatus', prop: 'type', default: '', chip: true },
    { name: 'Archivo', prop: 'file', default: 'No archivo' }
  ];
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalCrearContribuyenteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.taxpayerForm = fb.group({
      name: [null, Validators.required],
      rfc: [null, Validators.compose([Validators.required, Validators.pattern(RFC_REGEX)])],
      fiscal_regime: [null, Validators.required],
      suspension_date: '',
      regimen_change: '',
      vigencia_fiel: [null, Validators.required],
      vigencia_sellos: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.readonly = this.data.readonly;
    this.title = this.data.title;
    console.log(this.data);
    // no esta trabajando bien esto
    if (this.data.taxPayer) {   // detail
      this.taxPayer = this.data.taxPayer;
      this.statement = this.data.taxPayer.statement;
      console.log('detalle', this.data);
    } else {
      // new taxpayer
      console.log('Nuevo');
    }
  }

  onSelected(ev) {
    this.selectedStatement = ev.data;
  }
  onSave() {
    this.taxPayer.fiscal_regime = this.regimen;
    this.dialogRef.close(this.taxPayer);
  }
  onClose() {
    this.dialogRef.close();
  }
  printSelected() {
    console.log(this.selectedStatement);
  }
}
