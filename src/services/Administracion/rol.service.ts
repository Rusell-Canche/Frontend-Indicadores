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
    }
}