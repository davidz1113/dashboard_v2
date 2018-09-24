import { Injectable } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

/**
 * Clase dinamica para generar consultas de las tablas de tarifas
 */
@Injectable()
export class TarifasServices {
    public url: string;
    public token;
    public headers;

    private filtros$ = new Subject<any[]>();
    filtros: any[]=[];
    observableFiltros:Observable<any[]>;
    
    constructor(private _http: Http) {
        this.url = 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php';
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
     * 
     * @param url url del controlador donde se quiere hacer la peticion(llega del _router)
     * Metodo que consulta las cabeceras de la consulta de tarifas asi como los datos para mostrar en su respectiva columna 
     */
    consultarDatos(url:string){
        let params = "authorization="+this.getToken();
        return this._http.post(this.url + url + '/query', params, { headers: this.headers })
        .pipe(map(res => res.json()));
    }


    agregarFiltros(filtro:any={}){
        const index = this.filtros.indexOf(filtro);
        console.log(index);
        if (index > -1) this.filtros.splice(index, 1);
        this.filtros.push(filtro);
        this.filtros$.next(this.filtros);
        console.log(this.filtros);
    }


    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }


    getObservableFiltros$():Observable<any[]>{
        return this.filtros$.asObservable();
    }


}