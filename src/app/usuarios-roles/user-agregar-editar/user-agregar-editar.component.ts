import { Component, OnInit } from '@angular/core';
import { UsuarioServices } from '../../servicios/usuarioServices.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateContrasenia } from './contrase\u00F1a.validator';
import { Rol } from '../../modelos/rol';

@Component({
  selector: 'app-user-agregar-editar',
  templateUrl: './user-agregar-editar.component.html',
  styleUrls: ['./user-agregar-editar.component.scss'],
  providers: [UsuarioServices]
})
export class UserAgregarEditarComponent implements OnInit {

 
  //formulario reactive
  nuevoUsuarioForm: FormGroup;
  //archivo seleccionado
  archivoSelect: File;

  //Objeto de tipo usuario
  public identidad: Usuario;

  //para mostrar el formulario de usuario
  nUsuario = true;

  //actvar user, desactivar usuario
  active = false;
  textActive = "Desactivado";

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


  constructor(
    private nuevoForm: FormBuilder,
    private _usuarioService: UsuarioServices,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {

  }



  ngOnInit() {
    //validamos el formulario
    this.validarFormulario();
    this.identidad = new Usuario(0, '', 0, '', '', "true", new Date, new Date,'');
    //console.log(this.identidad);
    this.onChanges();
  }


  onChanges() {
    this.nuevoUsuarioForm.valueChanges.subscribe(
      valor => {
        this.contrasenia = valor.contrasenia;
        this.contrasenia2 = valor.repetirContrasenia;
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
    );


  }


  //conecta a la api rest e inserta los campos del usuario
  nuevoUsuario() {

    //seteamos en el objeto usuario las variables del formulario
    this.identidad.setNombreUsuario(this.nuevoUsuarioForm.get('nombreUsuario').value);
    this.identidad.setApellido(this.nuevoUsuarioForm.get('apellido').value);
    this.identidad.setIdentificacion(this.nuevoUsuarioForm.get('identificacion').value);
    this.identidad.setCodigoUsuario(this.nuevoUsuarioForm.get('codigoUsuario').value);
    this.identidad.setUsuarioActivo(this.active);
    this.identidad.setFkidrol(this.nuevoUsuarioForm.get('idRol').value);
    this.identidad.setContrasenia(this.nuevoUsuarioForm.get('contrasenia').value);

    const uploadData = new FormData();
    uploadData.append('fichero_usuario', this.archivoSelect);


    this._usuarioService.crearUsuario(this.identidad, uploadData).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          this.msg = this.respuesta.msg;
        }
      },
      error => {
        this.msg = 'Error en el servidor';
        console.log('Error en el servidor');
      }

    );
    //console.log(this.identidad);

  }


  validarFormulario() {
    this.nuevoUsuarioForm = this.nuevoForm.group({
      codigoUsuario: ['', Validators.required],
      identificacion: [null, Validators.required],
      nombreUsuario: ['', Validators.required],
      apellido: ["", Validators.required],
      usuarioActivo: [true, Validators.required],
      idRol: [null, Validators.required],
      contrasenia: ['', Validators.required],
      repetirContrasenia: ['', Validators.required]
    });
  }

  activarDesactivarUsuario() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }

  url: any;

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.archivoSelect = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = reader.result;

      }
    }
  }

  selectedFile: File;

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

 
}

