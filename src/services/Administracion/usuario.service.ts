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

    /**
     * Consigue un usuario en especifico
     * @returns Usuario
     * @throws Error si no se puede obtener el usuario
     */
    async fetchUsuario(usuarioID: string): Promise<Usuario> {
        usuarioState.loading = true
        usuarioState.error = null

        try {
            // OBtenemos la respuesta de la api
            const response = await usuarioApi.getUsuario(usuarioID)

            // Separamos el usuario de la respuesta
            const usuario: Usuario = response.data.user

            // Retornamos el usuario
            return usuario
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error desconocido al obtener el usuario'
            usuarioState.error = errorMessage

            throw error
        } finally {
            usuarioState.loading = false
        }
    },

    /**
     * Crea un nuevo usuario y actualiza el estado de usuarios
     */
    async createUsuario(usuario: Usuario) {
        usuarioState.loading = true
        usuarioState.error = null

        try {
            // Intentamos crear el usuarios
            const response = await usuarioApi.createUsuario(usuario)

            // Refrescamos los usuarios
            await this.fetchUsuarios(true)

            // Retornamos la respuesta
            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear el rol'
            usuarioState.error = errorMessage
            console.error('Error al crear el rol:', error)
            throw error
        } finally {
            usuarioState.loading = false
        }
    },

    /** Actualiza un usuario */
    async updateUsuario(usuario: Usuario) {
        usuarioState.loading = true
        usuarioState.error = null

        // INtentamos actualizar
        try {
            const response = await usuarioApi.updateUsuario(usuario)

            await this.fetchUsuarios()

            return response
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Error al actualizar el usuario'
            usuarioState.error = errorMessage
            console.error('Error al actualizar el usuario:', error)
            throw error
        } finally {
            usuarioState.loading = false
        }
    },
}
