import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator,MatSort, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position', 'email','actions'];
  msg:string="";

 

  employees:Employee[] = [
    { 'name': 'Andres', position: 'manager', email: 'example@gmail.com' },
    { 'name': 'David', position: 'manager', email: 'example@gmail.com' },
    { 'name': 'Jorge', position: 'manager', email: 'example@gmail.com' },
    { 'name': 'Carlos', position: 'manager', email: 'example@gmail.com' },
    { 'name': 'Luis', position: 'manager', email: 'example@gmail.com' },
    { 'name': 'Ramiro', position: 'manager', email: 'example@gmail.com' }
  ]

  dataSource : MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //Variables para ordenar datos por tipo de dato
  path: string[] = ['name'];
  order: number = 1; // 1 asc, -1 desc;


  //

  model: any = {};
  model2: any = {};
  hideForm : boolean = false;

  constructor() {
    this.dataSource= new MatTableDataSource<Employee>(this.employees);

   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addEmployee(): void {
    this.employees.push(this.model);
    this.model=[];
    this.msg = "Campo Agregado";
    this.dataSource= new MatTableDataSource<Employee>(this.employees);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  deleteEmployee(i): void {
    var answer = confirm('Esta seguro de eliminar el usuario?');
    if(answer){
      this.employees.splice(i,1);
      this.msg ='Campo eliminado';
    }
  }


  myValue;
  editEmployee(i): void {
    this.hideForm=true;
    this.model2.name = this.employees[i].name;
    this.model2.position = this.employees[i].position;
    this.model2.email = this.employees[i].email;
    this.myValue = i;
  }

  updateEmployee(): void {
    console.log(this.model2);
    let i = this.myValue;
    for(let j=0; j< this.employees.length;j++){
      if(i==j){
        this.employees[i]=this.model2;
        this.model2=[];
        this.msg='Campo actualizado';
      }
    }
  }

  closeDialog(){
    this.msg='';
  }


  sortTable(prop:string){
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }
}
export interface Employee{
    name:string;
    position:string;
    email:string;
    
}