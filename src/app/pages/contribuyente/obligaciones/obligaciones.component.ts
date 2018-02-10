import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-obligaciones',
  templateUrl: './obligaciones.component.html',
  styleUrls: ['./obligaciones.component.css']
})
export class ObligacionesComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute) { }
  sub: any;
  contribuyente: any;
  obligations = [];

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      console.log('params', params);
      // tslint:disable-next-line:triple-equals
      if (params.name) {
        this.contribuyente = params.name;
      }
    });
    this.obligations = JSON.parse(localStorage.getItem('user')).profile.obligations;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
