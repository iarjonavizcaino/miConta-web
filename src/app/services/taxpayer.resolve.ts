import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TaxpayerProvider } from '../providers/providers';

@Injectable()
export class TaxpayerResolve implements Resolve<any> {
    constructor(private taxpayerProv: TaxpayerProvider, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Promise<any> | boolean {
        // const id = route.params['id'];
        return this.taxpayerProv.getById('5a750621f7eac811f341eecd').toPromise().then(data => {
            if (data) {
                return data.taxpayer;
            } else {
                return false;
            }
        });
    }
}
