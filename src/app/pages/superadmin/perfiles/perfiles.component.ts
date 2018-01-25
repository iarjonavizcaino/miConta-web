import { Component, OnInit } from '@angular/core';
import { RtHeader, RtAction, RtActionName } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ModalProfilesComponent } from '../../_catalog/modal-profiles/modal-profiles.component';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {

  headers: Array<RtHeader> = [
    { name: 'Nombre', prop: 'name', default: 'Sin nombre' }
  ];
  action = new Subject<RtAction>();
  profileSelected: any;
  data = [];

  constructor(private noti: NotificationsService, private dialogCtrl: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.data = [
      {
        _id: '1',
        name: 'Tienda de abarrotes',
        concepts: [
          {
            _id: '1',
            code: '553686',
            concept: 'Gasolina'
          },
          {
            _id: '2',
            code: '523536',
            concept: 'Materiales de Limpieza'
          }
        ],
        obligations: [
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
          }
        ]
      },
      {
        _id: '2',
        name: 'Papelería',
        obligations: [
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
        ],
        concepts: [
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
        ]
      },
      {
        _id: '3',
        name: 'Farmacia',
        concepts: [
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
        ],
        obligations: [
          {
            _id: '3',
            type: 'Montos',
            // tslint:disable-next-line:max-line-length
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, aliquam porro itaque aperiam perspiciatis doloremque, facere blanditiis rem voluptate ad veniam placeat tempore quaerat facilis iusto obcaecati repellendus! Tempore, quas?'
          }
        ]
      }
    ];
  }

  onProfileSelected(ev) {
    this.profileSelected = ev.data;
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.profileModal('Nuevo perfil', null);
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      // Make HTTP request to create notification
      console.log(data);
      this.action.next({ name: RtActionName.CREATE, newItem: data });
      this.profileSelected = data;
      this.noti.success('Acción exitosa', `Nuevo perfil creado: ${this.profileSelected.name}`);
    });
  }

  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.profileModal('Modificar perfil', this.profileSelected);
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      // Make HTTP request to create notification
      console.log(data);
      this.action.next({ name: RtActionName.UPDATE, itemId: data._id, newItem: data });
      this.noti.success('Acción exitosa', `Perfil ${this.profileSelected.name} modificado`);
      this.profileSelected = data;
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `Está seguro de eliminar el perfil ${this.profileSelected.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (!data) { return; }
      console.log(data);
      // DO IT
      this.noti.success('Acción exitosa', `Perfil ${this.profileSelected.name} eliminado`);
      this.action.next({ name: RtActionName.DELETE, itemId: this.profileSelected._id, newItem: data });
    });
  }

  profileModal(title: string, profile: any) {
    return this.dialogCtrl.open(ModalProfilesComponent, {
      disableClose: false,
      data: {
        title: title,
        // tslint:disable-next-line:max-line-length
        profile: profile
      }
    });
  }

  stopPropagation(ev: Event) {
    if (ev) { ev.stopPropagation(); }
  }
}
