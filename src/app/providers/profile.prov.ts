import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileProvider {

  base = 'profile/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(profile: any) {
    return this.api.post(`${this.base}`, profile);
  }

  update(profile: any) {
    return this.api.put(`${this.base}${profile._id}`, profile);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
