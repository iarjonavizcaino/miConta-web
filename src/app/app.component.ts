import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { SessionService } from './services/session.serv';
import { trigger, transition, style, animate } from '@angular/animations';
import * as moment from 'moment';
import { AuthService } from './services/services';
import { _roles } from '../app/services/global';
import * as firebase from 'firebase';
import { firebaseConfig } from '../app/app.firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateY(-56px)' }),
        animate('400ms cubic-bezier(.25,.8,.25,1)')
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(.25,.8,.25,1)', style({ transform: 'translateY(-56px)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidemenu') sidemenu: SidemenuComponent;

  title = 'app';
  user$: Observable<any>;
  smallScreen: boolean;
  mode = 'side';
  notifyOptions = {
    position: ['bottom', 'right'],
    timeOut: 4000,
    animate: 'fromLeft',
    maxStack: 5
  };
  constructor(
    public auth: AuthService,
    private router: Router,
    private session: SessionService) {
    firebase.initializeApp(firebaseConfig);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureSidenav();
  }
  ngOnInit() {
    this.configureSidenav();
    this.configureMoment();
    // this.router.navigate(['/login']);
    this._checkSession();
    this.user$ = this.session.user;
  }
  private configureMoment() {
    moment.locale('es');
    moment.updateLocale('es', {
      monthsShort: [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
      ]
    });
  }
  onMenu() {
    this.sidenav.toggle();
  }

  onMenuItem() {
    if (!this.smallScreen) {
      return;
    } else if (this.smallScreen && this.sidemenu.getSelectedOption() !== 'header') {
      this.sidenav.close();
    }
  }

  private configureSidenav() {
    this.smallScreen = window.innerWidth < 841;
    this.mode = this.smallScreen ? 'over' : 'side';
  }

  private _checkSession() {
    if (!this.auth.checkSession()) {
      this.router.navigate(['/login']);
    } else {
      let urlName;
      this.router.events.subscribe((url: any) => {
        urlName = url.url;
        if (urlName === '/') {
          switch (JSON.parse(localStorage.getItem('user')).role._id) {
            case _roles.accountant_prod:
              this.router.navigate(['/contador/inicio']);
              break;

            case _roles.taxpayer_prod:
              this.router.navigate(['/contribuyente/inicio']);
              break;

            case _roles.offices_prod:
              this.router.navigate(['/despacho/inicio']);
              break;

            case _roles.superadmin_prod:
              this.router.navigate(['/superadmin/inicio']);
              break;
          }
        }
      });
    }
  }
}// class
