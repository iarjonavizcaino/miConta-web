import { Api } from './api';
import { Injectable } from '@angular/core';

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
        return this.api.get(this.base + 'taxpayer/' + _id + '/year/' + filter.year + '/bimester/' + filter.bimester);
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
}// class
