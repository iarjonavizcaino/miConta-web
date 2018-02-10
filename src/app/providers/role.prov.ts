import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleProvider {

  base = 'role/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(role: any) {
    return this.api.post(`${this.base}`, role);
  }

  update(role: any) {
    return this.api.put(`${this.base}${role._id}`, role);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
