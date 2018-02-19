import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ConceptProvider } from '../../../providers/providers';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss']
})
export class LimitesComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private conceptProv: ConceptProvider,
  ) { }
  sub: any;
  contribuyente: any;
  limits = [];
  user = JSON.parse(localStorage.getItem('user'));

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // console.log('params', params);
        // tslint:disable-next-line:triple-equals
        if (params.name) {
          this.contribuyente = params.name;
        }
      });
    if (this.user.role.name !== 'Contribuyente') {
      const tax = JSON.parse(localStorage.getItem('taxpayer'));
      this.getLimits(tax._id, tax.profile.concepts);
    } else {
      this.getLimits(this.user._id, this.user.profile.concepts);
      // this.limits = JSON.parse(localStorage.getItem('user')).profile.concepts;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getLimits(_id: string, concepts: any) {
    console.log(concepts);
    this.conceptProv.getByTaxpayer(this.user._id, { 'concepts': concepts }).subscribe(res => {
      this.limits = res.data;
      console.log('response limits', res);
    }, err => {
      console.log(err);
    });
  }
}// class
