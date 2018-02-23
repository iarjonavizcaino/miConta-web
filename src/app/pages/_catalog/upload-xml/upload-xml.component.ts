/**
 * dropzone
 * https://github.com/zefoy/ngx-dropzone-wrapper
 *
 * conver xml to json
 * https://github.com/NaturalIntelligence/fast-xml-parser
 *
 * xml parse
 * https://www.npmjs.com/package/xml-parse
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import * as fastXmlParser from 'fast-xml-parser';
// import * as xmlData from 'xml-parse';
import * as xml2json from 'xml-js';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.scss']
})

export class UploadXmlComponent implements OnInit {
  xml = false;
  title: string;
  taxpayer: string;
  // fastXmlParser = fastXmlParser;
  // xmlData = xmlData;
  files = [];
  constructor(
    private dialogRef: MatDialogRef<UploadXmlComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.taxpayer = this.data.taxpayer;
  }

  onSave() {
    this.dialogRef.close(this.files);
  }

  onClose() {
    this.dialogRef.close();
  }
  onUploadSuccess(ev: any) {
    this.xml = true;
    const xml_str = ev[1].files.file; // XML text
    // parse to json
    let jsonBill: any = xml2json.xml2json(xml_str, { compact: true, spaces: 4 }); // convert to json
    jsonBill = jsonBill.replace(/cfdi:/g, '');
    jsonBill = JSON.parse(jsonBill);

    const paymentKey = jsonBill.Comprobante._attributes.FormaPago;
    let paymentMethod: string;
    switch (paymentKey) {
      case '01':
        paymentMethod = 'Efectivo';
        break;
      case '02':
        paymentMethod = 'Cheque';
        break;
      case '03':
        paymentMethod = 'Transferencia';
        break;
      case '04':
        paymentMethod = 'Tarjetas de crédito';
        break;
      case '05':
        paymentMethod = 'Monederos electrónicos';
        break;
      case '06':
        paymentMethod = 'Dinero electrónico';
        break;
      case '07':
        paymentMethod = 'Tarjetas digitales';
        break;
      case '08':
        paymentMethod = 'Vales de despensa';
        break;
      case '09':
        paymentMethod = 'Bienes';
        break;
      case '10':
        paymentMethod = 'Servicio';
        break;
      case '11':
        paymentMethod = 'Por cuenta de tercero';
        break;
      case '12':
        paymentMethod = 'Dación en pago';
        break;
      case '13':
        paymentMethod = 'Pago por subrogación';
        break;
      case '14':
        paymentMethod = 'Pago por consignación';
        break;
      case '15':
        paymentMethod = 'Condonación';
        break;
      case '16':
        paymentMethod = 'Cancelación';
        break;
      case '17':
        paymentMethod = 'Compensación';
        break;
      case '98':
        paymentMethod = 'NA';
        break;
      case '99':
        paymentMethod = 'Otros';
        break;
    }
    const type = jsonBill.Comprobante._attributes.TipoDeComprobante;
    const newBill = {
      taxpayer: this.taxpayer,
      type: type === 'I' ? 'Ingresos' : 'Egresos',
      createdDate: jsonBill.Comprobante._attributes.Fecha,
      cobrada_pagada: jsonBill.Comprobante._attributes.MetodoPago === 'PUE' ? true : false,
      cobrada_pagadaDate: jsonBill.Comprobante._attributes.MetodoPago === 'PUE' ? jsonBill.Comprobante._attributes.Fecha : null,
      deducible: '',
      payMethod: {
        key: paymentKey,
        // tslint:disable-next-line:max-line-length
        method: paymentMethod,
      },
      general_public: '',
      captureMode: 'XML',
      taza: 0,
      taxes: 0,
      subtotal: jsonBill.Comprobante._attributes.SubTotal,
      total: jsonBill.Comprobante._attributes.Total,
      customer_provider: {
        name: type === 'I' ? jsonBill.Comprobante.Receptor._attributes.Nombre : jsonBill.Comprobante.Emisor._attributes.Nombre,
        rfc: type === 'I' ? jsonBill.Comprobante.Receptor._attributes.Rfc : jsonBill.Comprobante.Emisor._attributes.Rfc,
        address: {
          street: '',
          number: '',
          neighborhood: '',
          zipcode: '',
          city: '',
          municipality: '',
          state: '',
        }
      },
      products: []
    };

    let product;

    if (jsonBill.Comprobante.Conceptos.Concepto.length) {
      jsonBill.Comprobante.Conceptos.Concepto.forEach(concept => {
        product = {
          code: concept._attributes.ClaveProdServ.toString().substr(0, 4),
          concept: concept._attributes.Descripcion,
          product: concept._attributes.Descripcion,
          quantity: concept._attributes.Cantidad,
          price: concept._attributes.ValorUnitario,
          amount: concept._attributes.Importe
        };

        newBill.products.push(product);
      });
    } else {
      product = {
        code: jsonBill.Comprobante.Conceptos.Concepto._attributes.ClaveProdServ.toString().substr(0, 4),
        concept: jsonBill.Comprobante.Conceptos.Concepto._attributes.Descripcion,
        product: jsonBill.Comprobante.Conceptos.Concepto._attributes.Descripcion,
        quantity: jsonBill.Comprobante.Conceptos.Concepto._attributes.Cantidad,
        price: jsonBill.Comprobante.Conceptos.Concepto._attributes.ValorUnitario,
        amount: jsonBill.Comprobante.Conceptos.Concepto._attributes.Importe
      };
      newBill.products.push(product);
    }
    console.log(newBill);
    this.files.push(newBill);
  }

  onUploadError(ev: any) {
    console.log('No puedes subir archivos de este tipo');
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}// class
