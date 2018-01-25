import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RtHeader, RtAction, RtActionName } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

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
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.profileForm = fb.group({
      'name': [null, Validators.required],
      'concept': '',
      'obligation': ''
    });
  }

  ngOnInit() {
    console.log(this.data);
    this.loadData();
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
    this.filteredConcepts = this.profileForm.get('concept').valueChanges
      .startWith(null)
      .map(concept => concept && typeof concept === 'object' ? concept.concept : concept)
      .map(name => name ? this.filterConcept(name) : this.allConcepts.slice());

    this.filteredObligations = this.profileForm.get('obligation').valueChanges
      .startWith(null)
      .map(obligation => obligation && typeof obligation === 'object' ? obligation.description : obligation)
      .map(name => name ? this.filterObligation(name) : this.allObligations.slice());
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
   }

  onObligationDetail(ev) {
    this.stopPropagation(ev);
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

  loadData() {
    this.allConcepts = [
      {
        _id: '1',
        code: '553686',
        concept: 'Gasolina'
      },
      {
        _id: '2',
        code: '523536',
        concept: 'Materiales de Limpieza'
      },
      {
        _id: '3',
        code: '112626',
        concept: 'Consumibles de cómputo'
      },
      {
        _id: '4',
        code: '334168',
        concept: 'Material eléctrico'
      },
      {
        _id: '5',
        code: '664173',
        concept: 'Gasolina otra vez'
      }
    ];

    this.allObligations = [
      {
        _id: '1',
        type: 'Informativas',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      },
      {
        _id: '2',
        type: 'Plazos',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      },
      {
        _id: '3',
        type: 'Montos',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      }
    ];
  }
}
