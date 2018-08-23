//Clase usuario que refleja la identidad de la base de datos
export class Usuario {
    //Definicion implicita de los atributos
    

    constructor(private idUsuario: number,
        private codigoUsuario: string,
        private identificacion: number,
        private nombreUsuario: string,
        private apellido: string,
        private usuarioActivo: boolean,
        private creacionUsuario: Date,
        private modificacionUsuario: Date,
        private idRol: number,
        private permisos: string
    ) {
        
    }
    //Metodos getter and setters

    public getIdUsuario(): number {
        return this.idUsuario;
    }

    public setIdUsuario(idUsuario: number
    ): void {
        this.idUsuario = idUsuario;
    }

    public getCodigoUsuario(): string {
        return this.codigoUsuario;
    }

    public setCodigoUsuario(codigoUsuario: string
    ): void {
        this.codigoUsuario = codigoUsuario;
    }

    public getIdentificacion(): number {
        return this.identificacion;
    }

    public setIdentificacion(identificacion: number
    ): void {
        this.identificacion = identificacion;
    }

    public getNombreUsuario(): string {
        return this.nombreUsuario;
    }

    public setNombreUsuario(nombreUsuario: string
    ): void {
        this.nombreUsuario = nombreUsuario;
    }

    public getApellido(): string {
        return this.apellido;
    }

    public setApellido(apellido: string
    ): void {
        this.apellido = apellido;
    }

    public getUsuarioActivo(): boolean {
        return this.usuarioActivo;
    }

    public setUsuarioActivo(usuarioActivo: boolean
    ): void {
        this.usuarioActivo = usuarioActivo;
    }

    public getCreacionUsuario(): Date {
        return this.creacionUsuario;
    }

    public setCreacionUsuario(creacionUsuario: Date
    ): void {
        this.creacionUsuario = creacionUsuario;
    }

    public getModificacionUsuario(): Date {
        return this.modificacionUsuario;
    }

    public setModificacionUsuario(modificacionUsuario: Date
    ): void {
        this.modificacionUsuario = modificacionUsuario;
    }

    public getIdRol(): number {
        return this.idRol;
    }

    public setIdRol(idRol: number
    ): void {
        this.idRol = idRol;
    }

    public getPermisos(): string {
        return this.permisos;
    }

    public setPermisos(permisos: string): void {
        this.permisos = permisos;
    }




  



}