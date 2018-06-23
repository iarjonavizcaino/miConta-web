import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class CredentialsProvider {

    private base = 'credential/';

    constructor(private api: Api) { }

    create(credential: any) {
        return this.api.post(`${this.base}`, credential);
    }

    update(credential: any) {
        return this.api.put(`${this.base}`, credential);
    }

    delete(credential: any) {
        return this.api.post(this.base + 'delete', credential);
    }
}
