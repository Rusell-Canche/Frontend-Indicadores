import type { Accion } from "./accion";
import type { Recurso } from "./recurso";

/** === FORMA RAW (envío al backend) ===
 * recurso: string  -> puede ser "690..." o "plantilla:690..." (prefijo opcional)
 * acciones: string[] -> ids de acciones
 */
export interface PermisoGrupoRaw {
  recurso: string;
  acciones: string[];
}

export interface PermisosRaw {
  allowed?: PermisoGrupoRaw[];
  denied?: PermisoGrupoRaw[];
}

/** === FORMA HIDRATADA (respuesta show) ===
 * recurso: Recurso (objeto)
 * acciones: Accion[] (objetos)
 */
export interface PermisoGrupoHydrated {
  recurso: Recurso;
  acciones: Accion[];
}

export interface PermisosHydrated {
  allowed?: PermisoGrupoHydrated[];
  denied?: PermisoGrupoHydrated[];
}

/** Unión cuando no sabes si viene raw o hydrated */
export type PermisosMaybeHydrated = PermisosRaw | PermisosHydrated;

/** UI permissions (mantenlo abierto para keys dinámicas) */
export type UiPermissions = Record<string, boolean>;

/** === ESTADO INTERNO DEL COMPONENTE (fácil uso en checkboxes) ===
 * permisosGlobales: recursoId -> accionId[]
 * permisosIndividuales: tipo -> recursoId -> accionId[]
 */
export type PermisosGlobalesState = {
  allowed: Record<string, string[]>;
  denied: Record<string, string[]>;
};

export type PermisosIndividualesState = {
  allowed: { plantilla: Record<string, string[]>; documento: Record<string, string[]> };
  denied: { plantilla: Record<string, string[]>; documento: Record<string, string[]> };
};
