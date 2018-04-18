import { Component, OnInit, Inject } from '@angular/core';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-cierre-bimestre',
  templateUrl: './modal-cierre-bimestre.component.html',
  styleUrls: ['./modal-cierre-bimestre.component.scss']
})
export class ModalCierreBimestreComponent implements OnInit {
  cierreForm: FormGroup;
  readonly: boolean;
  // total to pay
  accountantSaid = {
    ISR: {
      amount: 0,
      surcharges: 0,
      updates: 0,
      subtotal: 0
    },
    IVA: {
      amount: 0,
      surcharges: 0,
      updates: 0,
      subtotal: 0
    },
    totalTaxes: 0,
    accesories: 0, // surcharges + updates
    debtSAT: 0,
    debtIVA: 0
  };
  miContaSaid: any;
  periodName: '';

  constructor(
    private fb: FormBuilder,
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalCierreBimestreComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.cierreForm = fb.group({
      // isr
      isrCalculated: [null, Validators.required],
      isrSurcharges: [null, Validators.required],
      isrUpdates: [null, Validators.required],
      isrDifference: [null, Validators.required],
      // iva
      ivaCalculated: [null, Validators.required],
      ivaSurcharges: [null, Validators.required],
      ivaUpdates: [null, Validators.required],
      ivaFavorPeriodAnt: [null, Validators.required],
    });

  }

  ngOnInit() {
    if (!this.data) { return; }
    console.log(this.data);
    this.readonly = this.data.readonly;
    this.miContaSaid = {
      ISR: this.data.ISR,
      IVA: this.data.IVA
    };
    this.accountantSaid.debtSAT = this.data.debtSAT;
    this.accountantSaid.debtIVA = this.data.debtIVA;
    console.log(this.miContaSaid);
    // set to default
    this.accountantSaid.ISR.amount = this.miContaSaid.ISR.isrNetoAPagar;
    this.accountantSaid.IVA.amount = this.miContaSaid.IVA.ivaCargo;
    if (this.data.extraData) {
      console.log(this.data.extraData);
      // ISR data
      this.accountantSaid.ISR.subtotal = this.data.extraData.ISR.subtotal;
      this.accountantSaid.ISR.amount = this.data.extraData.ISR.amount;
      this.accountantSaid.ISR.updates = this.data.extraData.ISR.updates;
      this.accountantSaid.ISR.surcharges = this.data.extraData.ISR.surcharges;

      // IVA data
      this.accountantSaid.IVA.subtotal = this.data.extraData.IVA.subtotal;
      this.accountantSaid.IVA.amount = this.data.extraData.IVA.amount;
      this.accountantSaid.IVA.updates = this.data.extraData.IVA.updates;
      this.accountantSaid.IVA.surcharges = this.data.extraData.IVA.surcharges;

      this.accountantSaid.accesories = this.data.extraData.accesories;
      this.accountantSaid.totalTaxes = this.data.extraData.totalTaxes;
    }
    this.doMath();

  }
  private doMath() {


    // tslint:disable-next-line:max-line-length
    this.accountantSaid.ISR.subtotal = this.accountantSaid.ISR.surcharges + this.accountantSaid.ISR.updates + this.accountantSaid.ISR.amount;
    // tslint:disable-next-line:max-line-length
    this.accountantSaid.IVA.subtotal = this.accountantSaid.IVA.surcharges + this.accountantSaid.IVA.updates + this.accountantSaid.IVA.amount;
    // tslint:disable-next-line:max-line-length
    this.accountantSaid.accesories = this.accountantSaid.ISR.surcharges + this.accountantSaid.ISR.updates + this.accountantSaid.IVA.surcharges + this.accountantSaid.IVA.updates;
    this.accountantSaid.totalTaxes = this.accountantSaid.ISR.amount + this.accountantSaid.IVA.amount;
  }

  onChange(ev: any) {
    this.doMath();
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        type: 'danger',
        title: '¡ATENCIÓN!',
        message: '¿Está seguro que desea cerrar el periodo ' + this.data.periodName + '?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { return; }
      this.dialogRef.close(
        {
          debtSAT: this.accountantSaid.debtSAT,
          debtIVA: this.accountantSaid.debtIVA,
          historico: {
            accountant: this.accountantSaid,
            miConta: this.miContaSaid
          }
        });
    });
  }
} // class

