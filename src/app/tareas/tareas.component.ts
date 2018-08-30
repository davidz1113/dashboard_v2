import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position', 'email', 'actions'];

  msg: string = "";

  selected: string = "";
  imputValue: string = "";
  toggle: boolean = false;

  employees: Employee[] = [
    { name: 'Andres', position: 'Manager', email: 'example@gmail.com', enabledType: true },
    { name: 'David', position: 'Manager', email: 'example@gmail.com', enabledType: false },
    { name: 'Jorge', position: 'Desarrollador', email: 'example@gmail.com', enabledType: true },
    { name: 'Carlos', position: 'Manager', email: 'example@gmail.com', enabledType: true },
    { name: 'Luis', position: 'Desarrollador', email: 'example@gmail.com', enabledType: true },
    { name: 'Ramiro', position: 'Gerente', email: 'example@gmail.com', enabledType: false }
  ]

  //Datos para paginar
  dataSource: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Variables para ordenar datos por tipo de dato
  path: string[] = ['name'];
  order: number = 1; // 1 asc, -1 desc;


  //

  model: any = {};
  model2: any = {};
  hideForm: boolean = false;

  constructor() {
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setFilterDataTable();
  }

  applyFilter(filterValue: string) {
    //filterValue = filterValue.trim(); // Remove whitespace
    //filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //console.log("filtervalue " + filterValue.toString())
    this.dataSource.filter = this.selected + this.imputValue + this.toggle;


  }

  addEmployee(): void {
    this.model.enabledType = true;
    this.employees.push(this.model);
    this.model = [];
    this.msg = "Campo Agregado";
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.setFilterDataTable();
  }


  deleteEmployee(i): void {
    var answer = confirm('Esta seguro de eliminar el usuario?');
    if (answer) {
      this.employees.splice(i, 1);
      this.msg = 'Campo eliminado';
    }
  }


  myValue;
  editEmployee(i): void {
    this.hideForm = true;
    this.model2.name = this.employees[i].name;
    this.model2.position = this.employees[i].position;
    this.model2.email = this.employees[i].email;
    this.myValue = i;
  }

  updateEmployee(): void {
    console.log(this.model2);
    let i = this.myValue;
    for (let j = 0; j < this.employees.length; j++) {
      if (i == j) {
        this.employees[i] = this.model2;
        this.model2 = [];
        this.msg = 'Campo actualizado';
      }
    }
  }

  closeDialog() {
    this.msg = '';
  }


  sortTable(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  setFilterDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      console.log(this.selected);
      console.log(this.imputValue);
      return /*data.name.toLowerCase().indexOf(this.imputValue)!==-1 || data.position==(this.selected) ||*/ (data.name.toLowerCase().indexOf(this.imputValue) !== -1 && (data.position == (this.selected) || this.selected == "") && (data.enabledType == (!this.toggle) || this.toggle == false));
    };
  }


  clearInput() {
    this.imputValue = '';
    this.applyFilter(this.imputValue);
  }



}
export interface Employee {
  name: string;
  position: string;
  email: string;
  enabledType: boolean;
}