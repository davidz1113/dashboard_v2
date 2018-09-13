import { Component, OnInit, ViewChild, Injector, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ExcepcionService } from '../servicios/excepcionServices.services';
import { EquipoService } from '../servicios/equipoService.service';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
  providers: [EquipoService, ExcepcionService]
})
export class EquiposComponent implements OnInit {


  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];
  cabecerasColumnas: string[] = ['identificacionequipo', 'nombrequipo', 'descripcionequipo', 'nombreusuario', 'actions'];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreEquipo: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //objeto equipo de mercado
  equipo: EquiposInterface[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<EquiposInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //msg de error
  msg: string = '';

  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //boton desactivado en caso q no hayan equipos o este caragndo
  botonBloqueo: boolean = true;

  //para recibir el mensaje del equipo agregado
  @Input() mensaje: string;


  equipoEdit: EquiposInterface = null;

  //variables booleanas para ocultar tabla y formulario
  tablaequipo = true;
  formequipo = false;

  constructor(public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService, private _equipoService: EquipoService) { }

  ngOnInit() {
    this.consultarEquipos();
  }

  //Metodo que consulta todos los equipos de computo
  consultarEquipos() {
    try {
      this.respuesta = null;

      this._equipoService.consultarTodosEquipo().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.respuesta.equipos.map((x) => {
              let equi: EquiposInterface={
                codigoequipo:'',descripcionequipo:'',equipoactivo:false,identificacion:null,identificacionequipo:'',nombrequipo:'',nombreusuario:'',pkidequipo:null,pkidusuario:null
              }
              equi.pkidequipo= x.pkidequipo;
              equi.identificacionequipo = x.identificacionequipo;
              equi.nombrequipo = x.nombrequipo;
              equi.codigoequipo = x.codigoequipo;
              equi.descripcionequipo = x.descripcionequipo;
              equi.equipoactivo = x.equipoactivo;
              equi.pkidusuario = x['usuario'].pkidusuario;
              equi.identificacion= x['usuario'].identificacion;
              equi.nombreusuario = x['usuario'].nombreusuario;
              this.equipo.push(equi);

            });
            //asignacion de los datos en el datasource para la tabla
            this.dataSource = new MatTableDataSource<EquiposInterface>(this.equipo);
            //Aplicamos el filtro de paginado, ordenamiento y filtros
            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor');
        }
      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarEquipos()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);


    }
  }

  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreEquipo + (!this.toggleActDesc);
  }


  clearInput() {
    this.filtroNombreEquipo = '';
    this.aplicarFiltro();
  }


  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: EquiposInterface, filter: string) => {
        //console.log(this.filtroNombreCedula);
        //console.log("holaaa");
        return ((data.nombrequipo.toLowerCase().indexOf(this.filtroNombreEquipo) !== -1) && (data.equipoactivo == true || this.toggleActDesc == true));
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "setFilterDataTable()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  /*
MEtodo que asigna de manera dinamica el estilo de agregado y alerta
*/
  mostrarMensaje(codeError: number) {
    if (codeError == 1) {
      this.claseDinamic = "alert alert-success alert-with-icon";
      this.iconAlert = "done";
    } else if (codeError == 0) {
      this.claseDinamic = "alert alert-warning alert-with-icon";
      this.iconAlert = "warning";
    }
  }


  /*
    MEtoido que captura las excepciones y las envia al servicio de capturar la excepcion
  */
  enviarExcepcion(mensaje, e, funcion, url) {
    this._exceptionService.capturarExcepcion({ mensaje, url: url, stack: e.stack, funcion: funcion }).subscribe(
      response => {

        if (response.length <= 1) {
          console.log('Error en el servidor al enviar excepcion');
        } else {
          if (response.status = !"error") {
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

export interface EquiposInterface {
  pkidequipo: number;
  identificacionequipo: string;
  nombrequipo: string;
  codigoequipo: string;
  descripcionequipo: string;
  pkidusuario: number;
  identificacion: number;
  nombreusuario: string;
  equipoactivo: boolean;
}
