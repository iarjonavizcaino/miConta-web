import { Component, OnInit, Inject } from '@angular/core';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-modal-asignar-contrib',
  templateUrl: './modal-asignar-contrib.component.html',
  styleUrls: ['./modal-asignar-contrib.component.scss']
})
export class ModalAsignarContribComponent implements OnInit {
  filteredAccountants: Observable<any[]>;
  accountantForm: FormGroup;

  todayAccontant: '';
  selectedAll = false;
  selectedAccountant: any;

  accountants = [
    {
      checked: false,
      accountant: 'Denis Adrian Jiménez Ortiz',
      taxpayer: 'Saúl Jiménez',
      rfc: 'VECJ880326XXX',
      regimen_fiscal: 'RIF'
    },
    {
      checked: false,
      accountant: 'Roberto Herrera Ortiz',
      taxpayer: 'Manuel Perez',
      rfc: 'JCVE880326XXX',
      regimen_fiscal: 'RIF'
    },
    {
      checked: false,
      accountant: 'Guadalupe Alcaraz Tizando',
      taxpayer: 'Ernesto de la Cruz',
      rfc: 'ANAS81636XXX',
      regimen_fiscal: 'RIF'
    }
  ];

  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalAsignarContribComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.accountantForm = fb.group({
      'accountant': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.filteredAccountants = this.accountantForm.get('accountant').valueChanges
      .startWith(null)
      .map(accountant => accountant && typeof accountant === 'object' ? accountant.accountant : accountant)
      .map(name => name ? this.filterAccountant(name) : this.accountants.slice());
    this.loadData();
  }
  private loadData() {
    if (this.data.options) {
      this.todayAccontant = this.data.todayAccontant;
      this.selectedAll = this.data.selectedAll;
    }
  }

  displayFnAccountant(accountant: any): any {
    this.selectedAccountant = accountant ? accountant : accountant;
    return accountant ? accountant.accountant : accountant;
  }

  filterAccountant(name: string): any[] {
    return this.accountants.filter(option =>
      option.accountant.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onSave() {
    console.log(this.selectedAccountant);
    this.dialogRef.close(this.selectedAccountant);
  }
  onClose() {
    this.dialogRef.close();
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}// class
