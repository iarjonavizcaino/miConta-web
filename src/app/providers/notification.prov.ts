import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationProvider {

  base = 'notification/';

  constructor(private api: Api) { }

  getAll() {
    return this.api.get(`${this.base}`);
  }

  create(notification: any) {
    return this.api.post(`${this.base}`, notification);
  }

  update(notification: any) {
    return this.api.put(`${this.base}${notification._id}`, notification);
  }

  delete(id: string) {
    return this.api.delete(`${this.base}${id}`);
  }

}
