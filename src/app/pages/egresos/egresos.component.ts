import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../_catalog/billing-catalog/billing-catalog.component';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Fecha', prop: 'date', default: 'No date', moment: true },
    { name: 'Proveedor', prop: 'customer.name', default: 'No customer' },
    { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true }
  ];
  selectedBill: any;
  data = [];
  action = new Subject<RtAction>();
  constructor(private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.data = [
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
  }// ngOnInit

  onBillSelected(ev) {
    this.selectedBill = ev.data;
  }
  onView(ev) {
    this.stopPropagation(ev);
    this.brandModal(this.selectedBill, true, 'Datos de Factura');
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
  brandModal(bill: any, readonly: boolean, title: string) {
    return this.dialogCtrl.open(BillingCatalogComponent, {
      disableClose: false,
      data: {
        title: title,
        readonly: readonly,
        bill: bill
      }
    });
  }
}// class
