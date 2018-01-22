import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  selectedOption;
  home = true;
  catalogs = false;
  inventory = false;
  sales = false;
  billing = false;
  permission: any;
  user$: Observable<any>;
  constructor(private session: SessionService) {

  }

  ngOnInit() {
    this.user$ = this.session.user;
    this.user$.subscribe(data => {
      if (data) {
        switch (data.role.name) {
          case 'contribuyente':
            this.permission = {
              contribuyente: true,
              contador: false,
              despacho: false,
              superadmin: false,
            };
            break;
          case 'contador':
            this.permission = {
              contribuyente: false,
              contador: true,
              despacho: false,
              superadmin: false,
            };
            break;
          case 'despacho':
            this.permission = {
              contribuyente: false,
              contador: false,
              despacho: true,
              superadmin: false,
            };
            break;
          case 'superadmin':
            this.permission = {
              contribuyente: false,
              contador: false,
              despacho: false,
              superadmin: true,
            };
        }// switch
      }
    });
  }

  setToFalse() {
    this.home = false;
    this.catalogs = false;
    this.inventory = false;
    this.sales = false;
    this.billing = false;
  }

  getSelectedOption() {
    return this.selectedOption;
  }
}
