import { reactive } from 'vue';
import * as accionAPi from '@/services/api/accion.api'
import type { Accion } from '@/models/accion'

interface AccionState {
    acciones: Accion[] | null,
    loading: boolean,
    error: string | null
}

export const accionesState = reactive<AccionState>({
    acciones: null,
    loading: false,
    error: null
});

export const AccionService = {
    /**
     * Consigue todas las acciones del sistema
     * @returns Lista de acciones
     */
    async fetchAcciones(): Promise<void> {
        try {
            // Obtenemos la respuesta de la api
            const { data } = await accionAPi.getRecursos();

            // Separamos los recursos de la respuesta
            const acciones: Accion[] = data.acciones;

            // Refrescamos el rolState
            accionesState.acciones = acciones;
        } catch(error) {
            console.error("Error al obtener los recursos:", error);
            accionesState.acciones = [];
        } finally {
            // NOthing here
        }
    },
}