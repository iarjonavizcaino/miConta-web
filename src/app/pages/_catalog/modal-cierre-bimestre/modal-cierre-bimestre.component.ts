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
    this.miContaSaid = {
      ISR: this.data.ISR,
      IVA: this.data.IVA
    };
    this.accountantSaid.debtSAT = this.data.debtSAT;
    this.accountantSaid.debtIVA = this.data.debtIVA;

    // set to default
    this.accountantSaid.ISR.amount = this.miContaSaid.ISR.isrNetoAPagar;
    this.accountantSaid.IVA.amount = this.miContaSaid.IVA.ivaCargo;
    this.doMath();

  }
  private doMath() {


    // tslint:disable-next-line:max-line-length
    this.accountantSaid.ISR.subtotal = this.accountantSaid.ISR.surcharges + this.accountantSaid.ISR.updates + this.accountantSaid.ISR.amount;
    // tslint:disable-next-line:max-line-length
    this.accountantSaid.IVA.subtotal = this.accountantSaid.IVA.surcharges + this.accountantSaid.IVA.updates + this.accountantSaid.IVA.amount;
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
      disableClose: false,
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

