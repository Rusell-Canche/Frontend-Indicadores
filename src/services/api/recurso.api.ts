// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Recurso } from '@/models/recurso'

/** Obtener todos los recursos */
export const getRecursos = () => api.get<Recurso[]>('/recursos')