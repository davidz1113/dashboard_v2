import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { UsuarioServices } from '../servicios/usuarioServices.services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/globales';
import Fingerprint2 = require('fingerprintjs2');
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogRegistroEquipo } from './dialogo-registro-equipo/registroequipo.dialog';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

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
  msg: string;

  //variables relacionadas con el formulario
  identificacionUsuario: number;
  contraseniaUsuario: string;

  //variables respuesta backend
  public identity;
  public token;

  logeandose = false;

  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";


  constructor(
    private identForm: FormBuilder,
    private _usuarioService: UsuarioServices,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog
  ) {


  }

  ngOnInit() {
    //cuando llega el parametro 1 para salir de sesion
    this.logOut();
    //En caso de que el usuario quiera dirijirse con autenticacion 
    //this._usuarioService.redirigirSiEstaIdentificado(this._router);

    //valdacion y asignacion de condiciones para el formulario
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
    this.logeandose = true;
    this.msg = '';
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
            //antes de llenar los datos en el local storage, se consulta por el identificador de el equipo en la base de datos
            //si esta en la base de datos signfica q esta entrando por el mismo explorador, caso contrario, lo redirijira a la pagina
            //de registro de equipo de computo para inserción manual para el usuario

            this.logearUsuario(usuario);

            //this.siTieneIdentificacionEquipo(this.identity.sub, (this.identity.name + " " + this.identity.surname), usuario);

          } else {
            this.msg = this.identity.msg;
            this.identity = null;
            this.logeandose = false;
          }
        }
      },
      error => {
        console.log("error conexión:");
        this.msg = "error de conexión";
        console.log(<any>error);
        this.logeandose = false;

      }
    );
  }


  /**
   * 
   * @param fkidusuario el id del usuario al cual pertenece el identificador de el equipo
   * @param nombreuser el nombre de usuario para mostrar en el modal
   */
  siTieneIdentificacionEquipo(fkidusuario, nombreuser: string): void {
    //se genera la llave con el metodo
    new Fingerprint2().get((result, components) => {
      console.log(result); // a hash, representing your device fingerprint
      //se envia el result(clave unica) al metodo de consultar
      this._usuarioService.consultarIdentificacion(result, fkidusuario).subscribe(
        response => {
          if (response.length <= 1) {
            console.log('Error en el servidor');
          } else {
            if (response.status == 'exito') { //si el identificar existe en la base de datos, redirije al dashboard y almacena las variables
              //this.logearUsuario(usuario);
              this.redirigirYalmacenar();
            } else if (response.status == 'error') {
              //En caso que no este el identificador, llama al dialogo de registrar el explorador
              this.mostrarDialogoRegistroEquipo(fkidusuario, nombreuser, result);
              this.logeandose = false;


            }

          }
        },
        error => {
          this.logeandose = false;
          this.msg = "ocurrio un error al ingresar al sistema, por favor intentelo nuevamente";
          console.log('Error en el servidor');
        }


      );
    })

    //console.log(components) // an array of FP components
  }


  /**
   * 
   * @param fkidusuario id de usuario para insertar en la tabla equipo
   * @param nombreuser para mostrar en l campo usuario
   */
  mostrarDialogoRegistroEquipo(fkidusuario, nombreuser, identificador) {
    const dialogRef = this.dialog.open(DialogRegistroEquipo, {
      width: '600px',
      data: { nombreusuario: nombreuser, fkidusuario: fkidusuario, identificador: identificador, token: this.token }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result.status == null) {
        this.msg = 'Debe Registrar el equipo para poder ingresar al sistema';
        this.identity = null;
      } else {
        this.msg = result.respuesta;
        this.redirigirYalmacenar();
        //this.logearUsuario(usuario);
      }
    });

  }

  logearUsuario(usuario) {


    usuario.getHash = false;
    this._usuarioService.iniciarSesion(usuario).subscribe(
      response => {
        this.token = response;
        if (this.identity.length <= 1) {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
          this.logeandose = false;
        } else {
          if (!this.identity.status) {
            this.siTieneIdentificacionEquipo(this.identity.sub, (this.identity.name + " " + this.identity.surname));
          }
        }

      },
      error => {
        console.log(<any>error);
        this.msg = "error de conexión";
        this.logeandose = false;
      }

    );
  }

  redirigirYalmacenar() {
    localStorage.setItem('identity', JSON.stringify(this.identity));
    localStorage.setItem('token', JSON.stringify(this.token));

    this.logeandose = false;
    this.msg = 'Usuario identificado correctamente, Bienvenido!!';
    this.claseDinamic = "alert alert-success alert-with-icon";
    this.iconAlert = "done";
    this._router.navigate([GLOBAL.urlBase + "/dashboard"]);


  }


  logOut() {
    this._route.params.forEach((params: Params) => {
      let logout = +params['id'];
      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;
        this.msg = "Sesión cerrada correctamente";
        this.claseDinamic = "alert alert-success alert-with-icon";
        this.iconAlert = "done";
        console.log(this.msg);
        this._router.navigate([GLOBAL.urlBase + "/login"]);
        //window.location.href = '/' + GLOBAL.urlBase + '/login';
      }
    });
  }
}
