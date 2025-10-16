<template>
  <!-- Modal para seleccionar plantilla y sección para select dinamico-->
  <div
    v-if="modalPlantillaVisible"
    class="medico-modal-backdrop"
    @click.self="cerrarModalPlantilla"
  >
    <div class="medico-modal-content" @click.stop style="max-width: 600px">
      <!-- Header del modal -->
      <div class="medico-modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="modal-title-section">
            <h3>Seleccionar Origen de Datos</h3>
            <p class="modal-subtitle">Selecciona la plantilla y sección para cargar las opciones</p>
          </div>
        </div>
        <button @click="cerrarModalPlantilla" class="medico-close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body del modal -->
      <div class="medico-modal-body">
        <div class="form-section">
          <!-- Selección de plantilla -->
          <div class="mb-3">
            <label class="form-label">Plantilla*</label>
            <select
              v-model="plantillaSeleccionada"
              class="form-select"
              @change="cargarSeccionesPlantilla"
            >
              <option value="">Seleccione una plantilla</option>
              <option
                v-for="plantilla in plantillasDisponibles"
                :key="plantilla.id"
                :value="plantilla.id"
              >
                {{ plantilla.nombre_plantilla || plantilla.title }}
              </option>
            </select>
          </div>

          <!-- Selección de sección -->
          <div class="mb-3" v-if="seccionesPlantilla.length > 0">
            <label class="form-label">Sección*</label>
            <select v-model="seccionSeleccionada" class="form-select">
              <option value="">Seleccione una sección</option>
              <option
                v-for="seccion in seccionesPlantilla"
                :key="seccion.nombre"
                :value="seccion.nombre"
              >
                {{ seccion.nombre }}
              </option>
            </select>
          </div>

          <!-- Campos disponibles -->
          <div v-if="camposSeccion.length > 0">
            <label class="form-label">Campo a mostrar*</label>
            <select v-model="campoMostrar" class="form-select mb-2">
              <option value="">Seleccione campo a mostrar</option>
              <option v-for="campo in camposSeccion" :key="campo.name" :value="campo.name">
                {{ campo.name }} ({{ campo.type }})
              </option>
            </select>
          </div>

          <!-- Vista previa -->
          <div v-if="campoMostrar" class="mt-3 p-3 bg-light rounded">
            <h6>Vista previa de opciones:</h6>
            <div v-if="cargandoOpciones" class="text-center">
              <i class="fas fa-spinner fa-spin"></i> Cargando...
            </div>
            <div v-else>
              <div
                v-for="(opcion, index) in opcionesPreview"
                :key="index"
                class="badge bg-info me-1 mb-1"
              >
                {{ opcion }}
              </div>
              <div v-if="opcionesPreview.length === 0" class="text-muted">
                No hay datos disponibles en esta sección
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer del modal -->
      <div class="medico-modal-footer">
        <button type="button" @click="cerrarModalPlantilla" class="btn btn-cancel">
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button
          type="button"
          @click="aplicarConfiguracionPlantilla"
          class="btn btn-save"
          :disabled="!configuracionValida"
        >
          <i class="fas fa-check me-2"></i>
          Aplicar Configuración
        </button>
      </div>
    </div>
  </div>

  <!-- Modal para configurar tabla dinámica en subformulario -->
  <div
    v-if="modalTablaVisible"
    class="medico-modal-backdrop"
    @click.self="cerrarModalTabla"
  >
    <div class="medico-modal-content" @click.stop style="max-width: 800px">
      <div class="medico-modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-table"></i>
          </div>
          <div class="modal-title-section">
            <h3>Configurar Tabla Dinámica</h3>
            <p class="modal-subtitle">
              Selecciona la plantilla, sección y campos para las columnas de la tabla
            </p>
          </div>
        </div>
        <button @click="cerrarModalTabla" class="medico-close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="medico-modal-body">
        <div class="form-section">
          <div class="mb-3">
            <label class="form-label">Plantilla*</label>
            <select
              v-model="tablaPlantillaSeleccionada"
              class="form-select"
              @change="cargarSeccionesTabla"
            >
              <option value="">Seleccione una plantilla</option>
              <option
                v-for="plantilla in plantillasDisponibles"
                :key="plantilla.id"
                :value="plantilla.id"
              >
                {{ plantilla.nombre_plantilla || plantilla.title }}
              </option>
            </select>
          </div>

          <div class="mb-3" v-if="tablaSeccionesPlantilla.length > 0">
            <label class="form-label">Sección*</label>
            <select v-model="tablaSeccionSeleccionada" class="form-select">
              <option value="">Seleccione una sección</option>
              <option
                v-for="seccion in tablaSeccionesPlantilla"
                :key="seccion.nombre"
                :value="seccion.nombre"
              >
                {{ seccion.nombre }}
              </option>
            </select>
          </div>

          <div v-if="tablaCamposDisponibles.length > 0" class="mb-3">
            <label class="form-label">Selecciona los campos para las columnas*</label>
            <div class="alert alert-info mb-3">
              <i class="fas fa-info-circle me-2"></i>
              Selecciona múltiples campos que se mostrarán como columnas en la tabla
            </div>
            
            <div class="campos-tabla-container">
              <div
                v-for="campo in tablaCamposDisponibles"
                :key="campo.name"
                class="campo-tabla-item"
              >
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :value="campo.name"
                    v-model="tablaCamposSeleccionados"
                    @change="actualizarVistaPreviewTabla"
                  />
                  <span class="checkmark"></span>
                  <span class="checkbox-label">
                    {{ campo.name }} 
                    <span class="badge bg-secondary ms-2">{{ campo.type }}</span>
                  </span>
                </label>
              </div>
            </div>

            <div v-if="tablaCamposSeleccionados.length > 0" class="mt-3">
              <small class="text-muted">
                <i class="fas fa-check-circle text-success me-1"></i>
                {{ tablaCamposSeleccionados.length }} campo(s) seleccionado(s)
              </small>
            </div>
          </div>

          <!-- Vista previa de la tabla -->
          <div v-if="tablaCamposSeleccionados.length > 0" class="mt-4">
            <h6>Vista previa de la tabla:</h6>
            <div v-if="cargandoOpcionesTabla" class="text-center p-4">
              <i class="fas fa-spinner fa-spin"></i> Cargando datos...
            </div>
            <div v-else class="table-responsive">
              <table class="table table-bordered table-sm">
                <thead class="table-light">
                  <tr>
                    <th v-for="campo in tablaCamposSeleccionados" :key="campo">
                      {{ campo }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in tablaPreviewData" :key="index">
                    <td v-for="campo in tablaCamposSeleccionados" :key="campo">
                      {{ row[campo] || '-' }}
                    </td>
                  </tr>
                  <tr v-if="tablaPreviewData.length === 0">
                    <td :colspan="tablaCamposSeleccionados.length" class="text-center text-muted">
                      No hay datos disponibles
                    </td>
                  </tr>
                </tbody>
              </table>
              <small class="text-muted">
                Mostrando primeras {{ tablaPreviewData.length }} filas
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="medico-modal-footer">
        <button @click="cerrarModalTabla" class="btn btn-cancel">
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button
          @click="aplicarConfiguracionTabla"
          class="btn btn-save"
          :disabled="!configuracionTablaValida"
        >
          <i class="fas fa-check me-2"></i>
          Aplicar Configuración
        </button>
      </div>
    </div>
  </div>

  <!-- Estructura del Subformulario -->
  <div v-if="campo.type === 'subform'" class="subform-container">
    <div class="subform-header">
      <div class="subform-header-content">
        <i class="fas fa-indent"></i>
        <span>Subformulario para {{ campo.name || 'este campo' }}</span>
      </div>
    </div>

    <div class="subform-body">
      <div
        v-for="(subcampo, subindex) in campo.subcampos || []"
        :key="subindex"
        class="subcampo-container"
      >
        <div class="subcampo-header">
          <div class="subcampo-header-content">
            <div class="subcampo-title-wrapper">
              <div class="subcampo-icon">
                <i class="fas fa-angle-right"></i>
              </div>
              <div class="subcampo-info">
                <span class="subcampo-index">Apartado #{{ subindex + 1 }}</span>
                <span class="subcampo-description">Configure este apartado</span>
              </div>
            </div>
            <button
              type="button"
              @click="quitarSubcampo(campo, subindex)"
              class="btn-delete-subcampo"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="subcampo-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre del Apartado*</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-edit"></i>
                </span>
                <input
                  v-solo-texto-y-numeros
                  v-model="subcampo.name"
                  class="form-control"
                  required
                  placeholder="Ej: nombre, cantidad, descripción"
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Tipo del Apartado*</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-cog"></i>
                </span>
                <select v-model="subcampo.type" class="form-select" @change="handleTypeChange(subcampo)" required>
                  <option value="">Seleccione un tipo</option>
                  <option value="string">Texto</option>
                  <option value="number">Numérico</option>
                  <option value="file">Archivo</option>
                  <option value="date">Fecha</option>
                  <option value="select">Lista de Selección</option>
                  <option value="checkBox">Selección múltiple</option>
                  <option value="subform">Subformulario</option>
                  <option value="tabla">Tabla</option>
                </select>
              </div>
            </div>

            <div class="col-md-12">
              <div class="subcampo-options">
                <div class="campo-checkbox">
                  <label class="checkbox-container">
                    <input type="checkbox" class="custom-checkbox" v-model="subcampo.required" />
                    <span class="checkmark"></span>
                    <span class="checkbox-label">Obligatorio</span>
                  </label>
                </div>
                <div class="campo-radio" v-if="subcampo.type === 'date'">
                  <label class="radio-container">
                    <input
                      type="radio"
                      :name="
                        'filterOptionSubform_' + seccionIndex + '_' + campoIndex + '_' + subindex
                      "
                      class="custom-radio"
                      v-model="subcampo.filterable"
                      :value="true"
                    />
                    <span class="radiomark"></span>
                  
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración para TABLA en subformulario -->
          <div v-if="subcampo.type === 'tabla'" class="select-options-container">
            <div class="select-options-header">
              <div class="options-header-content">
                <i class="fas fa-table"></i>
                <span>Configuración de tabla para "{{ subcampo.name || 'este subcampo' }}"</span>
              </div>
            </div>

            <div class="mb-3 p-3">
              <button
                type="button"
                @click="abrirModalTabla(subcampo)"
                class="btn btn-outline-primary btn-sm"
              >
                <i class="fas fa-table me-1"></i>
                Configurar columnas de la tabla
              </button>
            </div>

            <!-- Alert de configuración aplicada -->
            <div v-if="subcampo.tableConfig" class="alert alert-success mb-3">
              <div class="d-flex align-items-start">
                <i class="fas fa-check-circle me-3 mt-1"></i>
                <div>
                  <strong>Configuración de tabla aplicada:</strong><br />
                  Plantilla: <strong>"{{ getNombrePlantillaDataSource(subcampo.tableConfig.plantillaId) }}"</strong><br />
                  Sección: <strong>"{{ subcampo.tableConfig.seccion }}"</strong><br />
                  <div class="mt-2">
                    <strong>Columnas configuradas ({{ subcampo.tableConfig.campos.length }}):</strong>
                    <div class="mt-1">
                      <span
                        v-for="(campoTabla, idx) in subcampo.tableConfig.campos"
                        :key="idx"
                        class="badge bg-primary me-1"
                      >
                        {{ campoTabla }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de opciones para Opción Múltiple -->
          <div v-if="subcampo.type === 'checkBox'" class="select-options-container">
            <div class="select-options-header">
              <div class="options-header-content">
                <i class="fas fa-list-ul"></i>
                <span>Opciones múltiples para "{{ subcampo.name || 'este subcampo' }}"</span>
              </div>
            </div>

            <!-- Opciones definidas manualmente -->
            <div class="select-options-body">
              <div v-for="(option, optionIndex) in subcampo.options || []" :key="optionIndex" class="option-item">
                <div class="option-content">
                  <div class="input-group modern-input-small">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input
                      v-model="subcampo.options[optionIndex]"
                      class="form-control"
                      placeholder="Texto de la opción"
                      required
                    />
                    <button type="button" @click="quitarOpcion(subcampo, optionIndex)" class="btn-delete-option">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Agregar nueva opción -->
              <div class="add-option-section">
                <div class="add-option-wrapper">
                  <input
                    v-model="subcampo.newOption"
                    class="form-control modern-input-standalone"
                    placeholder="Nueva opción"
                    @keyup.enter="agregarOpcion(subcampo)"
                  />
                  <button type="button" @click="agregarOpcion(subcampo)" class="btn-add-option" :disabled="!subcampo.newOption">
                    <i class="fas fa-plus"></i> Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Opciones para subcampos de tipo select -->
          <div v-if="subcampo.type === 'select'" class="select-options-container subcampo-select">
            <div class="select-options-header">
              <div class="options-header-content">
                <i class="fas fa-list-ul"></i>
                <span>Opciones para subcampo "{{ subcampo.name || 'este subcampo' }}"</span>
              </div>
            </div>

            <!-- Botón para cargar desde otra plantilla -->
            <div class="mb-3">
              <button
                type="button"
                @click="abrirModalPlantilla(subcampo)"
                class="btn btn-outline-primary btn-sm"
              >
                <i class="fas fa-database me-1"></i>
                Cargar opciones desde otra plantilla
              </button>
            </div>

            <!-- Alert de configuración aplicada -->
            <div v-if="subcampo.dataSource" class="alert alert-info mb-3">
              <div class="d-flex align-items-start">
                <i class="fas fa-lightbulb me-3 mt-1"></i>
                <div>
                  <strong>Configuración de opciones dinámicas:</strong><br />
                  Las opciones se cargarán desde la plantilla
                  <strong
                    >"{{ subcampo.dataSource.plantillaNombre}}"</strong
                  >, sección <strong>"{{ subcampo.dataSource.seccion }}"</strong><br />
                  <span class="mt-1 d-block">
                    <small>
                      Campo mostrado:
                      <strong>{{ subcampo.dataSource.campoMostrar }}</strong>
                    </small>
                  </span>
                </div>
              </div>
            </div>

            <div v-if="!subcampo.dataSource" class="select-options-body">
              <div
                v-for="(option, optionIndex) in subcampo.options || []"
                :key="optionIndex"
                class="option-item"
              >
                <div class="option-content">
                  <div class="input-group modern-input-small">
                    <span class="input-group-text">
                      <i class="fas fa-tag"></i>
                    </span>
                    <input
                      v-solo-texto-y-numeros
                      v-model="subcampo.options[optionIndex]"
                      class="form-control"
                      placeholder="Texto de la opción"
                      required
                    />
                    <button
                      type="button"
                      @click="quitarOpcion(subcampo, optionIndex)"
                      class="btn-delete-option"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="add-option-section">
                <div class="add-option-wrapper">
                  <div class="add-option-input">
                    <input
                      v-model="subcampo.newOption"
                      class="form-control modern-input-standalone"
                      placeholder="Texto de la opción"
                      @keyup.enter="agregarOpcion(subcampo)"
                    />
                  </div>
                  <button
                    type="button"
                    @click="agregarOpcion(subcampo)"
                    class="btn-add-option"
                    :disabled="!subcampo.newOption"
                  >
                    <i class="fas fa-plus"></i>
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Subformulario anidado (recursivo) -->
          <Subformulario
            v-if="subcampo.type === 'subform'"
            :campo="subcampo"
            :seccionIndex="seccionIndex"
            :campoIndex="campoIndex"
            :subcampoIndex="subindex"
            :nivel="nivel + 1"
            @abrir-modal-plantilla="emitAbrirModal"
          />
        </div>
      </div>

      <button type="button" @click="agregarSubcampo(campo)" class="btn-add-subcampo">
        <i class="fas fa-plus"></i>
        <span>Agregar Apartado</span>
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Swal from 'sweetalert2'

export default {
  name: 'Subformulario',
  props: {
    campo: {
      type: Object,
      required: true,
    },
    seccionIndex: {
      type: Number,
      required: true,
    },
    campoIndex: {
      type: Number,
      required: true,
    },
    subcampoIndex: {
      type: Number,
      default: null,
    },
    nivel: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      modalPlantillaVisible: false,
      plantillasDisponibles: [],
      plantillaSeleccionada: '',
      seccionesPlantilla: [],
      seccionSeleccionada: '',
      camposSeccion: [],
      campoMostrar: '',
      opcionesPreview: [],
      cargandoOpciones: false,
      campoActual: null,

      // Variables para el modal de TABLA
      modalTablaVisible: false,
      tablaPlantillaSeleccionada: '',
      tablaSeccionesPlantilla: [],
      tablaSeccionSeleccionada: '',
      tablaCamposDisponibles: [],
      tablaCamposSeleccionados: [],
      tablaPreviewData: [],
      cargandoOpcionesTabla: false,
      campoTablaActual: null,
    }
  },
  computed: {
    configuracionValida() {
      return this.plantillaSeleccionada && this.seccionSeleccionada && this.campoMostrar
    },
    configuracionTablaValida() {
      return (
        this.tablaPlantillaSeleccionada &&
        this.tablaSeccionSeleccionada &&
        this.tablaCamposSeleccionados.length > 0
      )
    },
  },
  watch: {
    seccionSeleccionada: 'onSeccionSeleccionada',
    tablaSeccionSeleccionada: 'onTablaSeccionSeleccionada',
  },
  async mounted() {
    await this.cargarPlantillasDisponibles()
  },
  methods: {
    async cargarPlantillasDisponibles() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get('/plantillas', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.plantillasDisponibles = response.data || []
      } catch (error) {
        console.error('Error al cargar plantillas disponibles:', error)
      }
    },

    getNombrePlantillaDataSource(plantillaId) {
      if (!plantillaId) return 'Plantilla no especificada'

      const plantilla = this.plantillasDisponibles.find((p) => p.id === plantillaId)
      return plantilla
        ? plantilla.nombre_plantilla || plantilla.title
        : `Plantilla ID: ${plantillaId}`
    },

    handleTypeChange(campo) {
      if (campo.type === 'subform' && !campo.subcampos) {
        campo.subcampos = []
        this.agregarSubcampo(campo)
      } else if ((campo.type === 'select' || campo.type === 'checkBox')  && !campo.options) {
        campo.options = []
        campo.newOption = ''
      } else if (campo.type === 'tabla' && !campo.tableConfig) {
        // Inicializar configuración de tabla
        campo.tableConfig = null
      }

      if (campo.type !== 'date') {
        campo.filterable = false
      }
    },

    agregarSubcampo(campo) {
      if (!campo.subcampos) {
        campo.subcampos = []
      }
      campo.subcampos.push({
        name: '',
        type: 'string',
        required: false,
        filterable: false,
      })
    },

    quitarSubcampo(campo, index) {
      if (campo.subcampos && campo.subcampos.length > index) {
        campo.subcampos.splice(index, 1)
      }
    },

    agregarOpcion(campo) {
      if (!campo.options) {
        campo.options = []
      }

      if (campo.newOption && campo.newOption.trim() !== '') {
        const opcionTrimmed = campo.newOption.trim()

        const existeOpcion = campo.options.some(
          (option) => option && option.toString().toLowerCase() === opcionTrimmed.toLowerCase(),
        )

        if (existeOpcion) {
          Swal.fire({
            icon: 'warning',
            title: 'Opción duplicada',
            text: 'Esta opción ya existe',
            confirmButtonColor: '#f39c12',
          })
          return
        }

        campo.options.push(opcionTrimmed)
        campo.newOption = ''
      }
    },

    quitarOpcion(campo, index) {
      if (campo.options && campo.options.length > index) {
        campo.options.splice(index, 1)
      }
    },

    emitAbrirModal(campo) {
      this.$emit('abrir-modal-plantilla', campo)
    },

    // ========== MÉTODOS PARA SELECT DINÁMICO ==========
    async abrirModalPlantilla(campo) {
      this.campoActual = campo
      this.modalPlantillaVisible = true

      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get('/plantillas', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.plantillasDisponibles = response.data || []

        // Si ya hay una configuración previa, cargarla
        if (campo.dataSource) {
          this.plantillaSeleccionada = campo.dataSource.plantillaId
          await this.cargarSeccionesPlantilla()
          this.seccionSeleccionada = campo.dataSource.seccion
          await this.onSeccionSeleccionada()
          this.campoMostrar = campo.dataSource.campoMostrar
        }
        
      } catch (error) {
        console.error('Error al cargar plantillas:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las plantillas disponibles',
        })
      }
    },

    cerrarModalPlantilla() {
      this.modalPlantillaVisible = false
      this.resetModalPlantilla()
    },

    resetModalPlantilla() {
      this.plantillaSeleccionada = ''
      this.seccionesPlantilla = []
      this.seccionSeleccionada = ''
      this.camposSeccion = []
      this.campoMostrar = ''
      this.opcionesPreview = []
      this.campoActual = null
    },

    async cargarSeccionesPlantilla() {
      if (!this.plantillaSeleccionada) return

      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get(
          `/plantillas/${this.plantillaSeleccionada}/secciones`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        this.seccionesPlantilla = response.data?.secciones || []
        this.seccionSeleccionada = ''
        this.camposSeccion = []
        this.campoMostrar = ''
        this.opcionesPreview = []
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      }
    },

    async onSeccionSeleccionada() {
      if (!this.seccionSeleccionada) return

      const seccion = this.seccionesPlantilla.find((s) => s.nombre === this.seccionSeleccionada)
      if (seccion && seccion.fields) {
        this.camposSeccion = seccion.fields
      }
    },

    aplicarConfiguracionPlantilla() {
      if (!this.configuracionValida) return

      this.campoActual.options = []
      this.campoActual.dataSource = {
        plantillaId: this.plantillaSeleccionada,
        plantillaNombre: this.getNombrePlantillaDataSource(this.plantillaSeleccionada),
        seccion: this.seccionSeleccionada,
        campoMostrar: this.campoMostrar,
      }

      this.cerrarModalPlantilla()

      Swal.fire({
        icon: 'success',
        title: 'Configuración aplicada',
        text: 'Las opciones se cargarán desde la plantilla seleccionada',
        timer: 2000,
        showConfirmButton: false,
      })
    },

    // ========== MÉTODOS PARA TABLA DINÁMICA ==========
    async abrirModalTabla(campo) {
      this.campoTablaActual = campo
      this.modalTablaVisible = true

      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get('/plantillas', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.plantillasDisponibles = response.data || []
        
        // Si ya tiene configuración previa, cargarla
        if (campo.tableConfig) {
          this.tablaPlantillaSeleccionada = campo.tableConfig.plantillaId
          await this.cargarSeccionesTabla()
          this.tablaSeccionSeleccionada = campo.tableConfig.seccion
          await this.onTablaSeccionSeleccionada()
          this.tablaCamposSeleccionados = [...campo.tableConfig.campos]
          await this.actualizarVistaPreviewTabla()
        }
      } catch (error) {
        console.error('Error al cargar plantillas:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las plantillas disponibles',
        })
      }
    },

    cerrarModalTabla() {
      this.modalTablaVisible = false
      this.resetModalTabla()
    },

    resetModalTabla() {
      this.tablaPlantillaSeleccionada = ''
      this.tablaSeccionesPlantilla = []
      this.tablaSeccionSeleccionada = ''
      this.tablaCamposDisponibles = []
      this.tablaCamposSeleccionados = []
      this.tablaPreviewData = []
      this.campoTablaActual = null
    },

    async cargarSeccionesTabla() {
      if (!this.tablaPlantillaSeleccionada) return

      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get(`/plantillas/${this.tablaPlantillaSeleccionada}/secciones`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.tablaSeccionesPlantilla = response.data?.secciones || []
        this.tablaSeccionSeleccionada = ''
        this.tablaCamposDisponibles = []
        this.tablaCamposSeleccionados = []
        this.tablaPreviewData = []
      } catch (error) {
        console.error('Error al cargar secciones para tabla:', error)
      }
    },

    async onTablaSeccionSeleccionada() {
      if (!this.tablaSeccionSeleccionada) return

      const seccion = this.tablaSeccionesPlantilla.find(
        (s) => s.nombre === this.tablaSeccionSeleccionada,
      )
      if (seccion && seccion.fields) {
        this.tablaCamposDisponibles = seccion.fields
        this.tablaCamposSeleccionados = []
        this.tablaPreviewData = []
      }
    },

    async actualizarVistaPreviewTabla() {
      if (
        !this.tablaPlantillaSeleccionada ||
        !this.tablaSeccionSeleccionada ||
        this.tablaCamposSeleccionados.length === 0
      ) {
        this.tablaPreviewData = []
        return
      }

      this.cargandoOpcionesTabla = true
      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get(`/plantillas/${this.tablaPlantillaSeleccionada}/datos`, {
          params: {
            seccion: this.tablaSeccionSeleccionada,
          },
          headers: { Authorization: `Bearer ${token}` },
        })

        // Limitar a las primeras 5 filas para preview
        this.tablaPreviewData = (response.data || []).slice(0, 5)
      } catch (error) {
        console.error('Error al cargar datos de tabla:', error)
        this.tablaPreviewData = []
      } finally {
        this.cargandoOpcionesTabla = false
      }
    },

    aplicarConfiguracionTabla() {
      if (!this.configuracionTablaValida) return

      this.campoTablaActual.tableConfig = {
        plantillaId: this.tablaPlantillaSeleccionada,
        plantillaNombre: this.getNombrePlantillaDataSource(this.tablaPlantillaSeleccionada),
        seccion: this.tablaSeccionSeleccionada,
        campos: [...this.tablaCamposSeleccionados],
      }

      this.cerrarModalTabla()

      Swal.fire({
        icon: 'success',
        title: 'Configuración aplicada',
        text: `Tabla configurada con ${this.tablaCamposSeleccionados.length} columnas`,
        timer: 2000,
        showConfirmButton: false,
      })
    },
  },
}
</script>

<style scoped>
/* Estilos para el modal de tabla */
.campos-tabla-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: #fafafa;
}

.campo-tabla-item {
  padding: 10px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.campo-tabla-item:hover {
  border-color: #4285F4;
  box-shadow: 0 2px 4px rgba(66, 133, 244, 0.1);
}

.table-responsive {
  max-height: 300px;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.table {
  margin-bottom: 0;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}

/* Estilos base del diseño moderno para modales */
.medico-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.medico-modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.medico-modal-header {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  border-radius: 16px 16px 0 0;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.modal-title-section h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.medico-close-button {
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
}

.medico-close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.medico-modal-body {
  padding: 1.5rem;
  background: white;
}

.medico-modal-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-radius: 0 0 16px 16px;
}

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
}

.btn-save:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}
</style>