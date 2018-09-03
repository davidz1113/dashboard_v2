import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { TipoRecaudoServices } from '../../servicios/tipos-services/tiporecaudoServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TipoRecaudo } from '../../modelos/tipos/tiporecaudo';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-plazas-agregar-editar',
  templateUrl: './plazas-agregar-editar.component.html',
  styleUrls: ['./plazas-agregar-editar.component.scss'],
  providers: [PlazaServices, TipoRecaudoServices, ExcepcionService]
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
  @Output() llamarPlaza = new EventEmitter();
  @Output() enviarMensaje = new EventEmitter();

  //mensaje del boton actulizar guardar
  mensajeBoton: string;


  //progress de envio
  creandoplaza = false;

  //objeto para tiposRecaudo
  tiporecaudos: TipoRecaudo[];


  constructor(private nuevoForm: FormBuilder,
    private _tiporecaudoServices: TipoRecaudoServices, private injector: Injector, private _exceptionService: ExcepcionService, private _plazaServices: PlazaServices) { }

  ngOnInit() {
    console.log(this.plaza);
    this.consultarTipoRecaduo();
    this.validarFormulario();
    this.identidad = new PlazaMercado();
  }


  nuevaPlaza() {
    try {
      this.creandoplaza = true;
      //seteamos en el objeto rol las variables del formulario
      this.identidad.setCodigoplaza(this.nuevoPlazaForm.get('codigoplaza').value);
      this.identidad.setNombreplaza(this.nuevoPlazaForm.get('nombreplaza').value);
      this.identidad.setPlazaactivo(this.active);
      let arrTipoReca = this.nuevoPlazaForm.get('pkidtiporecaudo').value;
      let newArrTipo = [];

      arrTipoReca.forEach(element => {
        let rol = element.split('-');
        let id = rol[0];
        let nombre = rol[1];

        newArrTipo.push('"' + id + '"' + ':' + '"' + nombre + '"');
      });

      console.log(newArrTipo);

      if (this.plaza == null) {//significa que esta entrando por un nuevo usuario
        this._plazaServices.crearPlaza(this.identidad, newArrTipo).subscribe(
          response => {
            this.respuesta = response;
            if (this.respuesta.length <= 1) {
              this.msg = 'Error en el servidor';
              console.log('Error en el servidor');
            } else {
              //this.msg = this.respuesta.msg;
              this.creandoplaza = false;
              if (this.respuesta.status == "Exito") {
                this.llamarPlaza.emit({ cancel: '1', mensaje: this.respuesta.msg });
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


      } else {//es en caso que entra por actualizar

      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "nuevoRol()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }
  }


  valueSelect = [];
  validarFormulario() {
    try {
      let tiporReca: any[];

      if (this.plaza != null) {//si llega por actualizar
        this.active = this.plaza.getPlazaactivo();
        this.textActive = this.active ? "Activado" : "Desactivado";
        this.mensajeBoton = "Actualizar";
        //convierte el parametro en array para poder acceder
        tiporReca = (this.plaza.getTiporecaudo());

        var res = Object.keys(tiporReca)
          // iterate over them and generate the array
          .map(function (k) {
            // generate the array element 
            return [+k, tiporReca[k]];
          });
        //console.log(res.length);

        for (let i = 0; i < res.length; i++) {
          //console.log(res[i]);
          let unir = '';
          for (let j = 0; j < res[i].length; j++) {
            //console.log(res[i][j]);
            unir += res[i][j] + "-";
          }
          this.valueSelect.push(unir.slice(0, -1));//cortamos el - final


        }
        this.seleccionados = this.valueSelect;

      } else {

        this.mensajeBoton = "Guardar";
      }

      this.nuevoPlazaForm = this.nuevoForm.group({
        codigoplaza: [this.plaza != null ? this.plaza.getCodigoplaza() : '', Validators.required],
        nombreplaza: [this.plaza != null ? this.plaza.getNombreplaza() : '', Validators.required],
        pkidtiporecaudo: [this.plaza != null ? this.valueSelect : '', Validators.required]
      });
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "ValidarFormulario()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }

  }

  //consultar los tipos de recaudo y mostrarlo en el select
  consultarTipoRecaduo() {
    try {


      this._tiporecaudoServices.consultarTipoRecaudo().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.msg = 'Error en el servidor al consultar los permisos';
            console.log('Error en el servidor al consultar los permisos');
          } else {
            this.tiporecaudos = plainToClass(TipoRecaudo, this.respuesta.tiporecaudo)//recupero los tipos de recuado
            //console.log(this.tiporecaudos);

            //console.log(this.permisos[1].getIcono().length);
          }

        },
        error => {
          this.msg = 'Error en el servidor al consultar los permisos';
          console.log('Error en el servidor al consultar los permisos(tabla modulos)');
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "constultarTipoRecaudo()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);
    }

  }


  activarDesactivarPlaza() {
    this.active = !this.active;
    this.textActive = this.active ? "Activado" : "Desactivado";
  }


  seleccionados;
  //metodo que muestra los seleccionados
  onChangePermisos(event) {
    this.seleccionados = event.value;
    console.log(this.seleccionados);
  }

  /*
    MEtoido que captura las excepciones y las envia al servicio de capturar la excepcion
  */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !"error") {
            console.log('La excepcion se envio correctamente');
          }
        }
      },
      error => {
        console.log('Error en el servidor al enviar excepcion');
      }

    );
  }
}
