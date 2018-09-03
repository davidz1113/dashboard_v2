import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from "../globales";

@Injectable()
export class TipoSectorServices {
    public url: string;
    public identity;
    public token;
    public headers;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


     //metodo q consulta todos los tipos de sectores de la base de datos
    //paramtros de envio
    /*
        authorization: token del usuario
    */
    consultarTodosTiposSector(){
        let token = "authorization=" + this.getToken();
        return this._http.post(this.url + '/tiposector/query', token, { headers: this.headers })
            .pipe(map(res => res.json()));
    }

    /**
     * 
     * @param pkidtiporol id del tipo de rol
     * @param active valor para cambiarle a la base de datos
     * @param nombre_tabla nombre de la tabla
     */
    
    cambiarEstadoTipoSector(pkidtiporol: number, active: boolean, nombre_tabla: string) {
        let enviarDatos = { pkid: pkidtiporol, active: String(active), nombretabla: nombre_tabla };
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