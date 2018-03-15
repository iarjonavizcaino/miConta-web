import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class BitacoraProvider {

    private base = 'bitacora/';

    constructor(private api: Api) { }

    getByTaxpayer(_id: string) {
        return this.api.get(this.base + 'taxpayer/' + _id);
    }

}// class
