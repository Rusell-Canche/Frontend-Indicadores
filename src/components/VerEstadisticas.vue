<template>
  <div class="grafica-container">
    <h2>{{ grafica?.titulo || 'Cargando...' }}</h2>

    <!-- Mostrar solo cuando ya se cargó la configuración -->
    <apexchart
      v-if="grafica"
      :options="grafica.chartOptions"
      :series="grafica.series"
      :type="grafica.tipo"
      height="350"
    />

    <!-- Indicador de carga -->
    <div v-else class="loading">
      <i class="fa fa-spinner fa-spin"></i> Cargando configuración...
    </div>
  </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts'
import axios from 'axios'

export default {
  name: 'VerEstadisticas',
  components: { apexchart: ApexChart },

  data() {
    return {
      grafica: null, // Aquí se guardará la configuración
    }
  },

  async mounted() {
    try {
      const token = localStorage.getItem('apiToken')
      const { data } = await axios.get('http://localhost:8000/api/graficas/68dd8653ebabdd9c4c044c84', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      this.grafica = data.data
      console.log('Configuración de la gráfica cargada:', this.grafica)
    } catch (error) {
      console.error('Error al obtener la configuración de la gráfica:', error)
    }
  },
}
</script>

<style scoped>
.grafica-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.loading {
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-top: 2rem;
}
</style>
