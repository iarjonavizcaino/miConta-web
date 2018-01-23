import { Component, OnInit } from '@angular/core';
import { RtAction, RtActionName, RtHeader } from '../../../components/rt-datatable/rt-datatable.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { ModalObligacionesComponent } from '../../_catalog/modal-obligaciones/modal-obligaciones.component';
import { NotificationsService } from 'angular2-notifications';

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

  constructor(private noti: NotificationsService, private dialogCtrl: MatDialog) { }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.data = [
      {
        _id: '1',
        type: 'Informativas',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      },
      {
        _id: '2',
        type: 'Plazos',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      },
      {
        _id: '3',
        type: 'Montos',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
      }
    ];
  }
  onObligationSelected(ev) {
    this.obligationSelected = ev.data;
  }
  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ModalObligacionesComponent, {
      disableClose: false,
      data: {
        title: 'Nueva Obligación'
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create notification
      console.log(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data });
      this.noti.success('Exito', 'Obligación creada');
    });
  }
  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ModalObligacionesComponent, {
      disableClose: false,
      data: {
        title: 'Editar Obligación',
        // tslint:disable-next-line:max-line-length
        obligation: {_id: this.obligationSelected._id, type: this.obligationSelected.type, description: this.obligationSelected.description }
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      // Make HTTP request to create notification
      console.log(data);
      this.action.next({ name: RtActionName.UPDATE, itemId: data._id, newItem: data });
      this.noti.success('Exito', 'Obligación moficada');
    });
  }
  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: 'ATENCIÓN!',
        message: 'Estás seguro de eliminar ésta obligación?'
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return; }
      console.log(data);
      // DO IT
      this.action.next({ name: RtActionName.DELETE, itemId: this.obligationSelected._id, newItem: data });
      this.noti.success('Exito', 'Obligación eliminada');
    });
  }
  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}// class
