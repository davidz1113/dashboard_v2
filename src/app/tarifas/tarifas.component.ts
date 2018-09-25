import { Component, OnInit, Injector } from '@angular/core';
import { PlazaMercado } from '../modelos/plaza-mercado';
import { ExcepcionService } from '../servicios/excepcionServices.services';
import { PlazaServices } from '../servicios/plazaServices.services';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GLOBAL } from '../servicios/globales';
import { TarifaPuestoEventualService } from '../servicios/tarifapuestoeventual.service';
import { TarifaPuestoEventual } from '../modelos/tarifaPuestoEventual';
import { SectorInterface } from '../sectores/sectores.component';
import { SectoresServices } from '../servicios/sectorServices.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  providers: [ExcepcionService, PlazaServices, TarifaPuestoEventualService, SectoresServices]
})
export class TarifasComponent implements OnInit {

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------

  tarifasPuestoEventual: TarifaPuestoEventual[] = [];

  /**
   * Muestra u oculta la tabla de tarifas
   */
  oculta = false;

  /**
   * Fecha actual
   */
  currentDate: Date = new Date();

  /**
   * Filtros
   */
  filtros: any[] = [];

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades Formulario
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Plazas de mercado en el sistema
   */
  plazas: PlazaMercado[] = [];

  /**
   * Sectores
   */
  sectores: SectorInterface[] = [];

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

  url: any = '../' + GLOBAL.urlBase + '/assets/img/empleado.png';
  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  constructor(
    private _plazaService: PlazaServices,
    private _exceptionService: ExcepcionService,
    private injector: Injector,
    private _tarifaPuestoEventualService: TarifaPuestoEventualService,
    private _sectorService: SectoresServices
  ) { }

  ngOnInit() {
    this.inicializaForm();
    this.consultarPlazas();
    this.listarTarifasPuestoEventual();
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
  modificarFiltroPlaza() {
    this.filtros.push(
      { 'nombreFiltro': 'plaza', 'valorFiltro': this.plazaselect }
    );
    console.log(JSON.stringify(this.filtros));
  }

  consultarSectores(pPkidPlaza: string) {

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


      this._tarifaPuestoEventualService.crearTarifaPuestoEventual(nuevaTarifa,uploadData).subscribe(
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
          this.url = reader.result;
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
   * Consulta las plazas que existen en el sistema
   */
  consultarPlazas() {
    try {

      this._plazaService.consultarTodasPlazas().subscribe(
        (resp: any) => {
          this.plazas = resp.plaza;
          // console.log(this.plazas);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'consultarPlazas()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
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
