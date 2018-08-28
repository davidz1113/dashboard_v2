import { Usuario } from "../modelos/usuario";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { GLOBAL } from "./globales";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class UsuarioServices {
    public url: string;
    public identity;
    public token;
    public headers;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.headers =  new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    //Servicio para crear un usuario
    crearUsuario(nuevo_usuario: Usuario, uploadData:FormData) {
        let json = JSON.stringify(nuevo_usuario);
        let params =  "json="+json+"&authorization="+this.getToken()+"&fichero_usuario="+(uploadData);
        

        console.log(uploadData);
        //console.log(JSON.stringify(this.getToken()));
        
        return this._http.post(this.url+ '/user/new',uploadData, {headers: this.headers } )
            .pipe(map(res=>res.json()));
    }

    //metodo para eliminar usuario
    eliminarUsuario(pkidusuario){
        let user = {pkidusuario:pkidusuario};
        let json = JSON.stringify(user);
        let params =  "json="+json+"&authorization="+this.getToken();
        console.log(params);
        //console.log(JSON.stringify(this.getToken()));
        
        return this._http.post(this.url+ '/user/remove',params, { headers: this.headers } )
            .pipe(map(res=>res.json()));
    }

    //Servicio para iniciar sesion
    iniciarSesion(usuario_logeado) {
        let json = JSON.stringify(usuario_logeado);
        let params = "json=" + json;
        return this._http.post(this.url + '/login', params, { headers: this.headers })
            .pipe(map(res => res.json()));
    }


    //metodo q consulta todos los usuarios de la base de datos
    consultarUsuarios(){
        let token = "authorization="+this.getToken();
        return this._http.post(this.url+ '/user/query',token, { headers: this.headers } )
        .pipe(map(res=>res.json()));
    }

    //Obtener de manera globar los datos del usuario
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
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

    //Si el usuario esta identificado, se redirige
    redirigirSiEstaIdentificado(_router: Router) {
        let identity = this.getIdentity();
        if (identity != null && identity.sub) {
            _router.navigate(["/dashboard"]);
            console.log("redirijir");

        } else {
            _router.navigate(["/"]);
        }
    }




}