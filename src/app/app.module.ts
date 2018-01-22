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
import { InicioDespachoComponent } from './pages/despacho/inicio/inicio-despacho.component';
import { NotificacionesDespachoComponent } from './pages/despacho/notificaciones/notificaciones-despacho.component';
import { AsignarContribuyentesComponent } from './pages/despacho/asignar-contribuyentes/asignar-contribuyentes.component';

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

// Pages
import { InicioContadorComponent } from './pages/contador/inicio/inicio-contador.component';
import { ImpuestosComponent } from './pages/contribuyente/impuestos/impuestos.component';
import { EgresosComponent } from './pages/contribuyente/egresos/egresos.component';
import { IngresosComponent } from './pages/contribuyente/ingresos/ingresos.component';
import { ResumenContribuyenteComponent } from './pages/contribuyente/resumen/resumen-contribuyente.component';
import { InicioSuperadminComponent } from './pages/superadmin/inicio/inicio-superadmin.component';
import { DespachosComponent } from './pages/superadmin/despachos/despachos.component';
import { PerfilesComponent } from './pages/superadmin/perfiles/perfiles.component';
import { ConceptosComponent } from './pages/superadmin/conceptos/conceptos.component';
import { ObligacionesCrudComponent } from './pages/superadmin/obligaciones/obligaciones-crud.component';

// App catalog
import { BillingCatalogComponent } from './pages/_catalog/billing-catalog/billing-catalog.component';
import { ShowMessageCatalogComponent } from './pages/_catalog/show-message-catalog/show-message-catalog.component';
import { ModalCrearContribuyenteComponent } from './pages/_catalog/modal-crear-contribuyente/modal-crear-contribuyente.component';
import { NotificacionesComponent } from './pages/contador/notificaciones/notificaciones.component';
import { CrearNotificacionComponent } from './pages/_catalog/crear-notificacion/crear-notificacion.component';
import { ModalContadorComponent } from './pages/_catalog/modal-contador/modal-contador.component';
import { ModalAsignarContribComponent } from './pages/_catalog/modal-asignar-contrib/modal-asignar-contrib.component';
import { TaxpayerCatalogComponent } from './pages/_catalog/taxpayer-catalog/taxpayer-catalog.component';
import { ModalChangeStatusComponent } from './pages/_catalog/modal-change-status/modal-change-status.component';
import { UploadXmlComponent } from './pages/_catalog/upload-xml/upload-xml.component';
import { ModalNewStatementComponent } from './pages/_catalog/modal-new-statement/modal-new-statement.component';
import { UploadStatementFileComponent } from './pages/_catalog/upload-statement-file/upload-statement-file.component';
import { ModalObligacionesComponent } from './pages/_catalog/modal-obligaciones/modal-obligaciones.component';
import { ModalConceptosComponent } from './pages/_catalog/modal-conceptos/modal-conceptos.component';


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
  { path: 'contador/notificaciones', component: NotificacionesComponent },
  // despacho routes
  { path: 'despacho/inicio', component: InicioDespachoComponent },
  { path: 'despacho/notificaciones', component: NotificacionesDespachoComponent },
  { path: 'despacho/asignar', component: AsignarContribuyentesComponent },

  // superadmin
  { path: 'superadmin/inicio', component: InicioSuperadminComponent },
  { path: 'superadmin/despachos', component: DespachosComponent },
  { path: 'superadmin/perfiles', component: PerfilesComponent },
  { path: 'superadmin/conceptos', component: ConceptosComponent },
  { path: 'superadmin/obligaciones', component: ObligacionesCrudComponent },
];

@NgModule({
  entryComponents: [
    AlertComponent,
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,
    CrearNotificacionComponent,
    ModalContadorComponent,
    ConfirmComponent,
    ModalAsignarContribComponent,
    TaxpayerCatalogComponent,
    ModalChangeStatusComponent,
    UploadXmlComponent,
    UploadStatementFileComponent,
    ModalNewStatementComponent,
    ModalObligacionesComponent,
    ModalConceptosComponent
  ],
  declarations: [
    AppComponent,
    // cataloges
    BillingCatalogComponent,
    ShowMessageCatalogComponent,
    ModalCrearContribuyenteComponent,
    CrearNotificacionComponent,
    ModalContadorComponent,
    ModalAsignarContribComponent,
    TaxpayerCatalogComponent,
    ModalChangeStatusComponent,
    UploadXmlComponent,
    UploadStatementFileComponent,
    ModalNewStatementComponent,
    ModalObligacionesComponent,
    ModalConceptosComponent,

    // components
    AlertComponent,
    SidemenuComponent,
    RtDatatableComponent,
    RtSearchbarComponent,
    PaginatorComponent,
    ToolbarComponent,
    ConfirmComponent,
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
    CrudContribuyentesComponent,
    ResumenContribuyenteComponent,
    NotificacionesComponent,
    InicioDespachoComponent,
    NotificacionesDespachoComponent,
    AsignarContribuyentesComponent,
    ModalChangeStatusComponent,
    UploadXmlComponent,
    ModalNewStatementComponent,
    UploadStatementFileComponent,
    InicioSuperadminComponent,
    PerfilesComponent,
    DespachosComponent,
    ConceptosComponent,
    ObligacionesCrudComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SimpleNotificationsModule.forRoot(),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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
