import { Component, OnInit } from '@angular/core';
import { ReportesServices } from '../servicios/reportedinamicoService.service';
import { FormControl, FormGroup } from '@angular/forms';
import { log } from 'util';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-dinamico',
  templateUrl: './reporte-dinamico.component.html',
  styleUrls: ['./reporte-dinamico.component.scss'],
  providers: [ReportesServices,DatePipe]
})
export class ReporteDinamicoComponent implements OnInit {

  nombrereporte: string;
  //respuesta del servidor
  public respuesta;
  //mensaje de respuesta
  mensaje: string;

  //arreglo de filtros para generar los select y los inputs
  filtros: any[] = [];

  //variable de tipo Date para el picker de fechas
  dateinicial = new FormControl(new Date());
  datefinal = new FormControl(new Date());

  //variables para llenar las consultas de los selects;
  consultas: any = {};

  //Formulario reactive para enviar de filtros al backend
  formDatos:FormGroup = new FormGroup({
    default: new FormControl()
  });


  //datos de la tabla
  datostabla:any[]=[];

  //cabeceras columnas
  cabeceras:any[]=[];

  //ruta dinamica para consultar los datos
  public route='';

  constructor(private _reporteService: ReportesServices,private datePipe: DatePipe,private router: Router) {
    this.route= this.router.url.substring(15);
    
  }

  ngOnInit() {
    this.consultarDatos();
  }

  /**
   * metodo que consulta los filtros para armar los select y los inputs
   */
  consultarDatos() {
    this._reporteService.consultarCampos().subscribe(
      response => {
        this.respuesta = response;
        if (this.respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          console.log(this.respuesta);
          this.nombrereporte = this.respuesta.title;
          this.filtros = this.respuesta.filtros;

          this.filtros.map((filtro) => {
            if (filtro.tipofiltro == 'select') {//solo si es de tipo select hacemos consulta 
              this.consultarDatosSelect(filtro.nombretabla);
            }

          });

          this.validarFormulario();
          //console.log(this.consultas);
          

        }

      },
      error => {
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');

      }
    );

  }

  consultarDatosSelect(nombretabla){
    this._reporteService.consultarCamposSelect(nombretabla).subscribe(
      response => {
        let respuesta = response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
          this.consultas[nombretabla]=(respuesta[nombretabla]);//guardamos el arreglo en otro arreglo
          console.log(this.consultas[nombretabla]);

        }

      },
      error=>{
        this.mensaje = 'Error en el servidor';
        console.log('Error en el servidor');
        return null;
      }

    );
  }

  validarFormulario(){
    let group:any ={};
    for(let campo of this.filtros){
      group[campo.nombreatributo] = new FormControl();
    } 
    this.formDatos = new FormGroup(group);
  }

  clearInput(nombreatributo:string){
    this.formDatos.get(nombreatributo).setValue('');
  }

  public datos:any={};

  generarReporte(){
    console.log(this.dateinicial.value);
    console.log(this.datefinal.value);
    
    for(let dato of this.filtros){
      if(this.formDatos.get(dato.nombreatributo).value!=null){

        this.datos[dato.nombreatributo]= this.formDatos.get(dato.nombreatributo).value;
      }
    }
    this.datos['fechainicio'] = this.datePipe.transform(this.dateinicial.value,'yyyy-MM-dd');
    this.datos['fechafin'] = this.datePipe.transform(this.datefinal.value,'yyyy-MM-dd');
    console.log(this.datos);
    
    this._reporteService.consultarDatosTablaConFiltros(this.datos).subscribe(
      response=>{
        let respuesta= response;
        if (respuesta.length <= 1) {
          this.mensaje = 'Error en el servidor';
          console.log('Error en el servidor');
        } else {
          //console.log(respuesta[nombretabla]);
         this.cabeceras = respuesta.cabeceras;
         this.datostabla = respuesta[this.route.substring(1)];

         console.log(this.datostabla);
         
        }
        
      },
      error=>{

      }
    );
    
  }

}
