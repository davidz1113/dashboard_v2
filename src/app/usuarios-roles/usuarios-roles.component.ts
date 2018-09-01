import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioServices } from '../servicios/usuarioServices.services';
import { Usuario } from '../modelos/usuario';
import { ValidateContrasenia } from './user-agregar-editar/contraseña.validator';
import { Rol } from '../modelos/rol';


@Component({
  selector: 'app-usuarios-roles',
  templateUrl: './usuarios-roles.component.html',
  styleUrls: ['./usuarios-roles.component.scss'],
  providers: [UsuarioServices]
})

export class UsuariosRolesComponent implements OnInit {

  //variables para ocultar/mostrar las tablas/formularios de usuarios y roles
  ocultarTabla: boolean = true;
  ocultarAgreEdit: boolean = false;
  ocultarTablaRoles: boolean = false;
  ocultarAgreEditRoles: boolean = false;


  usuario: Usuario;
  rol: Rol;


  mensaje: string;
  mensaje2: string;

  constructor(

  ) {

  }

  ngOnInit() {
    //validamos el formulario

  }

  //para cambiar entre el formulario de agregar usuario y el de la tabla de usuarios

  cambiarEstados(event) {
    this.ocultarAgreEdit = !this.ocultarAgreEdit;
    this.ocultarTabla = !this.ocultarTabla;

    //si se le da cancelar recibe el parametro de 1 y, resetamos el usuario a null

    if (event != null) {
      if (event.cancel == '1') {
        this.usuario = null;
        console.log("cancel");
        //el mensaje pasa a null en caso que solo sea cancelar
        if(event.msj!=null){
          this.mensaje=null;
        }
      }
    }


  }

  //Metodo que envia el usuario para actualizarlo

  enviarUsuario(event) {
    this.usuario = event.usuario;
    //console.log(this.usuario);
    this.cambiarEstados(null);

  }



  ponerMensaje(event) {
    if (event != null) {
      this.mensaje = event.mensaje;
    }
  }


  
  //MEtodo que oculta la tabla de usuarios y muestra la de roles o al contrario
  cambiarRoles(event){
    this.ocultarTabla = !this.ocultarTabla;
    this.ocultarTablaRoles = !this.ocultarTablaRoles;
  }


  //MEtodo que llamar el formulario de agregar un rol y oculta la tabla e roles
  llamarFormAgregarRol(event){
    this.ocultarTablaRoles = !this.ocultarTablaRoles;
    this.ocultarAgreEditRoles = !this.ocultarAgreEditRoles;
    if (event != null) {
      if (event.cancel == '1') {
        this.rol = null;
        console.log("cancel");
        if(event.msj!=null){
          this.mensaje2=null;
        }
      }
    }
    //console.log(this.ocultarAgreEditRoles);
    //console.log(this.ocultarTablaRoles);
  }

  enviarRol(event){
    this.rol = event.rol;
    this.llamarFormAgregarRol(null);
  }

  ponerMensajeRol(event){
    if (event != null) {
      this.mensaje2 = event.mensaje;
    }
  }

}


