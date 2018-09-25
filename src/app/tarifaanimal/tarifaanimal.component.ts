import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TarifasServices } from '../servicios/tarifasdinamicosService.services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TablaTarifasDinamicaComponent } from '../tabla-tarifas-dinamica/tabla-tarifas-dinamica.component';
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

    /**
     * Muestra u oculta la tabla de tarifas
    */
    oculta = false;

    //objeto de tipo tarifa
    public tarifa: any = null;

    //objeto de formgroup para obtener los datos del formulario
    nuevoTarifaForm: FormGroup;

    //variable que valida si esta por actualizar o guardar un nuevo
    isUpdate = false;

    //instancia del componente hijo para el envio de paramtreos y/o llamads de funciones
    @ViewChild(TablaTarifasDinamicaComponent) tablacomponent: TablaTarifasDinamicaComponent;

    constructor(private router: Router, private _tarifasServices: TarifasServices, private nuevoForm: FormBuilder) {
    }


    ngOnInit(): void {
        this.consultarPlazas();
        this.consultarTiposAnimal();
        this.url = this.router.url.substring(15);
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
            nombreatributo: 'tarifaanimalactivo',
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
        this.oculta = !this.oculta;//ocultamos la tabla o el formulario respectivamente

        this.tarifa = event != null ? event.objecto : null; //validamos q sea diferente de null
        this.isUpdate = event != null ? true : false; // si es actualizar o nuevo

        if(!this.oculta){
            this.nuevoTarifaForm = this.nuevoForm.group({
                valor:[this.tarifa!=null?this.tarifa.valortarifaanimal:'',Validators.required],
                descripcion:[this.tarifa!=null?this.tarifa.descripciontarifaanimal:''],
                numero:[this.tarifa!=null?this.tarifa.numeroresoluciontarifaanimal:'',Validators.required],
                fkiplaza:[this.tarifa!=null?this.tarifa.fkiplaza:'',Validators.required],
                fkidtipoanimal:[this.tarifa!=null?this.tarifa.fkidtipoanimal:'',Validators.required]
            });
        }

        console.log(this.tarifa);
    }


}