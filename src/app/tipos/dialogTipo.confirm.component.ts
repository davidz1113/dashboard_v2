import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolesServices } from '../servicios/rolesServices.services';
import { DialogData, DialogDataTipo } from '../servicios/globales';
import { TipoSectorServices } from '../servicios/tipos-services/tiposectorServices.services';
//import { RolesServices } from '../../servicios/rolesServices.services';
//import { DialogDataRol } from './tabla-roles.component';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara  {{nombre}} ?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial  (click)="eliminarTipo()">Eliminar</button>
    </div>
        
    `,
    providers: [TipoSectorServices]

})

/**
 * Clase que se encargara de gestionar los mensaje para la eliminacion de cualquier tipo
 */
export class DialogConfirmacionTipos implements DialogDataTipo {
    tipoIdentifi: number;
    nombre: string;
    id: number;
    //variables de la interfaz
    
    //variable respuesta servidor
    public respuesta ;

    constructor(public dialogRef: MatDialogRef<DialogConfirmacionTipos>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private _tipoServices: TipoSectorServices) {

        this.nombre = data['nombre'];
        this.id = data['id'];
        this.tipoIdentifi = data['tipoIdentifi'];

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    
    //Metodo q elimina el rol desde la base de datos
    eliminarTipo() {

        if(this.tipoIdentifi==1){//para eliminar tipo de sector
            this._tipoServices.eliminartiposector(this.id).subscribe(
                respose => {
                    this.respuesta = respose;
                    if (this.respuesta.length <= 1) {
                        this.respuesta = 'Error en el servidor';
                        console.log('Error en el servidor');
                    }else{
                        this.dialogRef.close({respuesta:this.respuesta.msg,status:this.respuesta.status});
                        
                    }
    
                },
                error => {
                    console.log("Error de conexion");
    
                }
    
            );

        }
    }

}