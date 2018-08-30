import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { ExcepcionService } from './excepcionServices.services';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as StackTrace from 'stacktrace-js';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public stackString;

    constructor(private injector: Injector) { }


    handleError(error) {
        const excepcionService = this.injector.get(ExcepcionService);
        const mensaje= error.message ? error.message : error.toString();
        const location = this.injector.get(LocationStrategy);
        const url = location instanceof PathLocationStrategy
        ? location.path() : '';
        //console.log('Hio: error aqui ');

        // get the stack trace, lets grab the last 10 stacks only
        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
            .splice(0, 20)
            .map(function(sf) {
                
                return sf.toString();
            }).join('\n');
            
            //console.log(stackString);
            // enviar al servidor
            
               // excepcionService.capturarExcepcion({ mensaje, url, stack: stackString });
                
            
            
            //this.stackString=stackString;
            //console.log(mensaje);
            //console.log(url);
            //console.log(stackString);
        });
        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        //throw error;
     }


}