import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { GenericServices } from '../../servicios/genericServices.services';
import { FormGroup,FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateContrasenia } from './contrase\u00F1a.validator';
import { plainToClass } from "class-transformer";
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-generic-agregar-editar',
  templateUrl: './generic-agregar-editar.component.html',
  styleUrls: ['./generic-agregar-editar.component.scss'],
  providers: [GenericServices, ExcepcionService]
})
export class GenericAgregarEditarComponent implements OnInit {


  //formulario reactive
  nuevoUsuarioForm:FormGroup=new FormGroup({
       default: new FormControl()
    });

  public files: any[];

  //Objeto de tipo usuario
  public identidad: any={};

  //para mostrar el formulario de usuario
  nUsuario = true;
  primaryKey:string=''

  //actvar user, desactivar usuario
  active = false;
  textActive = "Desactivado";
  etiquetasColumnas:any[]=[];
  //campos de las contraseñas
  contrasenia: string = '123';
  contrasenia2: string = '';

  //mensaje validacion contraseña
  msg2: string = '';
  ban = false;

  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de usuario
  msg: string = '';

  //PAra alternar entre formularios Y ENVIAR MENSAJE
  @Output() llamarFormulario = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();
  @Input() mensaje: string;
  //traemos el usuario desde el componente tabla
  @Input() usuario: any;
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  //progress de envio
  creandoUsuario = false;



  constructor(
    private nuevoForm: FormBuilder,
    private _genericService: GenericServices,
    private injector: Injector, private _exceptionService: ExcepcionService
  ) {
    this.files = [];

  }

  ngOnInit() {

    //validamos el formulario
    this.validarFormulario();
    //this.identidad = new Usuario(0, '', 0, '', '', "true", new Date, new Date, '');
    //console.log(this.identidad);
    if(this.usuario!=null){let update:boolean=true;  this.consultarUsuarios(update,this.usuario);}else{let update:boolean=false;this.consultarUsuarios(update);}
    this.onChanges();
  }


  //observador para validar las contraseñas si son las mismas
  onChanges() {
    try {
      this.nuevoUsuarioForm.valueChanges.subscribe(
        valor => {
          this.contrasenia = valor.contrasenia;
          this.contrasenia2 = valor.repetirContrasenia;

          if (this.usuario != null) {//actualziacion
            //los campos de contraseña no son obligatorios
            if (this.contrasenia != '' || valor.repetirContrasenia != '') {

              if (this.contrasenia != this.contrasenia2) {
                this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([ValidateContrasenia(this.contrasenia)]);
                this.msg2 = "las contraseñas no coinciden";
                this.ban = true;
              } else {
                this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([Validators.required]);
                this.ban = false;
              }
              this.nuevoUsuarioForm.get('repetirContrasenia').updateValueAndValidity({ emitEvent: false, onlySelf: false });
            }
          } else {//si el usuario no esta definido(nuevo usuario)
            //se agrega siempre la validacion
            if (this.contrasenia != this.contrasenia2) {
              this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([ValidateContrasenia(this.contrasenia)]);
              this.msg2 = "las contraseñas no coinciden";
              this.ban = true;
            } else {
              this.nuevoUsuarioForm.get('repetirContrasenia').setValidators([Validators.required]);
              this.ban = false;
            }
            this.nuevoUsuarioForm.get('repetirContrasenia').updateValueAndValidity({ emitEvent: false, onlySelf: false });
          }

        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "onChanges()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }


  }




  //conecta a la api rest e inserta o actualiza  los campos del usuario
  nuevoUsuario() {
    try {

    this.msg='';
    this.creandoUsuario = true;



    for(let etiqueta of this.etiquetasColumnas){

      this.identidad[etiqueta.item]=this.nuevoUsuarioForm.get(etiqueta.item).value;
      console.log("identidad");
      console.log(this.identidad[etiqueta.item]);
      }
        //estas son opcionales solamente validas para user
      //  this.identidad['usuarioactivo']=true;
      //  this.identidad['fkidrol']='1';
        //this.identidad['contrasenia']='1240';


      const uploadData = new FormData();

      if (this.usuario == null) {//es un usuario nuevo

        this._genericService.crearUsuario(this.identidad, uploadData).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              console.log(this.respuesta);
              this.creandoUsuario = false;
              if (this.respuesta.status == "Exito") {
                this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
                this.llamarFormulario.emit({ cancel: '1' });
              } else {
                this.msg = this.respuesta.msg;
              }

            }
          },
          error => {
            this.creandoUsuario = false;
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          }

        );
      } else {//{Actualziar usuario

        console.log("Antes de Envio:")
        console.log(this.identidad);
        console.log(this.usuario[this.primaryKey]);

                this.identidad[this.primaryKey]=this.usuario[this.primaryKey];
        console.log(this.primaryKey);

        this._genericService.actualizarUsuario(this.identidad, uploadData).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoUsuario = false;
              if (this.respuesta.status != "error") {
                this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
                this.llamarFormulario.emit({ cancel: '1' });
              }else{
                this.msg = this.respuesta.msg;
                console.log(this.msg);
              }
            }
          },
          error => {
            this.creandoUsuario = false;
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');

          }

        );
      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "nuevoUsuario()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      console.log("error asdasd a:" + e.stack);

    }
    //console.log(this.identidad);

  }


  validarFormulario() {
    try {
      console.log("usuario");


      if (this.usuario != null) {//si llega por actualizar
        //this.url = this.url.substring(2);
        this.mensajeBoton = "Actualizar";
        console.log(this.usuario);

      } else {
        this.mensajeBoton = "Guardar";
//hay que hacer el cambio con otro formulario

      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "validarFormulario()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }


  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {
        if (this.respuesta.length <= 1) {
          //this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor al enviar excepcion');
        } else {
          console.log('La excepcion se envio correctamente');
        }
      },
      error => {
        console.log('Error en el servidor al enviar excepcion');
      }

    );
  }
  closeDialog() {
    this.msg = '';
  }

  consultarUsuarios(update:boolean,element?:any) {
    try {
      //throw new Error('Im errorn');
      this.respuesta = null;
      this._genericService.consultarUsuarios().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');

          } else {


           for(let i=0;i<this.respuesta.cabeceras.length;i++)
             {

               if(this.respuesta.cabeceras[i].pk==true){
                 this.primaryKey=this.respuesta.cabeceras[i].nombrecampo;
               }
               if(update){
                 if(this.respuesta.cabeceras[i].update==true){
                   this.etiquetasColumnas.push({etiqueta:this.respuesta.cabeceras[i].nombreetiqueta,item:this.respuesta.cabeceras[i].nombrecampo,type:this.respuesta.cabeceras[i].type});
                 }
               }
               else{
                 if(this.respuesta.cabeceras[i].create==true){
                 this.etiquetasColumnas.push({etiqueta:this.respuesta.cabeceras[i].nombreetiqueta,item:this.respuesta.cabeceras[i].nombrecampo,type:this.respuesta.cabeceras[i].type});
                 }
               }

             }

            let group: any = {};
            this.etiquetasColumnas
            for (let campo of this.etiquetasColumnas) {
              if(update){
                group[campo.item] = new FormControl(element[campo.item]);
                }
              else
                {
                  group[campo.item] = new FormControl();
                }
              console.log("campo");
              console.log(campo);
            //  this.nuevoUsuarioForm.addControl(campo.item,new FormControl(campo.item));
            }
          this.nuevoUsuarioForm=new FormGroup(group);

          }

        },
        error => {
          this.mensaje = 'Error en el servidor';
          this.respuesta = 'error';

          console.log('Error en el servidor');
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarUsuario()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  ngAfterViewInit() {
    //this.consultarUsuarios();

  }


}
