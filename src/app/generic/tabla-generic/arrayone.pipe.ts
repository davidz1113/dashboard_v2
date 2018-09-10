import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'arrayOne'})
export class ArrayOne implements PipeTransform {


  transform(value:any,i:string): String {


    return  value[i];// ele[0];

   }


}
