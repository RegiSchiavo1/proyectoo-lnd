export interface Estacionamiento {
    id:number,
    patente: string,
    horaIngreso: string,
    horaEgreso: string | null,
    costo: number | null,
    idUsuarioIngreso: string,
    idUsuarioegreso: string | null,
    idCochera: number,
    eliminado: null

       
    }