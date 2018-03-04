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
      this.newAmount = this.data.tax.isrNetoAPagar;
      this.loadISR();
    } else {
      this.loadIVA();
    }
  }
  private loadIVA() {
    this.taxes = [
      {
        concept: 'Total IVA causado del periodo Publico en General',
        amount: this.data.tax.totalIvaCausadoPublicoGeneral
      },
      {
        concept: 'Total IVA causado del periodo Clientes',
        amount: this.data.tax.totalIvaCausadoPeriodoClientes
      },
      {
        concept: 'Total IVA causado del periodo',
        amount: this.data.tax.totalIvaCausadoPeriodo
      },
      {
        concept: 'Iva acreditable (gastos)',
        amount: this.data.tax.ivaAcredGastos
      }
    ];
    if (this.data.tax.ivaCargo) {
      this.taxes.push({ concept: 'IVA A CARGO', amount: this.data.tax.ivaCargo });
    } else {
      this.taxes.push({ concept: 'IVA A FAVOR', amount: this.data.tax.ivaFavor });
    }
  }
  private loadISR() {
    this.taxes = [
      {
        concept: 'Ingresos Bimestrales Cobrados',
        amount: this.data.tax.ingresosBimestralesCobrados,
        red: false
      },
      {
        concept: 'Deducciones Bimestrales Pagadas',
        amount: this.data.tax.deduccionesBimestralesPagadas,
        red: false
      },
      {
        concept: 'Diferencia de gastos mayores a ingresos de periodos anteriores',
        amount: this.data.tax.diferenciaGastosMayores,
        red: true
      },
      {
        concept: 'ISR A PAGAR',
        amount: this.data.tax.isrAPagar,
        red: false
      },
      {
        concept: `MONTO DE REDUCCIÓN (${this.data.tax.porcentajeReduccion}%)`,
        amount: this.data.tax.montoReduccion,
        red: true
      },
      {
        concept: 'ISR NETO A PAGAR',
        amount: this.data.tax.isrNetoAPagar,
        red: false
      }
    ];
  }
  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.data.taxNetoAPagar);
  }
}// class

