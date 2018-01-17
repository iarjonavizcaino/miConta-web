import { Component, OnInit, Inject } from '@angular/core';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-modal-asignar-contrib',
  templateUrl: './modal-asignar-contrib.component.html',
  styleUrls: ['./modal-asignar-contrib.component.scss']
})
export class ModalAsignarContribComponent implements OnInit {
  myControl: FormControl = new FormControl();

  todayAccontant: '';
  selectedAll = false;
  selectedAccountant = '';

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
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.loadData();
  }
  private loadData() {
    if (this.data.options) {
      this.todayAccontant = this.data.todayAccontant;
      this.selectedAll = this.data.selectedAll;
    }
  }
  onSave() {
    console.log(this.selectedAccountant);
    this.dialogRef.close(this.selectedAccountant);
  }
  onClose() {
    this.dialogRef.close();
  }

}// class
