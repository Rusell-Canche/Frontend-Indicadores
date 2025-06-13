<template>
  <div class="container-fluid py-4">
    <!-- Modal de edición -->
    <div v-if="showEditModal" class="medico-modal-backdrop" @click="closeEditModal">
      <div class="medico-modal-content" @click.stop>
        <!-- Header del modal -->
        <div class="medico-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <i class="fas fa-edit"></i>
            </div>
            <div class="modal-title-section">
              <h3>Editar Indicador</h3>
              <p class="modal-subtitle">Actualiza la información del indicador seleccionado</p>
            </div>
          </div>
          <button @click="closeEditModal" class="medico-close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body del modal -->
        <div class="medico-modal-body">
          <form @submit.prevent="guardarEdicion">
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-tag me-2"></i>
                Información del Indicador
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Nombre del Indicador*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-tag"></i>
                    </span>
                    <input
                      v-model="indicadorEditForm.nombreIndicador"
                      class="form-control"
                      required
                      placeholder="Ej: Indicador de calidad"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-folder me-2"></i>
                Configuración del Proyecto
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Proyecto*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-folder"></i>
                    </span>
                    <select v-model="indicadorEditForm._idProyecto" class="form-select" required>
                      <option value="">Seleccione un proyecto</option>
                      <option value="1.1.2">Proyecto 1.1.2</option>
                      <option value="1.1.3">Proyecto 1.1.3</option>
                      <option value="1.1.4">Proyecto 1.1.4</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Número</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-hashtag"></i>
                    </span>
                    <input
                      v-model="indicadorEditForm.numero"
                      type="number"
                      class="form-control"
                      placeholder="Ej: 1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-calculator me-2"></i>
                Valores Numéricos
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Numerador</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-arrow-down"></i>
                    </span>
                    <input
                      v-model="indicadorEditForm.numerador"
                      type="number"
                      class="form-control"
                      placeholder="Ej: 100"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Denominador</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-arrow-up"></i>
                    </span>
                    <input
                      v-model="indicadorEditForm.denominador"
                      type="number"
                      class="form-control"
                      placeholder="Ej: 200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer del modal -->
        <div class="medico-modal-footer">
          <button @click="closeEditModal" class="btn btn-cancel">
            <i class="fas fa-times me-2"></i>
            Cancelar
          </button>
          <button @click="guardarEdicion" class="btn btn-save">
            <i class="fas fa-save me-2"></i>
            Actualizar Indicador
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para configurar el indicador -->
    <div v-if="showConfigModal" class="medico-modal-backdrop" @click="closeConfigModal">
      <div class="medico-modal-content" @click.stop>
        <!-- Header del modal -->
        <div class="medico-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <i class="fas fa-cog"></i>
            </div>
            <div class="modal-title-section">
              <h3>Configurar Indicador</h3>
              <p class="modal-subtitle">Ajusta los parámetros y configuraciones del indicador</p>
            </div>
          </div>
          <button @click="closeConfigModal" class="medico-close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body del modal -->
        <div class="medico-modal-body">
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-sliders-h me-2"></i>
              Configuraciones Disponibles
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="config-card">
                  <div class="config-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <h6>Parámetros de Cálculo</h6>
                  <p class="text-muted small">Configurar fórmulas y métodos de cálculo</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="config-card">
                  <div class="config-icon">
                    <i class="fas fa-bell"></i>
                  </div>
                  <h6>Alertas y Notificaciones</h6>
                  <p class="text-muted small">Establecer umbrales y alertas automáticas</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="config-card">
                  <div class="config-icon">
                    <i class="fas fa-calendar"></i>
                  </div>
                  <h6>Periodicidad</h6>
                  <p class="text-muted small">Definir frecuencia de actualización</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="config-card">
                  <div class="config-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <h6>Permisos</h6>
                  <p class="text-muted small">Gestionar accesos y permisos de usuario</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="medico-modal-footer">
          <button @click="closeConfigModal" class="btn btn-cancel">
            <i class="fas fa-times me-2"></i>
            Cancelar
          </button>
          <button @click="guardarConfiguracion" class="btn btn-save">
            <i class="fas fa-cog me-2"></i>
            Aplicar Configuración
          </button>
        </div>
      </div>
    </div>

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
                    <button
                      @click="configurarIndicador()"
                      class="action-btn config-btn"
                      title="Configurar indicador"
                    >
                      <i class="fas fa-cog"></i>
                    </button>
                    <button
                      @click="editarIndicador(indicador)"
                      class="action-btn edit-btn"
                      title="Editar indicador"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
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
      <!-- Modal para parámetros de cálculo -->
      <div v-if="showParametrosModal" class="medico-modal-backdrop" @click="closeParametrosModal">
        <div class="medico-modal-content" @click.stop>
          <!-- Header del modal -->
          <div class="medico-modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="modal-title-section">
                <h3>Parámetros de Cálculo</h3>
                <p class="modal-subtitle">
                  Configura las operaciones y campos para el cálculo del indicador
                </p>
              </div>
            </div>
            <button @click="closeParametrosModal" class="medico-close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal -->
          <div class="medico-modal-body">
            <!-- Selección de plantilla -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-file-alt me-2"></i>
                Seleccionar Plantilla
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Plantilla*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-list-alt"></i>
                    </span>
                    <select
                      v-model="parametrosForm.plantillaSeleccionada"
                      class="form-select"
                      @change="onPlantillaSelected"
                      required
                    >
                      <option value="">Seleccione una plantilla</option>
                      <option
                        v-for="plantilla in plantillasDisponibles"
                        :key="plantilla.id"
                        :value="plantilla.id"
                      >
                        {{ plantilla.title || plantilla.nombre_plantilla }}
                      </option>
                    </select>
                  </div>
                  <div class="form-text">Selecciona la plantilla de documentos a analizar</div>
                </div>
              </div>
            </div>

            <!-- Selección de operación -->
            <div class="form-section" v-if="parametrosForm.plantillaSeleccionada">
              <h6 class="section-title">
                <i class="fas fa-calculator me-2"></i>
                Tipo de Operación
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Operación*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-function"></i>
                    </span>
                    <select v-model="parametrosForm.tipoOperacion" class="form-select" required>
                      <option value="">Seleccione una operación</option>
                      <option value="count">Contar registros (COUNT)</option>
                      <option value="sum">Sumar valores (SUM)</option>
                      <option value="avg">Promedio (AVG)</option>
                      <option value="max">Valor máximo (MAX)</option>
                      <option value="min">Valor mínimo (MIN)</option>
                    </select>
                  </div>
                  <div class="form-text">
                    <span v-if="parametrosForm.tipoOperacion === 'count'">
                      Contará el número total de documentos
                    </span>
                    <span v-else-if="parametrosForm.tipoOperacion === 'sum'">
                      Sumará los valores del campo seleccionado
                    </span>
                    <span v-else-if="parametrosForm.tipoOperacion === 'avg'">
                      Calculará el promedio del campo seleccionado
                    </span>
                    <span v-else-if="parametrosForm.tipoOperacion === 'max'">
                      Encontrará el valor máximo del campo seleccionado
                    </span>
                    <span v-else-if="parametrosForm.tipoOperacion === 'min'">
                      Encontrará el valor mínimo del campo seleccionado
                    </span>
                    <span v-else> Selecciona la operación matemática a realizar </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selección de campo -->
            <div
              class="form-section"
              v-if="parametrosForm.tipoOperacion && parametrosForm.tipoOperacion !== 'count'"
            >
              <h6 class="section-title">
                <i class="fas fa-tag me-2"></i>
                Campo a Procesar
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Campo*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-columns"></i>
                    </span>
                    <select v-model="parametrosForm.campoSeleccionado" class="form-select" required>
                      <option value="">Seleccione un campo</option>
                      <option
                        v-for="campo in camposDisponibles"
                        :key="campo.name"
                        :value="campo.name"
                        :disabled="!esCampoNumerico(campo)"
                      >
                        {{ campo.alias || campo.name }}
                        <span v-if="!esCampoNumerico(campo)"> (No numérico)</span>
                      </option>
                    </select>
                  </div>
                  <div class="form-text">
                    <span v-if="parametrosForm.tipoOperacion === 'sum'">
                      Solo se pueden seleccionar campos numéricos para sumar
                    </span>
                    <span v-else-if="parametrosForm.tipoOperacion === 'avg'">
                      Solo se pueden seleccionar campos numéricos para promediar
                    </span>
                    <span
                      v-else-if="
                        parametrosForm.tipoOperacion === 'max' ||
                        parametrosForm.tipoOperacion === 'min'
                      "
                    >
                      Se pueden seleccionar campos numéricos o de fecha
                    </span>
                    <span v-else> Selecciona el campo sobre el cual realizar la operación </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información del cálculo (solo si está todo completo) -->
            <div class="form-section" v-if="isFormComplete">
              <h6 class="section-title">
                <i class="fas fa-info-circle me-2"></i>
                Resumen del Cálculo
              </h6>
              <div class="alert alert-info">
                <div class="d-flex align-items-start">
                  <i class="fas fa-lightbulb me-3 mt-1"></i>
                  <div>
                    <strong>Operación configurada:</strong><br />
                    <span v-if="parametrosForm.tipoOperacion === 'count'">
                      Se contarán todos los documentos de la plantilla
                      <strong>"{{ getNombrePlantillaSeleccionada() }}"</strong>
                    </span>
                    <span v-else>
                      Se realizará la operación <strong>{{ getTipoOperacionTexto() }}</strong> sobre
                      el campo <strong>"{{ getNombreCampoSeleccionado() }}"</strong>
                      de todos los documentos de la plantilla
                      <strong>"{{ getNombrePlantillaSeleccionada() }}"</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista previa de campos disponibles (solo informativa) -->
            <div class="form-section" v-if="camposDisponibles.length > 0">
              <h6 class="section-title">
                <i class="fas fa-eye me-2"></i>
                Campos Disponibles en la Plantilla
              </h6>
              <div class="campos-preview">
                <div class="row g-2">
                  <div
                    v-for="campo in camposDisponibles.slice(0, 6)"
                    :key="campo.name"
                    class="col-md-4"
                  >
                    <div class="campo-badge" :class="{ 'campo-numerico': esCampoNumerico(campo) }">
                      <i class="fas fa-tag me-2"></i>
                      <span>{{ campo.alias || campo.name }}</span>
                      <small class="campo-tipo">({{ getTipoCampo(campo) }})</small>
                    </div>
                  </div>
                </div>
                <div v-if="camposDisponibles.length > 6" class="text-muted mt-2">
                  <small>... y {{ camposDisponibles.length - 6 }} campos más</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer del modal -->
          <div class="medico-modal-footer">
            <button @click="closeParametrosModal" class="btn btn-cancel">
              <i class="fas fa-times me-2"></i>
              Cancelar
            </button>
            <button @click="aplicarParametros" class="btn btn-save" :disabled="!isFormComplete">
              <i class="fas fa-check me-2"></i>
              Aplicar Configuración
            </button>
          </div>
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
        denominador: '',
        _idProyecto: '',
      },
      showParametrosModal: false,
      plantillasDisponibles: [],
      camposDisponibles: [],
      parametrosForm: {
        plantillaSeleccionada: '',
        tipoOperacion: '',
        campoSeleccionado: '',
      },
    }
  },
  computed: {
    isFormComplete() {
      if (this.parametrosForm.tipoOperacion === 'count') {
        return this.parametrosForm.plantillaSeleccionada && this.parametrosForm.tipoOperacion
      }
      return (
        this.parametrosForm.plantillaSeleccionada &&
        this.parametrosForm.tipoOperacion &&
        this.parametrosForm.campoSeleccionado
      )
    },
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

        // Obtenemos el token del localStorage (usando la clave correcta)
        const token = localStorage.getItem('apiToken')

        // Verificamos que el token existe
        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          // Redirigir al login si no hay token
          this.$router.push('/login')
          return
        }

        // Hacemos la peticion para obtener los indicadores
        const response = await axios.get('http://127.0.0.1:8000/api/indicador/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

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
        console.error('Error completo:', error)

        // Revisamos que haya respuesta
        if (error.response) {
          const status = error.response.status

          if (status === 401) {
            // Token inválido o expirado
            this.mostrarNotificacion(
              'Error',
              'Sesión expirada. Por favor inicia sesión nuevamente.',
              'error',
            )
            // Limpiar token inválido
            localStorage.removeItem('apiToken')
            localStorage.removeItem('user')
            // Redirigir al login
            this.$router.push('/login')
          } else {
            this.mostrarNotificacion('Error', `Error inesperado: ${status}`, 'error')
          }
        } else if (error.request) {
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
          console.error('Error inesperado:', error)
        }
      } finally {
        // Desactivamos el modo de carga
        this.loading = false
      }
    },

    /**
     * Elimina un indicador en especifico
     * @param {Object} indicador -  El indicador a borrar.
     * @async
     */
    async eliminarIndicador(indicador) {
      try {
        // Obtenemos el token
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          this.$router.push('/login')
          return
        }

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
        console.error('Error completo:', error)

        // Revisamos que el error tenga respuesta
        if (error.response) {
          const status = error.response.status

          // Manejamos los posibles codigos de error
          switch (status) {
            case 401:
              this.mostrarNotificacion(
                'Error',
                'Sesión expirada. Por favor inicia sesión nuevamente.',
                'error',
              )
              localStorage.removeItem('apiToken')
              localStorage.removeItem('user')
              this.$router.push('/login')
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
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
        }
      }
    },
    /**
     * Configura el indicador seleccionado
     */
    configurarIndicador() {
      // Cambiamos el estado del modal de configuración
      this.configurarParametrosCalculo()
    },
    /**
     * Cierra el modal de configuración
     */
    closeConfigModal() {
      this.showConfigModal = false
    },

    /**
     * Guarda la configuración del indicador
     */
    guardarConfiguracion() {
      // Aquí iría la lógica para guardar la configuración
      this.mostrarNotificacion('¡Completado!', 'Configuración aplicada exitosamente', 'success')
      this.closeConfigModal()
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
      this.indicadorEditForm.denominador = indicador.denominador
      this.indicadorEditForm._idProyecto = indicador._idProyecto
    },

    /**
     * Guarda los cambios realizados en el indicador
     * @async
     */
    async guardarEdicion() {
      try {
        // Obtenemos el token
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          this.$router.push('/login')
          return
        }

        // Configuramos la información a enviar
        const indicadorData = new FormData()
        indicadorData.append('nombreIndicador', this.indicadorEditForm.nombreIndicador)
        indicadorData.append('numerador', this.indicadorEditForm.numerador)
        indicadorData.append('numero', this.indicadorEditForm.numero)
        indicadorData.append('_idProyecto', this.indicadorEditForm._idProyecto)

        // Enviamos la información al servidor
        const response = await axios.post(
          `http://127.0.0.1:8000/api/indicador/update/${this.indicadorEditForm._id}`,
          indicadorData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        console.error('Error completo:', error)

        // Revisamos que el error tenga respuesta
        if (error.response) {
          const status = error.response.status

          // Manejamos los posibles codigos de error
          switch (status) {
            case 401:
              this.mostrarNotificacion(
                'Error',
                'Sesión expirada. Por favor inicia sesión nuevamente.',
                'error',
              )
              localStorage.removeItem('apiToken')
              localStorage.removeItem('user')
              this.$router.push('/login')
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
          // No se recibió respuesta del servidor
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
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
        numero: '',
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
    /**
     * Abre el modal de parámetros de cálculo
     */
    async configurarParametrosCalculo() {
      this.showParametrosModal = true
      await this.fetchPlantillasDisponibles()
    },

    /**
     * Cierra el modal de parámetros
     */
    closeParametrosModal() {
      this.showParametrosModal = false
      this.resetParametrosForm()
    },

    /**
     * Obtiene las plantillas disponibles
     */
    async fetchPlantillasDisponibles() {
      try {
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion('Error', 'No hay sesión activa', 'error')
          return
        }

        const response = await axios.get('http://127.0.0.1:8000/api/plantillas/consultar', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        this.plantillasDisponibles = response.data || []
      } catch (error) {
        console.error('Error obteniendo plantillas:', error)
        this.mostrarNotificacion('Error', 'No se pudieron cargar las plantillas', 'error')
      }
    },

    /**
     * Maneja la selección de plantilla
     */
    async onPlantillaSelected() {
      if (this.parametrosForm.plantillaSeleccionada) {
        // Resetear selecciones dependientes
        this.parametrosForm.tipoOperacion = ''
        this.parametrosForm.campoSeleccionado = ''

        try {
          const token = localStorage.getItem('apiToken')
          const response = await axios.get(
            `http://127.0.0.1:8000/api/plantillas/${this.parametrosForm.plantillaSeleccionada}/campos`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )

          if (response.data && response.data.campos) {
            // Filtrar campos que no sean _id y subforms para simplificar
            this.camposDisponibles = response.data.campos.filter(
              (campo) => campo.name !== '_id' && campo.type !== 'subform',
            )
          }
        } catch (error) {
          console.error('Error al obtener los campos:', error)
          this.mostrarNotificacion('Error', 'Error al cargar los campos de la plantilla', 'error')
        }
      } else {
        this.camposDisponibles = []
      }
    },

    /**
     * Verifica si un campo es numérico
     */
    esCampoNumerico(campo) {
      return campo.type === 'number'
    },

    /**
     * Obtiene el tipo de campo en texto legible
     */
    getTipoCampo(campo) {
      const tipos = {
        text: 'Texto',
        number: 'Numérico',
        date: 'Fecha',
        file: 'Archivo',
      }
      return tipos[campo.type] || campo.type
    },

    /**
     * Obtiene el nombre de la plantilla seleccionada
     */
    getNombrePlantillaSeleccionada() {
      const plantilla = this.plantillasDisponibles.find(
        (p) => p.id === this.parametrosForm.plantillaSeleccionada,
      )
      return plantilla ? plantilla.title || plantilla.nombre_plantilla : ''
    },

    /**
     * Obtiene el nombre del campo seleccionado
     */
    getNombreCampoSeleccionado() {
      const campo = this.camposDisponibles.find(
        (c) => c.name === this.parametrosForm.campoSeleccionado,
      )
      return campo ? campo.alias || campo.name : ''
    },

    /**
     * Obtiene el texto descriptivo del tipo de operación
     */
    getTipoOperacionTexto() {
      const operaciones = {
        count: 'CONTEO',
        sum: 'SUMA',
        avg: 'PROMEDIO',
        max: 'MÁXIMO',
        min: 'MÍNIMO',
      }
      return operaciones[this.parametrosForm.tipoOperacion] || this.parametrosForm.tipoOperacion
    },

    /**
     * Aplica la configuración de parámetros
     */
    aplicarParametros() {
      // Por ahora solo mostrar la configuración
      const configuracion = {
        plantilla: this.getNombrePlantillaSeleccionada(),
        plantillaId: this.parametrosForm.plantillaSeleccionada,
        operacion: this.getTipoOperacionTexto(),
        tipoOperacion: this.parametrosForm.tipoOperacion,
        campo: this.getNombreCampoSeleccionado(),
        campoId: this.parametrosForm.campoSeleccionado,
      }

      console.log('Configuración de parámetros:', configuracion)

      this.mostrarNotificacion(
        '¡Configuración Lista!',
        `Se configuró ${configuracion.operacion} para la plantilla "${configuracion.plantilla}"`,
        'success',
      )

      this.closeParametrosModal()
    },

    /**
     * Resetea el formulario de parámetros
     */
    resetParametrosForm() {
      this.parametrosForm = {
        plantillaSeleccionada: '',
        tipoOperacion: '',
        campoSeleccionado: '',
      }
      this.camposDisponibles = []
    },
  },
}
</script>

<style scoped>
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
  width: 95%;
  max-width: 900px;
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
  max-height: 60vh;
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
</style>
