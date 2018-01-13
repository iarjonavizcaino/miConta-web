import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {

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
    console.log(':(');
    this.notification.success('Exito', 'Se guardo actualizo correctamente');
  }
}
