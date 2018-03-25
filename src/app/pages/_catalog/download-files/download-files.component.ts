import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as xml2json from 'xml-js';
import { ConceptProvider } from '../../../providers/providers';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-download-files',
    templateUrl: './download-files.component.html',
    styleUrls: ['./download-files.component.scss']
})

export class DownloadFilesComponent implements OnInit {
    title: string;
    files = [];
    currentTaxpayer: any;

    constructor(
        private dialogRef: MatDialogRef<DownloadFilesComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private conceptProv: ConceptProvider
    ) { }

    ngOnInit() {
        this.title = this.data.title;
        this.currentTaxpayer = this.data.taxpayer;
        this.files = this.data.files;
    }

    onClose() {
        this.dialogRef.close();
    }

}// class
