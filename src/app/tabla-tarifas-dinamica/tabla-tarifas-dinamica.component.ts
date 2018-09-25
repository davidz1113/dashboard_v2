import { Component, OnInit, ViewChild, Input, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { TarifasServices } from '../servicios/tarifasdinamicosService.services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';



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
  filtros: any[] = []; //filtros para armar el filter del datasource, como arreglo porque puede ser uno o varios

  //data source para la tabla 
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //datos de la tabla
  datostabla: any[] = [];

  //cabeceras columnas
  cabeceras: any[] = [];

  //para mostrar solo las cabeceras
  cabecerasColumnas: string[] = [];

  constructor(private _tarifasServices: TarifasServices, private datePipe: DatePipe) { }

  datos: any[] = [];


  ngOnInit() {
    //console.log(this.url);

    this.consultarDatos();
  }

  /**
   * 
   * @param filtros filtros que llegan desde el componente q lo llama
   */
  recibirFiltros(filtros) {
    //console.log(filtros);
    this.filtros = filtros;
    this.aplicarFiltro();
  }

  /**
   * Metodo que consulta los datos de la api y construye el data source
   */
  private consultarDatos() {
    this._tarifasServices.consultarDatos(this.url).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          console.log('Error en el servidor');
        } else {//traemos los objetos de respuesta
          this.cabeceras = this.respuesta.cabeceras;//obtenemos las cabeceras con nombrecampo y nombreetiqueta
          this.datostabla = this.respuesta[this.url.substring(1)];
          this.cabeceras.push({ nombrecampo: 'actions', nombreetiqueta: 'Acciones' });

          this.cabeceras.map(
            (dato) => {
              this.cabecerasColumnas.push(dato.nombrecampo);
            }
          );
          //this.cabecerasColumnas.push('actions');
          this.dataSource = new MatTableDataSource(this.datostabla);
          this.aplicarFiltro();
          this.setFilterDataTable();
          console.log(response);
        }
      },
      error => {
        console.log("error de consulta");

      }
    );
  }

  /**
   * Metodo que especifica los valores a los cuales se les aplicara el filtro
   */
  private aplicarFiltro() {
    let filtrotext: string = '';
    if(this.filtros.length==0){
      this.dataSource.filter = "true";
    }else{
      this.filtros.map(
        (dato) => {
          console.log(dato);
          
          filtrotext += dato.valor;
        }
      );
      this.dataSource.filter = filtrotext;
    }

    }


  /**
   * personaliza el filter de la tabla para retornar los datos exactos
   */
  setFilterDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("aqui");
    console.log(this.filtros.length);

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      
      let ban2: boolean;
      
      if(this.filtros.length==0){
        
        ban2 = data[this.url.substring(1)+'activo']==true;

      }else{
        let ban: boolean[] = [];//llenado de un arreglo de booleanos para saber el campo exacto donde encuentre la igualdad
        this.filtros.map(
          (campos) => {
            ban.push(data[campos.nombreatributo].toString().indexOf(campos.valor) !== -1);//llenamos los booleanos comparando el campo con el valor 
          }
        )
        let contador = 0;//contador para saber cuantos booleanos true encontrara
        ban.map(
          (x) => {
            if (x) {//si es igual a true, se suma 1 el contador
              contador++;
            }
          }
  
        )
        //Si encuentra q todos los campos son de tipo true, significa que la fila corresponde a los filtros seleccionados
        if (contador == ban.length) {//va hasta ban.length, porque determina la longitud de los filtros boleanos, todos deben ser true
          console.log('iguales');
          ban2 = true;
        } else {
          console.log('falsos');
          ban2 = false;
        }

      }


      //console.log(ban);
      //console.log("-----------");
      return ban2;
    }

  }
}
