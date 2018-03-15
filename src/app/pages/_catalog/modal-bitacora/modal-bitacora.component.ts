import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BitacoraProvider } from '../../../providers/providers';
import * as moment from 'moment';
@Component({
  selector: 'app-modal-bitacora',
  templateUrl: './modal-bitacora.component.html',
  styleUrls: ['./modal-bitacora.component.scss']
})
export class ModalBitacoraComponent implements OnInit {

  bitacoras = [];
  total = 0;
  nameTaxpayer = '';
  moment = moment;
  constructor(
    private dialogRef: MatDialogRef<ModalBitacoraComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit() {
    if (!this.data) { return; }
    this.bitacoras = this.data.bitacoras.bitacoras;
    this.total = this.data.bitacoras.suma;
    this.nameTaxpayer = this.data.name;
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close();
  }
} // class

