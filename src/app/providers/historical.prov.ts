import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class HistoricalProvider {

  private base = 'historical/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  getActive(taxpayer: string) {
    return this.api.get(`${this.base}active/${taxpayer}`);
  }

  closePeriod (data: any, _id: string) {
    return this.api.put(`${this.base}closePeriod/${_id}`, data);
  }

  closeExercise (data: any, _id: string) {
    return this.api.put(`${this.base}closeExercise/${_id}`, data);
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
