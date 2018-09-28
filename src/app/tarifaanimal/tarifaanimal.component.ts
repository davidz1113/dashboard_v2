import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TarifasServices } from '../servicios/tarifasdinamicosService.services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TablaTarifasDinamicaComponent } from '../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';
import { GLOBAL } from '../servicios/globales';
@Component({
    selector: 'app-tarifaanimal',
    templateUrl: './tarifaanimal.component.html',
    providers: [TarifasServices]
})
export class TarifaanimalComponent implements OnInit {

    //toggle filtro activos/descativados
    toggleActDesc: boolean = false;

    //url o nombre del controlador
    url: string;
    //variables para los selectores
    plazasmercado: any[] = [];
    tiposanimal: any[] = [];

    //captura de la respuesta del servidor global
    public respuesta;
    //mensaje de respuesta
    mensaje: string;


    //clase dinamica pra carga de mensajes
    claseDinamic = "alert alert-warning alert-with-icon";
    iconAlert = "warning";

    /**
     * -------------------Variables para el formulario---------------------------
     */

    documento = ' Seleccionar documento de resolución';
    urldocumento :string='';


    //actvar , desactivar 
    active = false;
    textActive = "Desactivado";
    //mensaje del boton actulizar guardar
    mensajeBoton: string;

    //mensaje para mostrar en el formulario de agregar
    msg: string = '';
    //progreso de envio
    creandotarifa: boolean = false;

    /**
     * Muestra u oculta la tabla de tarifas
    */
    oculta = false;

    /**
  * Archivo a subir
  */
    selectedFile: File = null;

    //objeto de tipo tarifa
    public tarifa: any = null;

    //objeto de formgroup para obtener los datos del formulario
    nuevoTarifaForm: FormGroup;

    //variable que valida si esta por actualizar o guardar un nuevo
    isUpdate = false;

    tablatarifa;//obtener el nombre de la tabla para llenado

    //instancia del componente hijo para el envio de paramtreos y/o llamads de funciones
    @ViewChild(TablaTarifasDinamicaComponent) tablacomponent: TablaTarifasDinamicaComponent;

    constructor(private router: Router, private _tarifasServices: TarifasServices, private nuevoForm: FormBuilder) {
    }


    ngOnInit(): void {
        this.consultarPlazas();
        this.consultarTiposAnimal();
        this.url = this.router.url.substring(15);
        this.tablatarifa =this.url.substring(1);
    }

    /**
     * Metodo que consultar todas las plazas de mercado para listarlas en el selector plazas de mercado
     */
    consultarPlazas() {
        this.consultarDatos('plaza', 1);
    }

    /**
     * Metodo que consulta todos los tipos de animales para listarlas en el selector de tipos de animal
     */
    consultarTiposAnimal() {
        this.consultarDatos('tipoanimal', 2);
    }


    /**
     * 
     * @param nombrecontrolador nombre de EL CONTROLADOR(TABLA) que se quiere hacer una consulta de todos los datos(query)
     * @param numero numero por el cual se llenara la variable correspondiente 
     */
    consultarDatos(nombrecontrolador: string, numero: number): any {
        this._tarifasServices.consultarDatos("/" + nombrecontrolador).subscribe(
            response => {
                this.respuesta = response;
                if (this.respuesta.length <= 1) {
                    this.mensaje = 'Ocurrio un error, intentelo nuevamente';
                    console.log('Ocurrio un error, intentelo nuevamente');
                } else {
                    console.log(this.respuesta[nombrecontrolador]);
                    if (numero == 1) {//si es numero 1 se llena las plazas de mercado
                        this.plazasmercado = this.respuesta[nombrecontrolador];
                    } else {
                        this.tiposanimal = this.respuesta[nombrecontrolador];
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
    filtros: any[] = [];

    /**
     * 
     * @param event valor del filtro
     */
    filtroplaza: any = {}
    guardarFiltroplaza(event) {
        const index = this.filtros.indexOf(this.filtroplaza);
        if (index > -1) this.filtros.splice(index, 1);
        this.filtroplaza = {
            nombreatributo: 'pkidplaza',
            valor: event.value
        }
        this.filtros.push(this.filtroplaza);
        this.tablacomponent.recibirFiltros(this.filtros);
        //this._tarifasServices.agregarFiltros(this.filtros);
    }

    /**
     //  * 
     //  * @param event valor del filtro
     //  */
    filtrotipo: any = {};
    guardarFiltrotipo(event) {
        const index = this.filtros.indexOf(this.filtrotipo);
        if (index > -1) this.filtros.splice(index, 1);

        this.filtrotipo = {
            nombreatributo: 'pkidtipoanimal',
            valor: event.value
        }
        this.filtros.push(this.filtrotipo);
        this.tablacomponent.recibirFiltros(this.filtros);

        //this._tarifasServices.agregarFiltros(this.filtros);

    }


    /**
     * Metodo que guarda el valor del toggle
     */
    filtrotogle: any = {};
    guardarToggle() {
        const index = this.filtros.indexOf(this.filtrotogle);
        if (index > -1) this.filtros.splice(index, 1);
        this.filtrotogle = {
            nombreatributo: (this.tablatarifa + 'activo'),
            valor: !this.toggleActDesc //se envia la negacion del valor del togle que tenga actualmente
        }
        this.filtros.push(this.filtrotogle);
        this.tablacomponent.recibirFiltros(this.filtros);
    }

    /**
     * 
     * @param event objecto a editar que llega desde la tabla
     */
    llamarFormulario(event) {
        this.mensaje='';
        this.msg='';
        this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
        this.selectedFile = null;
        this.tarifa = event != null ? event.objeto : null; //validamos q sea diferente de null
        this.isUpdate = event != null ? true : false; // si es actualizar o nuevo
        //validamos el formulario solo en caso que este este visible
        if (this.oculta) {
            this.nuevoTarifaForm = this.nuevoForm.group({
                valor: [this.tarifa != null ?  this.tarifa['valor' + this.tablatarifa] : '', Validators.required],
                descripcion: [this.tarifa != null ? this.tarifa['descripcion' + this.tablatarifa] : ''],
                numero: [this.tarifa != null ?  this.tarifa['numeroresolucion' + this.tablatarifa] : '', Validators.required],
                fkidplaza: [this.tarifa != null ? this.tarifa.pkidplaza : '', Validators.required],
                fkidtipoanimal: [this.tarifa != null ? this.tarifa.pkidtipoanimal : '', Validators.required]
            });
        }
        if(this.tarifa!=null){//validacion para mostrar el documento o url
            if(this.tarifa.documentoresoluciontarifaanimal!='sin documento'){
                this.urldocumento = (GLOBAL.urlImagen+this.tarifa.documentoresoluciontarifaanimal.substring(3));
                this.documento = this.tarifa.documentoresoluciontarifaanimal.substring(18);
            }else{
                this.documento = 'Seleccionar documento de resolución';
            }
        }else{
            this.toggleActDesc = false;
            this.documento = 'Seleccionar documento de resolución';
            this.urldocumento='';
        }
        this.active = this.tarifa != null ?  this.tarifa[this.tablatarifa + 'activo'] : false;
        this.textActive = this.active ? "Activado" : "Desactivado";
        //si el zona es nullo, significa que entra por un nuevo objeto
        this.mensajeBoton = this.tarifa == null ? "Guardar" : "Actualizar";
        console.log(this.tarifa);
    }

    /**
     * PAra activar y desactivar el toggle
     */
    activarDesactivarTarifa() {
        this.active = !this.active;
        this.textActive = this.active ? "Activado" : "Desactivado";
    }

    deleteFile(){
        this.selectedFile=null;this.documento='Seleccionar documento de resolución';this.urldocumento=''
        this.tarifa['documentoresolucion' + this.tablatarifa]=false;
    }

    /**
     * Metodo que guarda o actualiza los cambios de una tarifa
     */
    guardarActualizarCambios() {
        this.creandotarifa = true;
        this.msg='';
        if (this.tarifa == null){//significa que es una nueva tarifa
          /*this.tarifa = {
            pkidtarifaanimal: null,valortarifaanimal:0, descripciontarifaanimal: '', numeroresoluciontarifaanimal: '', documentoresoluciontarifaanimal: null, fkidplaza: null, fkidtipoanimal: null,tarifaanimalactivo: false
          };*/
          //this.selectedFile = null;
          this.tarifa = {};
          
        } 

        if(this.urldocumento=''){
        }
        
       
        this.tarifa['valor' + this.tablatarifa] = this.nuevoTarifaForm.get('valor').value;
        this.tarifa['descripcion' + this.tablatarifa] = this.nuevoTarifaForm.get('descripcion').value;
        this.tarifa['numeroresolucion' + this.tablatarifa] = this.nuevoTarifaForm.get('numero').value;
        this.tarifa['fkidplaza'] = this.nuevoTarifaForm.get('fkidplaza').value;
        this.tarifa['fkidtipoanimal'] = this.nuevoTarifaForm.get('fkidtipoanimal').value;
        this.tarifa[this.tablatarifa + 'activo'] = (this.active);

        console.log(this.tarifa);
        

        this.msg = ''; //cerramos el mensaje de alerta del formulario
        const uploadData = new FormData();
        if (this.selectedFile != null) {
            uploadData.append('fichero_usuario', this.selectedFile, this.selectedFile.name);
            console.log(this.selectedFile.name);
        }

        if (!this.isUpdate) {//entra por agregar una nueva tarifa 

            this._tarifasServices.crearTarifa(this.tarifa, uploadData, this.url).subscribe(
                response => {
                    this.respuesta = response;
                    if (this.respuesta.length <= 1) {
                        this.msg = 'Error en el servidor';
                        console.log('Error en el servidor');
                    } else {
                        this.creandotarifa = false;
                        if (this.respuesta.status == "Exito") {//Si lo creo, mostramos el mensaje en la pantalla princiapl
                            this.mensaje = this.respuesta.msg;
                            this.mostrarMensaje(1);
                            this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
                            this.active = false;
                            this.toggleActDesc = false;

                        } else {//mostramos el mensaje de respeusta desde el formulario
                            this.msg = this.respuesta.msg;
                        }

                    }
                },
                error => {
                    this.creandotarifa=false;
                    this.msg = 'Error en el servidor'; //se muestra el mensaje en el formualrio
                    console.log('Error en el servidor');
                }

            );

        } else {//actualizar una tarifa, el pkid de la tarifa ya viene asignado
            this._tarifasServices.editarTarifa(this.tarifa, uploadData, this.url).subscribe(
                response => {
                    this.respuesta = response;
                    if (this.respuesta.length <= 1) {
                        this.msg = 'Error en el servidor';
                        console.log('Error en el servidor');
                    } else {
                        this.creandotarifa = false;
                        if (this.respuesta.status == "Exito") {//Si lo creo, mostramos el mensaje en la pantalla princiapl
                            this.mensaje = this.respuesta.msg;
                            this.mostrarMensaje(1);
                            this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente
                            this.active = false;
                            this.toggleActDesc = false;

                        } else {//mostramos el mensaje de respeusta desde el formulario
                            this.msg = this.respuesta.msg;

                        }

                    }
                },
                error => {
                    this.creandotarifa=false;
                    this.msg = 'Error en el servidor'; //se muestra el mensaje en el formualrio
                    console.log('Error en el servidor');
                }
            )

        }

    }


    //Mostrar mensaje variable estilizado de error o de confirmacion 
    mostrarMensaje(codeError: number) {
        if (codeError == 1) {
            this.claseDinamic = "alert alert-success alert-with-icon";
            this.iconAlert = "done";
        } else if (codeError == 0) {
            this.claseDinamic = "alert alert-warning alert-with-icon";
            this.iconAlert = "warning";
        }
    }


    /**
   * Método de seleccionar archivo
   */
    onFileChanged(event) {

        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            this.selectedFile = event.target.files[0];
            console.log(this.selectedFile.name);
            this.urldocumento='';
            this.documento = this.selectedFile.name;
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            reader.onload = () => { // called once readAsDataURL is completed
                // this.url = reader.result;
            }
        }
    }
}