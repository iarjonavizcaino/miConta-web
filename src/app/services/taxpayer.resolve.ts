import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TaxpayerProvider } from '../providers/providers';

@Injectable()
export class TaxpayerResolve implements Resolve<any> {

    role = JSON.parse(localStorage.getItem('user')).role.name;
    currentTaxpayer: string;
    constructor(private taxpayerProv: TaxpayerProvider, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Promise<any> | boolean {
        // const id = route.params['id'];
        if (this.role !== 'Taxpayer' ) {
            this.currentTaxpayer = JSON.parse(localStorage.getItem('taxpayer'))._id;
          } else {
            this.currentTaxpayer = JSON.parse(localStorage.getItem('user'))._id;
          }
        return this.taxpayerProv.getById(this.currentTaxpayer).toPromise().then(data => {
            if (data) {
                return data.taxpayer;
            } else {
                return false;
            }
        });
    }
}
