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

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.scss']
})

export class UploadXmlComponent implements OnInit {
  xml = false;
  title: string;
  // fastXmlParser = fastXmlParser;
  // xmlData = xmlData;
  files = [];
  constructor(
    private dialogRef: MatDialogRef<UploadXmlComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
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
    this.xml = true;
    const xml_str = ev[1].files.file; // XML text
    console.log(xml_str);
    // parse to json
    this.files.push('json info');
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
