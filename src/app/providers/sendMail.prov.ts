import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class SendMailProvider {

    private base = 'sendMail/';

    constructor(private api: Api) { }

    send(body) {
        return this.api.post(this.base, body);
    }

} // class

