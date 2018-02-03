import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountantProvider {

  base = 'accountant/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(accountant: any) {
    return this.api.post(`${this.base}`, accountant);
  }

  update(accountant: any) {
    return this.api.put(`${this.base}${accountant._id}`, accountant);
  }

  addTaxpayer(taxpayer: any, accountant: string) {
    return this.api.put(`${this.base}addAccountant/${accountant}`, { taxpayer });
  }

  removeTaxpayer(taxpayer: any, accountant: string) {
    return this.api.put(`${this.base}removeAccountant/${accountant}`, { taxpayer });
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
