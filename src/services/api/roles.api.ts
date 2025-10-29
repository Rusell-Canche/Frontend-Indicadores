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

/** Obtener todos los roles */
export const getRoles = () => api.get<Rol[]>('/roles')

/** Elimina un rol */
export const deleteRol = (rolID: string) => api.delete<DeleteRolResponse>(`/roles/${rolID}`) 