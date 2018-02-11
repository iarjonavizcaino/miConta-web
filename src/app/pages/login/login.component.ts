import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../services/session.serv';
import { Employee } from '../../types/employee.type';
import { AuthService } from '../../services/services';
import { RoleProvider } from '../../providers/providers';
import { Credentials } from '../../types/types';

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
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private session: SessionService,
    private roleProv: RoleProvider,
  ) {
    this.loginForm = fb.group({
      role: ['superadmin', Validators.required],
      username: ['manuel', Validators.required],
      password: ['12345', Validators.required]
    });
  }

  ngOnInit() {
    this.roleProv.getAll().subscribe(data => {
      this.roles = data.roles;
    });
  }

  onLogin() {

    this.isSubmited = true;
    this.isLoginWrong = false;
    if (this.loginForm.invalid) { return; }

    const credentials: Credentials = this.loginForm.value;
    switch (this.selectedRole) {
      case '5a728f50b15f741695e35c97': // contador
        this.auth.loginAccountant(credentials).subscribe(user => {
          console.log('contador', user);
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
      case '5a728f4bb15f741695e35c96': // contribuyente
        this.auth.loginTaxpayer(credentials).subscribe(user => {
          console.log('contribuyente', user);
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
      case '5a728f43b15f741695e35c95': // despacho
        this.auth.loginOffice(credentials).subscribe(user => {
          console.log('despacho', user);
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
      case '5a728f56b15f741695e35c98': // superadmin
        this.auth.loginSuperadmin(credentials).subscribe(user => {
          console.log('superadmin', user);
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
    }
    // let emp: Employee;
    // let root = '';
    // switch (this.loginForm.get('username').value) {
    //   case 'contribuyente':
    //     emp = {
    //       name: 'Juan Antonio Rojas Hernández',
    //       role: {
    //         name: 'contribuyente'
    //       }
    //     };
    //     root = '/contribuyente/inicio';
    //     break;
    //   case 'contador':
    //     emp = {
    //       name: 'Ernesto Lago',
    //       role: {
    //         name: 'contador'
    //       }
    //     };
    //     root = '/contador/inicio';
    //     break;
    //   case 'despacho':
    //     emp = {
    //       name: 'Andrea Ramírez',
    //       role: {
    //         name: 'despacho'
    //       }
    //     };
    //     root = 'despacho/inicio';
    //     break;
    //   case 'superadmin':
    //     emp = {
    //       name: 'Jaime Maussan',
    //       role: {
    //         name: 'superadmin'
    //       }
    //     };
    //     root = 'superadmin/inicio';
    // }
    localStorage.removeItem('users');
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      if (this.loginForm.valid) {
        this.onLogin();
      }
    }
  }

}// class
