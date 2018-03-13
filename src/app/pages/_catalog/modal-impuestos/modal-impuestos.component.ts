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
      this.newAmount = this.data.tax.isrNetoAPagar.toFixed(2);
      this.loadISR();
    } else {
      this.loadIVA();
    }
  }

  private loadIVA() {
    this.taxes = [
      {
        concept: this.data.taxpayer ? 'Total IVA de ventas público en general' : 'Total IVA causado del periodo Publico en General',
        amount: this.data.tax.totalIvaCausadoPublicoGeneral.toFixed(2)
      },
      {
        concept: this.data.taxpayer ? 'Total IVA de ventas a clientes' : 'Total IVA causado del periodo Clientes',
        amount: this.data.tax.totalIvaCausadoPeriodoClientes.toFixed(2)
      },
      {
        concept: this.data.taxpayer ? 'Total IVA de ventas' : 'Total IVA causado del periodo',
        amount: this.data.tax.totalIvaCausadoPeriodo.toFixed(2)
      },
      {
        concept: this.data.taxpayer ? 'Total IVA de compras' : 'IVA acreditable (gastos)',
        amount: this.data.tax.ivaAcredGastos.toFixed(2)
      }
    ];
    if (this.data.tax.ivaCargo >= 0) {
      if (this.data.taxpayer) {
        this.taxes.push({ concept: 'IVA POR PAGAR', amount: this.data.tax.ivaCargo.toFixed(2) });
      } else {
        this.taxes.push({ concept: 'IVA A CARGO', amount: this.data.tax.ivaCargo.toFixed(2) });
      }
    } else {
      this.taxes.push({ concept: 'IVA A FAVOR', amount: this.data.tax.ivaCargo.toFixed(2) });
    }
  }
  private loadISR() {
    this.taxes = [
      {
        concept: 'Ingresos Bimestrales Cobrados',
        amount: this.data.tax.ingresosBimestralesCobrados.toFixed(2),
        red: false
      },
      {
        concept: 'Deducciones Bimestrales Pagadas',
        amount: this.data.tax.deduccionesBimestralesPagadas.toFixed(2),
        red: false
      },
      {
        concept: this.data.tax.utilidad >= 0 ? 'UTILIDAD' : 'PÉRDIDA FISCAL',
        amount: this.data.tax.utilidad.toFixed(2),
        red: false
      },
      {
        concept: 'Diferencia de gastos mayores a ingresos de periodos anteriores',
        amount: this.data.tax.diferenciaGastosMayores.toFixed(2),
        red: true
      },
      {
        concept: 'BASE GRAVABLE',
        amount: this.data.tax.baseGravable.toFixed(2),
        red: false
      },
      {
        concept: 'ISR A PAGAR',
        amount: this.data.tax.isrAPagar.toFixed(2),
        red: false
      },
      {
        concept: `MONTO DE REDUCCIÓN (${this.data.tax.porcentajeReduccion}%)`,
        amount: this.data.tax.montoReduccion.toFixed(2),
        red: true
      },
      {
        concept: 'ISR NETO A PAGAR',
        amount: this.data.tax.isrNetoAPagar.toFixed(2),
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

