import { Component, OnInit } from '@angular/core';
import { ReportesServices } from '../servicios/reportedinamicoService.service';
import { FormControl } from '@angular/forms';

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

  //variable de tipo Date para el picker de fechas
  dateinicial = new FormControl(new Date());
  datefinal = new FormControl(new Date());

  //variables para llenar las consultas de los selects;
  consultas: any = {};

  constructor(private _reporteService: ReportesServices) {

  }

  ngOnInit() {
    this.consultarDatos();
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

          this.filtros.map((filtro) => {
            if (filtro.tipofiltro == 'select') {//solo si es de tipo select hacemos consulta 
              this.consultarDatosSelect(filtro.nombretabla);
            }

          });

          //console.log(this.consultas);
          

        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');

      }
    );

  }

  consultarDatosSelect(nombretabla){
    this._reporteService.consultarCamposSelect(nombretabla).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
          this.consultas[nombretabla]=(respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
          console.log(this.consultas[nombretabla]);

        }

      },
      error=>{
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        return null;
      }

    );
  }

}
