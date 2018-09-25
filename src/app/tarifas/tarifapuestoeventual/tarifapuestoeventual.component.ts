import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { TarifaPuestoEventualService } from '../../servicios/tarifapuestoeventual.service';
import { TarifaPuestoEventual } from '../../modelos/tarifaPuestoEventual';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { GLOBAL } from '../../servicios/globales';
import { Router } from '@angular/router';
import { TarifasServices } from '../../servicios/tarifasdinamicosService.services';
import { TablaTarifasDinamicaComponent } from '../../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';

@Component({
  selector: 'app-tarifa-puesto-eventual',
  templateUrl: './tarifapuestoeventual.component.html',
  providers: [ExcepcionService, PlazaServices, TarifaPuestoEventualService, TarifasServices]
})
export class TarifaPuestoEventualComponent implements OnInit {

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Componente hijo tabla dinamica
   */
  @ViewChild(TablaTarifasDinamicaComponent) tablacomponent: TablaTarifasDinamicaComponent;

  /**
   * Tarifas registradas en el sistema
   */
  tarifasPuestoEventual: TarifaPuestoEventual[] = [];

  /**
   * Filtro de plazas
   */
  filtroplaza: any = {}

  /**
   * Filtro activo/inactivo
   */
  filtroactivo: any = {}

  /**
   * Plazas de mercado en el sistema
   */
  plazas: PlazaMercado[] = [];

  /**
   * Muestra u oculta la tabla de tarifas
   */
  oculta = false;

  /**
   * Estado de filtro activo/inactivo
   */
  estadoToggle = false;

  /**
   * Fecha actual
   */
  currentDate: Date = new Date();

  /**
   * Filtros
   */
  filtros: any[] = [];

  /**
   * clase dinamica pra carga de mensajes
   */
  claseDinamic = 'alert alert-warning alert-with-icon';

  /**
   * Iconono alerta mensaje
   */
  iconAlert = 'warning';

  /**
   * mensaje de respuesta
   */
  public mensaje: string;

  /**
   * captura de la respuesta del servidor global
   */
  public respuesta;

  /**
   * Url o nombre del controlador
   */
  url: string;

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Plaza seleccionada para el filtro
   */
  plazaselect = '';

  /**
   * Plaza seleccionada para el filtro
   */
  sectorselect = '';

  /**
   * Formulario de registro
   */
  puestoEventualForm: FormGroup;

  /**
   * Texto toggle
   */
  textActive = 'Desactivado';

  /**
   * Estado de la puerta
   */
  active = false;

  /**
   * Archivo a subir
   */
  selectedFile: File = null;

  // url: any = '../' + GLOBAL.urlBase + '/assets/img/empleado.png';
  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  constructor(
    private _plazaService: PlazaServices,
    private _exceptionService: ExcepcionService,
    private injector: Injector,
    private _tarifaPuestoEventualService: TarifaPuestoEventualService,
    private router: Router,
    private _tarifasServices: TarifasServices
  ) { }

  ngOnInit() {
    this.inicializaForm();
    this.consultarPlazas();
    this.listarTarifasPuestoEventual();
    this.url = this.router.url.substring(15);
  }

  // ----------------------------------------------------------------------------------------------------------
  // Métodos
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Muestra u oculta la lista de tarifas
   */
  mostrarOcultar() {
    this.oculta = !this.oculta;
  }

  /**
   * Modifica el filtro
   */
  guardarFiltroplaza(event) {
    const index = this.filtros.indexOf(this.filtroplaza);
    if (index > -1) {
      this.filtros.splice(index, 1)
    }
    this.filtroplaza = {
      nombreatributo: 'pkidplaza',
      valor: event.value
    }
    this.filtros.push(this.filtroplaza);
    this.tablacomponent.recibirFiltros(this.filtros);
  }

  /**
   * Guarda el filtro por activo o inactivo
   */
  guardarFiltroActivo() {
    const index = this.filtros.indexOf(this.filtroactivo);
    if (index > -1) {
      this.filtros.splice(index, 1)
    }

    this.filtroactivo = {
      nombreatributo: 'tarifapuestoeventualactivo',
      valor: !this.estadoToggle
    }
    this.filtros.push(this.filtroactivo);
    console.log(this.filtros);
    this.tablacomponent.recibirFiltros(this.filtros);
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialog() {
    this.mensaje = '';
  }


  /**
   * Consulta los datos
   * @param nombrecontrolador nombre de EL CONTROLADOR(TABLA) que se quiere hacer una consulta de todos los datos(query)
   * @param numero numero por el cual se llenara la variable correspondiente
   */
  consultarDatos(nombrecontrolador: string, numero: number): any {
    this._tarifasServices.consultarDatos('/' + nombrecontrolador).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Ocurrio un error, intentelo nuevamente';
          console.log('Ocurrio un error, intentelo nuevamente');
        } else {
          console.log(this.respuesta[nombrecontrolador]);
          if (numero === 1) { // si es numero 1 se llena las plazas de mercado
            this.plazas = this.respuesta[nombrecontrolador];
          } else if (numero === 2) {
            this.tarifasPuestoEventual = this.respuesta[nombrecontrolador];
          }
        }
      },
      error => {
        this.mensaje = 'Ocurrio un error, intentelo nuevamente';
        console.log(<any>error, 'Ocurrio un error, intentelo nuevamente');
        this.respuesta = null;
      }
    )
  }

  // ----------------------------------------------------------------------------------------------------------
  // Métodos Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Inicializa el formulario de plazas
   */
  inicializaForm() {
    this.puestoEventualForm = new FormGroup({
      valortarifapuestoeventual: new FormControl(null, Validators.required),
      numeroresoluciontarifapuestoeventual: new FormControl(null, Validators.required),
      tarifapuestoeventualactivo: new FormControl(false),
      descripciontarifapuestoeventual: new FormControl(null),
      fkidplaza: new FormControl(null, Validators.required)
    });
  }

  /**
   * Lista todas las tarifas de puesto eventual registradas en el sistema
   */
  listarTarifasPuestoEventual() {
    this._tarifaPuestoEventualService.consultarTarifaPuestoEventual().subscribe(
      (resp: any) => {
        this.tarifasPuestoEventual = resp.tarifapuestoeventual;
        console.log(this.tarifasPuestoEventual);
      }
    );
  }

  /**
   * Guarda los cambios del formulario (Agregar - Editar)
   */
  guardarCambios() {

    try {
      const nuevaTarifa = new TarifaPuestoEventual(
        this.puestoEventualForm.value.valortarifapuestoeventual,
        this.puestoEventualForm.value.numeroresoluciontarifapuestoeventual,
        this.puestoEventualForm.value.tarifapuestoeventualactivo,
        this.puestoEventualForm.value.descripciontarifapuestoeventual,
        this.puestoEventualForm.value.fkidplaza
      );
      const uploadData = new FormData();
      if (this.selectedFile != null) {

        uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
        console.log(this.selectedFile.size);
      }


      this._tarifasServices.crearTarifa(nuevaTarifa, uploadData,this.url).subscribe(
        resp => {
          console.log(resp);
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'guardarCambios()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }

  cancelarEdicion() {
    this.mostrarOcultar();
  }
  /**
   * Cambia el estado de una puerta
   */
  cambiarEstadoForm() {
    this.active = !this.active;
    this.textActive = this.active ? 'Activado' : 'Desactivado';
  }

  /**
   * Método de seleccionar archivo
   */
  onFileChanged(event) {
    try {

      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        this.selectedFile = event.target.files[0]
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = () => { // called once readAsDataURL is completed
          // this.url = reader.result;
        }
      }
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'onFileChanged()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      // console.log("error asdasd a:" + e.stack);

    }
  }

  /**
   * 
   * @param event 
   */
  llamarFormulario(event){
    console.log(event.objeto);
    
    this.oculta = !this.oculta;

  }


  /**
   * Consulta las plazas que existen en el sistema
   */
  consultarPlazas() {

    this.consultarDatos('plaza', 1);
    // try {

    //   this._plazaService.consultarTodasPlazas().subscribe(
    //     (resp: any) => {
    //       this.plazas = resp.plaza;
    //       // console.log(this.plazas);
    //     }
    //   );

    // } catch (e) {
    //   const mensaje = e.message ? e.message : e.toString();
    //   const funcion = 'consultarPlazas()';

    //   const location = this.injector.get(LocationStrategy);
    //   const url = location instanceof PathLocationStrategy ? location.path() : '';
    //   this.enviarExcepcion(mensaje, e, funcion, url);
    // }
  }

  /**
   * Envia la excepcion
   * @param mensaje
   * @param e
   * @param funcion
   * @param url
   */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !'error') {
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
