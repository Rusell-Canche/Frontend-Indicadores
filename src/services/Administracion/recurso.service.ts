import { reactive } from 'vue';
import * as recursoApi from '@/services/api/recurso.api'
import type { Recurso } from '@/models/recurso'

interface RecursoState {
    recursos: Recurso[] | null,
    loading: boolean,
    error: string | null
}

export const recursoState = reactive<RecursoState>({
    recursos: null,
    loading: false,
    error: null
});

export const RecursoService = {
    /**
     * Consigue todos los recursos del sistema
     * @returns Lista de recursos
     */
    async fetchRecursos(): Promise<void> {
        try {
            // Obtenemos la respuesta de la api
            const { data } = await recursoApi.getRecursos();

            // Separamos los recursos de la respuesta
            const recursos: Recurso[] = data.recursos;

            // Refrescamos el rolState
            recursoState.recursos = recursos;
        } catch(error) {
            console.error("Error al obtener los recursos:", error);
            recursoState.recursos = [];
        } finally {
            // NOthing here
        }
    },
}