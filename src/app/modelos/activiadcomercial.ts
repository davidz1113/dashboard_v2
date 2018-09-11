export class ActividadComercial {

    public pkidactividad: number;
    private codigoactividad: string;
    public nombreactividad: string;
    private descripcionactividad: string;
    private actividadactivo: boolean;
    private creacionactividad: Date;
    private modificacionactividad: Date;
 
    constructor(){
        
    }

    public getPkidactividad(): number {
        return this.pkidactividad;
    }

    public setPkidactividad(pkidactividad: number
    ): void {
        this.pkidactividad = pkidactividad;
    }

    public getCodigoactividad(): string {
        return this.codigoactividad;
    }

    public setCodigoactividad(codigoactividad: string
    ): void {
        this.codigoactividad = codigoactividad;
    }

    public getNombreactividad(): string {
        return this.nombreactividad;
    }

    public setNombreactividad(nombreactividad: string
    ): void {
        this.nombreactividad = nombreactividad;
    }

    public getDescripcionactividad(): string {
        return this.descripcionactividad;
    }

    public setDescripcionactividad(descripcionactividad: string
    ): void {
        this.descripcionactividad = descripcionactividad;
    }

    public getActividadactivo(): boolean {
        return this.actividadactivo;
    }

    public setActividadactivo(actividadactivo: boolean
    ): void {
        this.actividadactivo = actividadactivo;
    }

    public getCreacionactividad(): Date {
        return this.creacionactividad;
    }

    public setCreacionactividad(creacionactividad: Date
    ): void {
        this.creacionactividad = creacionactividad;
    }

    public getModificacionactividad(): Date {
        return this.modificacionactividad;
    }

    public setModificacionactividad(modificacionactividad: Date): void {
        this.modificacionactividad = modificacionactividad;
    }


}