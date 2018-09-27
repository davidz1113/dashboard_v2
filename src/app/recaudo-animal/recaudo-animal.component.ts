import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
   selector: 'app-recuado-animal',
  templateUrl: './recaudo-animal.component.html',
  styleUrls: ['./recaudo-animal.component.scss'],
  providers:[DatePipe]
})
export class RecaudoAnimalComponent implements OnInit{
     DATOS=[{}];

  
    date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    departamento= '';
    municipio= '';
    nombre= '';

    constructor(private datePipe: DatePipe){

    }

    ngOnInit() {

    }

    onBlurMethod(){
        console.log('foco out');
        this.departamento= 'Nariño';
        this.municipio= 'Pasto';
        this.nombre= 'Pepito Perez';
        this.DATOS = [
            {categoria:'HEMBRA BOVINA 0-3 MESES', cantidad:2},
            {categoria:'HEMBRA BOVINA 2-3 AÑOS', cantidad:1},
            {categoria:'MACHO BOVINO 1-2 AÑOS', cantidad:1},
        ]
    }


}