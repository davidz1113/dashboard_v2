import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortingCompanies'
  })

export class SortingEmployeesPipe implements PipeTransform{

    transform(employees:any[],path: string[], order: number):any[] {

        if(!employees || !path || !order) return employees;


        return employees.sort((a:any,b:any)=>{
            path.forEach(property => {
                a = a[property];
                b = b[property];
              })
              return a > b ? order : order * (- 1);
        });
    }


}