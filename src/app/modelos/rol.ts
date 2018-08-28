//Reflejo de la clase rol de la base de datos
export class Rol {

    //definicion explicita de los atributos
    constructor(
        public pkidrol: number,
        private codigorol: number,
        public nombrerol: string,
        private rolactivo: boolean,
        private descripcionrol: string,
        private creacionrol: Date,
        private modificacionrol: Date,
        private permiso: string

    ) {


    }
    public getPkidrol(): number {
        return this.pkidrol;
    }

    public setPkidrol(pkidrol: number
    ): void {
        this.pkidrol = pkidrol;
    }

    public getCodigoRol(): number {
        return this.codigorol;
    }

    public setCodigoRol(codigoRol: number
    ): void {
        this.codigorol = codigoRol;
    }

    public getNombreRol(): string {
        return this.nombrerol;
    }

    public setNombreRol(nombreRol: string
    ): void {
        this.nombrerol = nombreRol;
    }

    public getRolactivo(): boolean {
        return this.rolactivo;
    }

    public setRolactivo(rolactivo: boolean
    ): void {
        this.rolactivo = rolactivo;
    }

    public getDescripcionRol(): string {
        return this.descripcionrol;
    }

    public setDescripcionRol(descripcionRol: string
    ): void {
        this.descripcionrol = descripcionRol;
    }

    public getCreacionrol(): Date {
        return this.creacionrol;
    }

    public setCreacionrol(creacionrol: Date
    ): void {
        this.creacionrol = creacionrol;
    }

    public getModificacionrol(): Date {
        return this.modificacionrol;
    }

    public setModificacionrol(modificacionrol: Date
    ): void {
        this.modificacionrol = modificacionrol;
    }

    public getPermiso(): string {
        return this.permiso;
    }

    public setPermiso(permiso: string): void {
        this.permiso = permiso;
    }

}