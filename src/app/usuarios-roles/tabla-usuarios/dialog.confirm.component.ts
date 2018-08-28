import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './tabla-usuarios.component';
import { UsuarioServices } from '../../servicios/usuarioServices.services';


@Component({
    selector: 'app-dialog-interface',
    template: `
    <h1 mat-dialog-title>¿Esta seguro de que eliminara el usuario {{nombreUser}} ?</h1>
    <div mat-dialog-actions>
     <button mat-button (click)="onNoClick()">Cancelar</button>
    <button mat-button cdkFocusInitial (click)="eliminarUsuario()">Eliminar</button>
    </div>
        
    `,
    providers: [UsuarioServices]

})
export class DialogConfirmacionComponent implements DialogData {
    //variables de la interfaz
    nombreUser: string;
    idUser: number;
    respuestaServer: string;
    //variable respuesta servidor
    public respuesta;

    // //msg de respuesta del servidor
    msg: string = '';



    constructor(public dialogRef: MatDialogRef<DialogConfirmacionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private _userServices: UsuarioServices) {

        this.nombreUser = data['nombreUser'];
        this.idUser = data['idUser'];
        

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    //Metodo q elimina el usuario desde la base de datos
    eliminarUsuario() {
        this._userServices.eliminarUsuario(this.idUser).subscribe(
            respose => {
                this.respuesta = respose;
                if (this.respuesta.length <= 1) {
                    this.msg = 'Error en el servidor';
                    console.log('Error en el servidor');
                }else{
                    this.dialogRef.close();
                    this.respuestaServer = this.respuesta.msg;
                    //console.log(this.respuesta.msg);
                }

            },
            error => {
                console.log("Error de conexion");

            }

        );
    }

}