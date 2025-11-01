/**
 * Representa un recurso del sistema
 * 
 * @public
 */
export interface Recurso {
    /** ID del recurso */
    _id: string,
    /** Clave interna del recurso */
    clave: string,
    /** Nombre del comodin */
    nombre: string,

    /** Descripcion del recurso*/
    descripcion: string,
}