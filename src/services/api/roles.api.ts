//roles.api.ts
// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Rol } from '@/models/rol'

/** Obtener todos los roles */
export const getRoles = () => api.get('/roles')

/** Obtiene un rol en especifico */
export const getRol = (rolID: string) => api.get(`/roles/${rolID}`)

/** Crea un rol en especifico */
export const createRol = (rol: Rol) => api.post(`/roles`, rol)

/** Actualiza un rol en especifico */
export const updateRol = (rol: Rol) => api.put(`/roles/${rol.id}`, rol)

/** Elimina un rol */
export const deleteRol = (rolID: string) => api.delete(`/roles/${rolID}`) 