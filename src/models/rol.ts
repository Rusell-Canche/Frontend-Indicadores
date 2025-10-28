/**
 * Representa un Rol de usuario.
 * 
 * @public
 */
export interface Rol {
  /** Identificador único del rol */
  _id: string;

  /** Nombre del rol */
  nombre: string;

  /** Descripción del rol */
  descripcion: string;

  /** Permisos para acceder a recursos */
  permisos?: {
    /** Recursos permitidos */
    allowed?: {
      /** Nombre del recurso */
      recurso: string;
      /** Acciones permitidas sobre el recurso */
      acciones: string[];
    }[];
    /** Recursos denegados */
    denied?: {
      /** Nombre del recurso */
      recurso: string;
      /** Acciones denegadas sobre el recurso */
      acciones: string[];
    }[];
  };

  /** Permisos para vistas del frontend */
  ui_permissions?: {
    [key: string]: boolean;
  };

  /** Fecha de creación */
  created_at?: string;

  /** Fecha de actualización */
  updated_at?: string;
}
