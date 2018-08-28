import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../../modelos/usuario';
import { UsuarioServices } from '../../servicios/usuarioServices.services';
import { plainToClass } from "class-transformer";
import { Rol } from '../../modelos/rol';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogConfirmacionComponent } from './dialog.confirm.component';


@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.scss'],
  providers: [UsuarioServices]
})
export class TablaUsuariosComponent implements OnInit {
  //Cabeceras de las columnas
  cabecerasColumnas: string[] = [];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreCedula: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;

  //datos a llenar mediante la consulta
  usuarios: Usuario[] = [];
  rol: Rol[] = [];
  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //msg de error
  msg: string = '';

  //respuesta del servidor
  public respuesta;

  //PAra alternar entre formularios
  @Output() llamarFormulario = new EventEmitter();
  @Output() enviarUSuario = new EventEmitter();


  constructor(private _userService: UsuarioServices, public dialog: MatDialog) {
    this._userService.consultarUsuarios().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //cabeceras
          this.cabecerasColumnas = this.respuesta.cabeceras;
          this.cabecerasColumnas.push('actions');
          //conversion del json de usuarios a la clase Usuarios 
          //guardamos el objeto en la variable
          this.usuarios = plainToClass(Usuario, this.respuesta.users);

          //asignacion de los datos en el datasource para la tabla
       
          console.log(this.respuesta);
          console.log(this.usuarios[0].getIdentificacion());
          console.log(this.respuesta.users[0].roles);

          for (let i = 0; i < this.usuarios.length; i++) {
            console.log(this.respuesta.users[i].roles);
            this.usuarios[i].setRoles(this.respuesta.users[i].roles);
          }
          this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
          //console.log("rol: "+this.usuarios[0].getRoles().pkidrol);
          //Aplicamos el filtro de paginado, ordenamiento y filtros
          this.setFilterDataTable();

        }

      },
      error => {
        this.msg = 'Error en el servidor';
          console.log('Error en el servidor');
      }
    );
  }

  ngAfterViewInit() {
    //this.setFilterDataTable();
  }


  ngOnInit() {
    //this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  

  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreCedula + (this.toggleActDesc);
  }


  setFilterDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      console.log(this.filtroNombreCedula);
      console.log("holaaa");
      return /*data.name.toLowerCase().indexOf(this.imputValue)!==-1 || data.position==(this.selected) ||*/ (data.getNombreUsuario().toLowerCase().indexOf(this.filtroNombreCedula) !== -1 && (data.getUsuarioActivo() == (!this.toggleActDesc) || this.toggleActDesc == false));
    };
  }

  clearInput() {
    this.filtroNombreCedula = '';
    this.aplicarFiltro();
  }


  editarUsuario(idUser){
    let user: Usuario;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].getIdentificacion() == idUser) {
        user = this.usuarios[i];
      }
    }
    this.enviarUSuario.emit({usuario:user});

  }

  llamarDialog(idUser) {
    console.log(this.usuarios[0].getIdentificacion());
    let user: Usuario;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].getIdentificacion() == idUser) {
        user = this.usuarios[i];
      }
    }
    console.log(user.getNombreUsuario());

    this.openDialog(user.getNombreUsuario(), user.getPkidusuario());

  }

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(nombreUser, idUser): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '250px',
      data: { nombreUser: nombreUser, idUser: idUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log()

    });
  }

}

//interfaz para comunicarse con el dialogo
export interface DialogData {
  nombreUser: string;
  idUser: number;
  respuestaServer: string;
}
