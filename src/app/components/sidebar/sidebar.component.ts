import { Component, OnInit } from '@angular/core';
import { Modulo } from '../../modelos/modulo';
import { GLOBAL } from '../../servicios/globales';
import { plainToClass } from 'class-transformer';


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    valor: number;
}
export const ROUTES: RouteInfo[] = [
    { path: '/' + GLOBAL.urlBase + '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', valor: 0 },
    { path: '/' + GLOBAL.urlBase + '/usuarios-roles', title: 'Usuarios y Roles', icon: 'person', class: '', valor: 1 },
    { path: '/' + GLOBAL.urlBase + '/plazas-mercado', title: 'Plazas de mercado', icon: 'account_balance', class: '', valor: 2 },
    { path: '/' + GLOBAL.urlBase + '/tipos/tipo-sector', title: 'Tipos de sectores', icon: 'location_city', class: '', valor: 3 },
    { path: '/' + GLOBAL.urlBase + '/zonas', title: 'Zonas', icon: 'store_mall_directory', class: '', valor: 4 },
    { path: '/' + GLOBAL.urlBase + '/sectores', title: 'Sectores', icon: 'business', class: '', valor: 5 },
    { path: '/' + GLOBAL.urlBase + '/parqueaderos', title: 'Parqueaderos', icon: 'commute', class: '', valor: 6 },
    { path: '/' + GLOBAL.urlBase + '/tipoanimal', title: 'Tipos de animales', icon: 'pets', class: '', valor: 7 },
    { path: '/' + GLOBAL.urlBase + '/puesto', title: 'Puestos', icon: 'local_convenience_store', class: '', valor: 8 },
    { path: '/' + GLOBAL.urlBase + '/puerta', title: 'Puertas', icon: 'meeting_room', class: '', valor: 9 },
    { path: '/' + GLOBAL.urlBase + '/tipoparqueadero', title: 'Tipos de parqueadero', icon: 'meeting_room', class: '', valor: 10 },
    { path: '/' + GLOBAL.urlBase + '/abogado', title: 'Abogados', icon: 'supervised_user_circle', class: '', valor: 11 },
    { path: '/' + GLOBAL.urlBase + '/tipovehiculo', title: 'Tipos de vehiculos', icon: 'directions_car', class: '', valor: 12 },
    { path: '/' + GLOBAL.urlBase + '/tipopuesto', title: 'Tipos de puesto', icon: 'transfer_within_a_station', class: '', valor: 13 },
    { path: '/' + GLOBAL.urlBase + '/actividadcomercial', title: 'Actividad Comercial', icon: 'swap_horiz', class: '', valor: 14 },
    { path: '/' + GLOBAL.urlBase + '/estadoinfraestructura', title: 'Estado Infraestructura', icon: 'ballot', class: '', valor: 15 },
    { path: '/' + GLOBAL.urlBase + '/especieanimal', title: 'Especies de animales', icon: 'pets', class: '', valor: 16 },
    //{ path: '/' + GLOBAL.urlBase + '/configuracion', title: 'Configuración', icon: 'settings', class: '', valor: 17 },
    { path: '/' + GLOBAL.urlBase + '/equipo', title: 'Equipos', icon: 'computer', class: '', valor: 18 },
    { path: '/' + GLOBAL.urlBase + '/reporterecibopuestoeventual', title: 'Reporte puesto eventual', icon: 'credit_card', class: '', valor: 19 },
    { path: '/' + GLOBAL.urlBase + '/reporteauditoria', title: 'Reporte Auditoria', icon: 'description', class: '', valor: 20},
    { path: '/' + GLOBAL.urlBase + '', title: '', icon: '', class: '', valor: 4 },
    { path: '/' + GLOBAL.urlBase + '/user-profile', title: 'Plazas De Mercado', icon: 'person', class: '', valor: 200 },
    { path: '/' + GLOBAL.urlBase + '/table-list', title: 'Sectores', icon: 'content_paste', class: '', valor: 210 },
    { path: '/' + GLOBAL.urlBase + '/typography', title: 'Recaudo', icon: 'library_books', class: '', valor: 220 },
    { path: '/' + GLOBAL.urlBase + '/icons', title: 'Reportes', icon: 'bubble_chart', class: '', valor: 230 },
    { path: '/' + GLOBAL.urlBase + '/notificacion', title: 'Notificaciones', icon: 'notifications', class: '', valor: 240 },
    { path: '/' + GLOBAL.urlBase + '/tareas', title: 'Tareas', icon: 'assignment', class: '', valor: 250 },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    public identity;
    urlimagen: string = '../' + GLOBAL.urlBase + '/assets/img/empleado.png';
    nombreUsuario: string;

    modulos: Modulo[];


    constructor() {
        this.identity = this.getIdentity();
        if (this.identity.rutaimagen != null) {
            let imagen: string = this.identity.rutaimagen;
            this.urlimagen = GLOBAL.urlImagen + (imagen.substring(3));
        }

       
        this.nombreUsuario = this.identity.name + " " + this.identity.surname;
    }

    ngOnInit() {
        this.mostrarMenus();

    }
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };


    mostrarMenus() {
        this.modulos = plainToClass(Modulo, this.identity.modulos);
        let nuevosRoutes: RouteInfo[] = [];
        this.modulos.map((modulo) => {
            ROUTES.map((route) => {
                if (modulo.getPkidmodulo() == route.valor) {
                    //console.log(modulo.getNombremodulo());
                    nuevosRoutes.push(route)
                }

            })

        });
        console.log(nuevosRoutes);
        
        this.menuItems = nuevosRoutes.filter(menuItem => menuItem);
        //this.menuItems = ROUTES.filter(menuItem => menuItem);

    }

    //Obtener de manera globar los datos del usuario
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

}
