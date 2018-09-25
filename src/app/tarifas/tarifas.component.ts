import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from '../servicios/globales';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  providers: []
})
export class TarifasComponent implements OnInit {

  // ----------------------------------------------------------------------------------------------------------
  // Propiedades
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Fecha actual
   */
  currentDate: Date = new Date();


  // ----------------------------------------------------------------------------------------------------------
  // Constructores
  // ----------------------------------------------------------------------------------------------------------

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  // ----------------------------------------------------------------------------------------------------------
  // Métodos
  // ----------------------------------------------------------------------------------------------------------

  /**
   * Redirige a la pantalla de tarifa puesto eventual
   */
  redirigirPuestoEventual() {
    this.router.navigate([GLOBAL.urlBase + '/tarifapuestoeventual']);
  }

  /**
   * Redirige a la pantalla de tarifa interes
   */
  redirigirTarifaInteres() {
    this.router.navigate([GLOBAL.urlBase + '/tarifainteres']);
  }

}
