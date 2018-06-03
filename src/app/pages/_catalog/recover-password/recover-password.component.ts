import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SendMailProvider } from '../../../providers/providers';

const EMAIL_REGEX = /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  recoverForm: FormGroup;
  email: string;
  messages = {
    status: false,
    title: '',
    body: ''
  };
  constructor(
    private sendMailProv: SendMailProvider,
    private dialogRef: MatDialogRef<RecoverPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
  ) {

    this.recoverForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
    });
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    // this.dialogRef.close(this.email);
    this.sendMailProv.send({ email: this.email }).subscribe(res => {
      this.messages.status = true;
      this.messages.title = 'Acción Exitosa!';
      this.messages.body = 'El mensaje se envió correctamente. Revisa tu correo.';
    }, err => {
      console.log(err);
      this.messages.status = false;
      this.messages.title = 'Atención!';
      this.messages.body = 'No hay usuarios registrados con el email: ';
    });
  } // onSave

} // class
