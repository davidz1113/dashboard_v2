import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { TarifasServices } from '../servicios/tarifasdinamicosService.services';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tabla-tarifas-dinamica',
  templateUrl: './tabla-tarifas-dinamica.component.html',
  styleUrls: ['./tabla-tarifas-dinamica.component.scss'],
  providers: [TarifasServices, DatePipe]
})
export class TablaTarifasDinamicaComponent implements OnInit {
  //mensaje de respuesta
  public respuesta;

  @Input() url: string;//url del controlador, llega desde el router_link que llama al componente
  @Input() filtros: any[] = []; //filtros para armar el filter del datasource, como arreglo porque puede ser uno o varios

  //data source para la tabla 
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //datos de la tabla
  datostabla: any[] = [];

  //cabeceras columnas
  cabeceras: any[] = [];

  //para mostrar solo las cabeceras
  cabecerasColumnas: string[] = [];

  constructor(private _tarifasServices: TarifasServices, private datePipe: DatePipe) { }

  ngOnInit() {
    this.consultarDatos();

  }

  /**
   * Metodo que consulta los datos de la api y construye el data source
   */
  consultarDatos() {
    this._tarifasServices.consultarDatos(this.url).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          console.log('Error en el servidor');
        } else {//traemos los objetos de respuesta
          this.cabeceras = this.respuesta.cabeceras;//obtenemos las cabeceras con nombrecampo y nombreetiqueta
          this.datostabla = this.respuesta[this.url.substring(1)];
          this.cabeceras.push({nombrecampo:'actions',nombreetiqueta:'Acciones'});

          this.cabeceras.map(
            (dato)=>{
              this.cabecerasColumnas.push(dato.nombrecampo);
            }
          );
          //this.cabecerasColumnas.push('actions');
          this.dataSource = new MatTableDataSource(this.datostabla);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          console.log(response);
        }
      },
      error => {
        console.log("error de consulta");

      }
    );
  }




}
