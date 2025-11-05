// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Rol } from '@/models/rol'


/**
 * Maneja la respuesta del error
 */
export interface DeleteRolResponse {
  status: number;
  message: string;
}

/** Maneja la respuesta de crear rol */
export interface CreateRolResponse {
  status: number;
  message: string;
  rol: Rol;
}

/** Maneja la respuesta de actualizar rol */
export interface UpdateRolResponse {
  status: number;
  message: string;
  rol: Rol;
}

/** Obtener todos los roles */
export const getRoles = () => api.get<Rol[]>('/roles')

/** Obtiene un rol en especifico */
export const getRol = (rolID: string) => api.get<Rol>(`/roles/${rolID}`)

/** Crea un rol en especifico */
export const createRol = (rol: Rol) => api.post<CreateRolResponse>(`/roles`, rol)

/** Actualiza un rol en especifico */
export const updateRol = (rol: Rol) => api.put<UpdateRolResponse>(`/roles/${rol.id}`, rol)

/** Elimina un rol */
export const deleteRol = (rolID: string) => api.delete<DeleteRolResponse>(`/roles/${rolID}`) 