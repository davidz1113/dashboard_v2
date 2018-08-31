import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class RolesServices {

    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /* 
    Metodo que consulta los roles para el usuario
*/
    consultarRoles() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/user/roles', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    consultarTodosRoles() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/rol/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


    /*
    Metodo que crea un rol 
    recibe como parametro el rol de tipo Rol para insertar
    adicionalemte, los permisos como un array por aparte
    */
    crearRol(nuevo_rol,arrModulo) {
        let json = JSON.stringify(nuevo_rol);
        let permisos = "{"+(arrModulo)+"}";
        let params = "json=" + json + "&authorization=" + this.getToken() + "&permisos=" + permisos;

        return this._http.post(this.url + '/rol/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


    //metodo para actualizar un rol
    //parametros de usuario
    /*
        rol_editar: objeto de tipo Rol
    */
    actualizarRol(rol_editar) {
        let json = JSON.stringify(rol_editar);
        let permisos = {
            "1": "PERM_USUARIOS",
            "2": "PERM_ZONAS"
        };
        let params = "json=" + json + "&authorization=" + this.getToken() + "&permisos=" + permisos;

        return this._http.post(this.url + '/rol/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }

    //obtener de manera global los datos del token
    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

}