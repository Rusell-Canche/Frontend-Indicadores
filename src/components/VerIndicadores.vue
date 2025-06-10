<template>
  <div class="container-fluid px-4 py-4">
    <!-- MODAL DE EDICIÓN MEJORADO -->
    <div
      v-if="showEditModal"
      class="modal-backdrop d-flex align-items-center justify-content-center"
    >
      <div class="modal-content shadow-lg rounded-4 overflow-hidden" style="max-width: 600px">
        <!-- Cabecera -->
        <div class="modal-header bg-gradient-primary text-white py-3 px-4">
          <h3 class="modal-title m-0"><i class="bi bi-pencil-square me-2"></i>Editar Indicador</h3>
          <button
            @click="closeEditModal"
            class="btn-close btn-close-white"
            aria-label="Close"
          ></button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body px-4 py-3">
          <!-- Nombre del indicador-->
          <div class="form-floating mb-3">
            <input
              type="text"
              id="nombre-indicador"
              v-model="indicadorEditForm.nombreIndicador"
              class="form-control shadow-sm"
              placeholder="Nombre del indicador"
              required
            />
            <label for="nombre-indicador"
              ><i class="bi bi-tag me-2 text-primary"></i>Indicador
              <span class="text-danger">*</span></label
            >
          </div>

          <!-- Proyecto del indicador -->
          <div class="form-floating mb-3">
            <select
              id="proyecto"
              v-model="indicadorEditForm._idProyecto"
              class="form-select shadow-sm"
              required
            >
              <option value="1.1.2">1.1.2</option>
              <option value="1.1.3">1.1.3</option>
              <option value="1.1.4">1.1.4</option>
            </select>
            <label for="proyecto"
              ><i class="bi bi-folder me-2 text-primary"></i>Proyecto
              <span class="text-danger">*</span></label
            >
          </div>

          <div class="row g-3">
            <!-- Número -->
            <div class="col-md-6">
              <div class="form-floating">
                <input
                  type="number"
                  id="numero"
                  v-model="indicadorEditForm.numero"
                  class="form-control shadow-sm"
                  placeholder="0"
                />
                <label for="numero"><i class="bi bi-hash me-2 text-primary"></i>Número</label>
              </div>
            </div>

            <!-- Numerador del indicador -->
            <div class="col-md-6">
              <div class="form-floating">
                <input
                  type="number"
                  id="numerador"
                  v-model="indicadorEditForm.numerador"
                  class="form-control shadow-sm"
                  placeholder="0"
                />
                <label for="numerador"
                  ><i class="bi bi-calculator me-2 text-primary"></i>Numerador</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Pie -->
        <div class="modal-footer bg-light d-flex justify-content-end border-0 px-4 py-3">
          <button @click="closeEditModal" class="btn btn-outline-secondary rounded-pill px-4 me-2">
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
          <button @click="guardarEdicion" class="btn btn-primary rounded-pill px-4">
            <i class="bi bi-check-circle me-2"></i>Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para configurar el indicador -->
    <div
      v-if="showConfigModal"
      class="modal-backdrop d-flex align-items-center justify-content-center"
    >
      <div class="modal-content shadow-lg rounded-4 overflow-hidden" style="max-width: 600px">
        <!-- Cabecera -->
        <div class="modal-header bg-gradient-primary text-white py-3 px-4">
          <h3 class="modal-title m-0"><i class="bi bi-gear me-2"></i>Configurar Indicador</h3>
          <button
            @click="closeConfigModal"
            class="btn-close btn-close-white"
            aria-label="Close"
          ></button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body px-4 py-3">
          <p class="text-muted">Aquí puedes configurar el indicador seleccionado.</p>
          <!-- Aquí puedes agregar los campos necesarios para la configuración -->
        </div>
        <!-- Pie -->
        <div class="modal-footer bg-light d-flex justify-content-end border-0 px-4 py-3">
          <button
            @click="closeConfigModal"
            class="btn btn-outline-secondary rounded-pill px-4 me-2"
          >
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
          <button @click="guardarConfiguracion" class="btn btn-primary rounded-pill px-4">
            <i class="bi bi-check-circle me-2"></i>Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Indicadores -->
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-gradient-primary-to-secondary text-white p-4 border-0">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold"><i class="bi bi-speedometer2 me-2 fs-4"></i>Indicadores</h5>
          <span
            class="badge bg-white text-primary rounded-pill px-3 py-2 d-flex align-items-center"
          >
            <i class="bi bi-list-check me-1"></i>{{ indicadores.length }} Total
          </span>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead class="bg-light">
              <tr>
                <th class="text-uppercase ps-4 py-3 fw-bold text-primary">
                  <i class="bi bi-folder-fill me-2"></i>Proyecto
                </th>
                <th class="text-uppercase py-3 fw-bold text-primary">
                  <i class="bi bi-hash me-2"></i>No.
                </th>
                <th class="text-uppercase py-3 fw-bold text-primary">
                  <i class="bi bi-tag-fill me-2"></i>Indicador
                </th>
                <th class="text-uppercase py-3 fw-bold text-primary">
                  <i class="bi bi-arrow-up-circle-fill me-2"></i>Denominador
                </th>
                <th class="text-uppercase py-3 fw-bold text-primary">
                  <i class="bi bi-arrow-down-circle-fill me-2"></i>Numerador
                </th>
                <th class="text-uppercase py-3 fw-bold text-primary text-center" colspan="3">
                  <i class="bi bi-sliders me-2"></i>Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(indicador, index) in paginatedData"
                :key="indicador._id"
                class="border-bottom"
              >
                <td class="ps-4 py-3">
                  <span
                    class="badge rounded-pill bg-primary-subtle text-primary px-3 py-2 fw-semibold"
                  >
                    {{ indicador._idProyecto }}
                  </span>
                </td>
                <td class="py-3">
                  <span
                    class="badge bg-secondary text-white rounded-circle p-2 fw-bold"
                    style="width: 32px; height: 32px"
                  >
                    {{ indicador.numero }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="fw-medium text-dark">{{ indicador.nombreIndicador }}</div>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center">
                    <div class="me-2 p-2 rounded-circle bg-success-subtle">
                      <i class="bi bi-arrow-up text-success"></i>
                    </div>
                    <span class="text-success fw-bold">{{ indicador.denominador }}</span>
                  </div>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center">
                    <div class="me-2 p-2 rounded-circle bg-danger-subtle">
                      <i class="bi bi-arrow-down text-danger"></i>
                    </div>
                    <span class="text-danger fw-bold">{{ indicador.numerador }}</span>
                  </div>
                </td>
                <td class="py-3">
                  <button
                    class="btn btn-sm btn-outline-primary rounded-pill px-3"
                    @click="configurarIndicador()"
                  >
                    <i class="bi bi-pencil-square me-1"></i>configurar
                  </button>
                </td>
                <td class="py-3">
                  <button
                    class="btn btn-sm btn-outline-primary rounded-pill px-3"
                    @click="editarIndicador(indicador)"
                  >
                    <i class="bi bi-pencil-square me-1"></i>Editar
                  </button>
                </td>
                <td class="py-3">
                  <button
                    class="btn btn-sm btn-outline-danger rounded-pill px-3"
                    @click="eliminarIndicador(indicador)"
                  >
                    <i class="bi bi-trash me-1"></i>Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="indicadores.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="py-4">
                    <i class="bi bi-database-exclamation display-4 text-muted"></i>
                    <h5 class="mt-3 fw-semibold text-muted">No hay datos disponibles</h5>
                    <p class="text-muted">No se encontraron indicadores para mostrar</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-white p-4 border-0">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div class="text-muted mb-3 mb-md-0 fw-medium">
            <i class="bi bi-info-circle me-2"></i>Mostrando
            <span class="fw-bold text-primary">{{ startItem }}-{{ endItem }}</span> de
            <span class="fw-bold text-primary">{{ indicadores.length }}</span> registros
          </div>
          <nav aria-label="Paginación">
            <ul class="pagination pagination-md justify-content-center mb-0">
              <li class="page-item me-1" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link border-0 rounded-circle shadow-sm"
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  aria-label="Anterior"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li
                class="page-item mx-1"
                v-for="page in pages"
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <button
                  class="page-link border-0 rounded-circle shadow-sm fw-medium"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </li>
              <li class="page-item ms-1" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link border-0 rounded-circle shadow-sm"
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  aria-label="Siguiente"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
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
      showEditModal: false,
      showConfigModal: false,
      indicadorEditForm: {
        _id: null,
        nombreIndicador: '',
        numerador: '',
        numero: '',
        _idProyecto: '',
      },
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
  methods: {
    getCsrfToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]')
      if (!metaTag) {
        throw new Error('No se encontró el token CSRF')
      }
      return metaTag.content
    },

    /**
     * Hace una petición a la API para conseguir
     * todos los indicadores y los guarda en el arreglo indicadores
     * @async */
    async fetchIndicadores() {
      try {
        // Activamos el modo de carga
        this.loading = true

        // Hacemos la peticion para obtener los indicadores
        const response = await axios.get('api/indicador/getAll')

        // Imprimimos la respuesta
        console.info('Respuesta de la API a indicadores')
        console.info(response)

        // Procesamos la respuesta
        if (response.status === 200) {
          // Revisamos si hay indicadores en data
          if (Array.isArray(response.data.indicadores)) {
            this.indicadores = response.data.indicadores
          } else {
            // Si indicadores esta vacio no se devuelve nada
            this.indicadores = []
          }
        }
      } catch (error) {
        // Revisamos que haya respuesta
        if (error.response) {
          this.mostrarNotificacion('Error', `Error inesperado: ${error.response.status}`, 'error')
          console.error('Error inesperado:', error)
        } else if (error.request) {
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        }
      }
    },

    /**
     * Elimina un indicador en especifico
     * @param {Object} indicador -  El indicador a borrar.
     * @async
     */
    async eliminarIndicador(indicador) {
      try {
        // Mostramos un mensaje de confirmación
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

        // Si el usuario confirma la eliminacion hacemos la peticion
        if (respuesta.isConfirmed) {
          // Obtenemos el id del indicador
          const idIndicador = indicador._id || indicador.id

          // Hacemos la peticion
          const response = await axios.delete(`api/indicador/delete/${idIndicador}`, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          })

          // Manejamos la respuesta
          if (response.status === 200) {
            // Mostramos un mensaje de exito
            this.mostrarNotificacion('¡Completado!', 'Indicador eliminado exitosamente', 'success')
            // Actualizamos la lista de indicadores
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
        // Revisamos que el error tenga respuesta
        if (error.response) {
          // Manejamos los posibles codigos de error
          switch (error.response.status) {
            case 404:
              this.mostrarNotificacion('Error', 'Indicador no encontrado', 'error')
              console.error('Error 404:', error.response.data.message)
              break

            case 500:
              this.mostrarNotificacion('Error', 'Error interno del servidor', 'error')
              console.error('Error 500:', error.response.data.message)
              break

            default:
              this.mostrarNotificacion(
                'Error',
                `Error inesperado: ${error.response.status}`,
                'error',
              )
              console.error('Error inesperado:', error.response.data.message)
              break
          }
        } else if (error.request) {
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        }
      }
    },
    /**
     * Configura el indicador seleccionado
     */
    configurarIndicador() {
      // Cambiamos el estado del modal de configuración
      this.showConfigModal = true
    },
    /**
     * Cierra el modal de configuración
     */
    closeConfigModal() {
      this.showConfigModal = false
    },

    /**
     * Activa el modo de edición y carga los datos
     * del indicador seleccionado en indicadorEditForm
     * @param eje - El eje a editar.
     */
    editarIndicador(indicador) {
      // Cambiamos el estado del modal
      this.showEditModal = true
      // Cargamos los datos del eje en el formulario
      this.indicadorEditForm._id = indicador._id || indicador.id
      this.indicadorEditForm.nombreIndicador = indicador.nombreIndicador
      this.indicadorEditForm.numerador = indicador.numerador
      this.indicadorEditForm.numero = indicador.numero
      this.indicadorEditForm._idProyecto = indicador._idProyecto
    },

    /**
     * Guarda los cambios realizados en el indicador
     * @async
     */
    async guardarEdicion() {
      try {
        // Configuramos la información a enviar
        const indicadorData = new FormData()
        indicadorData.append('nombreIndicador', this.indicadorEditForm.nombreIndicador)
        indicadorData.append('numerador', this.indicadorEditForm.numerador)
        indicadorData.append('numero', this.indicadorEditForm.numero)
        indicadorData.append('_idProyecto', this.indicadorEditForm._idProyecto)

        // Enviamos la información al servidor
        const response = await axios.post(
          `api/indicador/update/${this.indicadorEditForm._id}`,
          indicadorData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        )

        // Verificamos la respuesta
        if (response.status === 200) {
          // Cerramos el modal
          this.closeEditModal()

          // Descargamos los indicadores nuevamente
          this.fetchIndicadores()
          // Mostramos un mensaje de éxito
          this.mostrarNotificacion('¡Completado!', 'Indicador editado exitosamente', 'success')
        } else {
          this.mostrarNotificacion(
            'Advertencia',
            'Estado inesperado: ' + response.status,
            'warning',
          )
        }
      } catch (error) {
        // Revisamos que el error tenga respuesta
        if (error.response) {
          // Manejamos los posibles codigos de error
          switch (error.response.status) {
            case 404:
              this.mostrarNotificacion('Error', 'Indicador no encontrado', 'error')
              console.error('Error 404:', error.response.data.message)
              break

            case 500:
              this.mostrarNotificacion('Error', 'Error interno del servidor', 'error')
              console.error('Error 500:', error.response.data.message)
              break

            default:
              this.mostrarNotificacion(
                'Error',
                `Error inesperado: ${error.response.status}`,
                'error',
              )
              console.error('Error inesperado:', error.response.data.message)
              break
          }
        } else if (error.request) {
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        }
      }
    },

    /**
     * Cierra el modal de edición
     */
    closeEditModal() {
      this.showEditModal = false
      this.indicadorEditForm = {
        _id: null,
        nombreIndicador: '',
        numerador: '',
        denominador: '',
        _idProyecto: '',
      }
    },

    formatDate(dateObj) {
      if (!dateObj) return 'Fecha no disponible'

      if (dateObj.$date) {
        const timestamp = dateObj.$date.$numberLong || dateObj.$date
        return new Date(parseInt(timestamp)).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (typeof dateObj === 'string') {
        return new Date(dateObj).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (typeof dateObj === 'number') {
        return new Date(dateObj).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }

      return 'Formato de fecha no reconocido'
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

<style scoped>
/* ESTILOS MEJORADOS */
.card {
  border-radius: 0.75rem;
  transition: box-shadow 0.3s ease;
  transform: none !important;
}

.card:hover {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.12) !important;
}

.bg-gradient-primary-to-secondary {
  background: linear-gradient(to right, #3b82f6, #2563eb);
}

.bg-gradient-primary {
  background: linear-gradient(to right, #3b82f6, #2563eb);
}

.table {
  --bs-table-bg: transparent;
  --bs-table-striped-bg: #f9fafb;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #3b82f6;
  white-space: nowrap;
}

.table td,
.table th {
  padding-top: 1rem;
  padding-bottom: 1rem;
  vertical-align: middle;
}

.table tbody tr {
  transition: background-color 0.15s ease-in-out;
}

.table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.05) !important;
}

/* Modal mejorado */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 550px;
  border-radius: 1.25rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.4s ease;
  border: none;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  border-bottom: none;
  padding: 1.5rem;
  position: relative;
}

.modal-title {
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-modal {
  background-color: rgba(255, 255, 255, 0.2);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
}

.form-floating .form-label i {
  opacity: 0.75;
}

.form-floating .form-control:focus + .form-label i,
.form-floating .form-select:focus + .form-label i {
  color: #3b82f6;
  opacity: 1;
}

.form-floating .form-control:focus,
.form-floating .form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
}

.form-floating .form-control,
.form-floating .form-select {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 1rem;
  height: calc(3.5rem + 2px);
  font-size: 1rem;
  transition: all 0.25s ease;
}

.form-floating label {
  padding-left: 1rem;
  height: calc(3.5rem + 2px);
  display: flex;
  align-items: center;
}

.btn-guardar {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border: none;
  box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}

.btn-guardar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

/* Scrollbar personalizada */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Paginación mejorada */
.pagination {
  margin-bottom: 0;
  gap: 4px;
}

.page-item .page-link {
  border: none !important;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  background-color: #f3f4f6;
  border-radius: 50%;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
}

.page-item.active .page-link {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  transform: scale(1.1);
}

.page-item:not(.active) .page-link:hover {
  background-color: #e5e7eb;
  color: #1f2937;
  transform: translateY(-2px);
}

.page-item.disabled .page-link {
  color: #9ca3af;
  background-color: #f3f4f6;
  opacity: 0.6;
}

/* Botones de acción */
.btn-outline-primary,
.btn-outline-danger {
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
}

.btn-outline-danger:hover {
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
}

/* Responsividad */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table th,
  .table td {
    white-space: nowrap;
  }

  .card-footer {
    flex-direction: column;
  }

  .pagination {
    margin-top: 15px;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }
}
</style>
