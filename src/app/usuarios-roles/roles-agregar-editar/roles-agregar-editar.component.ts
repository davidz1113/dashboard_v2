import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { RolesServices } from '../../servicios/rolesServices.services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Rol } from '../../modelos/rol';
import { Modulo } from '../../modelos/modulo';
import { ModuloServices } from '../../servicios/moduloServices.service';
import { plainToClass } from "class-transformer";
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-roles-agregar-editar',
  templateUrl: './roles-agregar-editar.component.html',
  styleUrls: ['./roles-agregar-editar.component.scss'],
  providers: [RolesServices,ModuloServices]
})
export class RolesAgregarEditarComponent implements OnInit {

  //formulario reactive
  nuevoRolForm: FormGroup;

  //Objeto de tipo usuario
  public identidad: Rol;

  //para mostrar el formulario de usuario
  nRol = true;

  //actvar rol, desactivar rol
  active = false;
  textActive = "Desactivado";


  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de rol
  msg: string = '';


  //traemos el rol desde el componente tabla rol
  //@Input() rol: Rol;

  //PAra alternar entre formularios Y ENVIAR MENSAJE
  @Output() llamarTablaRol = new EventEmitter;
  //@Output() enviarMensaje = new EventEmitter();

  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoRol = false;


  //variable de consulta de permisos
  permisos: Modulo[];


  constructor(private nuevoForm: FormBuilder,
    private _rolesServices: RolesServices,private _modulosServices: ModuloServices) { }

  ngOnInit() {
    //validamos el formulario
    this.consultarPermisos()
    this.validarFormulario();
    this.identidad = new Rol(0, 0, '', 'true', '', new Date, new Date, '');
  }

  //metodo que consulta los permisos de la tabla modulo
  //para setearlos en el objeto de permisos
  consultarPermisos(){
    this._modulosServices.consultarModulos().subscribe(
      response=>{
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.msg = 'Error en el servidor al consultar los permisos';
          console.log('Error en el servidor al consultar los permisos');
        } else {

         
          this.permisos =  plainToClass(Modulo, this.respuesta.modulo)//recupero los permisos

          console.log(this.permisos[1].getIcono().length);
        }
        
      },
      error=>{
        this.msg = 'Error en el servidor al consultar los permisos';
        console.log('Error en el servidor al consultar los permisos(tabla modulos)');

      }

    );
  }


  //conecta a la api rest e inserta o actualiza  los campos del rol
  nuevoRol() {
    this.creandoRol = true;
    //seteamos en el objeto rol las variables del formulario
    this.identidad.setCodigoRol(this.nuevoRolForm.get('codigorol').value);
    this.identidad.setNombreRol(this.nuevoRolForm.get('nombrerol').value);
    this.identidad.setDescripcionRol(this.nuevoRolForm.get('descripcionrol').value);
    this.identidad.setRolactivo(this.active);
    let arrPermisos = this.nuevoRolForm.get('pkidmodulo').value;
    let arrModulo = [];
    let stringMod='';
    
    arrPermisos.forEach(element => {
    let rol= element.split('-');
    let id = rol[0];
    let nombre = rol[1];
      
    arrModulo.push('"'+id+'"'+':'+'"'+nombre+'"');
   });

   console.log(arrModulo);
   
   

    //console.log(arrPermisos);
    
   /* let modulo={pkidmodulo:null,nombrepermiso:''};
    let arrModulo = [];


    for(let i = 0 ;i<this.permisos.length;i++){
      for(let j = 0 ; j<arrPermisos.length;j++){
        if(arrPermisos[j]==this.permisos[i].getPkidmodulo()){
          modulo.pkidmodulo=arrPermisos[i];
          modulo.nombrepermiso= this.permisos[i].getNombrepermiso();
          arrModulo.push({modulo});
          return;
        }
      }
    }

    this.permisos.map((perm,i)=>{
      


    });
    */

    //this.identidad.setPermiso(this.nuevoRolForm.get('pkidmodulo').value);

   // if (this.rol == null) {//Si el usuario de entrada por input es vacio significa q es un nuevo usuario
      
      this._rolesServices.crearRol(this.identidad,arrModulo).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor';
            console.log('Error en el servidor');
          } else {
            //this.msg = this.respuesta.msg;
            this.creandoRol = false;
            if (this.respuesta.status == "Exito") {
              //this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
              this.llamarTablaRol.emit({ cancel: '1' });
            } else {
              this.msg = this.respuesta.msg;
            }

          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        }

      );

      /*
    } else {//si llega el rol por el parametro input es actualizar
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
            this.enviarMensaje.emit({ mensaje: this.respuesta.msg });
            this.llamarTablaRol.emit({ cancel: '1' });
          }
        },
        error => {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor'+error);

        }

      );

    }*/

  }


  validarFormulario() {
   /* if (this.rol != null) {//si llega por actualizar
      this.active = this.rol.getRolactivo();
      this.textActive = this.active ? "Activado" : "Desactivado";
      this.mensajeBoton = "Actualizar";
    }else{*/

      this.mensajeBoton = "Guardar";
    //}

    this.nuevoRolForm = this.nuevoForm.group({
      codigorol: [/*this.rol!=null?this.rol.getCodigoRol():*/'', Validators.required],
      nombrerol: [/*this.rol!=null?this.rol.getNombreRol():*/'', Validators.required],
      descripcionrol: [/*this.rol!=null?this.rol.getDescripcionRol():*/'', Validators.required],
      pkidmodulo: ['', Validators.required]
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
