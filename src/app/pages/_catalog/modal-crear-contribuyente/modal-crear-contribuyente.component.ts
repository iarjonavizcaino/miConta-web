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
import { Observable } from 'rxjs/Observable';
import { ModalConceptosComponent } from '../modal-conceptos/modal-conceptos.component';
import { ModalObligacionesComponent } from '../modal-obligaciones/modal-obligaciones.component';
import { ProfileProvider } from '../../../providers/providers';
const RFC_REGEX = /^([A-ZÑ]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

@Component({
  selector: 'app-modal-crear-contribuyente',
  templateUrl: './modal-crear-contribuyente.component.html',
  styleUrls: ['./modal-crear-contribuyente.component.scss']
})
export class ModalCrearContribuyenteComponent implements OnInit {
  obligations = [];
  concepts = [];
  wrongLimit: boolean;
  obligationSelected: any;
  conceptSelected: any;
  currentProfile: any;
  actionStatement = new Subject<RtAction>();
  actionConcept = new Subject<RtAction>();
  actionObligation = new Subject<RtAction>();
  title: string;

  profiles = [];
  filteredProfiles: Observable<any[]>;

  taxPayer: any;

  taxpayerForm: FormGroup;
  readonly: boolean;
  statement: any = [];
  selectedStatement: any;
  regimen = 'RIF';

  headersStatement: Array<RtHeader> = [
    { name: 'Año', prop: 'year', default: '' },
    { name: 'Bimestre', prop: 'bimester', default: 'XXXX-XXX-XXXX' },
    { name: 'Estatus', prop: 'type', default: '', chip: true },
    { name: 'Acuse', prop: 'file1', default: 'No archivo', align: 'center', link: true },
    { name: 'Línea de captura', prop: 'file2', default: 'No archivo', align: 'center', link: true }
  ];

  headersConcepts: Array<RtHeader> = [
    { name: 'Código', prop: 'code', default: '' },
    { name: 'Concepto', prop: 'concept', default: '' },
    { name: 'Límite Bimestral', prop: 'limit', default: '0.00', priceSymbol: true, input: 'number', align: 'right', width: '20' }
  ];

  headersObligations: Array<RtHeader> = [
    { name: 'Tipo', prop: 'type', default: '', width: '20' },
    { name: 'Descripción', prop: 'description', default: '', width: '72' },
  ];

  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalCrearContribuyenteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private notification: NotificationsService,
    private profileProv: ProfileProvider
  ) {
    this.taxpayerForm = fb.group({
      name: ['', Validators.required],
      socialReason: ['', Validators.required],
      rfc: ['', Validators.compose([Validators.required, Validators.pattern(RFC_REGEX)])],
      fiscal_regime: ['', Validators.required],
      suspension_date: '',
      regimen_change: '',
      vigencia_fiel: [null, Validators.required],
      vigencia_sellos: [null, Validators.required],
      registro_regimen: [null, Validators.required],
      password: [null, Validators.required],
      user: [null, Validators.required],
      profile: [null, Validators.required],

      // configuration
      yearBefore: [null, Validators.required],
      difference: [null, Validators.required],
      ivaFavor: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.readonly = this.data.readonly;
    this.title = this.data.title;
    if (this.data.taxPayer) {   // detail
      this.taxPayer = this.data.taxPayer;
      this.statement = this.data.taxPayer.statements;
      this.currentProfile = this.data.taxPayer.profile;
      this.concepts = this.currentProfile.concepts;
      this.obligations = this.currentProfile.obligations;
    } else {
      // new taxpayer
      this.taxPayer = {
        name: '',
        socialReason: '',
        rfc: '',
        fiscalRegime: '',
        activitySuspension: '',
        regimeChangey: '',
        loyalValidity: '',
        regimenRegister: '',
        sealValidity: '',
        yearBefore: 0.00,
        difference: 0.00,
        ivaFavor: 0.00,
        account: {
          user: '',
          password: '',
        },
        role: {
          name: '',
          _id: ''
        },
        statement: [],
        profile: {
          name: '',
          concepts: [],
          obligations: [],
          activity: {
            percent: '',
            name: '',
            _id: ''
          }
        }
      };
    }
    this.profileProv.getAll().subscribe(data => {
      this.profiles = data.profiles;
      this.filteredProfiles = this.taxpayerForm.get('profile').valueChanges
        .startWith(null)
        .map(profile => profile && typeof profile === 'object' ? profile.name : profile)
        .map(name => name ? this.filterProfile(name) : this.profiles.slice());
    });
  }

  onChangeStatus(ev) {
    this.stopPropagation(ev);
    const dialogRef = this.changeStatusModal('Cambiar estatus de declaración');
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      const statement = this.selectedStatement;
      statement.type = data;
      // Mke http request to update
      this.actionStatement.next({ name: RtActionName.UPDATE, itemId: statement._id, newItem: statement });
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

  uploadFilesModal(title: string) {
    return this.dialogCtrl.open(UploadStatementFileComponent, {
      disableClose: false,
      data: {
        title: title
      }
    });
  }

  createStatementModal(title: string) {
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
      this.actionStatement.next({ name: RtActionName.CREATE, newItem: data }); // save data
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
    this.taxPayer.role = {
      '_id': '5a728f4bb15f741695e35c96',
      'name': 'Contribuyente'
    };
    this.currentProfile.concepts = this.concepts;
    this.currentProfile.obligations = this.obligations;
    this.taxPayer.profile = this.currentProfile;
    this.taxPayer.fiscalRegime = this.regimen;
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

  displayFnProfile(profile: any): any {
    // this.currentProfile = profile ? profile : profile;
    return profile ? profile.name : profile;
  }

  filterProfile(name: string): any[] {
    this.concepts = [];
    this.obligations = [];
    this.profiles.forEach(profile => {
      if (profile.name.toLowerCase() === name.toLowerCase()) {
        this.currentProfile = profile;
        this.concepts = profile.concepts;
        this.obligations = profile.obligations;
      }
    });
    return this.profiles.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onConceptSelected(ev: any) {
    this.conceptSelected = ev.data;
  }

  onObligationSelected(ev) {
    this.obligationSelected = ev.data;
  }

  inputChange(ev) {
    this.wrongLimit = !ev.data.limit || ev.data.limit <= 0 ? true : false;
  }

  onViewConcept(ev: any) {
    this.stopPropagation(ev);
    this.dialogCtrl.open(ModalConceptosComponent, {
      disableClose: false,
      data: {
        title: 'Detalle concepto',
        concept: this.conceptSelected,
        readonly: true
      }
    });
  }

  onViewObligation(ev) {
    this.stopPropagation(ev);
    this.dialogCtrl.open(ModalObligacionesComponent, {
      disableClose: false,
      data: {
        title: 'Detalle obligación',
        obligation: this.obligationSelected,
        readonly: true
      }
    });
  }
}
