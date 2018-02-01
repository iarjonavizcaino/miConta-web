import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalConceptosComponent } from '../../_catalog/modal-conceptos/modal-conceptos.component';
import { NotificationsService } from 'angular2-notifications';
import { ConceptProvider } from '../../../providers/providers';

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

  constructor(
    private noti: NotificationsService,
    private dialogCtrl: MatDialog,
    private conceptProv: ConceptProvider
  ) { }

  ngOnInit() {
    this.conceptProv.getAll().subscribe(data => {
      this.data = data.concepts;
    });
  }

  onConceptSelected(ev: any) {
    this.conceptSelected = ev.data;
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.conceptModal('Nuevo concepto', null);
    dialogRef.afterClosed().subscribe((concept) => {
      if (!concept) { return; }
      this.conceptProv.create(concept).subscribe(data => {
        concept = data.concept;
        this.action.next({ name: RtActionName.CREATE, newItem: concept });
        this.noti.success('Acción exitosa', `Nuevo concepto creado: ${concept.concept}`);
      }, err => {
        this.noti.error('Error', `No se pudo crear el concepto`);
      });
    });
  }

  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.conceptModal('Modificar concepto', this.conceptSelected);

    dialogRef.afterClosed().subscribe((concept) => {
      if (!concept) { return; }
      this.conceptProv.update(concept).subscribe(data => {
        concept = data.concept;
        this.action.next({ name: RtActionName.UPDATE, itemId: concept._id, newItem: concept });
        this.noti.success('Acción exitosa', `Concepto ${this.conceptSelected.concept} moficado`);
        this.conceptSelected = concept;
      }, err => {
        this.noti.error('Error', `No se pudo modificar el concepto`);
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¸ATENCIÓN!',
        message: `¿Está seguro de eliminar el concepto: ${this.conceptSelected.concept}?`
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      this.conceptProv.delete(this.conceptSelected._id).subscribe(data => {
        res = data.concept;
        this.noti.success('Acción exitosa', `Concepto ${this.conceptSelected.concept} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.conceptSelected._id });
        this.conceptSelected = null;
      }, err => {
        this.noti.error('Error', `No se pudo eliminar el concepto`);
      });

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
