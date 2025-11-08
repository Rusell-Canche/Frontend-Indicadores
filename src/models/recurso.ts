/**
 * Representa un recurso del sistema
 * 
 * @public
 */
export interface Recurso {
    /** ID del recurso */
  id: string;
  clave?: string;
  nombre: string;
  tipo?: string;         // 'ruta' | 'plantilla' | 'documento' | etc.
  grupo?: string;
  descripcion?: string;
  idPlantilla?: string;
  patron_regex?: string;
}