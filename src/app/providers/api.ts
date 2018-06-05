import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { config } from '../app.config';
import { SessionService } from '../services/session.serv';

// import { UserService } from '../services/user.service';


@Injectable()
export class Api {
  url = config.api.test;
  headers: Headers = new Headers();

  constructor(
    private http: Http,
    private session: SessionService
  ) {
    this.headers.append('Content-Type', 'application/json');
    // this.headers.append('Authorization', `Bearer ${session.token}`);
  }

  get(endpoint: string, params?: any) {
    // this.headers.set('Authorization', `Bearer ${this.session.token}`);
    const options = new RequestOptions({ headers: this.headers });
    // Support easy query params for GET requests
    if (params) {
      const p = new URLSearchParams();

      // tslint:disable-next-line:forin
      for (const k in params) {
        p.set(k, params[k]);
      }

      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }
    console.log(this.url + endpoint);
    return this.http.get(this.url + endpoint, options)
      .do(this.log)
      .map(this._toJson);
  }

  post(endpoint: string, body: any) {
    // this.headers.set('Authorization', `Bearer ${this.session.token}`);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.url + endpoint, body, options)
      .do(this.log)
      .map(this._toJson);
  }

  put(endpoint: string, body: any) {
    // this.headers.set('Authorization', `Bearer ${this.session.token}`);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.put(this.url + endpoint, body, options)
      .do(this.log)
      .map(this._toJson);
  }

  delete(endpoint: string) {
    // this.headers.set('Authorization', `Bearer ${this.session.token}`);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.delete(this.url + endpoint, options)
      .do(this.log)
      .map(this._toJson);
  }

  patch(endpoint: string, body: any) {
    // this.headers.set('Authorization', `Bearer ${this.session.token}`);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.put(this.url + endpoint, body, options)
      .do(this.log)
      .map(this._toJson);
  }

  private _toJson(res) {
    return res.json();
  }

  private log(res: any) {
    console.log(res);
  }
}
