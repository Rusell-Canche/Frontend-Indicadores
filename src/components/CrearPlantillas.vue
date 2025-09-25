<template>
  <div class="container-fluid py-4">
    <!-- Modal para seleccionar plantilla y sección -->
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
              <p class="modal-subtitle">
                Selecciona la plantilla y sección para cargar las opciones
              </p>
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
          <button @click="cerrarModalPlantilla" class="btn btn-cancel">
            <i class="fas fa-times me-2"></i>
            Cancelar
          </button>
          <button
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
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Plantilla</h3>
            <p class="header-subtitle">Configura los campos y estructura de tu nueva plantilla</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="crearPlantilla">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>Los campos marcados con
            <span class="text-danger">*</span> son obligatorios
          </div>

          <!-- Sección para el nombre de la plantilla -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-tag me-2"></i>
              Información de la Plantilla
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Nombre de la Plantilla*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-file-alt"></i>
                  </span>
                  <input
                    v-solo-texto-y-numeros
                    v-model="plantillaName"
                    v-validacion-input
                    class="form-control"
                    required
                    placeholder="Ingrese el nombre de la plantilla"
                  />
                </div>
                <div class="form-text">Ingrese un nombre descriptivo para la plantilla</div>
              </div>
            </div>
          </div>

          <!-- Sección para las secciones de la plantilla -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-layer-group me-2"></i>
              Secciones de la Plantilla
            </h6>

            <div
              v-for="(seccion, seccionIndex) in secciones"
              :key="seccionIndex"
              class="seccion-container mb-4"
            >
              <div class="seccion-header">
                <div class="seccion-header-content">
                  <div class="seccion-title-wrapper">
                    <div class="seccion-icon">
                      <i class="fas fa-folder"></i>
                    </div>
                    <div class="seccion-info">
                      <span class="seccion-index">Sección #{{ seccionIndex + 1 }}</span>
                      <span class="seccion-description">Configure los campos de esta sección</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="quitarSeccion(seccionIndex)"
                    class="btn-delete-section"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div class="seccion-name-input mt-3">
                  <label class="form-label">Nombre de la Sección*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-heading"></i>
                    </span>
                    <input
                      v-solo-texto-y-numeros
                      v-model="seccion.nombre"
                      class="form-control"
                      required
                      placeholder="Ej: Información Básica, Detalles del Proyecto"
                    />
                  </div>
                </div>
              </div>

              <div class="seccion-body">
                <!-- Campos dentro de la sección -->
                <div
                  v-for="(campo, campoIndex) in seccion.fields"
                  :key="campoIndex"
                  class="campo-container"
                >
                  <div class="campo-header">
                    <div class="campo-header-content">
                      <div class="campo-title-wrapper">
                        <div class="campo-icon">
                          <i class="fas fa-grip-vertical"></i>
                        </div>
                        <div class="campo-info">
                          <span class="campo-index">Campo #{{ campoIndex + 1 }}</span>
                          <span class="campo-description">Configure las propiedades del campo</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        @click="quitarCampo(seccionIndex, campoIndex)"
                        class="btn-delete-field"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>

                  <div class="campo-body">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label">Nombre del Campo*</label>
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-edit"></i>
                          </span>
                          <input
                            v-solo-texto-y-numeros
                            v-model="campo.name"
                            class="form-control"
                            required
                            placeholder="Ej: título, descripción, fecha_entrega"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Tipo del Campo*</label>
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-cog"></i>
                          </span>
                          <select
                            v-model="campo.type"
                            class="form-select"
                            @change="handleTypeChange(campo)"
                            required
                          >
                            <option value="">Seleccione un tipo</option>
                            <option value="string">Texto</option>
                            <option value="number">Numérico</option>
                            <option value="file">Archivo (pdf, png, mp4, mp3, wav, gif)</option>
                            <option value="date">Fecha</option>
                            <option value="select">Lista de Selección</option>
                            <option value="checkBox">Selección múltiple</option>
                            <option value="subform">Subformulario</option>
                          </select>
                        </div>
                      </div>

                      <div class="col-md-12">
                        <div class="campo-options">
                          <div class="campo-checkbox">
                            <label class="checkbox-container">
                              <input
                                type="checkbox"
                                class="custom-checkbox"
                                v-model="campo.required"
                              />
                              <span class="checkmark"></span>
                              <span class="checkbox-label">Campo obligatorio</span>
                            </label>
                          </div>

                        </div>
                      </div>
                    </div>

                    <!-- Configuración de opciones para Opción Múltiple -->
<div v-if="campo.type === 'checkBox'" class="select-options-container">
  <div class="select-options-header">
    <div class="options-header-content">
      <i class="fas fa-list-ul"></i>
      <span>Opciones múltiples para "{{ campo.name || 'este campo' }}"</span>
    </div>
  </div>

  <!-- Opciones definidas manualmente -->
  <div class="select-options-body">
    <div
      v-for="(option, optionIndex) in campo.options || []"
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
            v-model="campo.options[optionIndex]"
            class="form-control"
            placeholder="Texto de la opción"
            required
          />
          <button
            type="button"
            @click="quitarOpcion(campo, optionIndex)"
            class="btn-delete-option"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Agregar nueva opción -->
    <div class="add-option-section">
      <div class="add-option-wrapper">
        <div class="add-option-input">
          <input
            v-solo-texto-y-numeros
            v-model="campo.newOption"
            class="form-control modern-input-standalone"
            placeholder="Texto de la opción (ej: Activo, Inactivo, Pendiente)"
            @keyup.enter="agregarOpcion(campo)"
          />
        </div>
        <button
          type="button"
          @click="agregarOpcion(campo)"
          class="btn-add-option"
          :disabled="!campo.newOption"
        >
          <i class="fas fa-plus"></i>
          <span>Agregar</span>
        </button>
      </div>
    </div>
  </div>
</div>


                    <!-- Configuración de opciones para Select -->
                    <div v-if="campo.type === 'select'" class="select-options-container">
                      <div class="select-options-header">
                        <div class="options-header-content">
                          <i class="fas fa-list-ul"></i>
                          <span>Opciones para "{{ campo.name || 'este campo' }}"</span>
                        </div>
                      </div>

                      <!-- Botón para cargar desde otra plantilla -->
                      <div class="mb-3">
                        <button
                          type="button"
                          @click="abrirModalPlantilla(campo)"
                          class="btn btn-outline-primary btn-sm"
                        >
                          <i class="fas fa-database me-1"></i>
                          Cargar opciones desde otra plantilla
                        </button>
                      </div>

                      <!-- Alert de configuración aplicada -->
                      <div v-if="campo.dataSource" class="alert alert-info mb-3">
                        <div class="d-flex align-items-start">
                          <i class="fas fa-lightbulb me-3 mt-1"></i>
                          <div>
                            <strong>Configuración de opciones dinámicas:</strong><br />
                            Las opciones se cargarán desde la plantilla
                            <strong
                              >"{{
                                getNombrePlantillaDataSource(campo.dataSource.plantillaId)
                              }}"</strong
                            >, sección <strong>"{{ campo.dataSource.seccion }}"</strong><br />
                            <span class="mt-1 d-block">
                              <small>
                                Campo mostrado:
                                <strong>{{ campo.dataSource.campoMostrar }}</strong>
                              </small>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div v-if="!campo.dataSource" class="select-options-body">
                        <div
                          v-for="(option, optionIndex) in campo.options || []"
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
                                v-model="campo.options[optionIndex]"
                                class="form-control"
                                placeholder="Texto de la opción"
                                required
                              />
                              <button
                                type="button"
                                @click="quitarOpcion(campo, optionIndex)"
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
                                v-solo-texto-y-numeros
                                v-model="campo.newOption"
                                class="form-control modern-input-standalone"
                                placeholder="Texto de la opción (ej: Activo, Inactivo, Pendiente)"
                                @keyup.enter="agregarOpcion(campo)"
                              />
                            </div>
                            <button
                              type="button"
                              @click="agregarOpcion(campo)"
                              class="btn-add-option"
                              :disabled="!campo.newOption"
                            >
                              <i class="fas fa-plus"></i>
                              <span>Agregar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Subformulario - solo se muestra si el tipo es 'subform' -->
                    <!-- Subformulario - solo se muestra si el tipo es 'subform' -->
                    <Subformulario
                      v-if="campo.type === 'subform'"
                      :campo="campo"
                      :seccionIndex="seccionIndex"
                      :campoIndex="campoIndex"
                      @abrir-modal-plantilla="abrirModalPlantilla"
                    />
                  </div>
                </div>

                <button type="button" @click="agregarCampo(seccionIndex)" class="btn-add-campo">
                  <i class="fas fa-plus"></i>
                  <span>Agregar Campo a esta Sección</span>
                </button>
              </div>
            </div>

            <button type="button" @click="agregarSeccion" class="btn-add-seccion">
              <i class="fas fa-plus"></i>
              <span>Agregar Nueva Sección</span>
            </button>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button @click="resetForm" class="btn btn-cancel" type="button">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button type="submit" class="btn btn-save">
              <i class="fas fa-save me-2"></i>
              Crear Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import Subformulario from './Subformulario.vue'

export default {
  data() {
    return {
      plantillaName: '',
      secciones: [
        {
          nombre: '',
          fields: [{ name: '', type: 'string', required: false }],
        },
      ],
      ejes: [],
      selectedEje: '',
      indicadores: [],
      loading: true,
      // Variables para el modal de plantilla
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
    }
  },

  computed: {
    filteredEjes() {
      if (Array.isArray(this.ejes)) {
        const excludedEjes = []
        return this.ejes.filter((eje) => !excludedEjes.includes(eje.clave_oficial))
      } else {
        console.warn('ejes no es un array válido:', this.ejes)
        return []
      }
    },
    configuracionValida() {
      return this.plantillaSeleccionada && this.seccionSeleccionada && this.campoMostrar
    },
  },
  components: {
    Subformulario,
  },

  watch: {
    seccionSeleccionada: 'onSeccionSeleccionada',
    campoMostrar: 'cargarVistaPrevia',
  },

  methods: {
    // Nuevo método para obtener nombre de plantilla por ID
    getNombrePlantillaDataSource(plantillaId) {
      if (!plantillaId) return 'Plantilla no especificada'

      const plantilla = this.plantillasDisponibles.find((p) => p.id === plantillaId)
      return plantilla
        ? plantilla.nombre_plantilla || plantilla.title
        : `Plantilla ID: ${plantillaId}`
    },

    // Método alternativo si quieres cargar el nombre desde el servidor
    async cargarNombrePlantilla(plantillaId) {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get(`http://127.0.0.1:8000/api/plantillas/${plantillaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return (
          response.data.nombre_plantilla || response.data.title || `Plantilla ID: ${plantillaId}`
        )
      } catch (error) {
        console.error('Error al cargar nombre de plantilla:', error)
        return `Plantilla ID: ${plantillaId}`
      }
    },
    agregarSeccion() {
      this.secciones.push({
        nombre: '',
        fields: [{ name: '', type: 'string', required: false }],
      })
    },

    quitarSeccion(index) {
      if (this.secciones.length > 1) {
        this.secciones.splice(index, 1)
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Debe haber al menos una sección en la plantilla',
          confirmButtonColor: '#f39c12',
        })
      }
    },

    agregarCampo(seccionIndex) {
      this.secciones[seccionIndex].fields.push({
        name: '',
        type: 'string',
        required: false,
      })
    },

    quitarCampo(seccionIndex, campoIndex) {
      if (this.secciones[seccionIndex].fields.length > 1) {
        this.secciones[seccionIndex].fields.splice(campoIndex, 1)
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Cada sección debe tener al menos un campo',
          confirmButtonColor: '#f39c12',
        })
      }
    },

 handleTypeChange(campo) {
  if (campo.type === 'subform' && !campo.subcampos) {
    campo.subcampos = []
    this.agregarSubcampo(campo)
  } else if ((campo.type === 'select' || campo.type === 'checkBox') && !campo.options) {
    campo.options = []
    campo.newOption = ''
  }
},


    agregarSubcampo(campo) {
      if (!campo.subcampos) {
        campo.subcampos = []
      }
      campo.subcampos.push({
        name: '',
        type: 'string',
        required: false
      })
    },

    quitarSubcampo(campo, index) {
      campo.subcampos.splice(index, 1)
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

    resetForm() {
      this.plantillaName = ''
      this.secciones = [
        {
          nombre: '',
          fields: [{ name: '', type: 'string', required: false }],
        },
      ]
      this.selectedEje = ''
    },

    prepararDatosParaEnvio() {
const limpiarCampo = (campo) => {
  const campoLimpio = {
    name: campo.name,
    type: campo.type,
    required: campo.required,
  }

  if (campo.type === 'select' && campo.dataSource) {
    campoLimpio.dataSource = campo.dataSource
  } else if ((campo.type === 'select' || campo.type === 'checkBox') && campo.options) {
    campoLimpio.options = campo.options.filter(
      (option) => option !== null && option !== undefined && option.trim() !== '',
    )
  }

  if (campo.type === 'subform' && campo.subcampos) {
    campoLimpio.subcampos = campo.subcampos.map((subcampo) => limpiarCampo(subcampo))
  }

  return campoLimpio
}


      return this.secciones
        .map((seccion) => {
          const seccionLimpia = {
            nombre: seccion.nombre,
            fields: seccion.fields.map(limpiarCampo),
          }

          seccionLimpia.fields = seccionLimpia.fields.filter(
            (campo) => campo.name && campo.name.trim() !== '',
          )

          return seccionLimpia
        })
        .filter(
          (seccion) => seccion.nombre && seccion.nombre.trim() !== '' && seccion.fields.length > 0,
        )
    },

    async crearPlantilla() {
      try {
        if (!this.plantillaName || this.plantillaName.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Nombre requerido',
            text: 'Debe ingresar un nombre para la plantilla',
            confirmButtonColor: '#f39c12',
          })
          return
        }

        const seccionesSinNombre = this.secciones.filter(
          (seccion) => !seccion.nombre || seccion.nombre.trim() === '',
        )

        if (seccionesSinNombre.length > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Secciones incompletas',
            text: 'Todas las secciones deben tener un nombre',
            confirmButtonColor: '#f39c12',
          })
          return
        }

const camposInvalidos = this.secciones.some((seccion) =>
  seccion.fields.some((campo) => {
    if (campo.type === 'select' || campo.type === 'checkBox') {
      return !campo.options || campo.options.length === 0
    }
    if (campo.type === 'subform' && campo.subcampos) {
      return campo.subcampos.some(
        (subcampo) =>
          (subcampo.type === 'select' || subcampo.type === 'checkBox') &&
          (!subcampo.options || subcampo.options.length === 0),
      )
    }
    return false
  }),
)


        if (camposInvalidos && this.mostrarOpcionesManuales) {
          Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Los campos de tipo "Lista de Selección" deben tener al menos una opción',
            confirmButtonColor: '#f39c12',
          })
          return
        }

        const token = localStorage.getItem('apiToken')
        const datosParaEnviar = {
          plantilla_name: this.plantillaName,
          secciones: this.prepararDatosParaEnvio(),
        }

        console.log('Datos a enviar:', datosParaEnviar)

        const response = await axios.post('http://127.0.0.1:8000/api/plantillas', datosParaEnviar, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        Swal.fire({
          icon: 'success',
          title: '¡Completado!',
          text: response.data.message || 'Plantilla creada exitosamente',
          confirmButtonColor: '#4285F4',
        })

        this.resetForm()
      } catch (error) {
        console.error('Error al crear la plantilla:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Ocurrió un error al crear la plantilla',
          confirmButtonColor: '#d93025',
        })
      }
    },

    // MODAL METHODS - Now properly inside the methods object
    async abrirModalPlantilla(campo) {
      this.campoActual = campo
      this.modalPlantillaVisible = true

      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/plantillas', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.plantillasDisponibles = response.data || []
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
        const response = await axios.get(
          `http://127.0.0.1:8000/api/plantillas/${this.plantillaSeleccionada}/secciones`,
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
        await this.cargarVistaPrevia()
      }
    },

    async cargarVistaPrevia() {
      if (!this.plantillaSeleccionada || !this.seccionSeleccionada || !this.campoMostrar) return

      this.cargandoOpciones = true
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get(
          `http://127.0.0.1:8000/api/plantillas/${this.plantillaSeleccionada}/datos`,
          {
            params: {
              seccion: this.seccionSeleccionada,
              campo: this.campoMostrar,
            },
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        const valores = response.data || []
        this.opcionesPreview = [...new Set(valores.map((item) => item[this.campoMostrar]))].slice(
          0,
          10,
        )
      } catch (error) {
        console.error('Error al cargar vista previa:', error)
        this.opcionesPreview = []
      } finally {
        this.cargandoOpciones = false
      }
    },

    aplicarConfiguracionPlantilla() {
      if (!this.configuracionValida) return

      this.campoActual.options = []
      this.campoActual.dataSource = {
        plantillaId: this.plantillaSeleccionada,
        plantillaNombre: this.getNombrePlantillaDataSource(this.plantillaSeleccionada), // Agregado
        seccion: this.seccionSeleccionada,
        campoMostrar: this.campoMostrar,
      }

      // Ocultar opciones manuales cuando se configura desde plantilla
      this.campoActual.mostrarOpcionesManuales = false

      this.cerrarModalPlantilla()

      Swal.fire({
        icon: 'success',
        title: 'Configuración aplicada',
        text: 'Las opciones se cargarán desde la plantilla seleccionada',
        timer: 2000,
        showConfirmButton: false,
      })
    },
  },

  mounted() {},
}
</script>

<style>
/* Estilos base del diseño moderno */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
}

/* Header con el diseño moderno */
.medico-header {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.medico-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
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

/* Body con el diseño moderno */
.medico-body {
  padding: 2rem;
  background: white;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #dc3545, #c82333);
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
  color: #dc3545;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  transform: translateY(-1px);
}

.modern-input-standalone {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input-standalone:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  transform: translateY(-1px);
  outline: none;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.alert {
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  background: linear-gradient(145deg, #f8d7da 0%, #f1b0b7 100%);
  color: #721c24;
}

/* ===== ESTILOS PARA SECCIONES (COLOR AZUL) ===== */
.seccion-container {
  margin-bottom: 2rem;
  background: linear-gradient(145deg, #e3f2fd 0%, #f3f9ff 100%);
  border-radius: 16px;
  border: 2px solid rgba(33, 150, 243, 0.2);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  overflow: hidden;
  position: relative;
}

.seccion-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3, #1976d2, #0d47a1);
  border-radius: 16px 16px 0 0;
}

.seccion-header {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(33, 150, 243, 0.15);
}

.seccion-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.seccion-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seccion-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.seccion-info {
  display: flex;
  flex-direction: column;
}

.seccion-index {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1565c0;
  margin-bottom: 0.25rem;
}

.seccion-description {
  font-size: 0.85rem;
  color: #1976d2;
  font-weight: 500;
}

.btn-delete-section {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-delete-section:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.seccion-name-input {
  margin-top: 1rem;
}

.seccion-body {
  padding: 1.5rem;
  background: linear-gradient(145deg, #f3f9ff 0%, #ffffff 100%);
}

/* ===== ESTILOS PARA CAMPOS REGULARES (COLOR VERDE) ===== */
.campo-container {
  margin-bottom: 1.5rem;
  background: linear-gradient(145deg, #e8f5e8 0%, #f1f8e9 100%);
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
  overflow: hidden;
  position: relative;
}

.campo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #388e3c, #2e7d32);
  border-radius: 12px 12px 0 0;
}

.campo-header {
  background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%);
  padding: 1rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.15);
}

.campo-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.campo-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.campo-icon {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.4);
}

.campo-info {
  display: flex;
  flex-direction: column;
}

.campo-index {
  font-size: 1rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 0.2rem;
}

.campo-description {
  font-size: 0.8rem;
  color: #388e3c;
  font-weight: 500;
}

.btn-delete-field {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3);
}

.btn-delete-field:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
}

.campo-body {
  padding: 1.25rem;
  background: linear-gradient(145deg, #f1f8e9 0%, #ffffff 100%);
}

.campo-options {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
}

/* Checkbox personalizado */
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2rem;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
  border-color: #dc3545;
}

.custom-checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-color: #dc3545;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label {
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Radio button personalizado */
.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2rem;
}

.custom-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radiomark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.radio-container:hover .radiomark {
  border-color: #dc3545;
}

.custom-radio:checked ~ .radiomark {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-color: #dc3545;
}

.radiomark:after {
  content: '';
  position: absolute;
  display: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

.custom-radio:checked ~ .radiomark:after {
  display: block;
}

.radio-label {
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Estilos para las opciones del select en campos regulares */
.select-options-container {
  margin-top: 1.5rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  background: linear-gradient(145deg, #f1f8e9 0%, #ffffff 100%);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
}

.select-options-header {
  background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.options-header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2e7d32;
  font-size: 0.95rem;
}

.select-options-body {
  padding: 1.25rem;
}

.option-item {
  margin-bottom: 1rem;
}

.option-item:last-child {
  margin-bottom: 0;
}

.modern-input-small .input-group-text {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border: none;
  color: white;
  border-radius: 8px 0 0 8px;
  width: 45px;
  justify-content: center;
  font-size: 0.9rem;
}

.modern-input-small .form-control {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0;
  padding: 0.6rem 0.9rem;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.9rem;
}

.modern-input-small .form-control:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 0.15rem rgba(76, 175, 80, 0.25);
  transform: translateY(-1px);
}

.btn-delete-option {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  border-radius: 0 8px 8px 0;
  padding: 0.6rem 0.9rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete-option:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
}

.add-option-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.add-option-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.add-option-input {
  flex: 1;
}

.btn-add-option {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-add-option:hover:not(:disabled) {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-add-option:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ===== ESTILOS PARA SUBFORMULARIOS (COLOR NARANJA) ===== */
.subform-container {
  margin-top: 1.5rem;
  background: linear-gradient(145deg, #fff3e0 0%, #ffeaa7 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 152, 0, 0.3);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
  overflow: hidden;
  position: relative;
}

.subform-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff9800, #f57c00, #e65100);
  border-radius: 12px 12px 0 0;
}

.subform-header {
  background: linear-gradient(135deg, #ffcc02 0%, #fff3e0 100%);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 152, 0, 0.2);
}

.subform-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e65100;
  font-weight: 600;
  font-size: 1rem;
}

.subform-body {
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffeaa7 0%, #ffffff 100%);
}

.subcampo-container {
  margin-bottom: 1.25rem;
  background: linear-gradient(145deg, #fff8e1 0%, #ffffff 100%);
  border-radius: 10px;
  border: 1px solid rgba(255, 152, 0, 0.2);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.subcampo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffc107, #ff9800, #f57c00);
  border-radius: 10px 10px 0 0;
}

.subcampo-header {
  background: linear-gradient(135deg, #ffecb3 0%, #fff8e1 100%);
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 152, 0, 0.15);
}

.subcampo-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subcampo-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subcampo-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
}

.subcampo-info {
  display: flex;
  flex-direction: column;
}

.subcampo-index {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e65100;
  margin-bottom: 0.1rem;
}

.subcampo-description {
  font-size: 0.75rem;
  color: #f57c00;
  font-weight: 500;
}

.btn-delete-subcampo {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.btn-delete-subcampo:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(220, 53, 69, 0.4);
}

.subcampo-body {
  padding: 1rem;
  background: linear-gradient(145deg, #ffffff 0%, #fff8e1 100%);
}

.subcampo-options {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.75rem;
}

/* Estilos para las opciones del select en subcampos */
.select-options-container.subcampo-select {
  border-color: rgba(255, 152, 0, 0.3);
  background: linear-gradient(145deg, #fff8e1 0%, #ffffff 100%);
}

.subcampo-select .select-options-header {
  background: linear-gradient(135deg, #ffecb3 0%, #fff8e1 100%);
  border-bottom-color: rgba(255, 152, 0, 0.2);
}

.subcampo-select .options-header-content {
  color: #e65100;
}

.subcampo-select .modern-input-small .input-group-text {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.subcampo-select .modern-input-small .form-control:focus {
  border-color: #ff9800;
  box-shadow: 0 0 0 0.15rem rgba(255, 152, 0, 0.25);
}

/* Botones de agregar */
.btn-add-campo,
.btn-add-subcampo,
.btn-add-seccion {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-add-campo {
  width: 100%;
  margin-top: 1.5rem;
}

.btn-add-subcampo {
  margin-top: 1rem;
}

.btn-add-seccion {
  margin-top: 1.5rem;
}

.btn-add-campo:hover,
.btn-add-subcampo:hover,
.btn-add-seccion:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(40, 167, 69, 0.4);
}

/* Footer con botones */
.medico-footer {
  padding: 1.5rem 0 0.5rem 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
  color: white;
}

/* Animaciones */
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
  .medico-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .header-title-section h3 {
    font-size: 1.25rem;
  }

  .medico-body {
    padding: 1.5rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .seccion-container {
    margin-bottom: 1.5rem;
  }

  .seccion-header {
    padding: 1rem;
  }

  .seccion-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .seccion-body {
    padding: 1rem;
  }

  .campo-container {
    margin-bottom: 1rem;
  }

  .campo-header {
    padding: 0.875rem;
  }

  .campo-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .campo-body {
    padding: 1rem;
  }

  .campo-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .subform-container {
    margin-top: 1rem;
  }

  .subform-body {
    padding: 1rem;
  }

  .subcampo-container {
    margin-bottom: 1rem;
  }

  .subcampo-header {
    padding: 0.75rem;
  }

  .subcampo-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .subcampo-body {
    padding: 0.875rem;
  }

  .subcampo-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .add-option-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }

  .medico-footer {
    padding: 1rem 0;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .medico-header {
    padding: 1rem;
  }

  .medico-body {
    padding: 1rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .seccion-container {
    margin-bottom: 1rem;
  }

  .seccion-header {
    padding: 0.75rem;
  }

  .seccion-body {
    padding: 0.75rem;
  }

  .campo-container {
    margin-bottom: 0.75rem;
  }

  .campo-header {
    padding: 0.75rem;
  }

  .campo-body {
    padding: 0.75rem;
  }

  .subform-container {
    margin-top: 0.75rem;
  }

  .subform-body {
    padding: 0.75rem;
  }

  .subcampo-container {
    margin-bottom: 0.75rem;
  }

  .subcampo-header {
    padding: 0.625rem;
  }

  .subcampo-body {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .select-options-container {
    margin-top: 1rem;
  }

  .select-options-body {
    padding: 1rem;
  }

  .add-option-section {
    margin-top: 1rem;
    padding-top: 1rem;
  }
}
</style>
