<template>
  <div class="container-fluid py-4">
<div class="card shadow border-0 rounded-3"> 
        <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="header-title-section">
            <h3>Historial de estadísticas</h3>
            <p class="header-subtitle">Estadísticas creadas</p>
          </div>
        </div>

      </div>
      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        
        
          <!-- Sección de búsqueda -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-search me-2"></i>
              Buscar gráfica
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <div class="input-group modern-input">
                  <span class="plantilla-icon">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Búsqueda dinámica..."
                    v-model="palabraClave"
                  />
                </div>
                
              </div>
            </div>
          </div>

           <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando gráficas...</p>
        </div>

    <!-- Listado de plantillas -->
    <div class="plantilla-list">
      <div v-for="grafica in graficasPaginadas" :key="grafica.id" class="plantilla-card">
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
          <button @click="abrirVistaGrafica(grafica.id)" class="btn btn-mapa" title="Ver">
            <i class="fas fa-eye"></i>
            <span>Ver</span>
          </button>
          <button @click="eliminarGrafica(grafica.id)" class="btn btn-delete" title="Eliminar plantilla">
            <i class="fas fa-trash-alt"></i>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
<div v-if="!loading && graficasFiltradas.length > itemsPerPage" class="d-flex justify-content-center mt-4">
  <nav>
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
          &laquo;
        </button>
      </li>

      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" @click="currentPage = page">{{ page }}</button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
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
    </div>
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
      loading: true,
      palabraClave: '',
      itemsPerPage: 9,
      currentPage: 1, 
    }
  },
  computed: {
  graficasFiltradas() {
    if (!this.palabraClave) return this.arregloDeGraficas

    const busqueda = this.palabraClave.toLowerCase()
    return this.arregloDeGraficas.filter(grafica =>
      grafica.titulo.toLowerCase().includes(busqueda)
    )
  },
   // Paginación: solo los items de la página actual
  graficasPaginadas() {
    const inicio = (this.currentPage - 1) * this.itemsPerPage
    const fin = inicio + this.itemsPerPage
    return this.graficasFiltradas.slice(inicio, fin)
  },

  // Total de páginas
  totalPages() {
    return Math.ceil(this.graficasFiltradas.length / this.itemsPerPage)
  }

}
,
  
  methods: {
    async obtenerArregloDeGraficas() {
      this.loading = true
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
      }this.loading = false
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

.form-section::before{
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%);
  border-radius: 16px 16px 0 0 !important;
}
/* Loading spinner */
.spinner-border {
  color: #ff7700  !important;
}

/* Estilos base del diseño moderno */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
  min-height: 650px;
}

/* Header con el diseño moderno */
.medico-header {
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

/* Body con el diseño moderno */
.medico-body {
  padding: 2rem;
  background: white;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* Estilos mejorados para las tarjetas de plantillas */
.plantilla-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
  
}

.plantilla-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 53, 69, 0.1);
  position: relative;
}

.plantilla-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff8c00, #ff7700);
  border-radius: 16px 16px 0 0;
}

.plantilla-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(220, 53, 69, 0.2);
}

.plantilla-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.plantilla-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(90deg, #ff8c00, #ff7700);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.plantilla-info {
  flex: 1;
}

.plantilla-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
   word-break: break-word;
  /* 👇 Clave para limitar a 2 líneas */
  display: -webkit-box;             /* Permite usar line-clamp */
  -webkit-box-orient: vertical;     /* Define orientación del texto */
  -webkit-line-clamp: 2;            /* Máximo 2 líneas visibles */
  overflow: hidden;                 /* Oculta el texto sobrante */
  text-overflow: ellipsis; 
}

.plantilla-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 400;
}

.plantilla-actions {
  display: flex;
  padding: 1rem 1.5rem;
  background: white;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-edit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

/* Modal con diseño moderno */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
}

.modal-header-custom {
  padding: 2rem;
  border-bottom: none;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body-custom {
  padding: 2rem;
  background: white;
}

/* Estilos para el mapa de plantilla */
.btn-mapa {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-mapa:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
}

.mapa-modal {
  height: 100vh;
  border-radius: 0;
}

.mapa-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mapa-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
}

.mapa-container {
  max-width: 1200px;
  margin: 0 auto;
}

</style>
