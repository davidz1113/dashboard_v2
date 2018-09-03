import { PlazaMercado } from "../modelos/plaza-mercado";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class PlazaServices {
    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    /**
     * Metodo para retornar todas las plazas de mercado
     */
    consultarTodasPlazas() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/plaza/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * Metodo que cambia el estado del campo
     */
    cambiarEstadoPlaza(pkidPlaza: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidPlaza, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


        /*
    Metodo que crea un rol 
    recibe como parametro el rol de tipo Rol para insertar
    adicionalemte, los permisos como un array por aparte
    */
   crearPlaza(nuevo_plaza,arrTipoReca) {
    let json = JSON.stringify(nuevo_plaza);
    let tipoRecaudo = "{"+(arrTipoReca)+"}";
    let params = "json=" + json + "&authorization=" + this.getToken()+"&tiporecaudo="+tipoRecaudo;

    return this._http.post(this.url + '/plaza/new', params, { headers: this.headers }).pipe(map(res => res.json()));

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

