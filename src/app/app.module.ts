import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TareasComponent } from './tareas/tareas.component';

//importar el pipe
import { SortingEmployeesPipe} from './tareas/ordenamiento.pipe';
import { TablaPaginadaComponent } from './tabla-paginada/tabla-paginada.component';

import { LoginComponent } from './login/login.component'
import { MaterialModules } from './material.modules';


import "reflect-metadata";
import "es6-shim";
import { ExcepcionService } from './servicios/excepcionServices.services';
import { DialogRegistroEquipo } from './login/dialogo-registro-equipo/registroequipo.dialog';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    MaterialModules,
    ReactiveFormsModule

  ],
  

  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    DialogRegistroEquipo
  ],
  providers: [
  

  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogRegistroEquipo]

})
export class AppModule { }
