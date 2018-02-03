import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { TaxpayerProvider } from '../../../providers/providers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {
  // file picker
  situationFile: any;
  sealFile: any;
  loyalFile: any;

  taxpayer: any;

  currentPass: string;
  newPass: string;

  constructor(
    private notification: NotificationsService,
    private taxpayerProv: TaxpayerProvider,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { taxpayer: any}) => {
      if (data.taxpayer) {
        this.taxpayer = data.taxpayer;
      }
    });
  }

  updateTaxpayer() {
    this.taxpayerProv.update(this.taxpayer).subscribe(data => {
      console.log(data.taxpayer);
      this.notification.success('Acción exitosa', 'Los datos se actualizaron correctamente');
    }, err => {
      this.notification.error('Error', 'Ocurrió un error al actualizar los datos');
    });
  }

  updatePassword() {
    this.taxpayer.account.password = this.newPass;
    this.taxpayer.account.oldPass = this.currentPass;
    this.taxpayerProv.updatePassword(this.taxpayer).subscribe(data => {
      this.taxpayer = data.taxpayer;
      this.notification.success('Acción exitosa', 'La contraseña se actualizó correctamente');
    }, err => {
      const error = JSON.parse(err._body);
      this.notification.error('Error', error.message);
    });

  }

  onLoyalFile(ev) {
    this.loyalFile = ev.target.files[0];
  }

  onSealFile(ev) {
    this.sealFile = ev.target.files[0];
  }

  onSituationFile(ev) {
    this.situationFile = ev.target.files[0];
  }
}// class
