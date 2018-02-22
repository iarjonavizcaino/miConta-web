import { Api } from './api';
import { Injectable } from '@angular/core';

@Injectable()
export class TaxesProvider {

    private base = 'taxes/';

    constructor(private api: Api) { }

    getISR(_id: string, year: number, bimester: number) {
        return this.api.get(this.base + 'isr/' + _id + '/year/' + year + '/bimester/' + bimester);
    }

}// class

