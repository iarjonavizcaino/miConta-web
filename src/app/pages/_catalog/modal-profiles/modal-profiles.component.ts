import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RtHeader, RtAction, RtActionName } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ModalConceptosComponent } from '../modal-conceptos/modal-conceptos.component';
import { ModalObligacionesComponent } from '../modal-obligaciones/modal-obligaciones.component';
import { ConceptProvider, ObligationProvider } from '../../../providers/providers';

@Component({
  selector: 'app-modal-profiles',
  templateUrl: './modal-profiles.component.html',
  styleUrls: ['./modal-profiles.component.scss']
})
export class ModalProfilesComponent implements OnInit {
  currentObligation: any;
  currentConcept: any;

  profileForm: FormGroup;
  allConcepts = [];
  allObligations = [];
  profile: any;
  title: string;

  filteredConcepts: Observable<any[]>;
  filteredObligations: Observable<any[]>;

  conceptSelected: any;
  obligationSelected: any;

  headersConcepts: Array<RtHeader> = [
    { name: 'Código', prop: 'code', default: '#####' },
    { name: 'Concepto', prop: 'concept', default: 'Sin nombre', },
  ];
  actionConcepts = new Subject<RtAction>();

  headersObligations: Array<RtHeader> = [
    { name: 'Tipo', prop: 'type', default: '', width: '15' },
    { name: 'Descripción', prop: 'description', default: '', width: '75' },
  ];
  actionObligations = new Subject<RtAction>();

  constructor(
    private fb: FormBuilder,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalProfilesComponent>,
    private conceptProv: ConceptProvider,
    private obligationProv: ObligationProvider,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.profileForm = fb.group({
      'name': [null, Validators.required],
      'concept': '',
      'obligation': ''
    });
  }

  ngOnInit() {

    if (this.data.profile) {
      this.title = this.data.title;
      this.profile = this.data.profile;
    } else {
      this.profile = {
        name: '',
        concepts: [],
        obligations: []
      };
    }

    this.conceptProv.getAll().subscribe(data => {
      this.allConcepts = data.concepts;

      this.filteredConcepts = this.profileForm.get('concept').valueChanges
        .startWith(null)
        .map(concept => concept && typeof concept === 'object' ? concept.concept : concept)
        .map(name => name ? this.filterConcept(name) : this.allConcepts.slice());
    });
    this.obligationProv.getAll().subscribe(data => {
      this.allObligations = data.obligations;

      this.filteredObligations = this.profileForm.get('obligation').valueChanges
        .startWith(null)
        .map(obligation => obligation && typeof obligation === 'object' ? obligation.description : obligation)
        .map(name => name ? this.filterObligation(name) : this.allObligations.slice());
    });
  }

  displayFnConcept(concept: any): any {
    this.currentConcept = concept ? concept : concept;
    return concept ? concept.concept : concept;
  }

  filterConcept(name: string): any[] {
    return this.allConcepts.filter(option =>
      option.concept.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  displayFnObligation(obligation: any): any {
    this.currentObligation = obligation ? obligation : obligation;
    return obligation ? obligation.description : obligation;
  }

  filterObligation(name: string): any[] {
    return this.allObligations.filter(option =>
      option.description.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  addConcept() {
    const index = this.profile.concepts.findIndex(concept => concept._id === this.currentConcept._id);
    if (index === -1) {
      this.actionConcepts.next({ name: RtActionName.CREATE, newItem: this.currentConcept });
      this.currentConcept = null;
    }
  }

  addObligation() {
    const index = this.profile.obligations.findIndex(obligation => obligation._id === this.currentObligation._id);
    if (index === -1) {
      this.actionObligations.next({ name: RtActionName.CREATE, newItem: this.currentObligation });
      this.currentObligation = null;
    }
  }

  onConceptSelected(ev: any) {
    this.conceptSelected = ev.data;
  }

  onObligationSelected(ev: any) {
    this.obligationSelected = ev.data;
  }

  onConceptDetail(ev) {
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

  onObligationDetail(ev) {
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

  onDeleteConcept(ev) {
    this.stopPropagation(ev);
    this.actionConcepts.next({ name: RtActionName.DELETE, itemId: this.conceptSelected._id, newItem: this.currentConcept });
    this.conceptSelected = null;
  }

  onDeleteObligation(ev) {
    this.stopPropagation(ev);
    this.actionObligations.next({ name: RtActionName.DELETE, itemId: this.obligationSelected._id, newItem: this.currentConcept });
    this.obligationSelected = null;
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    // this.profile.concepts = this.concepts;
    // this.profile.obligations = this.obligations;
    this.dialogRef.close(this.profile);
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }

  keyConcept(ev: any) {
    if (ev.keyCode === 13) {
      this.addConcept();
    }
  }

  keyObligation(ev: any) {
    if (ev.keyCode === 13) {
      this.addObligation();
    }
  }
}
