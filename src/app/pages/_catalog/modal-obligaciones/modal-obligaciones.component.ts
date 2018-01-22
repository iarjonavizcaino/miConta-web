import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal-obligaciones',
  templateUrl: './modal-obligaciones.component.html',
  styleUrls: ['./modal-obligaciones.component.scss']
})
export class ModalObligacionesComponent implements OnInit {
  title: string;
  obligation: any;
  constructor(
    private dialogCtrl: MatDialog,
    private dialogRef: MatDialogRef<ModalObligacionesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title || 'Título del modal';
    console.log(this.data);
    if (this.data.obligation) {  // data: info from table
      this.obligation = this.data.obligation;
    } else {
      this.obligation = {
        _id: '200',
        type: '',
        description: ''
      };
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close(this.obligation);
  }
}// class
