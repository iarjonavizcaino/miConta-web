import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class ConceptProvider {

  base = 'concept/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(concept: any) {
    return this.api.post(`${this.base}`, concept);
  }

  update(concept: any) {
    return this.api.put(`${this.base}${concept._id}`, concept);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
