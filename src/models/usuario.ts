import type { PermisosRaw, PermisosHydrated, UiPermissions } from "./permisos"
import type { Rol } from "./rol"

/**
 * Representa un Usuario.
 * 
 * @public
 */
export interface Usuario {
    /** Identificador único */
    id?: string
    /** Nombre del usuario */
    nombre: string
    /** Apellido paterno */
    apellido_paterno: string
    /**Apellido materno */
    apellido_materno: string
    /**Correo */
    email: string
    /** Contraseña encriptada */
    password: string
    /**Edad */
    edad: number
    /**Genero */
    genero: string
    /**Estado */
    estado: string
    /**Ocupacion */
    ocupacion: string
    /**Escolaridad */
    escolaridad: string,
    /** Roles */
    roles: Rol[]
    /** Permisos para acceder a recursos */
    permisos?: PermisosRaw | PermisosHydrated
    ui_permissions?: UiPermissions

    /** Fecha de creación */
    created_at?: string

    /** Fecha de actualización */
    updated_at?: string
}