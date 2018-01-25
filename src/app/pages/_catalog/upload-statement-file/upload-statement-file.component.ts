import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upload-statement-file',
  templateUrl: './upload-statement-file.component.html',
  styleUrls: ['./upload-statement-file.component.scss']
})
export class UploadStatementFileComponent implements OnInit {
    // TODO: change variable names
    file1: any;
    file2: any;

    title: string;

  constructor(
    private dialogRef: MatDialogRef<UploadStatementFileComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title;
  }

  onFile1(ev) {
    this.file1 = ev.target.files[0];
  }

  onFile2(ev) {
    this.file2 = ev.target.files[0];
  }

  onSave() {
    const files = {file1: this.file1, file2: this.file2};
    this.dialogRef.close(files);
  }

  onClose() {
    this.dialogRef.close();
  }

  key(ev: any) {
    if (ev.keyCode === 13) {
      this.onSave();
    }
  }
}
