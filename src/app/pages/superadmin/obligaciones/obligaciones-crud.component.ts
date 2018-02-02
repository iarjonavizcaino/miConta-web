import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalObligacionesComponent } from '../../_catalog/modal-obligaciones/modal-obligaciones.component';
import { NotificationsService } from 'angular2-notifications';
import { ObligationProvider } from '../../../providers/providers';

@Component({
  selector: 'app-obligaciones-crud',
  templateUrl: './obligaciones-crud.component.html',
  styleUrls: ['./obligaciones-crud.component.css']
})
export class ObligacionesCrudComponent implements OnInit {
  headers: Array<RtHeader> = [
    { name: 'Tipo', prop: 'type', default: '', width: '12' },
    { name: 'Descripción', prop: 'description', default: '', width: '78' },
  ];
  obligationSelected: any;
  data = [];
  action = new Subject<RtAction>();

  constructor(
    private noti: NotificationsService,
    private dialogCtrl: MatDialog,
    private obligationProv: ObligationProvider
  ) { }

  ngOnInit() {
    this.obligationProv.getAll().subscribe(data => {
      this.data = data.obligations;
    });
  }

  onObligationSelected(ev) {
    this.obligationSelected = ev.data;
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.obligationModal('Nueva obligación', null);
    dialogRef.afterClosed().subscribe((obligation) => {
      if (!obligation) { return; }
      // Make HTTP request to create notification
      this.obligationProv.create(obligation).subscribe(data => {
        obligation = data.obligation;
        this.action.next({ name: RtActionName.CREATE, newItem: obligation });
        this.noti.success('Acción exitosa', 'Nueva obligación creada');
      }, err => {
        this.noti.error('Error', 'No se pudo crear la obligación');
      });
    });
  }

  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.obligationModal('Modificar obligación', this.obligationSelected);
    dialogRef.afterClosed().subscribe((obligation) => {
      if (!obligation) { return; }
      // Make HTTP request to create notification
      this.obligationProv.update(obligation).subscribe(data => {
        obligation = data.obligation;
        this.action.next({ name: RtActionName.UPDATE, itemId: obligation._id, newItem: obligation });
        this.noti.success('Acción exitosa', 'Obligación moficada');
        this.obligationSelected = obligation;
      }, err => {
        this.noti.error('Error', 'No se pudo modificar la obligación');
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: '¿Está seguro de eliminar esta obligación?'
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) { return; }
      console.log(res);
      this.obligationProv.delete(this.obligationSelected._id).subscribe(data => {
        res = data.obligation;
        this.noti.success('Acción exitosa', 'Obligación eliminada');
        this.action.next({ name: RtActionName.DELETE, itemId: this.obligationSelected._id });
        this.obligationSelected = null;
      }, err => {
        this.noti.error('Error', 'No se pudo modificar la obligación');
      });
    });
  }

  obligationModal(title: string, obligation: any) {
    return this.dialogCtrl.open(ModalObligacionesComponent, {
      disableClose: false,
      data: {
        title: title,
        obligation: obligation
      }
    });
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}// class
