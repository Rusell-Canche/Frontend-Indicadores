import { reactive } from 'vue'
import * as rolApi from '@/services/api/roles.api'
import type { Rol } from '@/models/rol'

/**
 * Interfaz para el estado del servicio de roles
 */
interface RolState {
    roles: Rol[] | null
    loading: boolean
    error: string | null
}

/**
 * Maneja el estado del servicio
 */
export const rolState = reactive<RolState>({
    roles: null,
    loading: false,
    error: null,
})

/**
 *
 */
export const RolService = {
    /**
     * Consigue todos los roles y actualiza el estado
     * @returns Lista de roles
     * @throws Error
     */
    async fetchRoles(silent = false): Promise<void> {
        if (!silent) rolState.loading = true
        rolState.error = null

        try {
            // Obtenemos la respuesta de la api
            const response = await rolApi.getRoles()

            // Separamos los roles de la respuesta
            const roles: Rol[] = response.data.roles

            // Refrescamos el rolState
            rolState.roles = roles
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido al obtener roles'
            rolState.error = errorMessage
            rolState.roles = null
            throw error
        } finally {
            if (!silent) rolState.loading = false
        }
    },

    /**
     * Consigue un rol en especifico y lo retorna
     * @returns Rol
     * @throws Error si no se puede obtener el rol
     */

    async fetchRol(rolID: string): Promise<Rol> {
        rolState.loading = true
        rolState.error = null
        try {
            // Obtenemos la respuesta de la api
            const response = await rolApi.getRol(rolID)

            // Separamos el rol de la respuesta
            const rol: Rol = response.data.rol

            // Retornamos el rol
            return rol
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido al obtener el rol'
            rolState.error = errorMessage

            throw error
        } finally {
            rolState.loading = false
        }
    },

    /**
     * Crea un nuevo rol
     * Tambien actualiza el estado
     **/
    async createRol(rol: Rol) {
        // Actualizamos el estado del servicio
        rolState.loading = true
        rolState.error = null

        try {
            // Intentamos crear el rol
            const response = await rolApi.createRol(rol)

            // Refrescamos los roles
            await this.fetchRoles()

            // Retornamos la respuesta
            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear el rol'
            rolState.error = errorMessage
            console.error('Error al crear el rol:', error)
            throw error
        } finally {
            // Dejamos de cargar
            rolState.loading = false
        }
    },

    /**
     * Actualiza un rol
     */
    async updateRol(rol: Rol) {
        // Actualizamos el estado del servicio
        rolState.loading = true
        rolState.error = null

        // INtentamos actualizar el rol
        try {
            const response = await rolApi.updateRol(rol)

            await this.fetchRoles()

            return response
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error al actualizar el rol'
            rolState.error = errorMessage
            console.error('Error al actualizar el rol:', error)
            throw error
        } finally {
            rolState.loading = false
        }
    },

    /**
     * Elimina un rol en especifico
     * @returns Exito o no
     */
    async deleteRol(rolID: string) {
        // Actualizamos estados del servicio
        rolState.loading = true
        rolState.error = null

        try {
            // Intentamos eliminar el rol
            const response = await rolApi.deleteRol(rolID)
            await this.fetchRoles()
            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el rol'
            rolState.error = errorMessage
            console.error(`Error al borrar el rol ${rolID}:`, error)
            throw error
        } finally {
            rolState.loading = false
        }
    },
}
