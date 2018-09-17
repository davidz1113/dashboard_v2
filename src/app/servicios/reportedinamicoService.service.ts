import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


//Servicio dinamico para generar los reportes
@Injectable()
export class ReportesServices {
    public url: string;
    public token;
    public headers;
    public route;

    
    constructor(private _http: Http,private router: Router) {
        this.url = "http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php";
        this.route= this.router.url.substring(15);
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }



    consultarCampos(){
        let token = "authorization=" + this.getToken();
        console.log(this.url + this.route+'/query');
        const key =this.route.substring(1); 
        //let json = {}
        //json[key]=false;
        //console.log(json);
        const params = token+"&"+key+"="+false;
        //console.log(params);
        
        return this._http.post(this.url + this.route+'/query', params, { headers: this.headers })
          .pipe(map(res => res.json()));
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

}