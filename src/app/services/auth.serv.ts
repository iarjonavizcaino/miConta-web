import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Credentials, Employee } from '../types/types';
// import { Api } from '../providers/api';
// import { CutProvider, StoreProvider, SaleProvider, CompanyProvider } from '../providers/providers';
import { SessionService } from './session.serv';
import { locales } from 'moment';
import { Api } from '../providers/api';

@Injectable()
export class AuthService {

  private _user = new Subject<any>();
  private _token: string;

  constructor(
    public api: Api,
    /*private storeProv: StoreProvider,
    private companyProv: CompanyProvider,
    private cutProv: CutProvider,
    private saleProv: SaleProvider,*/
    private sessionServ: SessionService
  ) { }

  loginAccountant(cred: Credentials): Observable<any> {
    return this.api.post('login/accountant/', cred);
  }

  loginOffice(cred: Credentials): Observable<any> {
    return this.api.post('login/office/', cred);
  }

  loginTaxpayer(cred: Credentials): Observable<any> {
    return this.api.post('login/taxpayer/', cred);
  }

  loginSuperadmin(cred: Credentials): Observable<any> {
    return this.api.post('login/superadmin/', cred);
  }

  loginSuccess(user: Employee, token: string) {
    this.sessionServ.save(user, token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.sessionServ.remove();
  }

  checkSession(): boolean {
    return this.sessionServ.check();
  }

  checkRole(role: any): boolean {
    return this.sessionServ.checkRole(role);
  }
}
