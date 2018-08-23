import { Usuario } from "../modelos/usuario";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class UsuarioServices implements Crud<Usuario>{
    public url: string;
    public identity;
    public token;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    //Servicio para iniciar sesion
    iniciarSesion(usuario_logeado) {
        let json = JSON.stringify(usuario_logeado);
        let params = "json=" + json;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });;
        return this._http.post(this.url + '/login', params, { headers: headers})
        .pipe(map(res=>res.json())) ;
    }

    crear(): void {
        throw new Error("Method not implemented.");
    }

    Leer(): Usuario {

        throw new Error("Method not implemented.");

    }

    actualizar(): void {
        throw new Error("Method not implemented.");
    }

    eliminar(): void {
        throw new Error("Method not implemented.");
    }

    //Obtener de manera globar los datos del usuario
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity!="undefined"){
            this.identity = identity;
        }else{
            this.identity=null;
        }
        return this.identity;
    }
    //obtener de manera global los datos del token
    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));

        if(token!="undefined"){
            this.token =token;
        }else{
            this.token=null;
        }
        return this.token;
    }

    //Si el usuario esta identificado, se redirige
    redirigirSiEstaIdentificado(_router:Router){
        let identity = this.getIdentity();
        if(identity!=null && identity.sub){
            _router.navigate(["/dashboard"]);
            console.log("redirijir");
            
        }
    }

}