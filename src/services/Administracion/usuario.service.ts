import { reactive } from 'vue'
import * as usuarioApi from '@/services/api/usuario.api'
import type { Usuario } from '@/models/usuario'

/**
 * Interfaz para el estado del servicio de usuarios
 */
interface UsuarioState {
    usuarios: Usuario[] | null
    loading: boolean
    error: string | null
}

/**
 * Maneja el estado del servicio
 */
export const usuarioState = reactive<UsuarioState>({
    usuarios: null,
    loading: false,
    error: null,
})

/**
 * Funciones del servicio
 */
export const UsuarioService = {
    /**
     * Consigue todos los usuarios y actualiza el estado del servicio
     * @param silent si la funcion deberia actualizar el estado de carga
     * @throws Error
     */
    async fetchUsuarios(silent: boolean = false): Promise<void> {
        if (!silent) usuarioState.loading = true
        usuarioState.error = null

        try {
            // Obtenemos la respuesta de la api
            const response = await usuarioApi.getUsuarios()

            // Separamos los usuarios de la respuesta
            const usuarios: Usuario[] = response.data.usuarios

            // Refrescamos el usuario state
            usuarioState.usuarios = usuarios
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido al obtener usuarios'
            usuarioState.error = errorMessage
            usuarioState.usuarios = null
            throw error
        } finally {
            if (!silent) usuarioState.loading = false
        }
    },
}
