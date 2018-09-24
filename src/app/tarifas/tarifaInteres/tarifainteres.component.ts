import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { TarifaInteresService } from '../../servicios/tarifainteres.service';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-nuevo',
    templateUrl: './nuevo.component.html',
    styleUrls: ['./nuevo.component.css'],
    providers: [ExcepcionService, PlazaServices, TarifaInteresService]
})
export class TarifaInteresComponent implements OnInit {

    // ----------------------------------------------------------------------------------------------------------
    // Propiedades
    // ----------------------------------------------------------------------------------------------------------

    /**
     * Plazas de mercado en el sistema
     */
    plazas: PlazaMercado[] = [];

    // ----------------------------------------------------------------------------------------------------------
    // Propiedades Formulario
    // ----------------------------------------------------------------------------------------------------------

    /**
     * Formulario para registrar o editar una tarifa interés
     */
    tarifaInteresForm: FormGroup;

    // ----------------------------------------------------------------------------------------------------------
    // Constructores
    // ----------------------------------------------------------------------------------------------------------

    constructor(
        private _plazaService: PlazaServices,
        private _exceptionService: ExcepcionService,
        private injector: Injector,
        private _tarifaInteresService: TarifaInteresService
    ) { }

    ngOnInit() {
    }
    // ----------------------------------------------------------------------------------------------------------
    // Métodos
    // ----------------------------------------------------------------------------------------------------------

    inicializaForm() {
        this.tarifaInteresForm = new FormGroup({
            valortarifainteres: new FormControl(null, Validators.required),
            numeroresoluciontarifainteres: new FormControl(null, Validators.required),
            tarifainteresactivo: new FormControl(false),
            descripciontarifainteres: new FormControl(null),
            fkidplaza: new FormControl(null, Validators.required)
        });
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


    // ----------------------------------------------------------------------------------------------------------
    // Métodos Formulario
    // ----------------------------------------------------------------------------------------------------------


    guardarCambios() {

    }

    cancelarEdicion() {

    }

}
