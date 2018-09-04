import { Component, OnInit } from '@angular/core';
import { Modulo } from '../../modelos/modulo';
import { plainToClass } from "class-transformer";


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    valor: number;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', valor:0 },
    { path: '/usuarios-roles', title: 'Usuarios y Roles', icon: 'person', class: '' , valor:1},
    { path: '/plazas-mercado', title: 'Plazas de mercado', icon: 'account_balance', class: '', valor:2 },
    { path: '/tipos/tipo-sector', title: 'Tipos de sectores', icon: 'account_balance', class: '', valor:3 },
    { path: '/user-profile', title: 'Plazas De Mercado', icon: 'person', class: '' , valor:4},
    { path: '/table-list', title: 'Sectores', icon: 'content_paste', class: '' , valor:123},
    { path: '/typography', title: 'Recaudo', icon: 'library_books', class: '', valor:123 },
    { path: '/icons', title: 'Reportes', icon: 'bubble_chart', class: '' , valor:123},
    { path: '/notificacion', title: 'Notificaciones', icon: 'notifications', class: '', valor:123 },
    { path: '/tareas', title: 'Tareas', icon: 'assignment', class: '' , valor:123},
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    public identity;
    urlimagen: string = '../assets/img/empleado.png';
    nombreUsuario: string;
    
    modulos : Modulo[];

    constructor() {
        this.identity = this.getIdentity();
        if(this.identity.rutaimagen != null){
            let imagen: string = this.identity.rutaimagen;
            this.urlimagen = "http://192.168.1.21/SistemaRecaudoBackend/" + (imagen.substring(3));
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


    mostrarMenus(){
        /*this.modulos = plainToClass(Modulo,this.identity.modulos);
        let nuevosRoutes:RouteInfo[] = [];
        this.modulos.map((modulo)=>{
            ROUTES.map((route)=>{
                if(modulo.getPkidmodulo()==route.valor){
                    console.log(modulo.getNombremodulo());
                    nuevosRoutes.push(route)
                }            

            })
            
        });*/

        this.menuItems = ROUTES.filter(menuItem => menuItem);

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
