import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/usuarios-roles', title: 'Usuarios y Roles',  icon: 'person', class: '' },
    { path: '/user-profile', title: 'Plazas De Mercado',  icon:'person', class: '' },
    { path: '/table-list', title: 'Sectores',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'Recaudo',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Reportes',  icon:'bubble_chart', class: '' },
    { path: '/notificacion', title: 'Notificaciones',  icon:'notifications', class: '' },
    { path: '/tareas', title: 'Tareas',  icon:'assignment', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
