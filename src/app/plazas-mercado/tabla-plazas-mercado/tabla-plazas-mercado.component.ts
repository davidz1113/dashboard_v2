import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PlazaMercado } from '../../modelos/plaza-mercado';
import { PlazaServices } from '../../servicios/plazaServices.services';
import { plainToClass } from "class-transformer";
import { Rol } from '../../modelos/rol';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-tabla-plazas-mercado',
  templateUrl: './tabla-plazas-mercado.component.html',
  styleUrls: ['./tabla-plazas-mercado.component.scss'],
  providers: [PlazaServices]
})
export class TablaPlazasMercadoComponent implements OnInit {

  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];
  cabecerasColumnas: string[] = ['identificacion','nombreusuario','nombrerol','usuarioactivo','actions'];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreCedula: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;



  constructor() { }

  ngOnInit() {
  }

}
