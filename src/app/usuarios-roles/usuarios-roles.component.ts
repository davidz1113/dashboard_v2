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

  ocultarTabla: boolean = true;
  ocultarAgreEdit: boolean = false;

  usuario:Usuario;

  constructor(

  ) {

  }

  ngOnInit() {
    //validamos el formulario

  }

  cambiarEstados(event){
    this.ocultarAgreEdit = !this.ocultarAgreEdit;
    this.ocultarTabla = !this.ocultarTabla;
    
    if(event!=null){
      if(event.cancel=='1'){
        this.usuario =null;
      }
    }


  }

  enviarUsuario(event){
    this.usuario = event.usuario;
    //console.log(this.usuario);
    this.cambiarEstados(null);

  }


}


