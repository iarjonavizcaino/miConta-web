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
  constructor(private session: SessionService) {}

  ngOnInit() {
  }
}// class
