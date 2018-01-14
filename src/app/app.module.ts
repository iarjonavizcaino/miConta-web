import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SessionService, AuthService } from './services/services';

//  Angular Material
import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatDialogModule,
  MatInputModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatCardModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatRadioModule,
  MatProgressBarModule,
} from '@angular/material';

//  Types
import { Credentials, Employee, Role } from './types/types';
// Pages
import { LoginComponent } from './pages/login/login.component';
import { MisDatosComponent } from './pages/mis-datos/mis-datos.component';
import { ObligacionesComponent } from './pages/obligaciones/obligaciones.component';
import { LimitesComponent } from './pages/limites/limites.component';
import { NotificacionesContribuyenteComponent } from './pages/notificaciones-contribuyente/notificaciones-contribuyente.component';
import { CrudContribuyentesComponent } from './pages/crud-contribuyentes/crud-contribuyentes.component';

// Components
import { RtDatatableComponent } from './components/rt-datatable/rt-datatable.component';
import { RtSearchbarComponent } from './components/rt-searchbar/rt-searchbar.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { AlertComponent } from './components/alert/alert.component';

import { SimpleNotificationsModule } from 'angular2-notifications';

//  Angular Animatios
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  Angular Router
import { RouterModule, Routes } from '@angular/router';

//  Angular Http
import { HttpModule } from '@angular/http';

//  Angular Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './pages/inicio/inicio.component';
import { importType } from '@angular/compiler/src/output/output_ast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InicioContadorComponent } from './pages/inicio-contador/inicio-contador.component';
import { ImpuestosComponent } from './pages/impuestos/impuestos.component';
import { EgresosComponent } from './pages/egresos/egresos.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';

// App catalog
import { BillingCatalogComponent } from './pages/_catalog/billing-catalog/billing-catalog.component';
import { ShowMessageCatalogComponent } from './pages/_catalog/show-message-catalog/show-message-catalog.component';
import { ModalCrearContribuyenteComponent } from './pages/_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { ResumenContribuyenteComponent } from './pages/resumen-contribuyente/resumen-contribuyente.component';


// all routes pages
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'inicioContador', component: InicioContadorComponent },
  { path: 'resumenContribuyente', component: ResumenContribuyenteComponent },
  { path: 'impuestos', component: ImpuestosComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'egresos', component: EgresosComponent },
  { path: 'misDatos', component: MisDatosComponent },
  { path: 'obligaciones', component: ObligacionesComponent },
  { path: 'limites', component: LimitesComponent },
  { path: 'notificaciones', component: NotificacionesContribuyenteComponent },
  { path: 'contribuyentes', component: CrudContribuyentesComponent }
];

@NgModule({
  entryComponents: [
    AlertComponent,
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent
  ],
  declarations: [
    AppComponent,
    // cataloges
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,

    // components
    AlertComponent,
    SidemenuComponent,
    RtDatatableComponent,
    RtSearchbarComponent,
    PaginatorComponent,
    ToolbarComponent,
    // pages
    LoginComponent,
    InicioComponent,
    InicioContadorComponent,
    ImpuestosComponent,
    EgresosComponent,
    IngresosComponent,
    MisDatosComponent,
    ObligacionesComponent,
    LimitesComponent,
    NotificacionesContribuyenteComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,
    CrudContribuyentesComponent,
    ModalCrearContribuyenteComponent,
    ResumenContribuyenteComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SimpleNotificationsModule.forRoot(),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,

    //  Material Modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressBarModule
  ],
  providers: [
    //  Services
    /*UserService,
    InputResolve,
    TransferResolve,
    OutputResolve,
    KardexResolve,
    SalesResolve,
    SaleResolve,
    RoleGuard,
    AuthGuard,*/
    SessionService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
