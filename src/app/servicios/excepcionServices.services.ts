import { Injectable } from "@angular/core";
import { Excepcion } from "../modelos/excepcion";
import { GLOBAL } from "./globales";
import { Http } from "@angular/http";

@Injectable()
export class ExcepcionService {
    public url: string;
    public headers;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }


    capturarExcepcion(excepcion:any){
        console.log(excepcion.mensaje);
        console.log(excepcion.url);
        console.log(excepcion.stack);

        let indiceFin = excepcion.stack.indexOf(" (");
        let indiceIni = excepcion.stack.indexOf("at");
        console.log(indiceFin);

        let funcion = excepcion.stack.substr(indiceIni+2,(indiceFin));
         
        

    }

}