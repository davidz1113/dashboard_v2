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
    consultarTodasPlazas(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/plaza/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
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

