import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { ExcepcionService } from '../servicios/excepcionServices.services';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { DialogConfirmacionTipos } from '../tipos/dialogTipo.confirm.component';
import { PlazaMercado } from '../modelos/plaza-mercado';
import { SectoresServices } from '../servicios/sectorServices.service';
import { ZonasServices } from '../servicios/zonaServices.services';


@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.scss'],
  providers: [ExcepcionService,  SectoresServices , ZonasServices ]

})
export class SectoresComponent implements OnInit {


  cabecerasColumnas = ['nombresector', 'nombrezona', 'nombretiposector', 'sectoractivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre sector )
  filtroNombreSector: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  sector: SectorInterface[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<SectorInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-success alert-with-icon";
  iconAlert = "done";

  //mensaje de respuesta
  public mensaje: string;

  //variable para retornar las plazas de mercado
  plazasmercado: PlazaMercado[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza
  plazaselect: string = '';
  zonaselect: string = '';

  
  /*-------------------------------------------------------------------------- */
  //Variables para el formulario de agregar un nuevo sector
  mostrarFormSector = false;
  mostrarTabla = true;

  //formulario reactive
  nuevoSectorForm: FormGroup;
  //actvar Plaza, desactivar Plaza
  active = false;
  textActive = "Desactivado";
  //mensaje del boton actulizar guardar
  mensajeBoton: string;
  sectoredit: SectorInterface;

  //mensaje para mostrar en el formulario de agregar
  msg: string = '';
  //progreso de envio
  creandosector: boolean = false;
  //variable que valida si esta por actualizar o guardar un nuevo
  isUpdate = false;

  //variables de seleccion para los select de plazas y zonas
  selectplazas: any[] = [];
  selectzonas: any[] = [];

  
  constructor(private nuevoForm: FormBuilder, private _zonaService: ZonasServices, private _sectorService: SectoresServices, public dialog: MatDialog, private _exceptionService: ExcepcionService,private injector: Injector) { }
  ngOnInit() {


  }

  
  ngAfterViewInit() {


    this.consultarPlazasMercado();
   this.consultarSectores();
  }

  /*
    Metodo que consulta las zonas y los asigna al dataSource para el ordenamiento, paginacion y demas
    */
   consultarSectores() {
    this.sector = [];
    try {
      this.respuesta = null;
      this._sectorService.consultarTodosSectores().subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {

            console.log(this.respuesta.sector);
            
            //seteamos el valor de los sectore en el objeto sector
            this.sector =this.respuesta.sector;
            this.dataSource = new MatTableDataSource<any>(this.sector);

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
      let funcion = "consultarSectores()"
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }



  consultarPlazasMercado() {
    try {
      this.respuesta = null;

      this._zonaService.consultarPlazasAsignadas(true).subscribe(
        response => {
          this.respuesta = response;
          if (this.respuesta.length <= 1) {
            this.mensaje = 'Error en el servidor';
            console.log('Error en el servidor');
            this.mostrarMensaje(0);
          } else {
            this.plazasmercado = plainToClass(PlazaMercado, this.respuesta.plazas);
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
      let funcion = "consultarPlazasMercado()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

    }
  }


  aplicarFiltro() {
    console.log(this.zonaselect);

    this.dataSource.filter = this.filtroNombreSector + (!this.toggleActDesc) + this.zonaselect;
  }


  //metodo que recibe desde plaza seleccionada el id de la plaza y la envia en una consulta para buscar por nombre de la zona
  buscarZonaPorPlaza(){
   let pkidplaza = this.plazaselect; //capturar el id de la plaza para enviarla a la consulta de zonas
   try {
    this.respuesta = null;

    this._zonaService.consultarZonasPorPlaza(pkidplaza).subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
          this.mostrarMensaje(0);
        } else {
          this.plazasmercado = plainToClass(PlazaMercado, this.respuesta.plazas);

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
    let funcion = "buscarZonaPorPlaza()"

    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy
      ? location.path() : '';
    this.enviarExcepcion(mensaje, e, funcion, url);

  }
    
  }

  setFilterDataTable() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: SectorInterface, filter: string) => {

        return ((data.nombresector.toLowerCase().indexOf(this.filtroNombreSector) !== -1) && (data.sectoractivo == true || this.toggleActDesc == true) && (data.nombrezona.indexOf(this.zonaselect) !== -1));
      };
    } catch (e) {
      const mensaje = e.message ? e.message : e.toString();
      let funcion = "setFilterDataTable()"

      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy
        ? location.path() : '';
      this.enviarExcepcion(mensaje, e, funcion, url);

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

interface SectorInterface {
  pkidsector: number;
  codigosector: string;
  nombresector: string;
  nombreplaza: string;
  nombrezona: string;
  sectoractivo: boolean;
  fkidplaza: number;
  fkidzona: number;
}
