import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalChangeStatusComponent } from '../modal-change-status/modal-change-status.component';
import { UploadStatementFileComponent } from '../upload-statement-file/upload-statement-file.component';
import { ModalNewStatementComponent } from '../modal-new-statement/modal-new-statement.component';
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
    { name: 'Archivo', prop: 'file1', default: 'No archivo', link: true },
    { name: 'Archivo', prop: 'file2', default: 'No archivo', link: true }
  ];
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalCrearContribuyenteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private notification: NotificationsService
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
    } else {
      // new taxpayer
      console.log('Nuevo');
    }
  }

  onChangeStatus (ev) {
    this.stopPropagation(ev);
    const dialogRef = this.changeStatusModal('Cambiar estatus de declaración');
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      const statement = this.selectedStatement;
      statement.type = data;
      // Mke http request to update
      this.action.next({ name: RtActionName.UPDATE, itemId: statement._id, newItem: statement });
      this.selectedStatement = statement;
    });
  }

  changeStatusModal(title: string) {
    return this.dialogCtrl.open(ModalChangeStatusComponent, {
      disableClose: false,
      data: {
        title: title,
        status: this.selectedStatement.type
      }
    });
  }

  uploadFilesModal (title: string) {
    return this.dialogCtrl.open(UploadStatementFileComponent, {
      disableClose: false,
      data: {
        title: title
      }
    });
  }

  createStatementModal (title: string) {
    return this.dialogCtrl.open(ModalNewStatementComponent, {
      disableClose: false,
      data: {
        title: title
      }
    });
  }

  onCreate(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.createStatementModal('Subir archivos');
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      console.log(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data }); // save data
      this.notification.success('Acción exitosa', 'La declaración se creó correctamente');
    });
  }

  onUploadFiles(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.uploadFilesModal('Subir archivos');
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      this.notification.success('Acción exitosa', 'Los archivos se subieron correctamente');
    });
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

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
