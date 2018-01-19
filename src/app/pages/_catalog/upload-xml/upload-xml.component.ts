import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.scss']
})
export class UploadXmlComponent implements OnInit {
  xml: any;
  title: string;
  constructor(
    private dialogRef: MatDialogRef<UploadXmlComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title;
  }

  onSave() {
    this.dialogRef.close(this.xml);
  }

  onClose() {
    this.dialogRef.close();
  }

  onFile(ev) {
    this.xml = ev.target.files[0];
  }

}
