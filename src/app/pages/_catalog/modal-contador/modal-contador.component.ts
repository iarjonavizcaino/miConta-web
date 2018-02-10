import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalAsignarContribComponent } from '../modal-asignar-contrib/modal-asignar-contrib.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { states } from '../../../../states';

const EMAIL_REGEX = /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/;

@Component({
  selector: 'app-modal-contador',
  templateUrl: './modal-contador.component.html',
  styleUrls: ['./modal-contador.component.scss']
})
export class ModalContadorComponent implements OnInit {

  currentState: any;
  filteredStates: Observable<any[]>;
  accountantForm: FormGroup;
  title: string;
  states = states;
  office: boolean;

  accountant: any = {
    name: '',
    email: '',
    phone: '',
    account: {
      user: '',
      password: ''
    },
    role: {
      name: '',
      _id: ''
    },
    address: {
      street: '',
      number: '',
      neighborhood: '',
      zipcode: '',
      city: '',
      state: '',
      municipality: ''
    }
  };
  constructor(
    private dialogRef: MatDialogRef<ModalContadorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.accountantForm = fb.group({
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
      phone: [null, Validators.required],
      street: [null, Validators.required],
      number: [null, Validators.required],
      neighborhood: [null, Validators.required],
      zipcode: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(5), Validators.required])],
      city: [null, Validators.required],
      state: [null, Validators.required],
      municipality: [null, Validators.required],
      user: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.office = this.data.office;
    this.title = this.data.title;
    if (this.data.accountant) {
      this.accountant = this.data.accountant;
      const index = this.states.findIndex(state => state.name === this.accountant.address.state);
      this.currentState = this.states[index];
    }

    this.filteredStates = this.accountantForm.get('state').valueChanges
      .startWith(null)
      .map(state => state && typeof state === 'object' ? state.name : state)
      .map(name => name ? this.filterState(name) : this.states.slice());
  }

  displayFnState(state: any): any {
    this.currentState = state ? state.name : state;
    return state ? state.name : state;
  }

  filterState(name: string): any[] {
    return this.states.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onSave() {
    if (this.office) {
      this.accountant.role = {
        '_id': '5a728f43b15f741695e35c95',
        'name': 'Despacho'
      };
    } else {
      this.accountant.role = {
        '_id': '5a728f50b15f741695e35c97',
        'name': 'Contador'
      };
    }
    this.accountant.address.state = this.currentState.name;
    this.dialogRef.close(this.accountant); // send data
  }
  onClose() {
    this.dialogRef.close();
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}
