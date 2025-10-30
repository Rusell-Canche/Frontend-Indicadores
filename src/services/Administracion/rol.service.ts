import { reactive } from 'vue';
import * as rolApi from '@/services/api/roles.api'
import type { Rol } from '@/models/rol'

/**
 * 
 */
interface RolState {
    roles: Rol[] | null
    loading: boolean
    error: string | null
}

/**
 * 
 */
export const rolState = reactive<RolState>({
    roles: null,
    loading: false,
    error: null
});

/**
 * 
 */
export const RolService = {

    /** 
     * Consigue todos los roles existentes
     * @returns Lista de roles
     */
    async fetchRoles() {
        try {
            // Obtenemos la respuesta de la api
            const { data } = await rolApi.getRoles();

            // Separamos los roles de la respuesta
            const roles: Rol[] = data.roles;

            // Refrescamos el rolState
            rolState.roles = roles;
        } catch (error) {
            console.error("Error al obtener los roles:", error)
            rolState.roles = [];
        } finally {
            // nothing
        }
    },

    /**
     * Consigue un rol en especifico
     */

    async fetchRol(rolID: string) {
        try {
            // Obtenemos la respuesta de la api
            const { data } = await rolApi.getRol(rolID);

            // Separamos el rol de la respuesta
            const rol: Rol = data.rol;

            // Retornamos el rol
            return rol;
        } catch (error) {
            console.error("Error al obtener el rol", error);

            return null;
        }
    },

    /**
     * Elimina un rol en especifico
     * @returns Exito o no
     */
    async deleteRol(rolID: string) {
        // Actualizamos estados del servicio
        rolState.loading = true;
        rolState.error = null;

        try {
            // Intentamos eliminar el rol
            const { response } = await rolApi.deleteRol(rolID);

            // Refrescamos los roles
            await this.fetchRoles();

            // Retornamos la respuesta
            return response;
        } catch (error: any) {
            
            console.error("Error al borrar el rol")
            throw error;
        } finally {
            // DEjamos de cargar
            rolState.loading = false;
        }
    }
}