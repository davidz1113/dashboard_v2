import { Component, OnInit, } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { UsuarioServices } from '../servicios/usuarioServices.services';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioServices]
})


export class LoginComponent implements OnInit {
 
  //formulario de tipo formGroup (reactiva)
  identificacionForm: FormGroup;

  //mensaje dialog error usuario
  msg: string = '';

  //variables relacionadas con el formulario
  identificacionUsuario: number;
  contraseniaUsuario: string;

  //variables respuesta backend
  public identity;
  public token;

  logeandose=false;

  constructor(
    private identForm: FormBuilder,
    private _usuarioService: UsuarioServices,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }
  

  
  ngOnInit() {
    //valdacion y asignacion de condiciones para el formulario
    this.logOut();
   this._usuarioService.redirigirSiEstaIdentificado(this._router);
    
    this.validarFormulario();
  }

  //Metodo para validar los campos de los formularios
  validarFormulario(): void {
    this.identificacionForm = this.identForm.group({
      identificacionUsuario: ['', Validators.required],
      contraseniaUsuario: ['', Validators.required]
    });
  }


  closeDialog() {
    this.msg = '';
  }


  identificarUsuario() {
    this.closeDialog();
    this.logeandose=true;
    //this.msg = "Usuario o contraseña incorrecto"
    //definicion de un objeto usario para login
    //getHash para traer o no el objeto usuario completo de la bd(entidad:usuario)
    let usuario = {
      "identificacion": this.identificacionForm.get('identificacionUsuario').value,
      "contrasenia": this.identificacionForm.get('contraseniaUsuario').value,
      "getHash": true
    }
    console.log(usuario);
    this._usuarioService.iniciarSesion(usuario).subscribe(
      response => {
        this.identity = response;
        if (this.identity.length <= 1) {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {

          if (!this.identity.status) {
            localStorage.setItem('identity', JSON.stringify(this.identity));
            usuario.getHash = false;
            this._usuarioService.iniciarSesion(usuario).subscribe(
              response => {
                this.token = response;
                if (this.identity.length <= 1) {
                  this.msg = 'Error en el servidor';
                  console.log('Error en el servidor');
                  this.logeandose=false;
                } else {
                  if (!this.identity.status) {
                    localStorage.setItem('token', JSON.stringify(this.token));
                    this.logeandose=false;
                    window.location.href="/";
                  }
                }

              },
              error => {
                console.log(<any>error);
                this.msg = "error de conexión";
                this.logeandose=false;
              }

            );
          } else {
            this.msg = this.identity.data;
            this.logeandose=false;
          }
        }
      },
      error => {
        console.log("error conexión:");
        this.msg = "error de conexión";
        console.log(<any>error);
        this.logeandose=false;

      }
    );
  }


  
  logOut(){
    this._route.params.forEach((params:Params)=>{
        let logout = +params['id'];
        if(logout==1){
            localStorage.removeItem('identity');
            localStorage.removeItem('token');

            this.identity = null;
            this.token =null;
            window.location.href = '/login';
        }
    });
}
}
