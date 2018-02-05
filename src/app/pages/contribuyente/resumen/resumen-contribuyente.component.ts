import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { BillingCatalogComponent } from '../../_catalog/billing-catalog/billing-catalog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NewBillComponent } from '../../_catalog/new-bill/new-bill.component';

@Component({
  selector: 'app-resumen-contribuyente',
  templateUrl: './resumen-contribuyente.component.html',
  styleUrls: ['./resumen-contribuyente.component.scss']
})
export class ResumenContribuyenteComponent implements OnInit, OnDestroy {
  headersIngresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'date', default: 'No date', moment: true },  // from xml file
    { name: 'Cliente', prop: 'customer.name', default: 'No customer' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo de factura', prop: 'type', default: '', align: 'center', chip: true },
    { name: 'Cobrada', prop: 'active', input: 'toggle' },
    { name: 'Fec Cobrada', prop: 'chargedDay', default: '', align: 'center', moment: true }
  ];
  headersEgresos: Array<RtHeader> = [
    { name: 'Emisión', prop: 'date', default: 'No date', moment: true },
    // { name: 'Estado', prop: 'status', default: 'Pendiente', chip: true },
    { name: 'Proveedor', prop: 'customer.name', default: 'No customer' },
    // { name: 'RFC', prop: 'customer.rfc', default: 'XXXX-XXX-XXXX' },
    { name: 'Total', prop: 'total', default: '$ 0.00', align: 'right', accounting: true },
    { name: 'Tipo de factura', prop: 'type', default: '', align: 'center', chip: true },
    { name: 'Pagada', prop: 'active', input: 'toggle' },
    { name: 'Fec Pago', prop: 'payDay', default: '', align: 'center', moment: true }
  ];

  // ingresos
  allIngresosChecked = false;
  checkedIngresos = 0;
  selectedIngresos: any;
  dataIngresos = [];
  actionIngresos = new Subject<RtAction>();

  // egresos
  allEgresosChecked = false;
  checkedEgresos = 0;
  selectedEgresos: any;
  dataEgresos = [];
  actionEgresos = new Subject<RtAction>();

  sub: any;
  contribuyente: string;
  years = [];
  bimesters = [];

  currentBimester = 'ENE-FEB 2018';
  selectedYear = '';
  selectedBimester = '';

  // to hadle breadcrumb
  roleUp = '';
  constructor(private router: Router, private dialogCtrl: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.roleUp = JSON.parse(localStorage.getItem('user')).role.name;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log('params', params);
        // tslint:disable-next-line:triple-equals
        if (params.name) {
          this.contribuyente = params.name;
          this.headersIngresos.splice(0, 0, { name: 'Seleccionar', prop: 'checked', input: 'checkbox', align: 'center' });
          this.headersEgresos.splice(0, 0, { name: 'Seleccionar', prop: 'checked', input: 'checkbox', align: 'center' });
          // tslint:disable-next-line:max-line-length
          this.headersEgresos.splice(this.headersEgresos.length - 1, 0, { name: 'Deducible', prop: 'deducible', input: 'toggle', width: '12', align: 'center' });
        }
      });
    this.loadBimesters();
    this.loadIngresosData();
    this.loadEgresosData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  onManualBillEgresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.manualBill(false);
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      console.log('new bill', newBill);
      this.actionEgresos.next({ name: RtActionName.CREATE, newItem: newBill });
    });
  }
  onManualBillIngresos(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.manualBill(true);
    dialogRef.afterClosed().subscribe((newBill) => {
      if (!newBill) { return; }
      console.log('new bill', newBill);
      this.actionIngresos.next({ name: RtActionName.CREATE, newItem: newBill });
    });
  }
  private manualBill(type: boolean) {
    return this.dialogCtrl.open(NewBillComponent, {
      disableClose: false,
      data: {
        ingresos: type
      }
    });
  }
  onEgresosSelected(ev: any) {
    if (ev.data) {
      if (ev.data.checked) {
        ev.data.checked = false;
        this.checkedEgresos = this.checkedEgresos - 1 === 0 ? 0 : this.checkedEgresos - 1;
      } else {
        ev.data.checked = true;
        this.checkedEgresos++;
      }
    }
    this.selectedEgresos = ev.data;
  }
  onEgresosChecked(ev: any) {
    if (!ev.item.checked) {
      this.checkedEgresos++;
      ev.item.checked = !ev.item.checked;
      this.selectedEgresos = ev.item;
    } else {
      this.checkedEgresos--;
    }
  }
  onCheckAllEgresos(ev: any) {
    this.allEgresosChecked = !this.allEgresosChecked;
    if (this.allEgresosChecked) {
      this.dataEgresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.dataEgresos.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedEgresos = this.dataEgresos.length;
    } else {
      this.checkedEgresos = 0;
      this.dataEgresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }
  /************************************************************************************ */
  onIngresosSelected(ev) {
    if (ev.data) {
      if (ev.data.checked) {
        ev.data.checked = false;
        this.checkedIngresos = this.checkedIngresos - 1 === 0 ? 0 : this.checkedIngresos - 1;
      } else {
        ev.data.checked = true;
        this.checkedIngresos++;
      }
    }
    this.selectedIngresos = ev.data;
  }
  onIngresosChecked(ev: any) {
    if (!ev.item.checked) {
      this.checkedIngresos++;
      ev.item.checked = !ev.item.checked;
      this.selectedIngresos = ev.item;
    } else {
      this.checkedIngresos--;
    }
  }
  onCheckAllIngresos(ev: any) {
    this.allIngresosChecked = !this.allIngresosChecked;
    if (this.allIngresosChecked) {
      this.dataIngresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
      this.dataIngresos.forEach((element) => {  // check all items
        element.checked = true;
      });
      this.checkedIngresos = this.dataIngresos.length;
    } else {
      this.checkedIngresos = 0;
      this.dataIngresos.forEach((element) => {  // uncheck all items
        element.checked = false;
      });
    }
  }
  /********************************************************************************* */
  onViewBillIngresos(ev) {
    this.stopPropagation(ev);
    this.billModal(this.selectedIngresos, true, 'Datos de Factura');
  }
  onViewBillEgresos(ev: any) {
    this.stopPropagation(ev);
    this.billModal(this.selectedEgresos, true, 'Datos de Factura');
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

  onDownloadXMLIngresos(ev: any) {
    this.stopPropagation(ev);
  }
  onDownloadXMLEgresos(ev: any) {
    this.stopPropagation(ev);
  }

  onDownloadPDF(ev: any) {
    this.stopPropagation(ev);
  }
  onDeleteStatement(ev: any) {
    console.log('Eliminar declaración que se registro manual');
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }

  loadIngresosData() {
    this.dataIngresos = [
      {
        chargedDay: '01/01/1995',
        active: true,
        type: 'XML',
        checked: false,
        total: 456,
        date: '01/01/1995',
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
            amount: '456',
            code: '123891'
          },
          {
            name: 'Herramientas y maquinaría general',
            quantity: '50',
            price: '250',
            amount: '12500',
            code: '123891'
          },
          {
            name: 'Materiales y productos de papel',
            quantity: '10',
            price: '7',
            amount: '70',
            code: '123891'
          }
        ]
      },
      {
        active: false,
        type: 'Manual',
        checked: false,
        total: 12500,
        date: '02/02/1995',
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
            amount: '22500',
            code: '123891'
          },
          {
            name: 'Productos de aseo personal',
            quantity: '20',
            price: '35',
            amount: '700',
            code: '123891'
          },
          {
            name: 'Equipo médico',
            quantity: '3',
            price: '500000',
            amount: '1500000',
            code: '123891'
          }
        ]
      },
      {
        chargedDay: '03/03/1995',
        active: false,
        type: 'Automática',
        checked: false,
        total: 70,
        date: '03/03/1995',
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
            amount: '120',
            code: '123891'
          },
          {
            name: 'Componentes y suministros electrónicos',
            quantity: '30',
            price: '5',
            amount: '150',
            code: '123891'
          },
          {
            name: 'Materiales de resina',
            quantity: '10',
            price: '20',
            amount: '200',
            code: '123891'
          }
        ]
      }
    ];
  }

  loadEgresosData() {
    this.dataEgresos = [
      {
        // status: 'Cobrado',
        payDay: '09/19/1995',
        deducible: true,
        cobrada: true,
        type: 'Manual',
        active: true,
        provider: true,
        total: 1325,
        date: '09/19/1995',
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
            amount: '456',
            code: '710183'
          },
          {
            name: 'Herramientas y maquinaría general',
            quantity: '50',
            price: '250',
            amount: '12500',
            code: '812718'
          },
          {
            name: 'Materiales y productos de papel',
            quantity: '10',
            price: '7',
            amount: '70',
            code: '719281'
          }
        ]
      },
      {
        deducible: true,
        cobrada: false,
        // status: 'Pendiente',
        type: 'Automática',
        active: false,
        provider: true,
        total: 3518,
        date: '02/06/2014',
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
            amount: '22500',
            code: '819271'
          },
          {
            name: 'Accesorios Hombre',
            quantity: '20',
            price: '35',
            amount: '700',
            code: '411531'
          },
          {
            name: 'Accesorios mujer',
            quantity: '3',
            price: '500000',
            amount: '1500000',
            code: '123891'
          }
        ]
      },
      {
        payDay: '11/14/2015',
        deducible: true,
        cobrada: true,
        // status: 'Cobrado',
        type: 'XML',
        active: true,
        provider: true,
        total: 6931,
        date: '11/04/2015',
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
            amount: '120',
            code: '123891'
          },
          {
            name: 'Componentes y suministros electrónicos',
            quantity: '30',
            price: '5',
            amount: '150',
            code: '981211'
          },
          {
            name: 'Componentes de sonido',
            quantity: '10',
            price: '20',
            amount: '200',
            code: '712731'
          }
        ]
      }
    ];
  }
  loadBimesters() {
    const year = new Date().getFullYear();
    for (let i = 2014; i <= year; i++) {
      this.years.push(i);
    }
    this.bimesters = [
      {
        name: 'ENE-FEB'
      },
      {
        name: 'MAR-ABR'
      },
      {
        name: 'MAY-JUN'
      },
      {
        name: 'JUL-AGO'
      },
      {
        name: 'SEPT-OCT'
      },
      {
        name: 'NOV-DIC'
      }
    ];
  }

  getBimesterInfo(ev: any) {
    this.currentBimester = this.selectedBimester + ' ' + this.selectedYear;
  }
}// class
