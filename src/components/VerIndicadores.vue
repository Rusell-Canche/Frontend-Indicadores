<template>
  <!-- Sección simple para elegir fecha de inicio y fecha fin -->
  <div class="date-filter-simple mb-3">
    <div class="filter-row">
      <div class="date-field">
        <label for="fechaInicio" class="date-label">Fecha Inicio:</label>
        <Calendar
          id="fechaInicio"
          v-model="fechaInicio"
          dateFormat="dd-mm-yy"
          placeholder="Seleccionar fecha"
          :showIcon="true"
        />
      </div>

      <div class="date-field">
        <label for="fechaFin" class="date-label">Fecha Fin:</label>
        <Calendar
          id="fechaFin"
          v-model="fechaFin"
          dateFormat="dd-mm-yy"
          placeholder="Seleccionar fecha"
          :showIcon="true"
        />
      </div>

      <div class="filter-buttons">
        <Button
          label="Filtrar"
          icon="pi pi-filter"
          @click="filtrarPorFecha"
          :loading="loading"
          class="p-button-primary"
        />
        <Button
          label="Limpiar"
          icon="pi pi-times"
          @click="limpiarFiltro"
          v-if="fechaInicio || fechaFin"
          class="p-button-secondary ml-2"
        />
      </div>
    </div>
  </div>

  <div class="container-fluid py-4">
    <!-- Toast y ConfirmDialog -->
    <Toast />
    <ConfirmDialog />

    <!-- Contenido principal -->
    <Panel class="shadow border-0 rounded-3">
      <template #header>
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 w-100"
        >
          <h2 class="card-title h5 text-primary mb-0">
            <i class="fas fa-chart-bar me-2"></i>{{ obtenerTituloVista() }}
          </h2>

          <!-- Botones de vista -->
          <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
            <div class="btn-group view-toggle" role="group">
              <Button
                :label="'Plan de Acción'"
                icon="pi pi-list"
                @click="cambiarVista('accion')"
                :class="
                  vistaActual === 'accion'
                    ? 'p-button-success'
                    : 'p-button-outlined p-button-success'
                "
                size="small"
              />
              <Button
                :label="'Resumen'"
                icon="pi pi-eye"
                @click="cambiarVista('resumen')"
                :class="
                  vistaActual === 'resumen' ? 'p-button-info' : 'p-button-outlined p-button-info'
                "
                size="small"
                class="ml-2"
              />
            </div>

            <div class="d-flex align-items-center gap-2">
              <Badge :value="`${indicadores.length} Total`" severity="info" size="large"></Badge>
              <Badge
                v-if="fechaInicio || fechaFin"
                value="Filtrado"
                severity="success"
                size="large"
              ></Badge>
            </div>
          </div>
        </div>
      </template>

      <DataTable
        :value="indicadores"
        :paginator="true"
        :rows="itemsPerPage"
        :totalRecords="indicadores.length"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15, 20]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        responsiveLayout="scroll"
        stripedRows
        class="p-datatable-lg"
        :loading="loading"
        emptyMessage="No se encontraron indicadores"
      >
        <!-- Columna Proyecto -->
        <Column v-if="mostrarColumnaProyecto" field="_idProyecto">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-folder text-primary me-2"></i>
              Proyecto
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="project-icon me-3">
                <i class="fas fa-folder"></i>
              </div>
              <div>
                <div class="fw-semibold text-dark">{{ slotProps.data._idProyecto }}</div>
                <small class="text-muted">Proyecto</small>
              </div>
            </div>
          </template>
        </Column>

        <!-- Columna Número -->
        <Column v-if="mostrarColumnaNumero" field="numero">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-hashtag text-primary me-2"></i>
              No.
            </div>
          </template>
          <template #body="slotProps">
            <div class="number-circle">
              {{ slotProps.data.numero }}
            </div>
          </template>
        </Column>

        <!-- Columna Indicador -->
        <Column v-if="mostrarColumnaIndicador" field="nombreIndicador">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-tag text-primary me-2"></i>
              Indicador
            </div>
          </template>
          <template #body="slotProps">
            <div>
              <div class="fw-semibold text-dark">{{ slotProps.data.nombreIndicador }}</div>
              <small class="text-muted">Indicador principal</small>
            </div>
          </template>
        </Column>

        <!-- Columna Departamento -->
        <Column v-if="mostrarColumnaDepartamento" field="departamento">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-building text-primary me-2"></i>
              Departamento
            </div>
          </template>
          <template #body="slotProps">
            <div class="fw-semibold text-dark">{{ slotProps.data.departamento }}</div>
          </template>
        </Column>

        <!-- Columnas del Plan de Acción -->
        <Column v-if="mostrarColumnasAccion" field="actividad">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-tasks text-success me-2"></i>
              Actividad
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon success me-2">
                <i class="fas fa-arrow-up"></i>
              </div>
              <span class="metric-value text-success fw-bold">
                {{ slotProps.data.actividad || 'N/A' }}
              </span>
            </div>
          </template>
        </Column>

        <Column v-if="mostrarColumnasAccion" field="causa">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-exclamation-triangle text-warning me-2"></i>
              Causa
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon warning me-2">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <span class="metric-value text-warning fw-bold">
                {{ slotProps.data.causa || 'N/A' }}
              </span>
            </div>
          </template>
        </Column>

        <Column v-if="mostrarColumnasAccion" field="accion">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-play text-success me-2"></i>
              Acción
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon success me-2">
                <i class="fas fa-play"></i>
              </div>
              <span class="metric-value text-success fw-bold">
                {{ slotProps.data.accion || 'N/A' }}
              </span>
            </div>
          </template>
        </Column>

        <Column v-if="mostrarColumnasAccion" field="denominadorCalculado">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-calculator text-info me-2"></i>
              Denominador Calculado
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon info me-2">
                <i class="fas fa-calculator"></i>
              </div>
              <span class="metric-value text-info fw-bold">
                {{ slotProps.data.denominadorCalculado || 'N/A' }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Columnas de Métricas -->
        <Column v-if="mostrarColumnasMetricas" field="denominador">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-arrow-up text-success me-2"></i>
              Denominador
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon success me-2">
                <i class="fas fa-arrow-up"></i>
              </div>
              <span class="metric-value text-success fw-bold">
                {{ slotProps.data.denominador || 0 }}
              </span>
            </div>
          </template>
        </Column>

        <Column v-if="mostrarColumnasMetricas" field="numerador">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-arrow-down text-danger me-2"></i>
              Numerador
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon danger me-2">
                <i class="fas fa-arrow-down"></i>
              </div>
              <span class="metric-value text-danger fw-bold">
                {{ slotProps.data.numerador || 0 }}
              </span>
            </div>
          </template>
        </Column>

        <Column v-if="mostrarColumnasMetricas" field="porcentaje">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="fas fa-percent text-danger me-2"></i>
              Porcentaje
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex align-items-center">
              <div class="metric-icon danger me-2">
                <i class="fas fa-percent"></i>
              </div>
              <span class="metric-value text-danger fw-bold">
                {{ slotProps.data.porcentaje ? `${slotProps.data.porcentaje}%` : 'N/A' }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Columna Acciones -->
        <Column v-if="mostrarColumnaAcciones">
          <template #header>
            <div class="d-flex align-items-center justify-content-center">
              <i class="fas fa-cogs text-primary me-2"></i>
              Acciones
            </div>
          </template>
          <template #body="slotProps">
            <div class="d-flex justify-content-center gap-2">
              <Button
                icon="fas fa-cog"
                class="p-button-rounded p-button-info p-button-sm"
                @click="navegarAConfiguracion(slotProps.data)"
                v-tooltip.top="'Configurar indicador'"
              />
              <Button
                icon="fas fa-edit"
                class="p-button-rounded p-button-warning p-button-sm"
                @click="navegarAEdicion(slotProps.data)"
                v-tooltip.top="'Editar indicador'"
              />
              <Button
                icon="fas fa-trash-alt"
                class="p-button-rounded p-button-danger p-button-sm"
                @click="confirmarEliminacion(slotProps.data)"
                v-tooltip.top="'Eliminar indicador'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center">
          <span>Total: {{ indicadores.length }} indicadores</span>
          <span>Última actualización: {{ new Date().toLocaleString() }}</span>
        </div>
      </template>
    </Panel>

    <!-- Vista para componentes hijos -->
    <router-view @indicador-actualizado="fetchIndicadores"></router-view>
  </div>
</template>

<script>
import api from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Panel from 'primevue/panel'
import Badge from 'primevue/badge'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

export default {
  components: {
    DataTable,
    Column,
    Button,
    Calendar,
    Panel,
    Badge,
    Toast,
    ConfirmDialog,
  },
  setup() {
    const toast = useToast()
    const confirm = useConfirm()
    return { toast, confirm }
  },
  data() {
    // Obtener la fecha actual
    const hoy = new Date()
    const inicioAno = new Date(hoy.getFullYear(), 0, 1) // 1 de enero del año actual

    return {
      indicadores: [],
      loading: true,
      itemsPerPage: 12,
      fechaInicio: inicioAno,
      fechaFin: hoy,
      vistaActual: 'resumen',
    }
  },
  computed: {
    mostrarColumnaProyecto() {
      return this.vistaActual === 'resumen'
    },
    mostrarColumnaNumero() {
      return this.vistaActual === 'resumen'
    },
    mostrarColumnaIndicador() {
      return true // Siempre visible
    },
    mostrarColumnaDepartamento() {
      return this.vistaActual === 'resumen'
    },
    mostrarColumnasAccion() {
      return this.vistaActual === 'accion'
    },
    mostrarColumnasMetricas() {
      return this.vistaActual === 'resumen'
    },
    mostrarColumnaAcciones() {
      return this.vistaActual === 'resumen'
    },
  },
  mounted() {
    this.filtrarPorFecha()
  },
  watch: {
    // Recargar indicadores al regresar de rutas hijas
    $route(to, from) {
      if (to.name === 'ver-indicadores' && from.name !== 'ver-indicadores') {
        this.filtrarPorFecha(false)
      }
    },
  },
  methods: {
    async fetchIndicadores() {
      try {
        this.loading = true

        const response = await api.get('/indicadores', {
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
              'Sesión expirada. Por favor inicia sesión nuevamente.',
              'error',
            )
            localStorage.removeItem('apiToken')
            localStorage.removeItem('user')
            this.$router.push('/')
          } else {
            this.mostrarNotificacion(`Error inesperado: ${status}`, 'error')
          }
        } else if (error.request) {
          this.mostrarNotificacion('No se pudo conectar con el servidor', 'error')
        } else {
          this.mostrarNotificacion('Error inesperado en la petición', 'error')
        }
      } finally {
        this.loading = false
      }
    },

    async filtrarPorFecha(mostrarNotificacion = true) {
      // Validar que al menos una fecha esté seleccionada
      if (!this.fechaInicio && !this.fechaFin) {
        this.mostrarNotificacion('Por favor selecciona al menos una fecha para filtrar.', 'warn')
        return
      }

      // Validar que fecha inicio no sea mayor que fecha fin
      if (this.fechaInicio && this.fechaFin && this.fechaInicio > this.fechaFin) {
        this.mostrarNotificacion('La fecha de inicio no puede ser mayor que la fecha fin.', 'warn')
        return
      }

      try {
        this.loading = true

        // Formatear fechas para la API
        const formatearFecha = (fecha) => {
          if (!fecha) return null
          const d = new Date(fecha)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        // Preparar el objeto de fechas
        const fechas = {
          inicio: formatearFecha(this.fechaInicio),
          fin: formatearFecha(this.fechaFin),
        }

        const response = await api.post(
          '/indicadores/filterByDates',
          fechas,
        )

        if (response.status === 200) {
          if (Array.isArray(response.data.indicadores)) {
            this.indicadores = response.data.indicadores

            if (this.indicadores.length === 0 && mostrarNotificacion) {
              this.mostrarNotificacion(
                'No se encontraron indicadores en el rango de fechas seleccionado.',
                'info',
              )
            }
          } else {
            this.indicadores = []
          }
        }
      } catch (error) {
        console.error('Error completo:', error)
        this.manejarErrores(error)
      } finally {
        this.loading = false
      }
    },

    limpiarFiltro() {
      this.fechaInicio = null
      this.fechaFin = null
      this.fetchIndicadores() // Recargar todos los indicadores
    },

    // Método separado para navegar a configuración
    navegarAConfiguracion(indicador) {
      const id = indicador._id || indicador.id
      if (id) {
        this.$router.push({ name: 'configurar-indicador', params: { id } })
      } else {
        this.mostrarNotificacion('Error: ID del indicador no válido', 'error')
      }
    },

    // Método separado para navegar a edición
    navegarAEdicion(indicador) {
      const id = indicador._id || indicador.id
      if (id) {
        this.$router.push({ name: 'editar-indicador', params: { id } })
      } else {
        this.mostrarNotificacion('Error: ID del indicador no válido', 'error')
      }
    },

    // Método separado para confirmar eliminación
    confirmarEliminacion(indicador) {
      console.log('Indicador a eliminar:', indicador) // Debug

      this.confirm.require({
        message: `¿Estás seguro que quieres eliminar el indicador "${indicador.nombreIndicador || 'Sin nombre'}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.eliminarIndicador(indicador)
        },
        reject: () => {
          console.log('Eliminación cancelada')
        },
      })
    },

    async eliminarIndicador(indicador) {
      console.log('Ejecutando eliminación para:', indicador) // Debug

      try {
        const idIndicador = indicador._id || indicador.id

        if (!idIndicador) {
          this.mostrarNotificacion('Error: ID del indicador no válido', 'error')
          return
        }

        console.log('Eliminando indicador con ID:', idIndicador) // Debug

        const response = await api.delete(
          `/indicadores/${idIndicador}`,
        )

        if (response.status === 200) {
          this.mostrarNotificacion('Indicador eliminado exitosamente', 'success')
          // Si hay filtros activos, aplicar el filtro nuevamente, si no, recargar todos
          if (this.fechaInicio || this.fechaFin) {
            this.filtrarPorFecha(false)
          } else {
            this.fetchIndicadores()
          }
        }
      } catch (error) {
        console.error('Error completo al eliminar:', error)

        // Mostrar error con SweetAlert2
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el indicador. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        })

        this.manejarErrores(error)
      }
    },

    manejarErrores(error) {
      if (error.response) {
        const status = error.response.status

        switch (status) {
          case 401:
            this.mostrarNotificacion(
              'Sesión expirada. Por favor inicia sesión nuevamente.',
              'error',
            )
            localStorage.removeItem('apiToken')
            localStorage.removeItem('user')
            this.$router.push('/')
            break
          case 404:
            this.mostrarNotificacion('Recurso no encontrado', 'error')
            break
          case 500:
            this.mostrarNotificacion('Error interno del servidor', 'error')
            break
          default:
            this.mostrarNotificacion(`Error inesperado: ${status}`, 'error')
            break
        }
      } else if (error.request) {
        this.mostrarNotificacion('No se pudo conectar con el servidor', 'error')
      } else {
        this.mostrarNotificacion('Error inesperado en la petición', 'error')
      }
    },

    mostrarNotificacion(mensaje, severidad) {
      this.toast.add({
        severity: severidad,
        summary:
          severidad === 'error'
            ? 'Error'
            : severidad === 'warn'
              ? 'Advertencia'
              : severidad === 'info'
                ? 'Información'
                : 'Éxito',
        detail: mensaje,
        life: 3000,
      })
    },

    cambiarVista(vista) {
      this.vistaActual = vista
    },

    obtenerTituloVista() {
      switch (this.vistaActual) {
        case 'accion':
          return 'Plan de Acción'
        case 'resumen':
          return 'Vista Resumen'
        default:
          return 'Panel de Indicadores'
      }
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
/* Estilos simples para el filtro de fechas */
.date-filter-simple {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin: 0 1rem;
}

.filter-row {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 160px;
}

.date-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.date-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #495057;
  background: white;
  transition: all 0.2s ease;
  width: 100%;
}

.date-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.15rem rgba(102, 126, 234, 0.15);
  outline: none;
}

.date-input:hover {
  border-color: #cbd5e1;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-filter-simple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.btn-clear-filter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.btn-filter-simple:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.btn-filter-simple:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .date-filter-simple {
    margin: 0 0.5rem;
    padding: 0.75rem 1rem;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .date-field {
    min-width: 100%;
  }

  .filter-buttons {
    justify-content: center;
  }

  .btn-filter-simple {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .date-filter-simple {
    margin: 0 0.25rem;
    padding: 0.5rem 0.75rem;
  }

  .date-label {
    font-size: 0.8rem;
  }

  .date-input {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }

  .btn-filter-simple {
    padding: 0.6rem 1.25rem;
    font-size: 0.8rem;
  }
}

/* Mejoras para pantallas grandes */
@media (min-width: 992px) {
  .filter-row {
    justify-content: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .date-field {
    flex: 0 0 auto;
  }
}

/* Estados de validación */
.date-input.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.15);
}

.date-input.is-valid {
  border-color: #28a745;
  box-shadow: 0 0 0 0.15rem rgba(40, 167, 69, 0.15);
}

/* Personalización del selector de fecha */
.date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
  transition: filter 0.2s ease;
}

.date-input:hover::-webkit-calendar-picker-indicator {
  filter: invert(0.3);
}

.date-input:focus::-webkit-calendar-picker-indicator {
  filter: invert(0.2);
}

/* Mejoras para tabla responsiva con muchas columnas */
.table-responsive-wrapper {
  position: relative;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #667eea #f1f1f1;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

/* Asegurar ancho mínimo para todas las columnas */
.modern-table {
  min-width: 1200px; /* Ajusta según el número de columnas */
  white-space: nowrap;
}

.modern-table thead th,
.modern-table tbody td {
  min-width: 120px; /* Ancho mínimo por columna */
  max-width: 200px; /* Ancho máximo por columna */
  word-wrap: break-word;
  white-space: normal;
}

/* Columnas específicas con anchos optimizados */
.modern-table thead th:nth-child(1),
.modern-table tbody td:nth-child(1) {
  min-width: 180px; /* Proyecto */
  position: sticky;
  left: 0;
  background: white;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.modern-table thead th:nth-child(2),
.modern-table tbody td:nth-child(2) {
  min-width: 80px; /* Número */
  text-align: center;
}

.modern-table thead th:nth-child(3),
.modern-table tbody td:nth-child(3) {
  min-width: 200px; /* Indicador */
}

.modern-table thead th:nth-child(4),
.modern-table tbody td:nth-child(4) {
  min-width: 150px; /* Departamento */
}

.modern-table thead th:nth-child(5),
.modern-table tbody td:nth-child(5),
.modern-table thead th:nth-child(6),
.modern-table tbody td:nth-child(6),
.modern-table thead th:nth-child(7),
.modern-table tbody td:nth-child(7) {
  min-width: 140px; /* Actividad, Causa, Acción */
}

.modern-table thead th:nth-child(8),
.modern-table tbody td:nth-child(8),
.modern-table thead th:nth-child(9),
.modern-table tbody td:nth-child(9) {
  min-width: 120px; /* Denominador, Numerador */
}

.modern-table thead th:nth-child(10),
.modern-table tbody td:nth-child(10) {
  min-width: 140px; /* Acciones */
  position: sticky;
  right: 0;
  background: white;
  z-index: 10;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Mejorar el sticky header */
.modern-table thead th {
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  z-index: 11;
}

.modern-table thead th:nth-child(1) {
  z-index: 12; /* Mayor z-index para la intersección */
}

.modern-table thead th:nth-child(10) {
  z-index: 12; /* Mayor z-index para la intersección */
}

/* Responsive breakpoints mejorados */
@media (max-width: 1200px) {
  .modern-table {
    min-width: 1000px;
  }
}

@media (max-width: 992px) {
  .modern-table {
    min-width: 900px;
  }

  .modern-table thead th,
  .modern-table tbody td {
    min-width: 100px;
    font-size: 0.85rem;
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  .modern-table {
    min-width: 800px;
  }

  .modern-table thead th,
  .modern-table tbody td {
    min-width: 90px;
    font-size: 0.8rem;
    padding: 0.6rem 0.4rem;
  }

  /* Hacer las columnas sticky más estrechas en móvil */
  .modern-table thead th:nth-child(1),
  .modern-table tbody td:nth-child(1) {
    min-width: 150px;
  }

  .modern-table thead th:nth-child(10),
  .modern-table tbody td:nth-child(10) {
    min-width: 120px;
  }
}

@media (max-width: 576px) {
  .modern-table {
    min-width: 700px;
  }

  .modern-table thead th,
  .modern-table tbody td {
    min-width: 80px;
    font-size: 0.75rem;
    padding: 0.5rem 0.3rem;
  }

  .modern-table thead th:nth-child(1),
  .modern-table tbody td:nth-child(1) {
    min-width: 130px;
  }

  .modern-table thead th:nth-child(10),
  .modern-table tbody td:nth-child(10) {
    min-width: 100px;
  }

  /* Hacer los botones de acción más pequeños */
  .action-btn {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
    margin: 0 1px;
  }
}

/* Indicador visual para scroll horizontal */
.table-responsive-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.table-responsive-wrapper:hover::after {
  opacity: 1;
}

/* Mejorar la experiencia de scroll en touch devices */
@media (hover: none) and (pointer: coarse) {
  .table-responsive {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .table-responsive-wrapper::after {
    display: none;
  }
}

/* Estilos para botones de vista */
.view-toggle {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-toggle .btn {
  border-radius: 0;
  border: none;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.view-toggle .btn:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.view-toggle .btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.view-toggle .btn:hover::before {
  left: 100%;
}

.view-toggle .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive para botones de vista */
@media (max-width: 768px) {
  .view-toggle {
    width: 100%;
  }

  .view-toggle .btn {
    flex: 1;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 576px) {
  .view-toggle .btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
  }

  .view-toggle .btn i {
    display: none;
  }
}
</style>
