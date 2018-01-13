import { Role } from './types';

export interface Employee {
    _id?: string;
    name?: string;
    age?: string;
    address?: Address;
    birthdate?: string;
    admissionDate?: string;
    phone?: string;
    account?: Account;
    role?: Role;
    active?: boolean;
}

export interface Account {
    user?: string;
    password?: string;
    email?: string;
}

export interface Address {
    city?: string;
    neighborhood?: string;
    number?: string;
    zipcode?: string;
    state?: string;
    street?: string;
}
