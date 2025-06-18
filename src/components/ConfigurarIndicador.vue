<template>
  <div class="medico-modal-backdrop" @click.self="cerrarModal">
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
        <button @click="cerrarModal" class="medico-close-button">
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

        <!-- Selección de campo con soporte para subconfiguración -->
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
              <label class="form-label">Campo principal*</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-columns"></i>
                </span>
                <select
                  v-model="parametrosForm.campoSeleccionado"
                  @change="onCampoPrincipalSelected"
                  class="form-select"
                  required
                >
                  <option value="">Seleccione un campo</option>
                  <option v-for="campo in camposDisponibles" :key="campo.name" :value="campo.name">
                    {{ campo.alias || campo.name }} ({{ getTipoCampo(campo) }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Subconfiguración para campos de tipo subform -->
            <div v-if="mostrarSubcampos" class="subform-config-section">
              <h6 class="mt-3 mb-3">
                <i class="fas fa-layer-group me-2"></i>
                Configuración del Subformulario
              </h6>

              <!-- Operación para subformulario -->
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Operación para Subformulario*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-calculator"></i>
                    </span>
                    <select
                      v-model="parametrosForm.subConfiguracion.tipoOperacion"
                      class="form-select"
                      required
                    >
                      <option value="">Seleccione operación</option>
                      <option value="count">Contar registros (COUNT)</option>
                      <option value="sum">Sumar valores (SUM)</option>
                      <option value="avg">Promedio (AVG)</option>
                      <option value="max">Valor máximo (MAX)</option>
                      <option value="min">Valor mínimo (MIN)</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Campo para subformulario -->
              <div
                class="row g-3 mt-3"
                v-if="
                  parametrosForm.subConfiguracion.tipoOperacion &&
                  parametrosForm.subConfiguracion.tipoOperacion !== 'count'
                "
              >
                <div class="col-md-12">
                  <label class="form-label">Campo en Subformulario*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-tag"></i>
                    </span>
                    <select
                      v-model="parametrosForm.subConfiguracion.campoSeleccionado"
                      class="form-select"
                      required
                    >
                      <option value="">Seleccione un campo</option>
                      <option
                        v-for="subcampo in subcamposDisponibles"
                        :key="subcampo.name"
                        :value="subcampo.name"
                        :disabled="!esCampoNumerico(subcampo)"
                      >
                        {{ subcampo.alias || subcampo.name }} ({{ getTipoCampo(subcampo) }})
                        <span v-if="!esCampoNumerico(subcampo)"> (No numérico) </span>
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de condiciones -->
        <div
          class="form-section"
          v-if="parametrosForm.campoSeleccionado || parametrosForm.tipoOperacion"
        >
          <h6 class="section-title">
            <i class="fas fa-filter me-2"></i>
            Condiciones de Filtrado
          </h6>

          <!-- Condiciones principales -->
          <div class="mb-4">
            <h6>Condiciones Principales</h6>
            <div class="table-responsive">
              <table class="table modern-table">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Operador</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(condicion, index) in parametrosForm.condiciones" :key="index">
                    <td>
                      <select v-model="condicion.campo" class="form-select form-select-sm">
                        <option
                          v-for="campo in camposFiltrables"
                          :key="campo.name"
                          :value="campo.name"
                        >
                          {{ campo.alias || campo.name }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-model="condicion.operador" class="form-select form-select-sm">
                        <option value="==">Igual a</option>
                        <option value="!=">Diferente de</option>
                        <option value=">">Mayor que</option>
                        <option value="<">Menor que</option>
                        <option value=">=">Mayor o igual</option>
                        <option value="<=">Menor o igual</option>
                        <option value="contains">Contiene</option>
                      </select>
                    </td>
                    <td>
                      <input
                        v-model="condicion.valor"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Valor"
                      />
                    </td>
                    <td>
                      <button
                        @click="eliminarCondicion(index)"
                        class="btn btn-sm btn-danger"
                        title="Eliminar condición"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button @click="agregarCondicion" class="btn btn-sm btn-primary mt-2">
              <i class="fas fa-plus me-1"></i> Agregar Condición Principal
            </button>
          </div>

          <!-- Condiciones de subformulario -->
          <div
            v-if="mostrarSubcampos && parametrosForm.subConfiguracion.tipoOperacion"
            class="mt-4"
          >
            <h6>Condiciones de Subformulario</h6>
            <div class="table-responsive">
              <table class="table modern-table">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Operador</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(condicion, index) in parametrosForm.subConfiguracion.condiciones"
                    :key="'sub-' + index"
                  >
                    <td>
                      <select v-model="condicion.campo" class="form-select form-select-sm">
                        <option
                          v-for="campo in subcamposFiltrables"
                          :key="campo.name"
                          :value="campo.name"
                        >
                          {{ campo.alias || campo.name }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-model="condicion.operador" class="form-select form-select-sm">
                        <option value="==">Igual a</option>
                        <option value="!=">Diferente de</option>
                        <option value=">">Mayor que</option>
                        <option value="<">Menor que</option>
                        <option value=">=">Mayor o igual</option>
                        <option value="<=">Menor o igual</option>
                        <option value="contains">Contiene</option>
                      </select>
                    </td>
                    <td>
                      <input
                        v-model="condicion.valor"
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Valor"
                      />
                    </td>
                    <td>
                      <button
                        @click="eliminarCondicionSubform(index)"
                        class="btn btn-sm btn-danger"
                        title="Eliminar condición"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button @click="agregarCondicionSubform" class="btn btn-sm btn-primary mt-2">
              <i class="fas fa-plus me-1"></i> Agregar Condición Subform
            </button>
          </div>
        </div>

        <!-- Información del cálculo -->
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
                  Se realizará la operación <strong>{{ getTipoOperacionTexto() }}</strong> sobre el
                  campo <strong>"{{ getNombreCampoSeleccionado() }}"</strong>
                  de todos los documentos de la plantilla
                  <strong>"{{ getNombrePlantillaSeleccionada() }}"</strong>
                </span>

                <div
                  v-if="mostrarSubcampos && parametrosForm.subConfiguracion.tipoOperacion"
                  class="mt-2"
                >
                  <strong>Subconfiguración:</strong><br />
                  Se aplicará la operación <strong>{{ getSubOperacionTexto() }}</strong>
                  <span v-if="parametrosForm.subConfiguracion.tipoOperacion !== 'count'">
                    sobre el campo <strong>"{{ getNombreSubcampoSeleccionado() }}"</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista previa de campos disponibles -->
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
        <button @click="cerrarModal" class="btn btn-cancel">
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
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  props: ['id'],
  data() {
    return {
      plantillasDisponibles: [],
      camposDisponibles: [],
      subcamposDisponibles: [],
      subcamposFiltrables: [],
      camposFiltrables: [],
      indicadorSeleccionado: null,
      parametrosForm: {
        plantillaSeleccionada: '',
        tipoOperacion: '',
        campoSeleccionado: '',
        condiciones: [],
        subConfiguracion: {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
        },
      },
    }
  },
  computed: {
    mostrarSubcampos() {
      const campoSeleccionado = this.camposDisponibles.find(
        (c) => c.name === this.parametrosForm.campoSeleccionado,
      )
      return campoSeleccionado && campoSeleccionado.type === 'subform'
    },
    isFormComplete() {
      // Validación básica
      if (!this.parametrosForm.plantillaSeleccionada || !this.parametrosForm.tipoOperacion) {
        return false
      }

      // Si es COUNT, no necesita campo
      if (this.parametrosForm.tipoOperacion === 'count') {
        return true
      }

      // Si no hay campo seleccionado, no es válido
      if (!this.parametrosForm.campoSeleccionado) {
        return false
      }

      // Si es subform, validar subconfiguración
      if (this.mostrarSubcampos) {
        // Subconfiguración debe tener tipo de operación
        if (!this.parametrosForm.subConfiguracion.tipoOperacion) {
          return false
        }

        // Si la suboperación no es COUNT, necesita campo
        if (
          this.parametrosForm.subConfiguracion.tipoOperacion !== 'count' &&
          !this.parametrosForm.subConfiguracion.campoSeleccionado
        ) {
          return false
        }
      }

      return true
    },
  },
  mounted() {
    this.indicadorSeleccionado = { _id: this.id }
    this.fetchPlantillasDisponibles()
  },
  methods: {
    mapOperacionToBackend(operacionFrontend) {
      const map = {
        count: 'contar',
        sum: 'sumar',
        avg: 'promedio',
        max: 'maximo',
        min: 'minimo',
      }
      return map[operacionFrontend] || operacionFrontend
    },
    mapOperadorToBackend(operadorFrontend) {
      const map = {
        '==': 'igual',
        '!=': 'diferente',
        '>': 'mayor',
        '<': 'menor',
        '>=': 'mayor_o_igual',
        '<=': 'menor_o_igual',
        contains: 'contiene',
      }
      return map[operadorFrontend] || operadorFrontend
    },
    onCampoPrincipalSelected() {
      this.parametrosForm.subConfiguracion = {
        tipoOperacion: '',
        campoSeleccionado: '',
        condiciones: [],
      }

      const campoSeleccionado = this.camposDisponibles.find(
        (c) => c.name === this.parametrosForm.campoSeleccionado,
      )

      if (campoSeleccionado && campoSeleccionado.type === 'subform') {
        this.subcamposDisponibles = campoSeleccionado.subcampos || []
        this.subcamposFiltrables = this.subcamposDisponibles.filter(
          (campo) => campo.type !== 'subform',
        )
      } else {
        this.subcamposDisponibles = []
        this.subcamposFiltrables = []
      }

      this.camposFiltrables = this.camposDisponibles.filter((campo) => campo.type !== 'subform')
    },
    agregarCondicion() {
      this.parametrosForm.condiciones.push({
        campo: this.camposFiltrables[0]?.name || '',
        operador: '==',
        valor: '',
      })
    },
    eliminarCondicion(index) {
      this.parametrosForm.condiciones.splice(index, 1)
    },
    agregarCondicionSubform() {
      this.parametrosForm.subConfiguracion.condiciones.push({
        campo: this.subcamposFiltrables[0]?.name || '',
        operador: '==',
        valor: '',
      })
    },
    eliminarCondicionSubform(index) {
      this.parametrosForm.subConfiguracion.condiciones.splice(index, 1)
    },
    async aplicarParametros() {
      try {
        const idIndicador = this.indicadorSeleccionado?._id || this.indicadorSeleccionado?.id
        if (!idIndicador) {
          this.mostrarNotificacion('Error', 'No se ha seleccionado un indicador', 'error')
          return
        }

        const plantillaSeleccionada = this.plantillasDisponibles.find(
          (p) => p.id === this.parametrosForm.plantillaSeleccionada,
        )

        if (!plantillaSeleccionada) {
          this.mostrarNotificacion('Error', 'No se encontró la plantilla seleccionada', 'error')
          return
        }

        const nombrePlantilla =
          plantillaSeleccionada.nombre_plantilla || plantillaSeleccionada.title

        // Construir objeto de configuración
        const configuracion = {
          coleccion: `template_${nombrePlantilla}_data`,
          operacion: this.mapOperacionToBackend(this.parametrosForm.tipoOperacion),
          campo: this.parametrosForm.campoSeleccionado,
          condicion: this.parametrosForm.condiciones.map((cond) => ({
            campo: cond.campo,
            operador: this.mapOperadorToBackend(cond.operador),
            valor: cond.valor,
          })),
        }

        // Agregar subconfiguración si es necesario
        if (this.mostrarSubcampos && this.parametrosForm.subConfiguracion.tipoOperacion) {
          configuracion.subConfiguracion = {
            operacion: this.mapOperacionToBackend(
              this.parametrosForm.subConfiguracion.tipoOperacion,
            ),
            campo: this.parametrosForm.subConfiguracion.campoSeleccionado,
            condicion: this.parametrosForm.subConfiguracion.condiciones.map((cond) => ({
              campo: cond.campo,
              operador: this.mapOperadorToBackend(cond.operador),
              valor: cond.valor,
            })),
          }
        }

        const token = localStorage.getItem('apiToken')
        if (!token) {
          this.mostrarNotificacion('Error', 'No hay sesión activa', 'error')
          this.$router.push('/')
          return
        }

        const payload = {
          configuracion: configuracion,
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/indicadores/${idIndicador}/configuracion`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )

        if (response.status === 200) {
          this.mostrarNotificacion(
            '¡Configuración Guardada!',
            `La configuración se guardó exitosamente`,
            'success',
          )
          this.$emit('indicador-actualizado')
          this.cerrarModal()
        } else {
          this.mostrarNotificacion(
            'Advertencia',
            'El servidor respondió con un estado inesperado: ' + response.status,
            'warning',
          )
        }
      } catch (error) {
        console.error('Error al guardar configuración:', error)

        let mensaje = 'Error al guardar la configuración'
        if (error.response) {
          if (error.response.status === 401) {
            mensaje = 'Sesión expirada. Por favor inicie sesión nuevamente'
            localStorage.removeItem('apiToken')
            this.$router.push('/')
          } else if (error.response.data && error.response.data.error) {
            mensaje = error.response.data.error
          }
        }

        this.mostrarNotificacion('Error', mensaje, 'error')
      }
    },
    resetParametrosForm() {
      this.parametrosForm = {
        plantillaSeleccionada: '',
        tipoOperacion: '',
        campoSeleccionado: '',
        condiciones: [],
        subConfiguracion: {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
        },
      }
      this.subcamposDisponibles = []
      this.camposFiltrables = []
    },
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
    async onPlantillaSelected() {
      if (this.parametrosForm.plantillaSeleccionada) {
        this.parametrosForm.tipoOperacion = ''
        this.parametrosForm.campoSeleccionado = ''
        this.parametrosForm.condiciones = []
        this.parametrosForm.subConfiguracion = {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
        }

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
            this.camposDisponibles = response.data.campos.filter((campo) => campo.name !== '_id')
            this.camposFiltrables = this.camposDisponibles.filter(
              (campo) => campo.type !== 'subform',
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
    esCampoNumerico(campo) {
      return campo.type === 'number'
    },
    getTipoCampo(campo) {
      const tipos = {
        text: 'Texto',
        number: 'Numérico',
        date: 'Fecha',
        file: 'Archivo',
        subform: 'Subformulario',
      }
      return tipos[campo.type] || campo.type
    },
    getNombrePlantillaSeleccionada() {
      const plantilla = this.plantillasDisponibles.find(
        (p) => p.id === this.parametrosForm.plantillaSeleccionada,
      )
      return plantilla ? plantilla.title || plantilla.nombre_plantilla : ''
    },
    getNombreCampoSeleccionado() {
      const campo = this.camposDisponibles.find(
        (c) => c.name === this.parametrosForm.campoSeleccionado,
      )
      return campo ? campo.alias || campo.name : ''
    },
    getNombreSubcampoSeleccionado() {
      const subcampo = this.subcamposDisponibles.find(
        (c) => c.name === this.parametrosForm.subConfiguracion.campoSeleccionado,
      )
      return subcampo ? subcampo.alias || subcampo.name : ''
    },
    getTipoOperacionTexto() {
      const operaciones = {
        count: 'contar',
        sum: 'SUMA',
        avg: 'PROMEDIO',
        max: 'MÁXIMO',
        min: 'MÍNIMO',
      }
      return operaciones[this.parametrosForm.tipoOperacion] || this.parametrosForm.tipoOperacion
    },
    getSubOperacionTexto() {
      const operaciones = {
        count: 'CONTAR',
        sum: 'SUMAR',
        avg: 'PROMEDIO',
        max: 'MÁXIMO',
        min: 'MÍNIMO',
      }
      return (
        operaciones[this.parametrosForm.subConfiguracion.tipoOperacion] ||
        this.parametrosForm.subConfiguracion.tipoOperacion
      )
    },
    cerrarModal() {
      this.$router.push({ name: 'ver-indicadores' })
    },
    mostrarNotificacion(titulo, mensaje, tipo) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33',
      })
    },
  },
}
</script>
