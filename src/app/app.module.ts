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
import { MisDatosComponent } from './pages/contribuyente/mis-datos/mis-datos.component';
import { ObligacionesComponent } from './pages/contribuyente/obligaciones/obligaciones.component';
import { LimitesComponent } from './pages/contribuyente/limites/limites.component';
import { NotificacionesContribuyenteComponent } from './pages/contribuyente/notificaciones/notificaciones-contribuyente.component';
import { CrudContribuyentesComponent } from './pages/contador/crud-contribuyentes/crud-contribuyentes.component';

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
import { InicioComponent } from './pages/contribuyente/inicio/inicio.component';
import { importType } from '@angular/compiler/src/output/output_ast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InicioContadorComponent } from './pages/contador/inicio/inicio-contador.component';
import { ImpuestosComponent } from './pages/contribuyente/impuestos/impuestos.component';
import { EgresosComponent } from './pages/contribuyente/egresos/egresos.component';
import { IngresosComponent } from './pages/contribuyente/ingresos/ingresos.component';
import { ResumenContribuyenteComponent } from './pages/contribuyente/resumen/resumen-contribuyente.component';

// App catalog
import { BillingCatalogComponent } from './pages/_catalog/billing-catalog/billing-catalog.component';
import { ShowMessageCatalogComponent } from './pages/_catalog/show-message-catalog/show-message-catalog.component';
import { ModalCrearContribuyenteComponent } from './pages/_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { NotificacionesComponent } from './pages/contador/notificaciones/notificaciones.component';
import { CrearNotificacionComponent } from './pages/_catalog/crear-notificacion/crear-notificacion.component';


// all routes pages
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // contribuyente routes
  { path: 'contribuyente/inicio', component: InicioComponent },
  { path: 'contribuyente/resumen', component: ResumenContribuyenteComponent },
  { path: 'contribuyente/impuestos', component: ImpuestosComponent },
  { path: 'contribuyente/ingresos', component: IngresosComponent },
  { path: 'contribuyente/egresos', component: EgresosComponent },
  { path: 'contribuyente/misDatos', component: MisDatosComponent },
  { path: 'contribuyente/obligaciones', component: ObligacionesComponent },
  { path: 'contribuyente/limites', component: LimitesComponent },
  { path: 'contribuyente/notificaciones', component: NotificacionesContribuyenteComponent },
  // contador routes
  { path: 'contador/incio', component: InicioContadorComponent },
  { path: 'contador/contribuyentes', component: CrudContribuyentesComponent },
  { path: 'contador/notificaciones', component: NotificacionesComponent }
];

@NgModule({
  entryComponents: [
    AlertComponent,
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,
    CrearNotificacionComponent
  ],
  declarations: [
    AppComponent,
    // cataloges
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,
    CrearNotificacionComponent,

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
    ResumenContribuyenteComponent,
    NotificacionesComponent,
    CrearNotificacionComponent
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
