<template>
  <div class="container-fluid py-4">

    <!-- Listado de plantillas -->
    <div class="plantilla-list">
      <div v-for="grafica in arregloDeGraficas" :key="grafica.id" class="plantilla-card">
        <div class="plantilla-card-header">
          <div class="plantilla-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="plantilla-info">
            <h4 class="plantilla-title">{{ grafica.titulo }}</h4>
          </div>
        </div>
        <div class="plantilla-actions">
          <button @click="openEditModal(grafica.id)" class="btn btn-edit" title="Editar plantilla">
            <i class="fas fa-edit"></i>
            <span>Editar</span>
          </button>
          <button @click="abrirVistaGrafica(grafica.id)" class="btn btn-mapa" title="Ver mapa de la plantilla">
            <i class="fas fa-project-diagram"></i>
            <span>Mapa</span>
          </button>
          <button @click="eliminarGrafica(grafica.id)" class="btn btn-delete" title="Eliminar plantilla">
            <i class="fas fa-trash-alt"></i>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
    


    <!-- Modal: Vista Gráfica -->
    <template v-if="mostrarVistaGrafica">
      <div class="modal fade show d-block" tabindex="-1" @click.self="cerrarModal">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Vista Gráfica</h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
            <!-- Contenido eliminado por solicitud -->
                <div class="grafica-container">
    <h2>{{ jsonGrafica?.titulo || 'Cargando...' }}</h2>

    <!-- Mostrar solo cuando ya se cargó la configuración -->
    <apexchart v-if="jsonGrafica" :options="jsonGrafica.chartOptions" :series="jsonGrafica.series" :type="jsonGrafica.tipo"
      height="350" />

    <!-- Indicador de carga -->
    <div v-else class="loading">
      <i class="fa fa-spinner fa-spin"></i> Cargando configuración...
    </div>
  </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts'
import api from '@/services/api'
import Swal from 'sweetalert2'

export default {
  components: { apexchart: ApexChart },
  data() {
    return {
      mostrarVistaGrafica: false,
      jsonGrafica: [],
      arregloDeGraficas: [],
    }
  },
  
  methods: {
    async obtenerArregloDeGraficas() {
      try {
        this.arregloDeGraficas = (await api.get('/graficas')).data.graficas

        if (this.arregloDeGraficas.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin plantillas',
            text: 'No hay plantillas disponibles.',
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener las plantillas.',
        })
        console.log('Error al obtener las plantillas:', error)
      }
    },

    async abrirVistaGrafica(id) {
      try {
        const response = await api.get(`/graficas/${id}`)

        this.jsonGrafica = response.data.graficas
        this.mostrarVistaGrafica = true
      } catch (error) {
        console.error("Error al cargar JSON de la plantilla:", error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la vista gráfica.',
        })
      }
    },

    cerrarModal() {
      this.mostrarVistaGrafica = false
      this.jsonGrafica = []
    },

openEditModal(id) {
  this.$router.push({ name: 'VerEstadisticas', query: { id } });
},


    async eliminarGrafica(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas eliminar la grafica?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
      })

      if (result.isConfirmed) {
        try {
          const response = await api.delete(`graficas/${id}`)
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: response.data.message,
          })
          this.obtenerArregloDeGraficas()
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar la grafica',
          })
          console.error('Error al eliminar la plantilla:', error)
        }
      }
    },
  },
  created() {
    this.obtenerArregloDeGraficas()
  },
}
</script>
<style scoped>
.plantilla-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.plantilla-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plantilla-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.plantilla-card-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f1f3f5;
}

.plantilla-icon {
  width: 48px;
  height: 48px;
  background: #dc3545;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.plantilla-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
}

.plantilla-actions {
  padding: 1rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-edit {
  background: #28a745;
  color: white;
}

.btn-edit:hover {
  background: #218838;
}

.btn-mapa {
  background: #667eea;
  color: white;
}

.btn-mapa:hover {
  background: #5a67d8;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 1140px;
  width: 100%;
  margin: 1.75rem auto;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: auto;
  height: auto;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Gráfica */
.grafica-container h2 {
  margin-bottom: 1.5rem;
  color: #212529;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .plantilla-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .plantilla-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    justify-content: center;
    width: 100%;
  }

  .modal-dialog {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
}
</style>