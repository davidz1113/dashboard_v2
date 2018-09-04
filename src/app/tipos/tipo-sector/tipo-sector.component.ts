import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { TipoSectorServices } from '../../servicios/tipos-services/tiposectorServices.services';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TipoSector } from '../../modelos/tipos/tiposector';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionTipos } from '../dialogTipo.confirm.component';

@Component({
  selector: 'app-tipo-sector',
  templateUrl: './tipo-sector.component.html',
  styleUrls: ['./tipo-sector.component.scss'],
  providers: [TipoSectorServices, ExcepcionService]
})
export class TipoSectorComponent implements OnInit {

  cabecerasColumnas: string[] = ['nombretiposector', 'descripciontiposector', 'tiposectoractivo', 'actions'];

  //variable de entrada de texto del imput buscar(nombre tipo sector)
  filtroNombreTipoSector: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;


  //variable roles para llenar de la consulta
  tiposector: TipoSector[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<TipoSector>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";

  //mensaje de respuesta
  public mensaje: string;


  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;



  constructor(private _tiposectorService: TipoSectorServices, public dialog: MatDialog, private injector: Injector, private _exceptionService: ExcepcionService) { }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.consultarTipoDeSectores();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreTipoSector + (!this.toggleActDesc);
  }


  closeDialog() {
    this.mensaje = '';
  }


  /*
    Metodo que consulta los roles de usuario y los asigna al dataSource para el ordenamiento, paginacion y demas
    */
   consultarTipoDeSectores() {
    try {
      this.respuesta = null;
      this._tiposectorService.consultarTodosTiposSector().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {

            //console.log(ser);
            //let foo: Rol = Object.assign(Rol, JSON.parse(this.respuesta.rol));
            //console.log(foo);

            //seteamos el valor de los roles en el objeto Rol
            this.tiposector = plainToClass(TipoSector, this.respuesta.tiposector);

            console.log(this.respuesta.tiposector);
            //console.log(this.roles[0].getRolactivo());


            //asignacion de roles en el dataSource
            this.dataSource = new MatTableDataSource<TipoSector>(this.tiposector);
            this.botonBloqueo = false;
            this.aplicarFiltro();
            this.setFilterDataTable();
          }
        },
        error => {
          this.mensaje = 'Error en el servidor';
          this.respuesta = 'error';
          this.mostrarMensaje(0);
          console.log('Error en el servidor: ' + error);
        }

      );
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "consultarTipoDeSectores()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);
      //console.log("error asdasd a:" + e.stack);

    }
  }


  setFilterDataTable() {
    try{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: TipoSector, filter: string) => {
      //console.log(this.filtroNombreCedula);
      //console.log("holaaa");
      return ((data.getNombretiposector().toLowerCase().indexOf(this.filtroNombreTipoSector) !== -1 ) && (data.getTiposectoractivo() == true || this.toggleActDesc == true));
    };
  } catch (e) {
    const mensaje = e.message ? e.message : e.toString();
    let funcion = "setFilterDataTable()"

    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy
    ? location.path() : '';
    this.enviarExcepcion(mensaje, e, funcion,url);
    //console.log("error asdasd a:" + e.stack);

  }

  }


  clearInput() {
    this.filtroNombreTipoSector = '';
    this.aplicarFiltro();
  }



  cambiarEstadoTipo(tiposector: TipoSector) {
    try {
      let active = tiposector.getTiposectoractivo();
      console.log("Active: " + active);

      this._tiposectorService.cambiarEstadoTipoSector(tiposector.getPkidtiposector(), !active, "ttiposector").subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.mensaje = "El cambio de estado del tipo sector " + tiposector.getNombretiposector() + " : " + this.respuesta.msg;
            //cambiamos eal rol de estado
            this.toggleActDesc = false;
            this.consultarTipoDeSectores();
          
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
      let funcion = "CambiarEstadoRol()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

    }

  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(tiposector:TipoSector): void {
    try {

    let nombretiposector = tiposector.getNombretiposector();
    let idtiposector = tiposector.getPkidtiposector();

      const dialogRef = this.dialog.open(DialogConfirmacionTipos, {
        width: '250px',
        data: { nombre: nombretiposector, id: idtiposector, tipoIdentifi: 1 }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.mensaje =  result.respuesta +" Nombre del tipo sector: "+nombretiposector;
        if (result != null) {
          console.log(result.status);
          if (result.status == "error") {
            this.mostrarMensaje(0);
          } else if (result.status == "Success") {
            this.mostrarMensaje(1)
            this.toggleActDesc = false;
            this.consultarTipoDeSectores();

          }
        }
      });
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "openDialog()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
      ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion,url);
      //console.log("error asdasd a:" + e.stack);

    }
  }

  /**
   * 
   * metodo que llamar el formulario de editar o agregar dependiendo 
   */
  editarAgregarTipo(element){
    if(element==null){//entra por agregar un nuevo tipo de sector

    }else{
      
    }

  }


  //Mostrar mensaje variable estilizado de error o de confirmacion 
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
