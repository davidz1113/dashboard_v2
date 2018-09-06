import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';

@Injectable()
export class SectoresServices {

    public url: string;
    public token;
    public headers;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
    * Metodo que constulta los sectores para listarlos en la tabla, con todos los campos
    */
    consultarTodosSectores() {
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/sector/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));

    }


    /*
        Metodo que crea un sector 
        recibe como parametro el sector de tipo Sector para insertar
        */
    crearSector(nuevo_sector) {
        let json = JSON.stringify(nuevo_sector);
        let params = "json=" + json + "&authorization=" + this.getToken();

        return this._http.post(this.url + '/sector/new', params, { headers: this.headers }).pipe(map(res => res.json()));

    }


      /**
     * Eliminar el sector por pkidSector
     */

    eliminarSector(pkidSector){
        let sector = { pkidsector: pkidSector };
        let json = JSON.stringify(sector);
        let params = "json=" + json + "&authorization=" + this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));

        return this._http.post(this.url + '/sector/remove', params, { headers: this.headers })
            .pipe(map(res => res.json()));
     }

     //metodo para actualizar un sector
    //parametros de usuario
    /*
        sector_editar: objeto de tipo Zona,
       
    */
    actualizarZona(sector_editar) {
        let json = JSON.stringify(sector_editar);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/sector/edit', params, { headers: this.headers }).pipe(map(res => res.json()));
    }


     /**
     * 
     * @param pkidsector id del sector a cambiarle 
     * @param active valor para cmbiar el estado
     * @param nombre_tabla nombre de la tabla a modificar
     */
    cambiarEstadoZona(pkidsector: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidsector, active: String(active), nombretabla: nombre_tabla };
        let json = JSON.stringify(enviarDatos);
        let params = "json=" + json + "&authorization=" + this.getToken();
        return this._http.post(this.url + '/active/query', params, { headers: this.headers })
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