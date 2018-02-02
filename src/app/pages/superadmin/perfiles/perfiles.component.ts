import { Component, OnInit } from '@angular/core';
import { RtHeader, RtAction, RtActionName } from '../../../components/rt-datatable/rt-datatable.component';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ModalProfilesComponent } from '../../_catalog/modal-profiles/modal-profiles.component';
import { ProfileProvider } from '../../../providers/providers';

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

  constructor(
    private noti: NotificationsService,
    private dialogCtrl: MatDialog,
    private profileProv: ProfileProvider
  ) { }

  ngOnInit() {
    this.profileProv.getAll().subscribe(data => {
      this.data = data.profiles;
    });
  }

  onProfileSelected(ev) {
    this.profileSelected = ev.data;
  }

  onCreate(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.profileModal('Nuevo perfil', null);
    dialogRef.afterClosed().subscribe(profile => {
      if (!profile) { return; }
      // Make HTTP request to create notification
      this.profileProv.create(profile).subscribe(data => {
        profile = data.profile;
        this.action.next({ name: RtActionName.CREATE, newItem: profile });
        this.noti.success('Acción exitosa', `Nuevo perfil creado: ${profile.name}`);
      }, err => {
        this.noti.error('Error', `No se pudo crear el perfil`);
      });
    });
  }

  onEdit(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.profileModal('Modificar perfil', this.profileSelected);
    dialogRef.afterClosed().subscribe(profile => {
      if (!profile) { return; }
      // Make HTTP request to create notification
      this.profileProv.update(profile).subscribe(data => {
        profile = data.profile;
        this.action.next({ name: RtActionName.UPDATE, itemId: profile._id, newItem: profile });
        this.noti.success('Acción exitosa', `Perfil ${this.profileSelected.name} modificado`);
        this.profileSelected = profile;
      }, err => {
        this.noti.error('Error', `No se pudo modificar el perfil`);
      });
    });
  }

  onDelete(ev: any) {
    this.stopPropagation(ev);
    const dialogRef = this.dialogCtrl.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: '¡ATENCIÓN!',
        message: `Está seguro de eliminar el perfil: ${this.profileSelected.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) { return; }
      this.profileProv.delete(this.profileSelected._id).subscribe(data => {
        res = data.profile;
        this.noti.success('Acción exitosa', `Perfil ${this.profileSelected.name} eliminado`);
        this.action.next({ name: RtActionName.DELETE, itemId: this.profileSelected._id, newItem: res });
      }, err => {
        this.noti.error('Error', `No se pudo eliminar el perfil`);
      });
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
