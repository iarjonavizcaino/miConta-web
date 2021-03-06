import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class OfficeProvider {

  base = 'office/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  getById(_id: string) {
    return this.api.get(`${this.base}${_id}`);
  }

  getAccountants(_id: string) {
    return this.api.get(`${this.base}accountant/${_id}`);
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

  updateMicroRif(id: string) {
    return this.api.put(`${this.base}microRif/${id}`, '');
  }

}
