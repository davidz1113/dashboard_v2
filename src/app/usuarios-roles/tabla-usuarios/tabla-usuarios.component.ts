import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, Input } from '@angular/core';
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
  //cabecerasColumnas: string[] = [];

  cabecerasColumnas: string[] = ['identificacion','nombreusuario','rol','activo/inactivo','actions'];

  //variable de entrada de texto del imput buscar(cedula o nombre)
  filtroNombreCedula: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;



  //datos a llenar mediante la consulta
  //usuarios: Usuario[] = [];
  rol: Rol[] = [];
  
  //usuarios de prueba para el data source
  usuarios: Usuario[] =
   [
     new Usuario(0,'4545454',87788787,'Andres','carvajal','false',new Date,new Date,''),
     new Usuario(0,'14545454',187788787,'Luis','carvajal','false',new Date,new Date,''),
     new Usuario(0,'24545454',987788787,'Carlos','carvajal','false',new Date,new Date,''),
     new Usuario(0,'84545454',787788787,'Juan','carvajal','false',new Date,new Date,''),
     new Usuario(0,'64545454',287788787,'lopez','carvajal','false',new Date,new Date,''),
  ]
  
  ;




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
  //envia el usuario al componente de editar
  @Output() enviarUSuario = new EventEmitter();

  //para recibir el mensaje del usuario agregado
  @Input() mensaje: string;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";

  //boton desactivado en caso q no hayan usuarios o este caragndo
  botonBloqueo: boolean = true;

  constructor(private _userService: UsuarioServices, public dialog: MatDialog) {
    for (let i = 0; i < this.usuarios.length; i++) {
      //console.log(this.respuesta.users[i].roles);
      this.usuarios[i].setRoles(new Rol(0,0,'admin',true,'asdasd',new Date,new Date,'123'));
      
    }
    this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  }

  ngOnInit() {
    //this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  }

  
  ngAfterViewInit() {
    //this.setFilterDataTable();
    if (this.mensaje != null) {
      //this.msg = this.mensaje;
      this.claseDinamic = "alert alert-success alert-with-icon";
      this.iconAlert = "done";

    }
    this.setFilterDataTable();
    //this.consultarUsuarios();
  }


   //Método para aplicar el filtro en la tabla
   aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreCedula + (!this.toggleActDesc);
  }




  closeDialog() {
    this.mensaje = '';
  }

  consultarUsuarios() {
    this.respuesta = null;
    this.mensaje = '';
    this._userService.consultarUsuarios().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
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
          this.botonBloqueo = false;
          this.aplicarFiltro();
          this.setFilterDataTable();

        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        this.respuesta = 'error';
        console.log('Error en el servidor');
      }
    );
  }


 

  setFilterDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      //console.log(this.filtroNombreCedula);
      //console.log("holaaa");
      return ((data.getNombreUsuario().toLowerCase().indexOf(this.filtroNombreCedula) !== -1 || data.getIdentificacion().toString().indexOf(this.filtroNombreCedula) !== -1) && (data.getUsuarioActivo() == true || this.toggleActDesc == true));
    };
  }

  clearInput() {
    this.filtroNombreCedula = '';
    this.aplicarFiltro();
  }


  editarUsuario(idUser) {
    let user: Usuario;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].getIdentificacion() == idUser) {
        user = this.usuarios[i];
      }
    }
    this.enviarUSuario.emit({ usuario: user });

  }

  //LLama al dialogo de confirmacion para eliminar o no el usuario,
  //le enviamos el parametro del nombre de usuario y el id
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
  respuestaServer: string;

  //dialogo de confirmacion para eliminar o no el usuario
  openDialog(nombreUser, idUser): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '250px',
      data: { nombreUser: nombreUser, idUser: idUser, respuesta: this.respuestaServer }
    });

    //subscripcion del metodo para esperar la respuesta del servidor
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.mensaje = result.respuesta;
      if (result != null) {
        console.log(result.status);
        if (result.status == "error") {
          this.claseDinamic = "alert alert-warning alert-with-icon";
          this.iconAlert = "warning";
        } else if (result.status == "Success") {
          this.claseDinamic = "alert alert-success alert-with-icon";
          this.iconAlert = "done";
          this.consultarUsuarios();

        }
      }
      //console.log("respuesta desde el confirm"+ this.respuestaServer);
      //this.respuestaServer = result;


    });
  }

  //Metodo q al presionar cambia el estado del usuario directametne desde la tabla
  //recibe el usuario(elemento de la tabla)
  cambiarEstado(usuario:Usuario){
    let active =!usuario.getUsuarioActivo();
    this._userService.cambiarEstadoUsuario(usuario.getPkidusuario(),active,"tusuario").subscribe(
      response=>{
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          this.mensaje = this.respuesta.msg;
          //cambiamos el usuario de estado
          this.usuarios.map((usu,i)=>{
            if(usu.getPkidusuario()==usuario.getPkidusuario()){
              this.usuarios[i].setUsuarioActivo(active);
            }
          });
        }
      },
      error=>{

      }
    );

  }

}

//interfaz para comunicarse con el dialogo
export interface DialogData {
  nombreUser: string;
  idUser: number;
  respuesta: string;
}
