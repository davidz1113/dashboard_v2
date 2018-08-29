import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsuarioServices } from '../../servicios/usuarioServices.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateContrasenia } from './contrase\u00F1a.validator';
import { Rol } from '../../modelos/rol';
import { RolesServices } from '../../servicios/rolesServices.services';
import { plainToClass } from "class-transformer";
@Component({
  selector: 'app-user-agregar-editar',
  templateUrl: './user-agregar-editar.component.html',
  styleUrls: ['./user-agregar-editar.component.scss'],
  providers: [UsuarioServices, RolesServices]
})
export class UserAgregarEditarComponent implements OnInit {


  //formulario reactive
  nuevoUsuarioForm: FormGroup;


  public files: any[];

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

  //PAra alternar entre formularios
  @Output() llamarFormulario = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();

  //traemos el usuario desde el componente tabla
  @Input() usuario: Usuario;

  //roles
  roles: Rol[] = [];

  //mensaje del boton actulizar guardar
  mensajeBoton: string;

  //progress de envio
  creandoUsuario = false;

  //idRol y nombre rol en caso de una actualizacion
  idRol: number = null;
  rolName: string = '--';

  constructor(
    private nuevoForm: FormBuilder,
    private _usuarioService: UsuarioServices,
    private _rolesServices: RolesServices,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.files = [];



  }



  ngOnInit() {
    this.consultarRoles();

    //validamos el formulario
    this.validarFormulario();
    this.identidad = new Usuario(0, '', 0, '', '', "true", new Date, new Date, '');
    //console.log(this.identidad);
    this.onChanges();
  }


  onChanges() {
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


  }


  //conecta a la api rest e inserta o actualiza  los campos del usuario
  nuevoUsuario() {
    this.creandoUsuario = true;
    //seteamos en el objeto usuario las variables del formulario
    this.identidad.setNombreUsuario(this.nuevoUsuarioForm.get('nombreUsuario').value);
    this.identidad.setApellido(this.nuevoUsuarioForm.get('apellido').value);
    this.identidad.setIdentificacion(this.nuevoUsuarioForm.get('identificacion').value);
    this.identidad.setCodigoUsuario(this.nuevoUsuarioForm.get('codigoUsuario').value);
    this.identidad.setUsuarioActivo(this.active);
    this.identidad.setFkidrol(this.nuevoUsuarioForm.get('idRol').value);
    this.identidad.setContrasenia(this.nuevoUsuarioForm.get('contrasenia').value);

    const uploadData = new FormData();
    if (this.selectedFile != null) {

      uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
      console.log(this.selectedFile.size);
    }
    if (this.usuario == null) {

      this._usuarioService.crearUsuario(this.identidad, uploadData).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //this.msg = this.respuesta.msg;
            this.creandoUsuario = false;
            this.enviarMensaje.emit({mensaje:this.respuesta.msg}); 
            this.llamarFormulario.emit({cancel:'1'});

          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        }
        
      );
    } else {//{Actualzia
      this.identidad.setPkidusuario(this.usuario.getPkidusuario());
      this._usuarioService.actualizarUsuario(this.identidad, uploadData).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //this.msg = this.respuesta.msg;
            this.creandoUsuario = false;
            this.enviarMensaje.emit({mensaje:this.respuesta.msg}); 
            this.llamarFormulario.emit({cancel:'1'});
          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
          
        }

      );
    }

    //console.log(this.identidad);

  }


  validarFormulario() {
    if (this.usuario != null) {//si llega por actualizar
      //this.url = this.url.substring(2);
      if (this.usuario.getRutaimagen() != null) {

        this.url = "http://192.168.1.21/SistemaRecaudoBackend/" + (this.usuario.getRutaimagen().substring(3));
      }
      console.log("url: " + this.url.toString());
      this.active = this.usuario.getUsuarioActivo();
      this.textActive = this.active ? "Activado" : "Desactivado";
      this.mensajeBoton = "Actualizar";

      this.idRol = this.usuario.getRoles().pkidrol;
      this.rolName = this.usuario.getRoles().nombrerol;

      console.log(this.usuario);
      this.nuevoUsuarioForm = this.nuevoForm.group({
        codigoUsuario: [this.usuario.getCodigoUsuario(), Validators.required],
        identificacion: [this.usuario.getIdentificacion(), Validators.required],
        nombreUsuario: [this.usuario.getNombreUsuario(), Validators.required],
        apellido: [this.usuario.getApellido(), Validators.required],
        usuarioActivo: [this.usuario.getUsuarioActivo(), Validators.required],
        idRol: [this.idRol, Validators.required],
        contrasenia: '',
        repetirContrasenia: ''
      });

    } else {
      this.mensajeBoton = "Guardar";

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
  }

  activarDesactivarUsuario() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }

  url: any = '../assets/img/empleado.png';

  selectedFile: File = null;

  onFileChanged(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0]
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = reader.result;

      }
    }
  }


  consultarRoles() {
    this._rolesServices.consultarRol().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          this.roles = plainToClass(Rol, this.respuesta.roles);
        }
      },
      error => {
        this.msg = 'Error en el servidor';
        console.log('Error en el servidor');
      }
    );
  }

  closeDialog() {
    this.msg = '';
  }



}

