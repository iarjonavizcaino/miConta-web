import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss']
})
export class LimitesComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute) { }
  sub: any;
  contribuyente: any;

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
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
