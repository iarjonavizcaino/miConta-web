import { Api } from './api';
import { Injectable } from '@angular/core';
import { storage } from 'firebase';

@Injectable()
export class FirebaseProvider {

    constructor() { }

    uploadFile(folder: string, name: string, extension: string, file: any) {
        const fileName = name + '.' + extension;
        const storageRef = storage().ref(folder + fileName);
        return storageRef.put(file);
    }

}
