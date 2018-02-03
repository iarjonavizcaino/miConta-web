import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class OfficeProvider {

  base = 'office/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(office: any) {
    return this.api.post(`${this.base}`, office);
  }

  update(office: any) {
    return this.api.put(`${this.base}${office._id}`, office);
  }

  addAccountant(accountant: any, office: string) {
    return this.api.put(`${this.base}addAccountant/${office}`, { accountant });
  }

  removeAccountant(accountant: any, office: string) {
    return this.api.put(`${this.base}removeAccountant/${office}`, { accountant });
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
