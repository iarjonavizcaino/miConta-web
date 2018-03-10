import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { TaxpayerProvider } from '../../../providers/providers';
import { ActivatedRoute } from '@angular/router';
import { states } from '../../../../states';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
const RFC_REGEX = /^([A-ZÑ]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {
  // file picker
  situationFile: any;
  sealFile: any;
  loyalFile: any;

  taxpayer: any;
  currentState: any;
  taxpayerForm: FormGroup;
  addressForm: FormGroup;

  currentPass: string;
  newPass: string;
  states = states;
  filteredStates: Observable<any[]>;

  constructor(
    private notification: NotificationsService,
    private taxpayerProv: TaxpayerProvider,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.taxpayerForm = fb.group({
      name: ['', Validators.required],
      socialReason: ['', Validators.required],
      rfc: ['', Validators.compose([Validators.required, Validators.pattern(RFC_REGEX)])],
    });

    this.addressForm = fb.group({
      street: [null, Validators.required],
      number: [null, Validators.required],
      neighborhood: [null, Validators.required],
      zipcode: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(5), Validators.required])],
      city: [null, Validators.required],
      state: [null, Validators.required],
      municipality: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: { taxpayer: any }) => {
      if (data.taxpayer) {
        this.taxpayer = data.taxpayer;
      }
      if (!this.taxpayer.address) {
        this.taxpayer.address = {
          'street': '',
          'number': '',
          'neighborhood': '',
          'zipcode': '',
          'city': '',
          'state': '',
          'municipality': ''
        };
      } else {
        const index = this.states.findIndex(state => state.name === this.taxpayer.address.state);
        this.currentState = this.states[index];
      }
      this.filteredStates = this.addressForm.get('state').valueChanges
        .startWith(null)
        .map(state => state && typeof state === 'object' ? state.name : state)
        .map(name => name ? this.filterState(name) : this.states.slice());
    });
  }

  displayFnState(state: any): any {
    this.currentState = state ? state.name : state;
    return state ? state.name : state;
  }

  filterState(name: string): any[] {
    return this.states.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  updateTaxpayer() {
    this.taxpayer.address.state = this.currentState;
    this.taxpayerProv.update(this.taxpayer).subscribe(data => {
      this.notification.success('Acción exitosa', 'Los datos se actualizaron correctamente');
    }, err => {
      this.notification.error('Error', 'Ocurrió un error al actualizar los datos');
    });
  }

  updatePassword() {
    this.taxpayer.account.password = this.newPass;
    this.taxpayer.account.oldPass = this.currentPass;
    this.taxpayerProv.updatePassword(this.taxpayer).subscribe(data => {
      this.taxpayer = data.taxpayer;
      this.notification.success('Acción exitosa', 'La contraseña se actualizó correctamente');
    }, err => {
      const error = JSON.parse(err._body);
      this.notification.error('Error', error.message);
    });
  }

  onLoyalFile(ev) {
    this.loyalFile = ev.target.files[0];
  }

  onSealFile(ev) {
    this.sealFile = ev.target.files[0];
  }

  onSituationFile(ev) {
    this.situationFile = ev.target.files[0];
  }
}// class
