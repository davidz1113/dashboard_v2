import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { TareasComponent } from '../../tareas/tareas.component'
import { UsuariosRolesComponent } from '../../usuarios-roles/usuarios-roles.component';
import { TablaUsuariosComponent } from '../../usuarios-roles/tabla-usuarios/tabla-usuarios.component';



import { SortingEmployeesPipe } from 'app/tareas/ordenamiento.pipe';
import { TablaPaginadaComponent } from '../../tabla-paginada/tabla-paginada.component';
import { MaterialModules } from '../../material.modules';
import { UserAgregarEditarComponent } from '../../usuarios-roles/user-agregar-editar/user-agregar-editar.component';
import { DialogConfirmacionComponent } from '../../usuarios-roles/tabla-usuarios/dialog.confirm.component';
import { PlazasMercadoComponent } from '../../plazas-mercado/plazas-mercado.component';
import { TablaPlazasMercadoComponent } from '../../plazas-mercado/tabla-plazas-mercado/tabla-plazas-mercado.component';
import { PlazasAgregarEditarComponent } from '../../plazas-mercado/plazas-agregar-editar/plazas-agregar-editar.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MaterialModules,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    TareasComponent,
    SortingEmployeesPipe,
    TablaPaginadaComponent,
    UsuariosRolesComponent,
    TablaUsuariosComponent,   
    UserAgregarEditarComponent,
    DialogConfirmacionComponent,
    PlazasMercadoComponent,
    TablaPlazasMercadoComponent,
    PlazasAgregarEditarComponent

  ],
  entryComponents: [
    DialogConfirmacionComponent
  ],
})

export class AdminLayoutModule { }
