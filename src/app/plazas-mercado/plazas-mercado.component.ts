import { Component, OnInit, Injector, ViewChild, Input, } from '@angular/core';
import { PlazaServices } from '../servicios/plazaServices.services';
import { ExcepcionService } from '../servicios/excepcionServices.services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlazaMercado } from '../modelos/plaza-mercado';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionPlaza } from './dialogPlaza.confirm.component';


@Component({
  selector: 'app-plazas-mercado',
  templateUrl: './plazas-mercado.component.html',
  styleUrls: ['./plazas-mercado.component.scss'],
  providers: [PlazaServices, ExcepcionService]
})
export class PlazasMercadoComponent implements OnInit {


  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];
  cabecerasColumnas: string[] = ['codigoplaza', 'nombreplaza', 'plazaactivo', 'actions'];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombre: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //objeto plaza de mercado
  plaza: PlazaMercado[]

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<PlazaMercado>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //msg de error
  msg: string = '';

  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";

  //boton desactivado en caso q no hayan plazas o este caragndo
  botonBloqueo: boolean = true;

  //para recibir el mensaje del plaza agregado
  @Input() mensaje: string;


  plazaEdit: PlazaMercado = null;

  //variables booleanas para ocultar tabla y formulario
   tablaplaza= true;
   formplaza = false;

  constructor(private _plazaService: PlazaServices, private _exceptionService: ExcepcionService, private injector: Injector, public dialog: MatDialog) { }

  ngOnInit() {
    this.consultarPlazas();
  }

  closeDialog() {
    this.mensaje = '';

  }

  //alternar entre el formulario de agregar plaza y la tabla de plazas
  ocultarTablaPlaza(event){
    if (event != null) {
      if (event.cancel == '1') {
        this.plazaEdit = null;
        console.log("cancel");
        //el mensaje pasa a null en caso que solo sea cancelar
        if(event.mensaje!=null){
          this.mensaje=event.mensaje;
          this.consultarPlazas();
        }else{
          this.mensaje=null;
        }
      }
    }
    this.tablaplaza = !this.tablaplaza;
    this.formplaza = !this.formplaza;
  }


  consultarPlazas() {
    try {
      //throw new Error('Im errorn');
      this.respuesta = null;

      this._plazaService.consultarTodasPlazas().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            //cabeceras
            //this.cabecerasColumnas = this.respuesta.cabeceras;
            //this.cabecerasColumnas.push('actions');
            //conversion del json de plazas a la clase plazas 
            //guardamos el objeto en la variable
            this.plaza = plainToClass(PlazaMercado, this.respuesta.plazas);

            //asignacion de los datos en el datasource para la tabla


            this.dataSource = new MatTableDataSource<PlazaMercado>(this.plaza);
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
      let funcion = "constultarPlazas()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);


    }
  }


  clearInput() {
    this.filtroNombre = '';
    this.aplicarFiltro();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombre + (!this.toggleActDesc);
  }



  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: PlazaMercado, filter: string) => {
        //console.log(this.filtroNombreCedula);
        //console.log("holaaa");
        return ((data.getNombreplaza().toLowerCase().indexOf(this.filtroNombre) !== -1) && (data.getPlazaactivo() == true || this.toggleActDesc == true));
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

  //Mwtodo que recibe la plaza y la envia al componente para editar
  enviarPlaza(element){
    console.log(element);
    
    this.plazaEdit = element;
    this.ocultarTablaPlaza(null);
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

    //dialogo de confirmacion para eliminar o no el Plaza
  openDialog(plaza:PlazaMercado){
    try{

      
    let nombrePlaza = plaza.getNombreplaza();
    let idPlaza = plaza.getPkidplaza();

      const dialogRef = this.dialog.open(DialogConfirmacionPlaza, {
        width: '250px',
        data: { nombre: nombrePlaza, id: idPlaza }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje =  result.respuesta +" Nombre de la Plaza: "+nombrePlaza;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Exito") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarPlazas();

          }
        }
      });


    }catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "openDialog()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);
    }
  }

 
  cambiarEstado(plaza: PlazaMercado) {
    try {
      let active = plaza.getPlazaactivo();
      console.log("Active: " + active);

      this._plazaService.cambiarEstadoPlaza(plaza.getPkidplaza(), !active, "tplaza").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del plaza " + plaza.getNombreplaza() + " : " + this.respuesta.msg;
            //cambiamos el plaza de estado
            this.toggleActDesc = false;
            this.consultarPlazas();
          
            this.mostrarMensaje(1);
          }
        },
        error => {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
          this.mostrarMensaje(0);
        }
      );

    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "CambiarEstado()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

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
