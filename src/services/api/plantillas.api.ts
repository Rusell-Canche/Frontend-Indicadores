// @ts-ignore: Sin archivo de declaracion para '@/services/api'
import api from '@/services/api'
import type { Plantilla } from '@/models/plantilla'

/** Obtener todos los recursos */
export const getPlantillas = () => api.get<Plantilla[]>('/plantillas')