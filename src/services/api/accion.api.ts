// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Accion } from '@/models/accion'

/** Obtener todos los recursos */
export const getRecursos = () => api.get<Accion[]>('/acciones')