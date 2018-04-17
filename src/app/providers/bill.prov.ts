import { Api } from './api';
import { Injectable } from '@angular/core';
import { config } from '../app.config';

@Injectable()
export class BillProvider {
    private base = 'bill/';

    constructor(private api: Api) { }

    getAll() {
        return this.api.get(this.base);
    }
    getById(_id: string) {
        return this.api.get(this.base + _id);
    }
    getByTaxPayer(_id: string, filter: any) {
        // tslint:disable-next-line:max-line-length
        return this.api.get(this.base + 'taxpayer/' + _id + '/year/' + filter.year + '/bimester/' + filter.bimester + '/active/' + filter.active);
    }
    create(bill: any) {
        return this.api.post(this.base, bill);
    }
    update(_id: string, bill: any) {
        return this.api.put(this.base + _id, bill);
    }
    delete(_id: string) {
        return this.api.delete(this.base + _id);
    }

    generateBill(_id: string) {
        const url = config.api.prod;
        window.open(`${url}${this.base}bill/${_id}`);
      }
}// class
