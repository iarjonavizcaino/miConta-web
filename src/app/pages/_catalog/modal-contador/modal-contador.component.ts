import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalAsignarContribComponent } from '../modal-asignar-contrib/modal-asignar-contrib.component';

@Component({
  selector: 'app-modal-contador',
  templateUrl: './modal-contador.component.html',
  styleUrls: ['./modal-contador.component.scss']
})
export class ModalContadorComponent implements OnInit {

  title: string;
  accountant: any = {
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      zipcode: '',
      city: '',
      state: '',
      municipality: ''
    }
  };
  constructor(
    private dialogRef: MatDialogRef<ModalContadorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.loadData();
  }
  onSave() {
    this.dialogRef.close(this.accountant); // send data
  }
  onClose() {
    this.dialogRef.close();
  }
  private loadData() {
    this.title = this.data.title;
    if (this.data.accountant) {
      this.accountant = this.data.accountant;
      console.log(this.data);
    }
  }

}
