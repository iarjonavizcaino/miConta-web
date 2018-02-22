import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-impuestos',
  templateUrl: './modal-impuestos.component.html',
  styleUrls: ['./modal-impuestos.component.scss']
})
export class ModalImpuestosComponent implements OnInit {

  isrNetoAPagar;
  title = 'Detalle Impuesto';
  taxes = [];
  newAmount;
  constructor(
    private dialogRef: MatDialogRef<ModalImpuestosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit() {
    if (!this.data) { return; }
    this.title = this.data.title;
    if (this.data.type === 'isr') {
      this.newAmount = Math.round(this.data.tax.isrNetoAPagar);
      this.loadISR();
    } else {

    }
  }

  private loadISR() {
    this.taxes = [
      {
        concept: 'Ingresos Bimestrales Cobrados',
        amount: this.data.tax.ingresosBimestralesCobrados
      },
      {
        concept: 'Deducciones Bimestrales Pagadas',
        amount: this.data.tax.deduccionesBimestralesPagadas
      },
      {
        concept: 'Diferencia de gastos mayores a ingresos de periodos anteriores',
        amount: this.data.tax.diferenciaGastosMayores
      },
      {
        concept: 'ISR A PAGAR',
        amount: this.data.tax.isrAPagar
      },
      {
        concept: 'PORCENTAJE DE REDUCCIÓN',
        amount: this.data.tax.porcentajeReduccion
      },
      {
        concept: 'MONTO DE REDUCCIÓN',
        amount: this.data.tax.montoReduccion
      },
      // {
      //   concept: 'ISR NETO A PAGAR',
      //   amount: this.data.tax.isrNetoAPagar
      // }
    ];
  }
  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.data.taxNetoAPagar);
  }
}// class

