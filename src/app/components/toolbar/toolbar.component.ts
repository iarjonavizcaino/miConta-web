import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/services'; //AuthService
import { Observable } from 'rxjs/Observable';
// import { InputOutputMoneyCatalogComponent } from '../../pages/_catalog/input-output-money/input-output-money-catalog.component';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../services/auth.serv';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  user$: Observable<any>;
  role: string;
  // tslint:disable-next-line:no-output-rename
  @Output('menu') menuEmitter = new EventEmitter();

  constructor(
    private auth: AuthService,
    private router: Router,
    private session: SessionService,
    private dialogCtrl: MatDialog,
  ) {
    this.user$ = this.session.user;
    this.user$.subscribe(data => {
      if (data) {
        this.role = data.role._id;
      }
    });
  }

  onMenu() {
    this.menuEmitter.emit();
  }
/*
  inputOutputMoney() {
    this.inputOutputModal();
  }
*/
  /*inputOutputModal() {
    return this.dialogCtrl.open(InputOutputMoneyCatalogComponent, {
      disableClose: false
    });
  }*/

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
