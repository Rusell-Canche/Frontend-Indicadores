/**
 * Representa una accion del sistema
 *
 * @public
 */
export interface Accion {
  /** ID de la accion */
  id: string
  /** Clave interna de la accion */
  clave?: string
  /** Nombre del comodin */
  nombre: string

  /** Descripcion del recurso*/
  descripcion?: string
}
