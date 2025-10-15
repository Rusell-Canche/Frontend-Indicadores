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
        <!-- Control de nivel de subformulario -->
        <div class="form-section nivel-control">
          <h6 class="section-title">
            <i class="fas fa-layer-group me-2"></i>
            Configuración de Anidamiento
          </h6>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nivel máximo de subformularios</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-sort-numeric-up"></i>
                </span>
                <select v-model="maxNivelSubformulario" class="form-select">
                  <option :value="1">1 nivel</option>
                  <option :value="2">2 niveles</option>
                  <option :value="3">3 niveles</option>
                  <option :value="4">4 niveles</option>
                </select>
              </div>
              <div class="form-text">
                Define qué tan profundo puede ser el anidamiento de subformularios
              </div>
            </div>
          </div>
        </div>

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
        <!-- Selección de campo de fecha para filtro -->
        <div
          class="form-section"
          v-if="parametrosForm.plantillaSeleccionada && camposFechaDisponibles.length > 0"
        >
          <h6 class="section-title">
            <i class="fas fa-calendar-alt me-2"></i>
            Campo para Filtro de Fecha
          </h6>
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Campo de Fecha</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-calendar"></i>
                </span>
                <select v-model="parametrosForm.campoFechaFiltro" class="form-select">
                  <option value="">Ninguno (sin filtro de fecha)</option>
                  <option
                    v-for="campo in camposFechaDisponibles"
                    :key="campo.fullPath"
                    :value="campo.fullPath"
                  >
                    {{ campo.displayName }}
                  </option>
                </select>
              </div>
              <div class="form-text">
                Selecciona un campo de fecha para filtrar los documentos por rango de fechas
              </div>
            </div>
          </div>
        </div>

        <!-- Selección de sección -->
        <div
          class="form-section"
          v-if="parametrosForm.plantillaSeleccionada && seccionesDisponibles.length > 0"
        >
          <h6 class="section-title">
            <i class="fas fa-layer-group me-2"></i>
            Seleccionar Sección
          </h6>
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Sección*</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-folder"></i>
                </span>
                <select
                  v-model="parametrosForm.seccionSeleccionada"
                  class="form-select"
                  @change="onSeccionSelected"
                  required
                >
                  <option value="">Seleccione una sección</option>
                  <option
                    v-for="seccion in seccionesDisponibles"
                    :key="seccion.nombre"
                    :value="seccion.nombre"
                  >
                    {{ seccion.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-text">
                Selecciona la sección de la plantilla que contiene los campos a analizar
              </div>
            </div>
          </div>
        </div>

        <!-- Selección de operación -->
        <div class="form-section" v-if="parametrosForm.seccionSeleccionada">
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
                  <option value="contar">Contar registros (COUNT)</option>
                  <option value="distinto">Contar distintos (DISTINCT)</option>
                  <option value="sumar">Sumar valores (SUM)</option>
                  <option value="promedio">Promedio (AVG)</option>
                  <option value="maximo">Valor máximo (MAX)</option>
                  <option value="minimo">Valor mínimo (MIN)</option>
                  <option value="porcentaje">Porcentaje (%)</option>
                </select>
              </div>
              <div class="form-text">
                <span v-if="parametrosForm.tipoOperacion === 'contar'">
                  Contará el número total de documentos
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'distinto'">
                  Contará el número total de documentos diferentes
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'sumar'">
                  Sumará los valores del campo seleccionado
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'promedio'">
                  Calculará el promedio del campo seleccionado
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'maximo'">
                  Encontrará el valor máximo del campo seleccionado
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'minimo'">
                  Encontrará el valor mínimo del campo seleccionado
                </span>
                <span v-else-if="parametrosForm.tipoOperacion === 'porcentaje'">
                  Calculará el porcentaje basado en el campo seleccionado
                </span>
                <span v-else>Selecciona la operación matemática a realizar</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selección de campo con soporte para subconfiguración recursiva -->
        <div
          class="form-section"
          v-if="parametrosForm.tipoOperacion && parametrosForm.tipoOperacion !== 'contar'"
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

            <!-- Componente recursivo para subformularios -->
            <div v-if="mostrarSubcampos && parametrosForm.tipoOperacion !== 'distinto'">
              <SubformRecursivo
                :configuracion="parametrosForm.subConfiguracion"
                :subcampos-disponibles="subcamposDisponibles"
                :nivel="1"
                :ruta-campo="parametrosForm.campoSeleccionado"
                :max-nivel-subformulario="maxNivelSubformulario"
                @configuracion-updated="onSubconfiguracionUpdated"
              />
            </div>

            <!-- Campo en subformulario para contarDistinto -->
            <div
              v-if="mostrarSubcampos && parametrosForm.tipoOperacion === 'distinto'"
              class="subform-config-section"
            >
              <h6 class="mt-3 mb-3">
                <i class="fas fa-layer-group me-2"></i>
                Campo Distinto en Subformulario
              </h6>

              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Campo en Subformulario*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-columns"></i>
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
                      >
                        {{ subcampo.alias || subcampo.name }} ({{ getTipoCampo(subcampo) }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de condiciones principales -->
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
                        <option value="igual">Igual a</option>
                        <option value="diferente">Diferente de</option>
                        <option value="mayor">Mayor que</option>
                        <option value="menor">Menor que</option>
                        <option value="mayor_igual">Mayor o igual</option>
                        <option value="menor_igual">Menor o igual</option>
                        <option value="contiene">Contiene</option>
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
                <span v-if="parametrosForm.tipoOperacion === 'contar'">
                  Se contarán todos los documentos de la plantilla
                  <strong>"{{ getNombrePlantillaSeleccionada() }}"</strong>
                </span>
                <span v-else>
                  Se realizará la operación <strong>{{ getTipoOperacionTexto() }}</strong> sobre el
                  campo <strong>"{{ getNombreCampoSeleccionado() }}"</strong>
                  de todos los documentos de la plantilla
                  <strong>"{{ getNombrePlantillaSeleccionada() }}"</strong>
                </span>

                <div v-if="tieneSubconfiguracion" class="mt-2">
                  <strong>Configuración de subformularios:</strong><br />
                  <div
                    v-html="getResumenSubconfiguracion(parametrosForm.subConfiguracion, 1)"
                  ></div>
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
import api from '@/services/api'
import Swal from 'sweetalert2'
import SubformRecursivo from './SubformRecursivo.vue'

export default {
  components: {
    SubformRecursivo,
  },
  props: ['id','noRedirigir','modoEstadisticas'],
  data() {
    return {
      maxNivelSubformulario: 2, // Nueva variable para controlar el nivel máximo
      plantillasDisponibles: [],
      camposDisponibles: [],
      seccionesDisponibles: [],
      subcamposDisponibles: [],
      subcamposFiltrables: [],
      camposFiltrables: [],
      camposFechaDisponibles: [],
      indicadorSeleccionado: null,
      cargandoConfiguracion: false,
      parametrosForm: {
        plantillaSeleccionada: '',
        seccionSeleccionada: '',
        campoFechaFiltro: '',
        tipoOperacion: '',
        campoSeleccionado: '',
        condiciones: [],
        subConfiguracion: {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null, // Soporte recursivo
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

    tieneSubconfiguracion() {
      return (
        this.parametrosForm.subConfiguracion && this.parametrosForm.subConfiguracion.tipoOperacion
      )
    },

    isFormComplete() {
      if (
        !this.parametrosForm.plantillaSeleccionada ||
        !this.parametrosForm.seccionSeleccionada ||
        !this.parametrosForm.tipoOperacion
      ) {
        return false
      }

      if (this.parametrosForm.tipoOperacion === 'contar') {
        return true
      }

      if (!this.parametrosForm.campoSeleccionado) {
        return false
      }

      // Validar recursivamente la configuración de subformularios
      if (this.mostrarSubcampos) {
        return this.validarSubconfiguracion(this.parametrosForm.subConfiguracion)
      }

      return true
    },
  },
  mounted() {
    this.indicadorSeleccionado = { _id: this.id }
    this.fetchPlantillasDisponibles().then(() => {
      if (this.id) {
        this.cargarConfiguracionExistente()
      }
    })
  },
  methods: {
    validarSubconfiguracion(subconfig) {
      if (!subconfig.tipoOperacion) {
        return false
      }

      if (subconfig.tipoOperacion !== 'contar' && !subconfig.campoSeleccionado) {
        return false
      }

      // Si tiene más subconfiguraciones anidadas, validar recursivamente
      if (subconfig.subConfiguracion && subconfig.subConfiguracion.tipoOperacion) {
        return this.validarSubconfiguracion(subconfig.subConfiguracion)
      }

      return true
    },

    onSubconfiguracionUpdated(nuevaSubconfiguracion) {
      this.parametrosForm.subConfiguracion = nuevaSubconfiguracion
    },

    getResumenSubconfiguracion(subconfig, nivel) {
      if (!subconfig || !subconfig.tipoOperacion) {
        return ''
      }

      let resumen = `Nivel ${nivel}: ${subconfig.tipoOperacion.toUpperCase()}`

      if (subconfig.campoSeleccionado) {
        resumen += ` en campo "${subconfig.campoSeleccionado}"`
      }

      if (subconfig.subConfiguracion && subconfig.subConfiguracion.tipoOperacion) {
        resumen += '<br>' + this.getResumenSubconfiguracion(subconfig.subConfiguracion, nivel + 1)
      }

      return resumen
    },

    // Función recursiva para construir la configuración completa
    construirConfiguracionRecursiva(subconfig) {
      if (!subconfig || !subconfig.tipoOperacion) {
        return null
      }

      const config = {
        operacion: subconfig.tipoOperacion,
        campo: subconfig.tipoOperacion === 'contar' ? null : subconfig.campoSeleccionado,
        condicion: subconfig.condiciones.map((cond) => ({
          campo: cond.campo,
          operador: cond.operador,
          valor: cond.valor,
        })),
      }

      if (subconfig.subConfiguracion && subconfig.subConfiguracion.tipoOperacion) {
        config.subConfiguracion = this.construirConfiguracionRecursiva(subconfig.subConfiguracion)
      }

      return config
    },

    // Función recursiva para cargar configuración existente
    cargarSubconfiguracionRecursiva(configServer, subcamposDisponibles) {
      if (!configServer) {
        return {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null,
        }
      }

      const subconfig = {
        tipoOperacion: configServer.operacion || '',
        campoSeleccionado: configServer.campo || '',
        condiciones: [],
      }

      if (configServer.condicion && Array.isArray(configServer.condicion)) {
        subconfig.condiciones = configServer.condicion.map((c) => ({
          campo: c.campo || '',
          operador: c.operador || 'igual',
          valor: c.valor || '',
        }))
      }

      // Si hay subconfiguracion anidada
      if (configServer.subConfiguracion) {
        // Encontrar los subcampos del campo seleccionado
        const campoSubform = subcamposDisponibles.find(
          (c) => c.name === subconfig.campoSeleccionado,
        )
        const siguientesSubcampos =
          campoSubform && campoSubform.type === 'subform' ? campoSubform.subcampos || [] : []

        subconfig.subConfiguracion = this.cargarSubconfiguracionRecursiva(
          configServer.subConfiguracion,
          siguientesSubcampos,
        )
      } else {
        subconfig.subConfiguracion = null
      }

      return subconfig
    },

    async cargarConfiguracionExistente() {
      this.cargandoConfiguracion = true
      try {
        const token = localStorage.getItem('apiToken')
        if (!token) {
          this.mostrarNotificacion('Error', 'No hay sesión activa', 'error')
          return
        }

        const response = await api.get(
          `/indicadores/${this.id}/configuracion`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )

        if (!response.data || !response.data.configuracion) {
          console.log('No hay configuración existente para este indicador')
          return
        }

        const config = response.data.configuracion

        if (!config || typeof config !== 'object') {
          console.log('Configuración inválida o vacía')
          return
        }

        if (!config.coleccion) {
          console.log('No se encontró información de colección en la configuración')
          return
        }

        // Buscar plantilla por nombre de colección
        const plantilla = this.plantillasDisponibles.find(
          (p) => p.nombre_coleccion == config.coleccion,
        )

        if (!plantilla) {
          console.log(`No se encontró la plantilla con colección: ${config.coleccion}`)
          return
        }

        // Establecer plantilla seleccionada
        this.parametrosForm.plantillaSeleccionada = plantilla.id

        // Cargar secciones de la plantilla
        await this.onPlantillaSelected()

        // Buscar la sección que contiene el campo
        if (config.campo) {
          const seccionConCampo = this.seccionesDisponibles.find((seccion) =>
            seccion.fields.some((field) => field.name === config.campo),
          )

          if (seccionConCampo) {
            this.parametrosForm.seccionSeleccionada = seccionConCampo.nombre
            this.onSeccionSelected()
          }
        } else {
          // Si no hay campo específico, seleccionar la primera sección
          if (this.seccionesDisponibles.length > 0) {
            this.parametrosForm.seccionSeleccionada = this.seccionesDisponibles[0].nombre
            this.onSeccionSelected()
          }
        }

        // Continuar con el resto de la configuración
        if (config.operacion) {
          this.parametrosForm.tipoOperacion = config.operacion
        }

        if (config.campo) {
          this.parametrosForm.campoSeleccionado = config.campo
          await this.onCampoPrincipalSelected()
        }

        // Mapear condiciones principales
        if (config.condicion && Array.isArray(config.condicion)) {
          this.parametrosForm.condiciones = config.condicion.map((c) => ({
            campo: c.campo || '',
            operador: c.operador || 'igual',
            valor: c.valor || '',
          }))
        }

        // Cargar campo de fecha filtro
        if (config.campoFechaFiltro && Array.isArray(config.campoFechaFiltro)) {
          // Eliminar la sección (primer elemento) y unir el resto con puntos
          const pathParts = config.campoFechaFiltro.slice(1)
          this.parametrosForm.campoFechaFiltro = pathParts.join('.')
        }

        // Cargar subconfiguracion recursivamente
        if (config.subConfiguracion && typeof config.subConfiguracion === 'object') {
          this.parametrosForm.subConfiguracion = this.cargarSubconfiguracionRecursiva(
            config.subConfiguracion,
            this.subcamposDisponibles,
          )
        }

        console.log('Configuración cargada exitosamente')
      } catch (error) {
        console.error('Error al cargar configuración:', error)

        if (error.response && error.response.status === 404) {
          console.log('Este indicador no tiene configuración guardada (404)')
          return
        }

        if (error.response) {
          const status = error.response.status
          const message =
            error.response.data?.message || error.response.data?.error || 'Error desconocido'

          if (status === 401) {
            this.mostrarNotificacion(
              'Sesión Expirada',
              'Su sesión ha expirado. Por favor inicie sesión nuevamente.',
              'warning',
            )
            localStorage.removeItem('apiToken')
            this.$router.push('/')
            return
          }

          if (status === 403) {
            this.mostrarNotificacion(
              'Sin Permisos',
              'No tiene permisos para acceder a esta configuración.',
              'warning',
            )
            return
          }

          this.mostrarNotificacion('Error del Servidor', `Error ${status}: ${message}`, 'error')
        } else {
          this.mostrarNotificacion(
            'Error de Conexión',
            'No se pudo conectar con el servidor. Verifique su conexión a internet.',
            'error',
          )
        }
      } finally {
        this.cargandoConfiguracion = false
      }
    },

    onCampoPrincipalSelected() {
      if (!this.cargandoConfiguracion) {
        this.parametrosForm.subConfiguracion = {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null,
        }
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

      this.camposFiltrables = this.camposDisponibles.filter(
        (campo) => campo.type !== 'subform' || campo.type === 'subform',
      )
    },

    agregarCondicion() {
      this.parametrosForm.condiciones.push({
        campo: this.camposFiltrables[0]?.name || '',
        operador: 'igual',
        valor: '',
      })
    },

    eliminarCondicion(index) {
      this.parametrosForm.condiciones.splice(index, 1)
    },

    async aplicarParametros() {
      try {
      

        const plantillaSeleccionada = this.plantillasDisponibles.find(
          (p) => p.id === this.parametrosForm.plantillaSeleccionada,
        )

        if (!plantillaSeleccionada) {
          this.mostrarNotificacion('Error', 'No se encontró la plantilla seleccionada', 'error')
          return
        }

        const nombrePlantilla =
          plantillaSeleccionada.nombre_coleccion || plantillaSeleccionada.title

        // Construir objeto de configuración
        const configuracion = {
          coleccion: nombrePlantilla,
          operacion: this.parametrosForm.tipoOperacion,
          secciones: this.parametrosForm.seccionSeleccionada,
          campo:
            this.parametrosForm.tipoOperacion === 'contar'
              ? null
              : this.parametrosForm.campoSeleccionado,
          campoFechaFiltro: this.parametrosForm.campoFechaFiltro
            ? (() => {
                const campoObj = this.camposFechaDisponibles.find(
                  (c) => c.fullPath === this.parametrosForm.campoFechaFiltro,
                )
                const seccionReal = campoObj
                  ? campoObj.seccion || this.parametrosForm.seccionSeleccionada
                  : this.parametrosForm.seccionSeleccionada
                return [
                  seccionReal,
                  ...this.parametrosForm.campoFechaFiltro.split('.').slice(0, -1),
                  this.parametrosForm.campoFechaFiltro.split('.').pop(),
                ]
              })()
            : null,
          condicion: this.parametrosForm.condiciones.map((cond) => ({
            campo: cond.campo,
            operador: cond.operador,
            valor: cond.valor,
          })),
        }

        // Agregar subconfiguracion recursiva si es necesario
        if (this.mostrarSubcampos && this.parametrosForm.subConfiguracion.tipoOperacion) {
          configuracion.subConfiguracion = this.construirConfiguracionRecursiva(
            this.parametrosForm.subConfiguracion,
          )
        }

        // ✅ NUEVO: Si estamos en modo estadísticas (noRedirigir = true)
if (this.noRedirigir) {
  // Solo emitimos la configuración al padre
  this.$emit('configuracion-lista', configuracion);
  this.cerrarModal(); // cierra el modal normalmente
  return;
}
// ✅ A PARTIR DE AQUÍ: solo se ejecuta si NO es modo estadísticas → necesita indicador
  const idIndicador = this.indicadorSeleccionado?._id || this.indicadorSeleccionado?.id
        if (!idIndicador) {
          this.mostrarNotificacion('Error', 'No se ha seleccionado un indicador', 'error')
          return
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

        const response = await api.put(
          `/indicadores/${idIndicador}/configuracion`,
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
        seccionSeleccionada: '',
        campoFechaFiltro: '',
        tipoOperacion: '',
        campoSeleccionado: '',
        condiciones: [],
        subConfiguracion: {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null,
        },
      }
      this.seccionesDisponibles = []
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

        const response = await api.get('/plantillas', {
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
        if (!this.cargandoConfiguracion) {
          this.parametrosForm.seccionSeleccionada = ''
          this.parametrosForm.tipoOperacion = ''
          this.parametrosForm.campoSeleccionado = ''
          this.parametrosForm.condiciones = []
          this.parametrosForm.subConfiguracion = {
            tipoOperacion: '',
            campoSeleccionado: '',
            condiciones: [],
            subConfiguracion: null,
          }
        }

        try {
          const token = localStorage.getItem('apiToken')
          const response = await api.get(
            `/plantillas/${this.parametrosForm.plantillaSeleccionada}/secciones`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )

          if (response.data && response.data.secciones) {
            this.seccionesDisponibles = response.data.secciones
            this.camposDisponibles = []
            this.camposFiltrables = []
            this.camposFechaDisponibles = []
            this.seccionesDisponibles.forEach((seccion) => {
              if (seccion.fields) {
                const camposFecha = this.extraerCamposFecha(seccion.fields, '', '', seccion.nombre)
                this.camposFechaDisponibles = this.camposFechaDisponibles.concat(camposFecha)
              }
            })
          }
        } catch (error) {
          console.error('Error al obtener las secciones:', error)
          this.mostrarNotificacion(
            'Error',
            'Error al cargar las secciones de la plantilla',
            'error',
          )
        }
      } else {
        this.seccionesDisponibles = []
        this.camposDisponibles = []
      }
    },

    onSeccionSelected() {
      if (this.parametrosForm.seccionSeleccionada) {
        if (!this.cargandoConfiguracion) {
          this.parametrosForm.tipoOperacion = ''
          this.parametrosForm.campoSeleccionado = ''
          this.parametrosForm.condiciones = []
          this.parametrosForm.subConfiguracion = {
            tipoOperacion: '',
            campoSeleccionado: '',
            condiciones: [],
            subConfiguracion: null,
          }
        }

        const seccionSeleccionada = this.seccionesDisponibles.find(
          (s) => s.nombre === this.parametrosForm.seccionSeleccionada,
        )

        if (seccionSeleccionada && seccionSeleccionada.fields) {
          this.camposDisponibles = seccionSeleccionada.fields.filter(
            (campo) => campo.name !== '_id',
          )
          this.camposFiltrables = this.camposDisponibles.filter(
            (campo) => campo.type !== 'subform' || campo.type === 'subform',
          )
        }
      } else {
        this.camposDisponibles = []
        this.camposFiltrables = []
      }
    },

    esCampoNumerico(campo) {
      return campo.type === 'number'
    },

    getTipoCampo(campo) {
      const tipos = {
        text: 'Texto',
        string: 'Texto',
        number: 'Numérico',
        date: 'Fecha',
        file: 'Archivo',
        subform: 'Subformulario',
        select: 'Selección',
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

    getTipoOperacionTexto() {
      const operaciones = {
        contar: 'CONTAR',
        sumar: 'SUMA',
        promedio: 'PROMEDIO',
        maximo: 'MÁXIMO',
        minimo: 'MÍNIMO',
        distinto: 'CONTAR DISTINTOS',
      }
      return operaciones[this.parametrosForm.tipoOperacion] || this.parametrosForm.tipoOperacion
    },

    cerrarModal() {
        if (this.noRedirigir) {
    // Solo emitimos un evento para que el padre cierre el modal
    this.$emit('cerrar');
  } else {
    // Comportamiento original: redirige
    this.$router.push({ name: 'ver-indicadores' });
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
      })
    },
    // Método recursivo para extraer todos los campos de tipo fecha
    extraerCamposFecha(fields, parentPath = '', parentName = '', seccionNombre = '') {
      let camposFecha = []

      fields.forEach((campo) => {
        const fullPath = parentPath ? `${parentPath}.${campo.name}` : campo.name
        const displayName = parentName
          ? `${parentName} > ${campo.alias || campo.name}`
          : campo.alias || campo.name

        if (campo.type === 'date') {
          camposFecha.push({
            name: campo.name,
            fullPath: fullPath,
            displayName: displayName,
            alias: campo.alias,
            seccion: seccionNombre,
          })
        }

        // Si es subformulario, buscar recursivamente
        if (campo.type === 'subform' && campo.subcampos && Array.isArray(campo.subcampos)) {
          const subcamposFecha = this.extraerCamposFecha(
            campo.subcampos,
            fullPath,
            displayName,
            seccionNombre,
          )
          camposFecha = camposFecha.concat(subcamposFecha)
        }
      })

      return camposFecha
    },
  },
}
</script>
<style scoped>
/* Estilo específico para la tabla de condiciones del subformulario */
.subform-config-section .table {
  --bs-table-bg: #cfccf9;
}
</style>
