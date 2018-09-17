import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'arrayOne'})
export class ArrayOne implements PipeTransform {


  transform(value:any): any{

    if(value==true || value ==false){
      if(value==true){
        return "Si";
      }
      else{
        return "No";

      }

    }
    else{
      return value;
    }
   }


}
