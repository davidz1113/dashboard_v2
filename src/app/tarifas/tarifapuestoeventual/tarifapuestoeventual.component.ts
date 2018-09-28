import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TarifaPuestoEventual } from '../../modelos/tarifaPuestoEventual';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { GLOBAL } from '../../servicios/globales';
import { Router } from '@angular/router';
import { TarifasServices } from '../../servicios/tarifasdinamicosService.services';
import { TablaTarifasDinamicaComponent } from '../../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';

@Component({
  selector: 'app-tarifa-puesto-eventual',
  templateUrl: './tarifapuestoeventual.component.html',
  providers: [ExcepcionService, TarifasServices]
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
   * Mensaje de error en el formulario
   */
  public mensajeForm: string;

  /**
   * captura de la respuesta del servidor global
   */
  public respuesta;

  /**
   * Url o nombre del controlador
   */
  url: string;

  tarifaEdit: TarifaPuestoEventual;
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

  /**
   * Url de documento
   */
  urlDocumento: any;

  /**
   * Link al documento
   */
  linkDocumento: any;

  barraProgresoForm = false;

  // url: any = '../' + GLOBAL.urlBase + '/assets/img/empleado.png';
  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  constructor(
    private _exceptionService: ExcepcionService,
    private injector: Injector,
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
    console.log('edit:   ' + this.tarifaEdit);

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
    // console.log(this.filtros);
    this.tablacomponent.recibirFiltros(this.filtros);
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialog() {
    this.mensaje = '';
  }

  /**
   * Cierra el dialogo del mensaje
   */
  closeDialogForm() {
    this.mensajeForm = '';
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
        console.log(this.respuesta);
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Ocurrio un error, intentelo nuevamente';
          console.log('Ocurrio un error, intentelo nuevamente');
        } else {
          // console.log(this.respuesta[nombrecontrolador]);
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

  /**
   * Método llamado cuando se va a crear una nueva tarifa
   */
  nuevaTarifa() {
    this.tarifaEdit = null;
    this.inicializaForm();
    this.mostrarOcultar();
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
   * Inicializa el formulario de plazas
   */
  inicializaFormEdit() {

    if (this.tarifaEdit !== undefined || this.tarifaEdit !== null) {
      // console.log('Tarifa a editar:  ' + JSON.stringify(this.tarifaEdit));
      this.puestoEventualForm = new FormGroup({
        valortarifapuestoeventual: new FormControl(this.tarifaEdit.valortarifapuestoeventual, Validators.required),
        numeroresoluciontarifapuestoeventual: new FormControl(this.tarifaEdit.numeroresoluciontarifapuestoeventual, Validators.required),
        tarifapuestoeventualactivo: new FormControl(this.tarifaEdit.tarifapuestoeventualactivo),
        descripciontarifapuestoeventual: new FormControl(this.tarifaEdit.descripciontarifapuestoeventual),
        fkidplaza: new FormControl(this.tarifaEdit.pkidplaza, Validators.required)
      });

      this.linkDocumento = (GLOBAL.urlImagen + this.tarifaEdit.documentoresoluciontarifapuestoeventual.substring(3));
      this.urlDocumento = this.tarifaEdit.documentoresoluciontarifapuestoeventual.substring(18);
    }
  }

  /**
   * Lista todas las tarifas de puesto eventual registradas en el sistema
   */
  listarTarifasPuestoEventual() {
    this.consultarDatos('tarifapuestoeventual', 2);
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

      if (this.tarifaEdit === null || this.tarifaEdit === undefined) {
        this.selectedFile = null;
        this.urlDocumento = '';
        this.inicializaForm();
        const uploadData = new FormData();

        if (this.selectedFile != null) {
          uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
          // console.log(this.selectedFile.size);
        }

        // this.barraProgresoForm = true;

        this._tarifasServices.crearTarifa(nuevaTarifa, uploadData, this.url).subscribe(
          resp => {
            // console.log(resp);
            this.mostrarOcultar();
            this.mensaje = resp.msg;
            this.mostrarMensaje(1);
            this.barraProgresoForm = false;
            this.selectedFile = null;
            this.linkDocumento = '';
            this.urlDocumento = '';

          }, error => {
            this.mostrarMensaje(0);
            this.mensajeForm = 'Error en el servidor';
            this.barraProgresoForm = false;
          }
        );
      } else {

        nuevaTarifa.pkidtarifapuestoeventual = this.tarifaEdit.pkidtarifapuestoeventual;
        // = this.tarifaEdit.documentoresoluciontarifapuestoeventual;
        const uploadData = new FormData();

        if (this.selectedFile != null) {
          uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
          console.log(this.selectedFile.size);
        }

        this.barraProgresoForm = true;

        this._tarifasServices.editarTarifa(nuevaTarifa, uploadData, this.url).subscribe(
          resp => {
            // console.log(resp);
            if (resp.status === 'error') {
              this.mostrarMensaje(0);
              this.mensajeForm = resp.msg;
              this.barraProgresoForm = false;
              this.selectedFile = null;
              this.linkDocumento = '';
              this.urlDocumento = '';
            } else {
              this.mostrarMensaje(1);
              this.mostrarOcultar();
              this.mensaje = resp.msg;
              this.barraProgresoForm = false;
              this.selectedFile = null;
              this.linkDocumento = '';
              this.urlDocumento = '';
            }
          }, error => {
            this.mostrarMensaje(0);
            this.mensajeForm = 'Error en el servidor';
            this.barraProgresoForm = false;
          }
        );
      }

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      const funcion = 'guardarCambios()';

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
    }
  }

  /**
   * Muestra el mensaje de confirmación
   * @param codeError Codigo de error
   */
  mostrarMensaje(codeError: number) {
    if (codeError === 1) {
      this.claseDinamic = 'alert alert-success alert-with-icon';
      this.iconAlert = 'done';
    } else if (codeError === 0) {
      this.claseDinamic = 'alert alert-warning alert-with-icon';
      this.iconAlert = 'warning';
    }
  }

  /**
   * Cancela una edición
   */
  cancelarEdicion() {
    this.selectedFile = null;
    this.urlDocumento = '';
    this.tarifaEdit = null;
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
        this.selectedFile = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        if (this.selectedFile !== null) {
          this.urlDocumento = this.selectedFile.name;
        }
        reader.onload = () => { // called once readAsDataURL is completed
          // this.urlDocumento = reader.result;
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
   * llama el formulario de editar con el objeto respectivo
   * @param event Evento del emmiter
   */
  llamarFormularioEditar(event) {
    this.tarifaEdit = event.objeto;
    this.inicializaFormEdit();
    this.mostrarOcultar();
  }

  /**
   * Consulta las plazas que existen en el sistema
   */
  consultarPlazas() {
    this.consultarDatos('plaza', 1);
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
