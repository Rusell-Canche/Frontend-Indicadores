<template>
  <div class="container-fluid py-4">
    <!-- Contenido principal -->
    <div class="card shadow border-0 rounded-3">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h2 class="card-title h5 text-primary mb-0">
          <i class="fas fa-chart-bar me-2"></i>Panel de Indicadores
        </h2>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-primary rounded-pill px-3 py-2">
            <i class="fas fa-list-check me-1"></i>{{ indicadores.length }} Total
          </span>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table modern-table align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-4">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-folder text-primary me-2"></i>
                    Proyecto
                  </div>
                </th>
                <th>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-hashtag text-primary me-2"></i>
                    No.
                  </div>
                </th>
                <th>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-tag text-primary me-2"></i>
                    Indicador
                  </div>
                </th>
                <th>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-tag text-primary me-2"></i>
                    Departamento
                  </div>
                </th>
                <th>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-arrow-up text-success me-2"></i>
                    Denominador
                  </div>
                </th>
                <th>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-arrow-down text-danger me-2"></i>
                    Numerador
                  </div>
                </th>
                <th class="text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <i class="fas fa-cogs text-primary me-2"></i>
                    Acciones
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(indicador, index) in paginatedData"
                :key="indicador._id"
                class="table-row"
              >
                <td class="ps-4">
                  <div class="d-flex align-items-center">
                    <div class="project-icon me-3">
                      <i class="fas fa-folder"></i>
                    </div>
                    <div>
                      <div class="fw-semibold text-dark">{{ indicador._idProyecto }}</div>
                      <small class="text-muted">Proyecto</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="number-circle">
                    {{ indicador.numero }}
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-semibold text-dark">{{ indicador.nombreIndicador }}</div>
                    <small class="text-muted">Indicador principal</small>
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-semibold text-dark">{{ indicador.departamento }}</div>
                    <small class="text-muted">Departamento principal</small>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="metric-icon success me-2">
                      <i class="fas fa-arrow-up"></i>
                    </div>
                    <span class="metric-value text-success fw-bold">{{
                      indicador.denominador || 0
                    }}</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="metric-icon danger me-2">
                      <i class="fas fa-arrow-down"></i>
                    </div>
                    <span class="metric-value text-danger fw-bold">{{
                      indicador.numerador || 0
                    }}</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <router-link
                      :to="{
                        name: 'configurar-indicador',
                        params: { id: indicador._id || indicador.id },
                      }"
                      class="action-btn config-btn"
                      title="Configurar indicador"
                    >
                      <i class="fas fa-cog"></i>
                    </router-link>
                    <router-link
                      :to="{
                        name: 'editar-indicador',
                        params: { id: indicador._id || indicador.id },
                      }"
                      class="action-btn edit-btn"
                      title="Editar indicador"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      @click="eliminarIndicador(indicador)"
                      class="action-btn delete-btn"
                      title="Eliminar indicador"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="indicadores.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="empty-state">
                    <div class="empty-icon">
                      <i class="fas fa-chart-bar"></i>
                    </div>
                    <h5 class="text-muted mb-2">No hay indicadores registrados</h5>
                    <p class="text-muted mb-3">
                      Los indicadores aparecerán aquí una vez que sean creados
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div class="card-footer bg-white border-0 p-4" v-if="totalPages > 1">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div class="pagination-info mb-3 mb-md-0">
            <span class="text-muted">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Mostrando <strong class="text-primary">{{ startItem }}-{{ endItem }}</strong> de
              <strong class="text-primary">{{ indicadores.length }}</strong> registros
            </span>
          </div>
          <nav aria-label="Paginación">
            <ul class="pagination pagination-modern justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link page-nav"
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  aria-label="Anterior"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li
                class="page-item"
                v-for="page in pages"
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <button class="page-link page-number" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link page-nav"
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  aria-label="Siguiente"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Footer con información -->
      <div class="card-footer bg-white text-muted small py-2">
        <div class="d-flex justify-content-between align-items-center">
          <span>Total: {{ indicadores.length }} indicadores</span>
          <span>Última actualización: {{ new Date().toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Vista para componentes hijos -->
    <router-view @indicador-actualizado="fetchIndicadores"></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      indicadores: [],
      loading: true,
      currentPage: 1,
      itemsPerPage: 12,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.indicadores.length / this.itemsPerPage)
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.indicadores.slice(start, end)
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage
      return end > this.indicadores.length ? this.indicadores.length : end
    },
    pages() {
      const pages = []
      let startPage = Math.max(1, this.currentPage - 2)
      let endPage = Math.min(this.totalPages, startPage + 4)

      if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      return pages
    },
  },
  mounted() {
    this.fetchIndicadores()
  },
  watch: {
    // Recargar indicadores al regresar de rutas hijas
    $route(to, from) {
      if (to.name === 'ver-indicadores' && from.name !== 'ver-indicadores') {
        this.fetchIndicadores()
      }
    },
  },
  methods: {
    async fetchIndicadores() {
      try {
        this.loading = true
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          this.$router.push('/')
          return
        }

        const response = await axios.get('http://127.0.0.1:8000/api/indicador/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        if (response.status === 200) {
          if (Array.isArray(response.data.indicadores)) {
            this.indicadores = response.data.indicadores
          } else {
            this.indicadores = []
          }
        }
      } catch (error) {
        console.error('Error completo:', error)

        if (error.response) {
          const status = error.response.status

          if (status === 401) {
            this.mostrarNotificacion(
              'Error',
              'Sesión expirada. Por favor inicia sesión nuevamente.',
              'error',
            )
            localStorage.removeItem('apiToken')
            localStorage.removeItem('user')
            this.$router.push('/')
          } else {
            this.mostrarNotificacion('Error', `Error inesperado: ${status}`, 'error')
          }
        } else if (error.request) {
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
          console.error('Error inesperado:', error)
        }
      } finally {
        this.loading = false
      }
    },
    async eliminarIndicador(indicador) {
      try {
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          this.$router.push('/')
          return
        }

        const respuesta = await Swal.fire({
          title: '¿Estás seguro que quieres borrarlo?',
          text: 'No podrás revertir esto.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        })

        if (respuesta.isConfirmed) {
          const idIndicador = indicador._id || indicador.id

          const response = await axios.delete(
            `http://127.0.0.1:8000/api/indicador/delete/${idIndicador}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
            },
          )

          if (response.status === 200) {
            this.mostrarNotificacion('¡Completado!', 'Indicador eliminado exitosamente', 'success')
            this.fetchIndicadores()
          } else {
            this.mostrarNotificacion(
              'Advertencia',
              'Estado inesperado: ' + response.status,
              'warning',
            )
          }
        }
      } catch (error) {
        console.error('Error completo:', error)

        if (error.response) {
          const status = error.response.status

          switch (status) {
            case 401:
              this.mostrarNotificacion(
                'Error',
                'Sesión expirada. Por favor inicia sesión nuevamente.',
                'error',
              )
              localStorage.removeItem('apiToken')
              localStorage.removeItem('user')
              this.$router.push('/')
              break

            case 404:
              this.mostrarNotificacion('Error', 'Indicador no encontrado', 'error')
              break

            case 500:
              this.mostrarNotificacion('Error', 'Error interno del servidor', 'error')
              break

            default:
              this.mostrarNotificacion('Error', `Error inesperado: ${status}`, 'error')
              break
          }
        } else if (error.request) {
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
        }
      }
    },
    mostrarNotificacion(titulo, mensaje, tipo) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33',
        timer: tipo === 'success' ? 2500 : undefined,
        timerProgressBar: tipo === 'success',
      })
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToPage(page) {
      this.currentPage = page
    },
  },
}
</script>
<style>
/* Estilos para el modal moderno */
.medico-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  backdrop-filter: blur(8px);
  animation: backdropFadeIn 0.3s ease;
}

.medico-modal-content {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 20px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  position: relative;
}

.medico-modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.medico-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.medico-modal-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.modal-icon {
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

.modal-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.medico-close-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.medico-close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.medico-modal-body {
  padding: 2rem;
  max-height: 65vh;
  overflow-y: auto;
  background: white;
}

.medico-modal-body::-webkit-scrollbar {
  width: 6px;
}

.medico-modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.medico-modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 16px 16px 0 0;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #667eea;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.modern-input {
  position: relative;
}

.modern-input .input-group-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control,
.modern-input .form-select {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  transform: translateY(-1px);
}

.medico-modal-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.btn-save::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-save:hover::before {
  left: 100%;
}

.btn-save:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

/* Tarjetas de configuración */
.config-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.config-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.config-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin: 0 auto 1rem;
}

.config-card h6 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Estilos para la tabla y botones */
.card {
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
}

.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modern-table thead th {
  font-weight: 600;
  color: #495057;
  border: none;
  padding: 1.25rem 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.modern-table thead th:first-child {
  border-top-left-radius: 0.75rem;
}

.modern-table thead th:last-child {
  border-top-right-radius: 0.75rem;
}

.modern-table tbody .table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f3f4;
}

.modern-table tbody .table-row:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.modern-table tbody .table-row:last-child {
  border-bottom: none;
}

.modern-table tbody td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
  border: none;
}

/* Iconos de proyecto */
.project-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Círculo de número */
.number-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Iconos de métricas */
.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.metric-icon.success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 2px solid rgba(22, 163, 74, 0.2);
}

.metric-icon.danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  color: #dc2626;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.metric-value {
  font-size: 1rem;
}

/* Botones de acción modernos */
.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease;
  z-index: 0;
}

.action-btn i {
  position: relative;
  z-index: 1;
}

.config-btn {
  background-color: #e0f2fe;
  color: #0277bd;
  border: 2px solid #b3e5fc;
}

.config-btn::before {
  background: linear-gradient(135deg, #0288d1 0%, #0277bd 100%);
}

.config-btn:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(2, 136, 209, 0.4);
}

.config-btn:hover::before {
  transform: scale(1);
}

.edit-btn {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #ffeaa7;
}

.edit-btn::before {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
}

.edit-btn:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
}

.edit-btn:hover::before {
  transform: scale(1);
}

.delete-btn {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.delete-btn::before {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.delete-btn:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
}

.delete-btn:hover::before {
  transform: scale(1);
}

/* Estado vacío mejorado */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #6c757d;
}

/* Paginación moderna */
.pagination-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.pagination-modern {
  gap: 6px;
}

.pagination-modern .page-link {
  border: none;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  color: #64748b;
  background: #f8fafc;
}

.page-nav {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
}

.page-nav:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.page-number:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #374151;
  transform: translateY(-2px);
}

.pagination-modern .page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: scale(1.05);
}

.pagination-modern .page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animaciones */
@keyframes backdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0%,
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .medico-modal-content {
    width: 98%;
    max-height: 95vh;
    margin: 1rem;
  }

  .medico-modal-header {
    padding: 1.5rem;
  }

  .modal-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .modal-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .modal-title-section h3 {
    font-size: 1.25rem;
  }

  .medico-modal-body {
    padding: 1.5rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .medico-modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modern-table thead th {
    padding: 1rem 0.75rem;
    font-size: 0.8rem;
  }

  .modern-table tbody td {
    padding: 1rem 0.75rem;
  }

  .project-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .action-btn {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .medico-modal-header {
    padding: 1rem;
  }

  .medico-modal-body {
    padding: 1rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .modern-table {
    font-size: 0.875rem;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
/* Estilos para resoluciones mas pequeñas */
@media (max-width: 992px) {
  .modern-table thead th {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }

  .modern-table tbody td {
    padding: 0.875rem 0.5rem;
  }

  .project-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .number-circle {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }

  .metric-icon {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}

/* Mejoras para móviles grandes */
@media (max-width: 768px) {
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .card {
    margin: 0.5rem 0;
  }

  .card-header {
    padding: 1rem;
  }

  .card-header h2 {
    font-size: 1.1rem;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  /* Hacer la tabla más compacta en móviles */
  .modern-table thead th {
    padding: 0.75rem 0.25rem;
    font-size: 0.7rem;
    line-height: 1.2;
  }

  .modern-table tbody td {
    padding: 0.75rem 0.25rem;
    font-size: 0.85rem;
  }

  /* Ocultar columnas menos importantes en móviles */
  .modern-table thead th:nth-child(4),
  .modern-table thead th:nth-child(5),
  .modern-table tbody td:nth-child(4),
  .modern-table tbody td:nth-child(5) {
    display: none;
  }

  /* Ajustar información del proyecto en móviles */
  .project-icon {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }

  .project-icon + div {
    font-size: 0.8rem;
  }

  .project-icon + div .fw-semibold {
    font-size: 0.85rem;
  }

  .project-icon + div small {
    font-size: 0.7rem;
  }

  /* Ajustar botones de acción para móviles */
  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
    margin: 0 1px;
  }

  /* Mejorar paginación en móviles */
  .pagination-info {
    text-align: center;
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .pagination-modern .page-link {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }

  .card-footer {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}

/* Mejoras para móviles pequeños */
@media (max-width: 576px) {
  .card-header {
    padding: 0.75rem;
  }

  .card-header h2 {
    font-size: 1rem;
  }

  /* Hacer scroll horizontal más evidente */
  .table-responsive {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
  }

  .table-responsive::-webkit-scrollbar {
    height: 8px;
  }

  .table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .table-responsive::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Mostrar solo columnas esenciales */
  .modern-table {
    min-width: 500px; /* Asegurar ancho mínimo para scroll */
  }

  .modern-table thead th:nth-child(1),
  .modern-table thead th:nth-child(2),
  .modern-table thead th:nth-child(3),
  .modern-table thead th:nth-child(6),
  .modern-table tbody td:nth-child(1),
  .modern-table tbody td:nth-child(2),
  .modern-table tbody td:nth-child(3),
  .modern-table tbody td:nth-child(6) {
    display: table-cell;
  }

  /* Ajustar espaciado de botones de acción */
  .d-flex.justify-content-center.gap-2 {
    gap: 0.25rem !important;
  }

  /* Mejorar estado vacío en móviles */
  .empty-state {
    padding: 1.5rem 0.5rem;
  }

  .empty-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .empty-state h5 {
    font-size: 1rem;
  }

  .empty-state p {
    font-size: 0.85rem;
  }

  /* Paginación más compacta */
  .pagination-modern {
    gap: 2px;
  }

  .pagination-modern .page-link {
    min-width: 32px;
    height: 32px;
    font-size: 0.75rem;
    padding: 0;
  }

  /* Footer más compacto */
  .card-footer {
    padding: 0.5rem 0.75rem;
  }

  .card-footer .d-flex {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}

/* Mejoras para pantallas muy pequeñas */
@media (max-width: 400px) {
  .container-fluid {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  .card-header h2 {
    font-size: 0.9rem;
  }

  .badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }

  .modern-table thead th {
    padding: 0.5rem 0.125rem;
    font-size: 0.65rem;
  }

  .modern-table tbody td {
    padding: 0.5rem 0.125rem;
    font-size: 0.8rem;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }

  .pagination-modern .page-link {
    min-width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
}

/* Mejoras para pantallas muy anchas */
@media (min-width: 1400px) {
  .container-fluid {
    max-width: 1320px;
    margin: 0 auto;
  }

  .modern-table thead th {
    padding: 1.5rem 1.25rem;
  }

  .modern-table tbody td {
    padding: 1.5rem 1.25rem;
  }

  .project-icon {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }

  .action-btn {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }
}

/* Mejoras para orientación landscape en móviles */
@media (max-width: 768px) and (orientation: landscape) {
  .card-header {
    padding: 0.5rem 1rem;
  }

  .modern-table thead th {
    padding: 0.5rem 0.375rem;
  }

  .modern-table tbody td {
    padding: 0.5rem 0.375rem;
  }

  .pagination-info {
    padding: 6px 10px;
  }
}
</style>
