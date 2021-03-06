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
import { PlazasAgregarEditarComponent } from '../../plazas-mercado/plazas-agregar-editar/plazas-agregar-editar.component';
import { TablaRolesComponent } from '../../usuarios-roles/tabla-roles/tabla-roles.component';
import { RolesAgregarEditarComponent } from '../../usuarios-roles/roles-agregar-editar/roles-agregar-editar.component';
import { DialogConfirmacionRol } from '../../usuarios-roles/tabla-roles/dialogRol.confirm.component';
import { TipoSectorComponent } from '../../tipos/tipo-sector/tipo-sector.component';
import { DialogConfirmacionPlaza } from '../../plazas-mercado/dialogPlaza.confirm.component';
import { DialogConfirmacionTipos } from '../../tipos/dialogTipo.confirm.component';
import { ZonasComponent } from '../../zonas/zonas.component';
import { SectoresComponent } from '../../sectores/sectores.component';
import { ParqueaderoComponent } from '../../parqueaderos/parqueadero/parqueadero.component';
import { GenericComponent } from '../../generic/generic.component';
import { GenericAgregarEditarComponent } from '../../generic/generic-agregar-editar/generic-agregar-editar.component';
import { TablaGenericComponent } from '../../generic/tabla-generic/tabla-generic.component';
import { ArrayOne } from '../../generic/tabla-generic/arrayone.pipe';
import { PuestosComponent } from '../../puestos/puestos.component';
import { PuertasComponent } from '../../puertas/puertas.component';
import { DialogConfirmacionGenericComponent } from '../../generic/tabla-generic/dialog.confirmgeneric.component';
import { EspecieAnimalComponent } from '../../especie-animal/especie-animal.component';
import { ConfiguracionComponent } from '../../configuracion/configuracion.component';
import { EquiposComponent } from '../../equipos/equipos.component';
import { EquiposAgregarEditarComponent } from '../../equipos/equipos-agregar-editar/equipos-agregar-editar.component';
import { DialogRegistroEquipo } from '../../login/dialogo-registro-equipo/registroequipo.dialog';
import { ReporteDinamicoComponent } from '../../reporte-dinamico/reporte-dinamico.component';
import { TablaTarifasDinamicaComponent } from '../../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';
import { TarifaanimalComponent } from '../../tarifaanimal/tarifaanimal.component';
import { TarifasComponent } from '../../tarifas/tarifas.component';
import { TarifaInteresComponent } from '../../tarifas/tarifaInteres/tarifainteres.component';
import { DatosPipe } from '../../servicios/pipes/pipedatostabla.pipe';




import { TarifaPuestoEventualComponent } from '../../tarifas/tarifapuestoeventual/tarifapuestoeventual.component';
import { TarifavehiculoComponent } from '../../tarifas/tarifavehiculo/tarifavehiculo.component';
import { RecaudoAnimalComponent } from '../../recaudo-animal/recaudo-animal.component';
import { TarifaPuestoComponent } from '../../tarifas/tarifaPuesto/tarifapuesto.component';



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
    PlazasAgregarEditarComponent,
    TablaRolesComponent,
    RolesAgregarEditarComponent,
    DialogConfirmacionRol,
    TipoSectorComponent,
    DialogConfirmacionPlaza,
    DialogConfirmacionTipos,
    ZonasComponent,
    SectoresComponent,
    ParqueaderoComponent,
    GenericComponent,
    GenericAgregarEditarComponent,
    TablaGenericComponent,
    ArrayOne,
    DatosPipe,
    PuestosComponent,
    PuertasComponent,
    DialogConfirmacionGenericComponent,
    EspecieAnimalComponent,
    ConfiguracionComponent,
    EquiposComponent,
    EquiposAgregarEditarComponent,
    ReporteDinamicoComponent,
    TablaTarifasDinamicaComponent,
    TarifaanimalComponent,
    TarifasComponent,
    TarifaInteresComponent,
    TarifaPuestoEventualComponent,
    TarifavehiculoComponent,
    RecaudoAnimalComponent,
    TarifaPuestoComponent

  ],
  entryComponents: [
    DialogConfirmacionComponent,
    DialogConfirmacionRol,
    DialogConfirmacionPlaza,
    DialogConfirmacionTipos,
    DialogConfirmacionGenericComponent,
  ],
})

export class AdminLayoutModule { }
