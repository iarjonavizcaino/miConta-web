import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../services/session.serv';
import { Employee } from '../../types/employee.type';
import { AuthService } from '../../services/services';
import { RoleProvider } from '../../providers/providers';
import { Credentials } from '../../types/types';
import { _roles } from '../../services/global';
import { RecoverPasswordComponent } from '../_catalog/recover-password/recover-password.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoginWrong: boolean;
  isSubmited: boolean;
  message: string;
  loginForm: FormGroup;
  noConnection: boolean;

  roles = [];
  selectedRole: any;

  constructor(
    private dialogCtrl: MatDialog,
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private session: SessionService,
    private roleProv: RoleProvider,
  ) {
    this.loginForm = fb.group({
      role: ['superadmin', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.roleProv.getAll().subscribe(data => {
      this.roles = data.roles;
    });
  }

  recoverPassword() {
    const dialogRef = this.dialogCtrl.open(RecoverPasswordComponent, {
      disableClose: true,
    });
  } // recoverPassword()

  onLogin() {

    this.isSubmited = true;
    this.isLoginWrong = false;
    if (this.loginForm.invalid) { return; }

    const credentials: Credentials = this.loginForm.value;
    this.auth.firstLogin(credentials).subscribe(res => {
      console.log(res);
      localStorage.setItem('credentialId', res.credential);
      this.selectedRole = res.role;
      this.myGodWhatAreYouDone(credentials);
      localStorage.removeItem('users');
    }, err => {
      if (err.status === 0) {
        this.noConnection = true;
        return;
      }
      const error = JSON.parse(err._body);
      this.isLoginWrong = true;
      this.message = error.detail;
    });
  } // onLogin()

  private myGodWhatAreYouDone(credentials: Credentials) {
    switch (this.selectedRole) {
      case _roles.accountant_prod: // contador
        this.auth.loginAccountant(credentials).subscribe(user => {
          this.isLoginWrong = !user.token;
          if (!this.isLoginWrong) {
            this.auth.loginSuccess(user.userInfo, user.token);
            this.router.navigate(['/contador/inicio']);
          }
        }, err => {
          if (err.status === 0) {
            this.noConnection = true;
            return;
          }
          const error = JSON.parse(err._body);
          this.isLoginWrong = true;
          this.message = error.detail;
        });
        break;
      case _roles.taxpayer_prod: // contribuyente
        this.auth.loginTaxpayer(credentials).subscribe(user => {
          this.isLoginWrong = !user.token;
          if (!this.isLoginWrong) {
            this.auth.loginSuccess(user.userInfo, user.token);
            this.router.navigate(['/contribuyente/inicio']);
          }
        }, err => {
          if (err.status === 0) {
            this.noConnection = true;
            return;
          }
          const error = JSON.parse(err._body);
          this.isLoginWrong = true;
          this.message = error.detail;
        });
        break;
      case _roles.offices_prod: // despacho
        this.auth.loginOffice(credentials).subscribe(user => {
          this.isLoginWrong = !user.token;
          if (!this.isLoginWrong) {
            this.auth.loginSuccess(user.userInfo, user.token);
            this.router.navigate(['/despacho/inicio']);
          }
        }, err => {
          if (err.status === 0) {
            this.noConnection = true;
            return;
          }
          const error = JSON.parse(err._body);
          this.isLoginWrong = true;
          this.message = error.detail;
        });
        break;
      case _roles.superadmin_prod: // superadmin
        this.auth.loginSuperadmin(credentials).subscribe(user => {
          this.isLoginWrong = !user.token;
          if (!this.isLoginWrong) {
            this.auth.loginSuccess(user.userInfo, user.token);
            this.router.navigate(['/superadmin/inicio']);
          }
        }, err => {
          if (err.status === 0) {
            this.noConnection = true;
            return;
          }
          const error = JSON.parse(err._body);
          this.isLoginWrong = true;
          this.message = error.detail;
        });
        break;
    } // switch
  } // myGodWhatAreYouDone()

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      if (this.loginForm.valid) {
        this.onLogin();
      }
    }
  }

}// class
