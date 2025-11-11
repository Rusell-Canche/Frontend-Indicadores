//usuario.api.ts
//@ts-expect-error: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Usuario } from '@/models/usuario'

/** Obtiene todos los usuarios */
export const getUsuarios = () => api.get('/usuarios')

/** Obtiene un usuario en especifico */
export const getUsuario = (usuarioID: string) => api.get(`/usuarios/${usuarioID}`)

/** Crea un usuario en especifico */
export const createUsuario = (usuario: Usuario) => api.post(`/usuarios/register`, usuario)

/** Actualiza un usuario */
export const updateUsuario = (usuario: Usuario) => api.put(`/usuarios/${usuario.id}`, usuario)

/** Elimina un usuario */
export const deleteUsuario = (usuarioID: string) => api.delete(`/usuarios/${usuarioID}`)