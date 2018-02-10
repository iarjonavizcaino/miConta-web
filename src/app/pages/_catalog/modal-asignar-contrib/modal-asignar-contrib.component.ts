import { Component, OnInit, Inject } from '@angular/core';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { AccountantProvider, OfficeProvider } from '../../../providers/providers';

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
  accountants: any;
  currentAccountant: string;

  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalAsignarContribComponent>,
    private fb: FormBuilder,
    private accountantProv: AccountantProvider,
    private officeProv: OfficeProvider,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.accountantForm = fb.group({
      'accountant': [null, Validators.required]
    });
  }

  ngOnInit() {
    console.log(this.data);
    this.currentAccountant = this.data.accountant;
    this.officeProv.getById(this.data.office).subscribe(data => {
      this.accountants = data.office.accountants;
      this.filteredAccountants = this.accountantForm.get('accountant').valueChanges
        .startWith(null)
        .map(accountant => accountant && typeof accountant === 'object' ? accountant.name : accountant)
        .map(name => name ? this.filterAccountant(name) : this.accountants.slice());
    });
    if (this.data.options) {
      this.todayAccontant = this.data.todayAccontant;
      this.selectedAll = this.data.selectedAll;
    }
  }

  displayFnAccountant(accountant: any): any {
    this.selectedAccountant = accountant ? accountant : accountant;
    return accountant ? accountant.name : accountant;
  }

  filterAccountant(name: string): any[] {
    return this.accountants.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
