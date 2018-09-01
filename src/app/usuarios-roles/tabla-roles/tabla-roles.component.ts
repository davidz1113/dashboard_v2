import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Rol } from '../../modelos/rol';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { RolesServices } from '../../servicios/rolesServices.services';
import { plainToClass, serialize, deserialize } from "class-transformer";
@Component({
  selector: 'app-tabla-roles',
  templateUrl: './tabla-roles.component.html',
  styleUrls: ['./tabla-roles.component.scss'],
  providers: [RolesServices]
})
export class TablaRolesComponent implements OnInit {
  //Cabeceras de las columnas
  //cabecerasColumnas: string[] = [];

  cabecerasColumnas: string[] = ['nombrerol', 'descripcionrol', 'rolactivo', 'actions'];

  //variable de entrada de texto del imput buscar(nombre Rol)
  filtroNombreRol: string = '';
  //varible de mostrar desctivados
  toggleActDesc: boolean = false;


  //variable roles para llenar de la consulta
  roles: Rol[] = [];

  //Variables de paginacion y ordenamiento
  dataSource: MatTableDataSource<Rol>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //respuesta del servidor
  public respuesta;

  //para alternar entre el fomrulario de agregar nuevo rol y la tabla usuarios
  @Output() llamarFormularioAgregarRol = new EventEmitter()
  @Output() llamarFormUsuarios = new EventEmitter();

  //envia el rol al componente editar
  @Output() enviarRol = new EventEmitter();

  //para recibir el mensaje del rol agregado
  @Input() mensaje: string;

  //clase dinamica pra carga de mensajes
  claseDinamic = "alert alert-warning alert-with-icon";
  iconAlert = "warning";


  //boton desactivado en caso q no hayan roles o este caragndo
  botonBloqueo: boolean = true;



  constructor(private _rolService: RolesServices, public dialog: MatDialog) { }

  ngOnInit() {
    this.consultarRoles();
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //Si el mensaje de eliminar rol trae un mensaje
    if (this.mensaje != null) {
      //this.msg = this.mensaje;
      this.claseDinamic = "alert alert-success alert-with-icon";
      this.iconAlert = "done";

    }
    //this.setFilterDataTable();
  }


  //Método para aplicar el filtro en la tabla
  aplicarFiltro() {
    this.dataSource.filter = this.filtroNombreRol + (!this.toggleActDesc);
  }


  closeDialog() {
    this.mensaje = '';
  }


  /*
  Metodo que consulta los roles de usuario y los asigna al dataSource para el ordenamiento, paginacion y demas
  */
  consultarRoles() {
    this.respuesta = null;
    this._rolService.consultarTodosRoles().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {

          //console.log(ser);
          //let foo: Rol = Object.assign(Rol, JSON.parse(this.respuesta.rol));
          //console.log(foo);
          
          //seteamos el valor de los roles en el objeto Rol
          this.roles = plainToClass(Rol,this.respuesta.rol);

          console.log(this.respuesta.rol);
          //console.log(this.roles[0].getRolactivo());
          

          //asignacion de roles en el dataSource
          this.dataSource = new MatTableDataSource<Rol>(this.roles);
          this.botonBloqueo = false;
          this.aplicarFiltro();
          this.setFilterDataTable();
        }
      },
      error => {
        this.mensaje = 'Error en el servidor';
        this.respuesta = 'error';
        console.log('Error en el servidor: '+error);
      }

    );
  }

  setFilterDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Rol, filter: string) => {
      //console.log(this.filtroNombreCedula);
      //console.log("holaaa");
      return ((data.getNombreRol().toLowerCase().indexOf(this.filtroNombreRol) !== -1 ) && (data.getRolactivo() == true || this.toggleActDesc == true));
    };
  }


  clearInput() {
    this.filtroNombreRol = '';
    this.aplicarFiltro();
  }

  
}
