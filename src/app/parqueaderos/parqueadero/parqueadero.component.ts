import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from "class-transformer";
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { ParqueaderoServices } from '../../servicios/parqueaderoService.services';
import { ExcepcionService } from '../../servicios/excepcionServices.services';
import { TipoParqueaderoServices } from '../../servicios/tipos-services/tipoparqueaderoServices.service';

@Component({
  selector: 'app-parqueadero',
  templateUrl: './parqueadero.component.html',
  styleUrls: ['./parqueadero.component.scss'],
  providers: [ExcepcionService,PlazaServices, ParqueaderoServices,TipoParqueaderoServices]

})
export class ParqueaderoComponent implements OnInit {

  cabecerasColumnas = ['nombresector', 'nombrezona', 'nombretiposector', 'sectoractivo', 'actions'];
  //variable de entrada de texto del imput buscar(nombre sector )
  filtroNombreSector: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //sector: SectorInterface[] ;

  //Variables de paginacion y ordenamiento
  //dataSource: MatTableDataSource<SectorInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //respuesta del servidor
  public respuesta;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //mensaje de respuesta
  public mensaje: string;

  //variable para retornar las plazas de mercado
  //plazasmercado: PlazaMercado[];
  //zonas: Zona[] = [];

  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;

  //variable asignada al selector de busqeuda por plaza
  plazaselect: string = '';
  zonaselect: string = '';

  constructor() { }

  ngOnInit() {
  }

}


interface ParqueaderoInterface {
  pkidparqueadero: number;
  codigoparqueadero: string;
  numeroparqueadero: string;
  nombreplaza: string;
  nombreusuario: string;
  parqueaderoactivo: boolean;
  fkidplaza: number;
  fkidusuario: number;
}
