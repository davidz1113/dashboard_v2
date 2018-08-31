import { Component, OnInit, Input } from '@angular/core';
import { RolesServices } from '../../servicios/rolesServices.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Rol } from '../../modelos/rol';

@Component({
  selector: 'app-roles-agregar-editar',
  templateUrl: './roles-agregar-editar.component.html',
  styleUrls: ['./roles-agregar-editar.component.scss'],
  providers: [RolesServices]
})
export class RolesAgregarEditarComponent implements OnInit {

  //formulario reactive
  nuevoRolForm: FormGroup;

  //Objeto de tipo usuario
  public identidad: Rol;

  //para mostrar el formulario de usuario
  nRol = true;

  //actvar user, desactivar usuario
  active = false;
  textActive = "Desactivado";


  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de rol
  msg: string = '';


  //traemos el rol desde el componente tabla rol
  @Input() rol: Rol;


  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoRol = false;

  constructor(private nuevoForm: FormBuilder,
    private _rolesServices: RolesServices) { }

  ngOnInit() {
    //validamos el formulario
    this.validarFormulario();
    this.identidad = new Rol(0, 0, '', 'true', '', new Date, new Date, '');
  }


  //conecta a la api rest e inserta o actualiza  los campos del rol
  nuevoRol() {
    this.creandoRol = true;
    //seteamos en el objeto rol las variables del formulario
    this.identidad.setCodigoRol(this.nuevoRolForm.get('codigorol').value);
    this.identidad.setNombreRol(this.nuevoRolForm.get('nombrerol').value);
    this.identidad.setDescripcionRol(this.nuevoRolForm.get('descripcionrol').value);
    this.identidad.setRolactivo(this.active);

    if (this.rol == null) {//Si el usuario de entrada por input es vacio significa q es un nuevo usuario
      this._rolesServices.crearRol(this.identidad).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //this.msg = this.respuesta.msg;
            this.creandoRol = false;
            //this.enviarMensaje.emit({mensaje:this.respuesta.msg}); 
            //this.llamarFormulario.emit({cancel:'1'});

          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        }

      );
    } else {//si llega el rol por el parametro input
      this.identidad.setPkidrol(this.rol.getPkidrol());
      this._rolesServices.actualizarRol(this.identidad).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //this.msg = this.respuesta.msg;
            this.creandoRol = false;
            //this.enviarMensaje.emit({mensaje:this.respuesta.msg}); 
            // this.llamarFormulario.emit({cancel:'1'});
          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');

        }

      );

    }

  }


  validarFormulario() {
    if (this.rol != null) {//si llega por actualizar
      this.active = this.rol.getRolactivo();
      this.textActive = this.active ? "Activado" : "Desactivado";
      this.mensajeBoton = "Actualizar";
    }else{
      this.mensajeBoton = "Guardar";
    }

    this.nuevoRolForm = this.nuevoForm.group({
      codigorol: [this.rol!=null?this.rol.getCodigoRol():'', Validators.required],
      nombrerol: [this.rol!=null?this.rol.getNombreRol():'', Validators.required],
      descripcionrol: [this.rol!=null?this.rol.getDescripcionRol():'', Validators.required],
    });

  }


  activarDesactivarRol() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }

  
  closeDialog() {
    this.msg = '';
  }
}
