import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

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

  user: any = {
    name: 'Denis Adrían Jimnénez',
    rfc: 'XXXX-XXX-XXXX',
    address: {
      street: 'Blvd. Colosio',
      number: '95',
      neighborhood: 'Centro',
      zipcode: '63121',
      city: 'Tepic',
      municipality: 'Tepic',
      state: 'Nayarit'
    },
    socialReason: 'Evolución',
    pass: 'denis'
  };
  constructor(private notification: NotificationsService) { }

  ngOnInit() {
  }

  showNotification() {
    this.notification.success('Acción exitosa', 'Se guardo actualizo correctamente');
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
