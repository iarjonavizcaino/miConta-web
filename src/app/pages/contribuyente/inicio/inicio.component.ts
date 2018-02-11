import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../../services/session.serv';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  permission: any;
  user$: Observable<any>;
  welcome: any = {
    socialReason: '',
    name: '',
    profile: ''
  };
  constructor(private session: SessionService) { }

  ngOnInit() {
    this.user$ = this.session.user;
    this.user$.subscribe((user) => {
      console.log(user);
      if (user) {
        this.welcome.socialReason = user.socialReason;
        this.welcome.name = user.name;
        this.welcome.profile = user.profile.name;
      }
    });
  }
}// class
