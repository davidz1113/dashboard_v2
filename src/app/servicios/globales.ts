export var GLOBAL = {
    url: 'http://localhost/SistemaRecaudoBackend/web/app_dev.php',
    //url: 'http://192.168.1.21/SistemaRecaudoBackend/web/app_dev.php',
    
}

//interfaz para comunicarse con el dialogo
export interface DialogData {
    nombre: string;
    id: number;
    respuesta: string;
  }
//interfaz para comunicarse con el dialogo
export interface DialogDataTipo {
    nombre: string;
    id: number;
    respuesta: string;
    tipoIdentifi: number;//para identificar el tipo y poder llamar el servicio correspondiente para la eliminarcion
  }
  