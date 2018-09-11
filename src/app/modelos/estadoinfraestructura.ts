//reflejo identidad de la base de datos
export class EstadoInfraestructura {

    public pkidestado: number;
    private codigoestado: string;
    public nombreestado: string;
    private descripcionestado: string;
    private estadoactivo: boolean;
    private creacionestado: Date;
    private modificacionestado: Date;

    constructor() {

    }

    public getPkidestado(): number {
        return this.pkidestado;
    }

    public setPkidestado(pkidestado: number
    ): void {
        this.pkidestado = pkidestado;
    }

    public getCodigoestado(): string {
        return this.codigoestado;
    }

    public setCodigoestado(codigoestado: string
    ): void {
        this.codigoestado = codigoestado;
    }

    public getNombreestado(): string {
        return this.nombreestado;
    }

    public setNombreestado(nombreestado: string
    ): void {
        this.nombreestado = nombreestado;
    }

    public getDescripcionestado(): string {
        return this.descripcionestado;
    }

    public setDescripcionestado(descripcionestado: string
    ): void {
        this.descripcionestado = descripcionestado;
    }

    public getEstadoactivo(): boolean {
        return this.estadoactivo;
    }

    public setEstadoactivo(estadoactivo: boolean
    ): void {
        this.estadoactivo = estadoactivo;
    }

    public getCreacionestado(): Date {
        return this.creacionestado;
    }

    public setCreacionestado(creacionestado: Date
    ): void {
        this.creacionestado = creacionestado;
    }

    public getModificacionestado(): Date {
        return this.modificacionestado;
    }

    public setModificacionestado(modificacionestado: Date): void {
        this.modificacionestado = modificacionestado;
    }



}