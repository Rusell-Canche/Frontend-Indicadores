/**
 * Representa una plantilla
 *
 * @public
 */
export interface Plantilla {
  /** ID de la plantilla */
  id: string;
  nombre_plantilla?: string;
  nombre_modelo?: string;
  nombre_coleccion?: string;
  creada_por?: string;
  secciones?: any;
}
