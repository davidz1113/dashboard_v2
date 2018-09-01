import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolesServices } from '../../servicios/rolesServices.services';
import { DialogDataRol } from './tabla-roles.component';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara el Rol {{nombreRol}} ?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial  (click)="eliminarRol()">Eliminar</button>
    </div>
        
    `,
    providers: [RolesServices]

})
export class DialogConfirmacionRol implements DialogDataRol {
    //variables de la interfaz
    nombreRol: string;
    idRol: number;
    //variable respuesta servidor
    public respuesta ;

    constructor(public dialogRef: MatDialogRef<DialogConfirmacionRol>,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataRol, private _RolServices: RolesServices) {

        this.nombreRol = data['nombreRol'];
        this.idRol = data['idRol'];

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    //Metodo q elimina el rol desde la base de datos
    eliminarRol() {
        this._RolServices.eliminarRol(this.idRol).subscribe(
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