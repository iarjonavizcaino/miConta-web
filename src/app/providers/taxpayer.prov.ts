import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class TaxpayerProvider {

  base = 'taxpayer/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  getById(_id: string) {
    return this.api.get(`${this.base}${_id}`);
  }

  create(taxpayer: any) {
    return this.api.post(`${this.base}`, taxpayer);
  }

  update(taxpayer: any) {
    return this.api.put(`${this.base}${taxpayer._id}`, taxpayer);
  }

  updatePassword(taxpayer: any) {
    return this.api.put(`${this.base}password/${taxpayer._id}`, taxpayer);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
