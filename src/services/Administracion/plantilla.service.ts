import { reactive } from 'vue';
import * as plantillaApi from '@/services/api/plantillas.api'
import type { Plantilla } from '@/models/plantilla'

interface PlantillaState {
    plantillas: Plantilla[] | null,
    loading: boolean,
    error: string | null
}

export const plantillaState = reactive<PlantillaState>({
    plantillas: null,
    loading: false,
    error: null
});

export const PlantillaService = {
    /**
     * Consigue todas las plantillas del sistema
     * @returns Lista de recursos
     */
    async fetchPlantillas(): Promise<void> {
        try {
            // Obtenemos la respuesta de la api
            const { data } = await plantillaApi.getPlantillas();

            // Separamos los recursos de la respuesta
            const plantilas: Plantilla[] = data;

            // Refrescamos el rolState
            plantillaState.plantillas = plantilas;
        } catch(error) {
            console.error("Error al obtener las plantillas:", error);
            plantillaState.plantillas = [];
        } finally {
            // NOthing here
        }
    },
}