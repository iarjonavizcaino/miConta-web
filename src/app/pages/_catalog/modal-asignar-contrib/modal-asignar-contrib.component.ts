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
  options = [];
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalAsignarContribComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    console.log('hola');
    this.loadData();
  }
  private loadData() {
    if (this.data.options) {
      this.todayAccontant = this.data.todayAccontant;
      this.options = this.data.options;
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
