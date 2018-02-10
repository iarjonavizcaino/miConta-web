import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TaxpayerProvider } from '../../../providers/providers';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss']
})
export class LimitesComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private taxpayerProv: TaxpayerProvider
  ) { }
  sub: any;
  contribuyente: any;
  limits = [];
  role = JSON.parse(localStorage.getItem('user')).role.name;

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
      console.log(localStorage.getItem('taxpayer'));
      if (this.role !== 'Contribuyente') {
        this.limits = JSON.parse(localStorage.getItem('taxpayer')).profile.concepts;
      } else {
        this.limits = JSON.parse(localStorage.getItem('user')).profile.concepts;
      }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
