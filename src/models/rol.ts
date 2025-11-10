import type { PermisosRaw, PermisosHydrated, UiPermissions } from '@/models/permisos'

/**
 * Representa un Rol de usuario.
 *
 * @public
 */
export interface Rol {
    /** Identificador único del rol */
    id?: string

    /** Nombre del rol */
    nombre: string

    /** Descripción del rol */
    descripcion: string

    /** Permisos para acceder a recursos */
    permisos?: PermisosRaw | PermisosHydrated
    ui_permissions?: UiPermissions

    /** Fecha de creación */
    created_at?: string

    /** Fecha de actualización */
    updated_at?: string
}
