import { Routes, UrlSegmentGroup } from '@angular/router';

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
import { PlazasMercadoComponent } from '../../plazas-mercado/plazas-mercado.component';
import { TipoSectorComponent } from '../../tipos/tipo-sector/tipo-sector.component';
import { GLOBAL } from '../../servicios/globales';
import { ZonasComponent } from '../../zonas/zonas.component';
import { SectoresComponent } from '../../sectores/sectores.component';
import { ParqueaderoComponent } from '../../parqueaderos/parqueadero/parqueadero.component';
import { GenericComponent } from '../../generic/generic.component';
import { PuestosComponent } from '../../puestos/puestos.component';
import { PuertasComponent } from '../../puertas/puertas.component';
import { EspecieAnimalComponent } from '../../especie-animal/especie-animal.component';
import { ConfiguracionComponent } from '../../configuracion/configuracion.component';
import { EquiposComponent } from '../../equipos/equipos.component';
import { ReporteDinamicoComponent } from '../../reporte-dinamico/reporte-dinamico.component';


export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: GLOBAL.urlBase + '/dashboard', component: DashboardComponent },
    { path: GLOBAL.urlBase + '/usuarios-roles', component: UsuariosRolesComponent },
    { path: GLOBAL.urlBase + '/plazas-mercado', component: PlazasMercadoComponent },
    { path: GLOBAL.urlBase + '/tipos/tipo-sector', component: TipoSectorComponent },
    //{ path: GLOBAL.urlBase + '/tipos/tipo-sector', component: TipoSectorComponent },
    { path: GLOBAL.urlBase + '/tipoanimal', component: GenericComponent },
    { path: GLOBAL.urlBase + '/tipoparqueadero', component: GenericComponent },
    { path: GLOBAL.urlBase + '/tiporecaudo', component: GenericComponent },
    { path: GLOBAL.urlBase + '/tipovehiculo', component: GenericComponent },
    { path: GLOBAL.urlBase + '/tipopuesto', component: GenericComponent },
    { path: GLOBAL.urlBase + '/zonas', component: ZonasComponent },
    { path: GLOBAL.urlBase + '/sectores', component: SectoresComponent },
    { path: GLOBAL.urlBase + '/parqueaderos', component: ParqueaderoComponent },
    { path: GLOBAL.urlBase + '/puesto', component: PuestosComponent },
    { path: GLOBAL.urlBase + '/puerta', component: PuertasComponent },
    { path: GLOBAL.urlBase + '/abogado', component: GenericComponent },
    { path: GLOBAL.urlBase + '/configuracion', component: ConfiguracionComponent },
    { path: GLOBAL.urlBase + '/actividadcomercial', component: GenericComponent },
    { path: GLOBAL.urlBase + '/estadoinfraestructura', component: GenericComponent },
    { path: GLOBAL.urlBase + '/especieanimal', component: EspecieAnimalComponent },
    { path: GLOBAL.urlBase + '/equipo', component: EquiposComponent },
    { path: GLOBAL.urlBase + '/recibopuestoeventual', component: ReporteDinamicoComponent },
    { path: GLOBAL.urlBase + '/user-profile', component: UserProfileComponent },
    { path: GLOBAL.urlBase + '/table-list', component: TableListComponent },
    { path: GLOBAL.urlBase + '/typography', component: TypographyComponent },
    { path: GLOBAL.urlBase + '/icons', component: IconsComponent },
    { path: GLOBAL.urlBase + '/maps', component: MapsComponent },
    { path: GLOBAL.urlBase + '/notificacion', component: NotificationsComponent },
    { path: GLOBAL.urlBase + '/upgrade', component: UpgradeComponent },
    { path: GLOBAL.urlBase + '/tareas', component: TareasComponent },
];
