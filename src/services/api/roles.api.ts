// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Rol } from '@/models/rol'

/** Obtener todos los roles */
export const getRoles = () => api.get<Rol[]>('/roles')