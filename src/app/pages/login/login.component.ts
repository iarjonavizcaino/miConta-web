import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../services/session.serv';
import { Employee } from '../../types/employee.type';
import { AuthService } from '../../services/services';

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

  constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, private session: SessionService) {
    this.loginForm = fb.group({
      username: ['superadmin', Validators.required],
      password: ['superadmin', Validators.required]
    });
  }

  ngOnInit() {
  }

  onLogin() {
    let emp: Employee;
    let root = '';
    switch (this.loginForm.get('username').value) {
      case 'contribuyente':
        emp = {
          name: 'Juan Antonio Rojas Hernández',
          role: {
            name: 'contribuyente'
          }
        };
        root = '/contribuyente/inicio';
        break;
      case 'contador':
        emp = {
          name: 'Ernesto Lago',
          role: {
            name: 'contador'
          }
        };
        root = '/contador/incio';
        break;
      case 'despacho':
        emp = {
          name: 'Andrea Ramírez',
          role: {
            name: 'despacho'
          }
        };
        root = 'despacho/inicio';
        break;
      case 'superadmin':
      emp = {
        name: 'Jaime Maussan',
        role: {
          name: 'superadmin'
        }
      };
      root = 'superadmin/inicio';
    }
    this.auth.loginSuccess(emp, '');
    this.router.navigate([root]);
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      if (this.loginForm.valid) {
        this.onLogin();
      }
    }
  }

}// class
