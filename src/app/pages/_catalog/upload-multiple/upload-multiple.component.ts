/**
 * dropzone
 * https://github.com/zefoy/ngx-dropzone-wrapper
 *
 * conver xml to json
 * https://github.com/NaturalIntelligence/fast-xml-parser
 *
 * xml parse
 * https://www.npmjs.com/package/xml-parse
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import * as fastXmlParser from 'fast-xml-parser';
// import * as xmlData from 'xml-parse';
import * as xml2json from 'xml-js';
import { ConceptProvider } from '../../../providers/providers';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-upload-multiple',
    templateUrl: './upload-multiple.component.html',
    styleUrls: ['./upload-multiple.component.scss']
})

export class UploadMultipleComponent implements OnInit {
    title: string;
    files = [];
    multipleFiles = false;    // upload files to enable save button

    customConfig: DropzoneConfigInterface = {
        // Change this to your upload POST address:
        url: 'https://httpbin.org/post',
        maxFilesize: 50,
        acceptedFiles: '.txt'
    };
    constructor(
        private dialogRef: MatDialogRef<UploadMultipleComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private conceptProv: ConceptProvider
    ) { }

    ngOnInit() {
        this.title = this.data.title;
    }

    onSave() {
        this.dialogRef.close(this.files);
    }

    onClose() {
        this.dialogRef.close();
    }

    onUploadSuccess(ev: any) {
        this.multipleFiles = true;
        this.files.push(ev[0]);
    }

    onUploadError(ev: any) {
        console.log('No puedes subir archivos de este tipo');
    }

    key(ev: any) {
        if (ev.keyCode === 13) {
            this.onSave();
        }
    }
}// class
