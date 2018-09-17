import { Component, OnInit } from '@angular/core';
import { ReportesServices } from '../servicios/reportedinamicoService.service';

@Component({
  selector: 'app-reporte-dinamico',
  templateUrl: './reporte-dinamico.component.html',
  styleUrls: ['./reporte-dinamico.component.scss'],
  providers: [ReportesServices]
})
export class ReporteDinamicoComponent implements OnInit {

  nombrereporte: string;
  //respuesta del servidor
  public respuesta;
  //mensaje de respuesta
  mensaje: string;

  //arreglo de filtros para generar los select y los inputs
  filtros: any[] = [];

  constructor(private _reporteService: ReportesServices) {
    this.consultarDatos()

  }

  ngOnInit() {
  }

  /**
   * metodo que consulta los filtros para armar los select y los inputs
   */
  consultarDatos() {
    this._reporteService.consultarCampos().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          console.log(this.respuesta);
          this.nombrereporte = this.respuesta.title;
          this.filtros = this.respuesta.filtros;
          console.log(this.filtros);
          
        }

      },
      error => {

      }
    );

  }

}
