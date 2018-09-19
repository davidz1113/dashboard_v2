import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportesServices } from '../servicios/reportedinamicoService.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { log } from 'util';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-dinamico',
  templateUrl: './reporte-dinamico.component.html',
  styleUrls: ['./reporte-dinamico.component.scss'],
  providers: [ReportesServices, DatePipe]
})
export class ReporteDinamicoComponent implements OnInit {

  nombrereporte: string;
  //respuesta del servidor
  public respuesta;
  //mensaje de respuesta
  mensaje: string;

  //numero filtro para los 3 casos posirbles
  numerofiltro: number = 0;

  //arreglo de filtros para generar los select y los inputs
  filtros: any[] = [];

  //variable de tipo Date para el picker de fechas
  dateinicial = new FormControl(new Date());
  datefinal = new FormControl(new Date());
  fkidplaza = new FormControl();
  fkidsector = new FormControl();

  //variables para llenar las consultas de los selects;
  consultas: any = {};

  //Formulario reactive para enviar de filtros al backend
  formDatos: FormGroup = new FormGroup({
    default: new FormControl()
  });

  //ruta dinamica para consultar los datos
  public route = '';

  //plazas de mercado
  plazas: any[] = [];

  //sectores
  sectores:any[]=[];

  /**-----Variables para la tabla -----*/

  //datos de la tabla
  datostabla: any[] = [];

  //cabeceras columnas
  cabeceras: any[] = [];

  //data source para la tabla 
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //variable para mostrar/ocultar tabla
  mostrartabla: boolean = false;

  //para mostrar solo las cabeceras
  cabecerasColumnas: string[] = [];



  constructor(private _reporteService: ReportesServices, private datePipe: DatePipe, private router: Router) {
    this.route = this.router.url.substring(15);

  }

  ngOnInit() {
    this.consultarDatos();
    this.consultarDatosSelect("plaza");
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
          this.numerofiltro = this.respuesta.numerofiltro;

          /*
          this.filtros.map((filtro) => {
            if (filtro.tipofiltro == 'select') {//solo si es de tipo select hacemos consulta pasando el nombre de la tabla
              this.consultarDatosSelect(filtro.nombretabla);
            }

          });*/

          this.validarFormulario();
          //console.log(this.consultas);


        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');

      }
    );

  }

  /**
   * 
   * @param nombretabla variable que determina la tabla a la cual hacer la consulta
   */
  consultarDatosSelect(nombretabla) {
    this._reporteService.consultarCamposSelect(nombretabla).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
          this.consultas[nombretabla] = (respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
          console.log(this.consultas[nombretabla]);

        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        this.respuesta = null;
      }

    );
  }

  /**
   * Metodo que inicia los datos del formulario
   */
  group: any = {
   
  };
  validarFormulario() {
    //group["fkidplaza"] = new FormControl('');
    for (let campo of this.filtros) {
      this.group[campo.nombreatributo] = new FormControl();
    }
    this.formDatos = new FormGroup(this.group);
  }

  clearInput(nombreatributo: string) {
    this.formDatos.get(nombreatributo).setValue('');
  }

  //varible para obtener los datos de la consulta despues de enviar el json de filtros
  public datos: any = {};

  generarReporte() {
    console.log(this.dateinicial.value);
    console.log(this.datefinal.value);
    this.datos = {};
    this.cabecerasColumnas = [];
    for (let dato of this.filtros) {
      if (this.formDatos.get(dato.nombreatributo).value != null) {
        //llenado de datos en un array de json, como clave el valor del atributo
        this.datos[dato.nombreatributo] = this.formDatos.get(dato.nombreatributo).value;
      }
    }
    if(this.fkidplaza.value!=''  && this.fkidplaza.value!=null )this.datos['fkidplaza']= this.fkidplaza.value;
    if(this.fkidsector.value!='' && this.fkidsector.value!=null )this.datos['fkidsector']= this.fkidsector.value;
    this.datos['fechainicio'] = this.datePipe.transform(this.dateinicial.value, 'yyyy-MM-dd');
    this.datos['fechafin'] = this.datePipe.transform(this.datefinal.value, 'yyyy-MM-dd');
    console.log(this.datos);

    //enviamos el json y recibimos la respuesta
    this._reporteService.consultarDatosTablaConFiltros(this.datos).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(this.respuesta[nombretabla]);
          //llenado de cabeceras y los datos de la tabla
          this.cabeceras = this.respuesta.cabeceras;
          this.datostabla = this.respuesta[this.route.substring(1)];

          console.log(this.datostabla);
          console.log(this.cabeceras);

          this.cabeceras.map((dato) => {
            this.cabecerasColumnas.push(dato.nombrecampo);//llenado de las cabeceras para las columnas
          });

          this.dataSource = new MatTableDataSource(this.datostabla);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.mostrartabla = true;


        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        this.respuesta = null;
      }
    );

  }


  consultarSectores(fkidplaza){
    console.log(fkidplaza);
    //reinicio de variables
    this.sectores = [];
    this.fkidsector=new FormControl();
    if(fkidplaza!=''){

    this._reporteService.consultarSectoresPorPlaza(fkidplaza).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
          this.sectores = respuesta.sector;
        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        this.respuesta = null;
      }

    );
  }

    
  }

}
