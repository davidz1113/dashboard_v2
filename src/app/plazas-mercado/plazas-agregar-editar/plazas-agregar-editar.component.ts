import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { PlazaServices } from '../../servicios/plazaServices.services';

@Component({
  selector: 'app-plazas-agregar-editar',
  templateUrl: './plazas-agregar-editar.component.html',
  styleUrls: ['./plazas-agregar-editar.component.scss'],
  providers: [PlazaServices]
})
export class PlazasAgregarEditarComponent implements OnInit {

  //formulario reactive
  nuevoPlazaForm: FormGroup;

  //Objeto de tipo usuario
  public identidad: PlazaMercado;

  //para mostrar el formulario de usuario
  nPlaza = true;

  //actvar Plaza, desactivar Plaza
  active = false;
  textActive = "Desactivado";


  //respuesta del servidor
  public respuesta;

  //mensaje dialog error creacion de Plaza
  msg: string = '';


  //traemos el Plaza desde el componente tabla Plaza
  @Input() plaza: PlazaMercado;

  //enviar mensaje y alternar entre formualrios
  @Output()llamarPlaza = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();

  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoplaza = false;


  constructor(private nuevoForm: FormBuilder,
    private _plazasServices: PlazaServices) { }

  ngOnInit() {
    console.log(this.plaza);
    
    this.validarFormulario();
    this.identidad = new PlazaMercado();
  }


  nuevaPlaza(){
    this.creandoplaza = true;
    //seteamos en el objeto rol las variables del formulario
    this.identidad.setCodigoplaza(this.nuevoPlazaForm.get('codigoplaza').value);
    this.identidad.setNombreplaza(this.nuevoPlazaForm.get('nombreplaza').value);
    this.identidad.setPlazaactivo(this.active);

    if(this.plaza == null){//significa que esta entrando por un nuevo usuario

    }else{//es en caso que entra por actualizar

    }
  }


  validarFormulario() {
   
    if (this.plaza != null) {//si llega por actualizar
      this.active = this.plaza.getPlazaactivo();
      this.textActive = this.active ? "Activado" : "Desactivado";
      this.mensajeBoton = "Actualizar";
      //convierte el parametro en array para poder acceder

    } else {

      this.mensajeBoton = "Guardar";
    }

    this.nuevoPlazaForm = this.nuevoForm.group({
      codigoplaza: [this.plaza != null ? this.plaza.getCodigoplaza() : '', Validators.required],
      nombreplaza: [this.plaza != null ? this.plaza.getNombreplaza() : '', Validators.required],
    });

  
}

activarDesactivarPlaza(){
  this.active = !this.active;
  this.textActive = this.active ? "Activado" : "Desactivado";
}


}
