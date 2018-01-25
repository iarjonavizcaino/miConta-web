import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalConceptosComponent } from '../../_catalog/modal-conceptos/modal-conceptos.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Código', prop: 'code', default: '', width: '12' },
    { name: 'Concepto', prop: 'concept', default: '', width: '78' },
  ];
  conceptSelected: any;
  data = [];
  action = new Subject<RtAction>();

  constructor(private noti: NotificationsService, private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.data = [
      {
        _id: '1',
        code: '553686',
        concept: 'Gasolina'
      },
      {
        _id: '2',
        code: '523536',
        concept: 'Materiales de Limpieza'
      },
      {
        _id: '3',
        code: '112626',
        concept: 'Consumibles de cómputo'
      },
      {
        _id: '4',
        code: '334168',
        concept: 'Material eléctrico'
      },
      {
        _id: '5',
        code: '664173',
        concept: 'Gasolina otra vez'
      }
    ];
  }

  onConceptSelected(ev: any) {
    this.conceptSelected = ev.data;
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.conceptModal('Nuevo concepto', null);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      console.log(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data });
      this.conceptSelected = data;
      this.noti.success('Acción exitosa', `Nuevo concepto creado: ${ this.conceptSelected.concept }`);

    });
  }

  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.conceptModal('Modificar concepto', this.conceptSelected);

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      this.action.next({ name: RtActionName.UPDATE, itemId: data._id, newItem: data });
      this.noti.success('Acción exitosa', `Concepto ${ this.conceptSelected.concept } moficado`);
      this.conceptSelected = data;
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¸ATENCIÓN!',
        message: `¿Está seguro de eliminar el concepto: ${ this.conceptSelected.concept }?`
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // DO IT
      this.action.next({ name: RtActionName.DELETE, itemId: this.conceptSelected._id, newItem: data });
      this.noti.success('Acción exitosa', `Concepto ${ this.conceptSelected.concept } eliminado`);
      this.conceptSelected = null;
    });
  }

  conceptModal(title: string, concept: any) {
    return this.dialogCtrl.open(ModalConceptosComponent, {
      disableClose: false,
      data: {
        title: title,
        concept: concept
      }
    });
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}// class
