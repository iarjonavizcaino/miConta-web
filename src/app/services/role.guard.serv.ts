import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.serv';


@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private authServ: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const currentRole = JSON.parse(localStorage.getItem('user')).role._id;
        const expectedRole = route.data.expectedRole;
        if (!this.authServ.checkRole(expectedRole)) {
            switch (currentRole) {
                case '5a728f50b15f741695e35c97': // contador
                    this.router.navigate(['/contador/inicio/']);
                    break;
                case '5a728f4bb15f741695e35c96': // contribuyente
                    this.router.navigate(['/contribuyente/inicio/']);
                    break;
                case '5a728f43b15f741695e35c95': // despacho
                    this.router.navigate(['/despacho/inicio/']);
                    break;
                case '5a728f56b15f741695e35c98': // superadmin
                    this.router.navigate(['/superadmin/inicio/']);
                    break;
            }
            return false;
        }
        return true;
    }
}
