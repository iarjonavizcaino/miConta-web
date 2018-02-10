
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Employee } from '../types/types';

@Injectable()
export class SessionService {
    private _user = new Subject<Employee>();
    private _token: string;

    save(user: Employee, token: string) {
        this._token = token;
        this._user.next(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    remove() {
        this._token = null;
        this._user.next(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    check(): boolean {
        const user = localStorage.getItem('user');
        if (user) {
            this._token = localStorage.getItem('token');

            setTimeout(_ => { this._user.next(JSON.parse(user)); }, 100);

            return true;
        }
        this._user.next(null);
        return false;
    }

    checkRole(role: any) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (role.length === 1) {
            if (user === null || (user.role._id !== role[0])) {
                return false;
            }
        } else if (role.length === 2) {
            if (user === null || ((user.role._id !== role[0]) && (user.role._id !== role[1]))) {
                return false;
            }
        } else {
            if (user === null || ((user.role._id !== role[0]) && (user.role._id !== role[1]) && (user.role._id !== role[2]))) {
                return false;
            }
        }
        console.log(4);
        return true;
    }

    get user(): Observable<Employee> {
        return this._user.asObservable();
    }

    get token(): string {
        return this._token;
    }
}
