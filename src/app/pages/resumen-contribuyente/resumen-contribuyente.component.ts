import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../_catalog/billing-catalog/billing-catalog.component';

@Component({
  selector: 'app-resumen-contribuyente',
  templateUrl: './resumen-contribuyente.component.html',
  styleUrls: ['./resumen-contribuyente.component.css']
})
export class ResumenContribuyenteComponent implements OnInit {
  headersIngresos: Array<RtHeader> = [
    { name: 'Fecha', prop: 'date', default: 'No date', moment: true },
    { name: 'Cliente', prop: 'customer.name', default: 'No customer' },
    { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true }
  ];
  headersEgresos: Array<RtHeader> = [
    { name: 'Fecha', prop: 'date', default: 'No date', moment: true },
    { name: 'Proveedor', prop: 'customer.name', default: 'No customer' },
    { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true }
  ];
  selectedBill: any;

  // ingresos
  dataIngresos = [];
  actionIngresos = new Subject<RtAction>();

  // egresos
  dataEgresos = [];
  actionEgresos = new Subject<RtAction>();
  constructor(private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadIngresosData();
    this.loadEgresosData();
  }
  onBillSelected(ev) {
    this.selectedBill = ev.data;
  }
  onViewBill(ev) {
    this.stopPropagation(ev);
    this.billModal(this.selectedBill, true, 'Datos de Factura');
  }
  billModal(bill: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(BillingCatalogComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        bill: bill
      }
    });
  }
  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
  loadIngresosData() {
    this.dataIngresos = [
      {
        total: 456,
        date: '01-01-1995',
        customer: {
          name: 'Rafael Barajas López',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111905402',
          email: 'luismi@example.com'
        },
        address: {
          street: 'Sanchez Tahuada',
          number: '29',
          neighborhood: 'Centro',
          zipcode: '63175',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Equipo de limpieza y suministros',
            quantity: '12',
            price: '38',
            amount: '456'
          },
          {
            name: 'Herramientas y maquinaría general',
            quantity: '50',
            price: '250',
            amount: '12500'
          },
          {
            name: 'Materiales y productos de papel',
            quantity: '10',
            price: '7',
            amount: '70'
          }
        ]
      },
      {
        total: 12500,
        date: '02-02-1995',
        customer: {
          name: 'Jorge Madrigal Curiel',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111951421',
          email: 'jorch@example.com'
        },
        address: {
          street: 'Hotel California',
          number: '12',
          neighborhood: 'Centro',
          zipcode: '60500',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Productos para joyería y piedras presiosas',
            quantity: '5',
            price: '4500',
            amount: '22500'
          },
          {
            name: 'Productos de aseo personal',
            quantity: '20',
            price: '35',
            amount: '700'
          },
          {
            name: 'Equipo médico',
            quantity: '3',
            price: '500000',
            amount: '1500000'
          }
        ]
      },
      {
        total: 70,
        date: '03-03-1995',
        customer: {
          name: 'Juan Daniel Medrano Barajas',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111108525',
          email: 'dani@example.com'
        },
        address: {
          street: 'Blvd. Colosio',
          number: '95',
          neighborhood: 'Centro',
          zipcode: '63121',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Alimentos',
            quantity: '3',
            price: '40',
            amount: '120'
          },
          {
            name: 'Componentes y suministros electrónicos',
            quantity: '30',
            price: '5',
            amount: '150'
          },
          {
            name: 'Materiales de resina',
            quantity: '10',
            price: '20',
            amount: '200'
          }
        ]
      }
    ];
  }

  loadEgresosData() {
    this.dataEgresos = [
      {
        provider: true,
        total: 1325,
        date: '09-19-1995',
        customer: {
          name: 'Master Clean',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111905402',
          email: 'master_clean@example.com'
        },
        address: {
          street: 'Sanchez Tahuada',
          number: '29',
          neighborhood: 'Centro',
          zipcode: '63175',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Equipo de limpieza y suministros',
            quantity: '12',
            price: '38',
            amount: '456'
          },
          {
            name: 'Herramientas y maquinaría general',
            quantity: '50',
            price: '250',
            amount: '12500'
          },
          {
            name: 'Materiales y productos de papel',
            quantity: '10',
            price: '7',
            amount: '70'
          }
        ]
      },
      {
        provider: true,
        total: 3518,
        date: '02-06-2014',
        customer: {
          name: 'Joyería la Perla',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111951421',
          email: 'jorch@example.com'
        },
        address: {
          street: 'Hotel California',
          number: '12',
          neighborhood: 'Centro',
          zipcode: '60500',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Productos para joyería y piedras presiosas',
            quantity: '5',
            price: '4500',
            amount: '22500'
          },
          {
            name: 'Accesorios Hombre',
            quantity: '20',
            price: '35',
            amount: '700'
          },
          {
            name: 'Accesorios mujer',
            quantity: '3',
            price: '500000',
            amount: '1500000'
          }
        ]
      },
      {
        provider: true,
        total: 6931,
        date: '12-04-2015',
        customer: {
          name: 'Marbuen',
          rfc: 'XXXX-XXX-XXXX',
          phone: '3111108525',
          email: 'dani@example.com'
        },
        address: {
          street: 'Blvd. Colosio',
          number: '95',
          neighborhood: 'Centro',
          zipcode: '63121',
          city: 'Tepic',
          municipality: 'Tepic',
          state: 'Nayarit'
        },
        products: [
          {
            name: 'Lorem',
            quantity: '3',
            price: '40',
            amount: '120'
          },
          {
            name: 'Componentes y suministros electrónicos',
            quantity: '30',
            price: '5',
            amount: '150'
          },
          {
            name: 'Componentes de sonido',
            quantity: '10',
            price: '20',
            amount: '200'
          }
        ]
      }
    ];
  }

}
