import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class ObligationProvider {

  base = 'obligation/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(obligation: any) {
    return this.api.post(`${this.base}`, obligation);
  }

  update(obligation: any) {
    return this.api.put(`${this.base}${obligation._id}`, obligation);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
