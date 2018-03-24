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
import { ConceptProvider, FirebaseProvider } from '../../../providers/providers';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.scss']
})

export class UploadXmlComponent implements OnInit {
  xml = false;
  title: string;
  taxpayer: any;
  concepts = [];
  allConcepts = [];
  files = [];
  constructor(
    private firebaseProv: FirebaseProvider,
    private dialogRef: MatDialogRef<UploadXmlComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private conceptProv: ConceptProvider
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.taxpayer = this.data.taxpayer;
    this.concepts = this.taxpayer.profile.concepts;

    this.conceptProv.getAll().subscribe(data => {
      this.allConcepts = data.concepts;
    });
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
    // console.log(jsonBill);
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
      taxpayer: this.taxpayer._id,
      type: type === 'I' ? 'Ingresos' : 'Egresos',
      createdDate: jsonBill.Comprobante._attributes.Fecha,
      cobrada_pagada: jsonBill.Comprobante._attributes.MetodoPago === 'PUE' ? true : false,
      cobrada_pagadaDate: jsonBill.Comprobante._attributes.MetodoPago === 'PUE' ? jsonBill.Comprobante._attributes.Fecha : null,
      deducible: true,
      payMethod: {
        key: paymentKey,
        // tslint:disable-next-line:max-line-length
        method: paymentMethod,
      },
      general_public: jsonBill.Comprobante.Receptor._attributes.Rfc === 'XAXX010101000' ? true : false,
      captureMode: 'X',
      tasa: jsonBill.Comprobante.Impuestos.Traslados.Traslado._attributes.TasaOCuota,
      taxes: jsonBill.Comprobante.Impuestos._attributes.TotalImpuestosTrasladados,
      retenciones: jsonBill.Comprobante.Impuestos._attributes.TotalImpuestosRetenidos,
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
          code: concept._attributes.ClaveProdServ,
          concept: concept._attributes.Descripcion,
          product: concept._attributes.Descripcion,
          quantity: concept._attributes.Cantidad,
          price: concept._attributes.ValorUnitario,
          amount: concept._attributes.Importe
        };
        // if (newBill.type === 'Egresos') {
        const conceptCode = product.code.substr(0, 2);
        const index = this.concepts.findIndex(concepto => concepto.code.substr(0, 2) === conceptCode);
        if (index !== -1) {
          product.code = this.concepts[index].code.substr(0, 2);
          product.concept = this.concepts[index].concept;
          product.deducible = true;
        } else {
          const index2 = this.allConcepts.findIndex(concepto => concepto.code.substr(0, 2) === conceptCode);
          if (index2 !== -1) {
            product.code = this.allConcepts[index2].code.substr(0, 2);
            product.concept = this.allConcepts[index2].concept;
          } else {
            product.code = concept._attributes.ClaveProdServ.substr(0, 2);
            product.concept = 'Concepto no registrado';
          }
          newBill.deducible = false;
          product.deducible = false;
        }
        // }
        newBill.products.push(product);
      });
    } else {
      product = {
        code: jsonBill.Comprobante.Conceptos.Concepto._attributes.ClaveProdServ,
        concept: jsonBill.Comprobante.Conceptos.Concepto._attributes.Descripcion,
        product: jsonBill.Comprobante.Conceptos.Concepto._attributes.Descripcion,
        quantity: jsonBill.Comprobante.Conceptos.Concepto._attributes.Cantidad,
        price: jsonBill.Comprobante.Conceptos.Concepto._attributes.ValorUnitario,
        amount: jsonBill.Comprobante.Conceptos.Concepto._attributes.Importe
      };
      // if (newBill.type === 'Egresos') {
      const conceptCode = product.code.substr(0, 2);
      const index = this.concepts.findIndex(concept => concept.code.substr(0, 2) === conceptCode);
      if (index !== -1) {
        product.code = this.concepts[index].code.substr(0, 2);
        product.concept = this.concepts[index].concept;
        product.deducible = true;
      } else {
        const index2 = this.allConcepts.findIndex(concept => concept.code.substr(0, 2) === conceptCode);
        if (index2 !== -1) {
          product.code = this.allConcepts[index2].code.substr(0, 2);
          product.concept = this.allConcepts[index2].concept;
        } else {
          product.code = jsonBill.Comprobante.Conceptos.Concepto._attributes.ClaveProdServ.substr(0, 2);
          product.concept = 'Concepto no registrado';
        }
        newBill.deducible = false;
        product.deducible = false;
      }
      // }
      newBill.products.push(product);
    }
    // let code;
    // newBill.products.forEach(producto => {
    //   code  = producto.code.substr(0, 2);
    //   const index = this.concepts.findIndex(concept => concept.code.substr(0, 2) === code);
    //   if (index !== -1) {
    //     producto.code = this.concepts[index].code.substr(0, 2);
    //     producto.concept = this.concepts[index].concept;
    //     producto.deducible = true;
    //   } else {
    //     const index2 = this.allConcepts.findIndex(concept => concept.code.substr(0, 2) === code);
    //     producto.code = this.allConcepts[index2].code.substr(0, 2);
    //     producto.concept = this.allConcepts[index2].concept;
    //     newBill.deducible = false;
    //     producto.deducible = false;
    //   }
    // });
    // console.log(newBill);
    this.files.push({ bill: newBill, file: ev[0] });

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
