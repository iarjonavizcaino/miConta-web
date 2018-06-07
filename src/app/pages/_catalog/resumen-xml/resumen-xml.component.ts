import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-resumen-xml',
  templateUrl: './resumen-xml.component.html',
  styleUrls: ['./resumen-xml.component.scss']
})
export class ResumenXmlComponent implements OnInit {
  title: '';
  billSuccessfully = [];
  billsWithErrors = [];
  constructor(
    private dialogRef: MatDialogRef<ResumenXmlComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit() {
    if (!this.data) { return; }
    this.title = this.data.title;
    this.billSuccessfully = this.data.bills.billSuccessfully;
    this.billsWithErrors = this.data.bills.billsWithErrors;
  }

  onClose() {
    this.dialogRef.close();
  }

} // class
