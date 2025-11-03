import type { Accion } from "./accion";

/**
 * Representa un Rol de usuario.
 * 
 * @public
 */
export interface Rol {
  /** Identificador único del rol */
  id: string;

  /** Nombre del rol */
  nombre: string;

  /** Descripción del rol */
  descripcion: string;

  /** Permisos para acceder a recursos */
  permisos?: {
    /** Recursos permitidos */
    allowed?: {
      /** Recurso */
      recurso?: {
        /** NOmbre del recurso */
        nombre?: string,
        /** ID del recurso */
        id: string,
        /** Descripcion del recurso */
        descripcion?: string,
      };
      /** Acciones permitidas sobre el recurso */
      acciones: Accion[];
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
