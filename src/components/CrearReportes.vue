<template>
  <div class="crear-reportes-container">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">
        <i class="fas fa-chart-bar me-2"></i>
        {{ modoEdicion ? 'Editar Reporte' : 'Generar Reportes' }}
        <span v-if="modoEdicion" class="badge bg-warning ms-2">
          <i class="fas fa-edit me-1"></i>Modo Edición
        </span>
      </h2>
      <p class="page-description">
        {{
          modoEdicion
            ? 'Modifica y regenera este reporte'
            : 'Crea reportes personalizados a partir de los documentos de tus colecciones'
        }}
      </p>
    </div>

    <!-- Selección de Colección -->
    <div class="form-section mb-4">
      <h6 class="section-title">
        <i class="fas fa-database me-2"></i>
        Seleccionar Fuente de Datos
      </h6>

      <div class="row">
        <div class="col-md-6">
          <label class="form-label">Colección</label>
          <div class="input-group modern-input">
            <span class="input-group-text">
              <i class="fas fa-folder"></i>
            </span>
            <select
              class="form-select"
              v-model="selectedColeccion"
              @change="onColeccionSelected"
              :disabled="loading.colecciones"
            >
              <option value="">Seleccionar colección...</option>
              <option v-for="coleccion in colecciones" :key="coleccion.id" :value="coleccion">
                {{ coleccion.nombre_plantilla }} {{ coleccion.total_documentos }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-md-6" v-if="selectedColeccion">
          <label class="form-label">Información de la Colección</label>
          <div class="info-card">
            <div class="info-item">
              <strong>Nombre:</strong> {{ selectedColeccion.nombre_plantilla }}
            </div>
            <div class="info-item">
              <strong>Total de documentos:</strong> {{ documentos.length }}
            </div>
            <div class="info-item">
              <strong>Campos disponibles:</strong> {{ camposDocumento.length }}
            </div>
            <div class="info-item">
              <strong>Documentos filtrados:</strong> {{ documentosFiltrados.length }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración del Reporte -->
    <div class="form-section mb-4" v-if="selectedColeccion && !loading.documentos">
      <h6 class="section-title">
        <i class="fas fa-cog me-2"></i>
        Configuración del Reporte
      </h6>

      <div class="row">
        <!-- Selección de campos a incluir -->
        <div class="col-md-6">
          <label class="form-label">Campos a incluir en el reporte</label>
          <div class="campos-selection">
            <div class="campo-item" v-for="campo in camposDisponibles" :key="campo">
              <input
                type="checkbox"
                :id="'campo-' + campo"
                v-model="camposSeleccionados"
                :value="campo"
                class="form-check-input"
              />
              <label :for="'campo-' + campo" class="form-check-label">
                {{ formatFieldName(campo) }}
              </label>
            </div>
          </div>
        </div>

        <!-- Opciones del reporte -->
        <div class="col-md-6">
          <label class="form-label">Opciones del Reporte</label>

          <div class="mb-3">
            <label class="form-label">Título del Reporte</label>
            <input
              type="text"
              class="form-control"
              v-model="tituloReporte"
              placeholder="Reporte de datos"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Formato de salida</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-file-pdf text-danger"></i>
              </span>
              <input type="text" class="form-control" value="PDF" readonly />
            </div>
          </div>

          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="incluirFecha"
              v-model="incluirFecha"
            />
            <label class="form-check-label" for="incluirFecha"> Incluir fecha de generación </label>
          </div>
        </div>
      </div>
      <!-- ========== SECCIÓN DE ORDENAMIENTO ========== -->
      <div class="form-section mt-4" v-if="camposSeleccionados.length > 0">
        <h6 class="section-title">
          <i class="fas fa-sort me-2"></i>
          Ordenamiento de Campos
        </h6>
        <p class="text-muted mb-3">
          Define cómo se ordenarán los registros en el reporte. Puedes agregar múltiples criterios
          de ordenamiento.
        </p>

        <!-- Configurador de ordenamiento -->
        <div class="ordenamiento-container">
          <div class="row g-3">
            <!-- Campo para ordenar -->
            <div class="col-md-4">
              <label class="form-label">Campo</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list"></i>
                </span>
                <select class="form-select" v-model="ordenamientoActivo.campo">
                  <option value="">Seleccionar campo...</option>
                  <option v-for="campo in camposSeleccionados" :key="campo" :value="campo">
                    {{ formatFieldName(campo) }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Dirección del ordenamiento -->
            <div class="col-md-3" v-if="ordenamientoActivo.campo">
              <label class="form-label">Orden</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-sort-amount-down"></i>
                </span>
                <select class="form-select" v-model="ordenamientoActivo.direccion">
                  <option value="asc">Ascendente (A-Z, 1-9)</option>
                  <option value="desc">Descendente (Z-A, 9-1)</option>
                </select>
              </div>
            </div>

            <!-- Prioridad -->
            <div class="col-md-3" v-if="ordenamientoActivo.campo">
              <label class="form-label">Prioridad</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-hashtag"></i>
                </span>
                <select class="form-select" v-model="ordenamientoActivo.prioridad">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>

            <!-- Botón para agregar -->
            <div class="col-md-2" v-if="ordenamientoActivo.campo">
              <label class="form-label">&nbsp;</label>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-success btn-sm"
                  @click="agregarOrdenamiento"
                  :disabled="!ordenamientoActivo.campo"
                  title="Agregar criterio de ordenamiento"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Criterios de ordenamiento activos -->
          <div v-if="criteriosOrdenamiento.length > 0" class="mt-3">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="badge bg-secondary">Ordenamiento aplicado:</span>

              <!-- Lista ordenada por prioridad -->
              <div
                v-for="(criterio, index) in criteriosOrdenamientoOrdenados"
                :key="index"
                class="badge bg-primary text-white cursor-pointer d-flex align-items-center gap-2"
                style="font-size: 0.85em; padding: 0.5rem"
              >
                <span
                  class="badge bg-light text-dark rounded-circle"
                  style="width: 20px; height: 20px; font-size: 0.7em"
                >
                  {{ criterio.prioridad }}
                </span>

                <span>{{ formatFieldName(criterio.campo) }}</span>

                <i
                  :class="criterio.direccion === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"
                ></i>

                <button
                  class="btn btn-sm btn-outline-light p-0"
                  style="
                    width: 18px;
                    height: 18px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                  "
                  @click="eliminarOrdenamiento(criterio.campo)"
                  title="Eliminar criterio"
                >
                  <i class="fas fa-times" style="font-size: 0.7em"></i>
                </button>
              </div>

              <button
                class="btn btn-danger btn-sm"
                @click="limpiarOrdenamiento"
                title="Limpiar todos los criterios"
              >
                <i class="fas fa-trash"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ========== FIN SECCIÓN ORDENAMIENTO ========== -->

      <!-- ========== SECCIÓN DE FILTROS AVANZADOS ========== -->
      <div class="form-section mt-4">
        <h6 class="section-title">
          <i class="fas fa-filter me-2"></i>
          Filtros Avanzados para el Reporte
        </h6>
        <p class="text-muted mb-3">
          Filtra los documentos que se incluirán en el reporte. Actualmente se incluirán
          {{ documentosFiltrados.length }} de {{ documentos.length }} documentos.
        </p>

        <!-- Contenedor de filtros -->
        <div class="filters-container">
          <div class="row g-3">
            <!-- Filtro por campo específico -->
            <div class="col-md-4">
              <label class="form-label">Campo a filtrar</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list"></i>
                </span>
                <select
                  class="form-select"
                  v-model="filtroActivo.campo"
                  @change="onCampoFiltroChange"
                >
                  <option value="">Seleccionar campo...</option>
                  <option
                    v-for="campo in camposFiltrables"
                    :key="campo.name"
                    :value="campo.fullPath"
                  >
                    {{ campo.displayName || campo.alias || formatFieldName(campo.name) }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Operador de filtro -->
            <div class="col-md-3" v-if="filtroActivo.campo">
              <label class="form-label">Operador</label>
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-equals"></i>
                </span>
                <select class="form-select" v-model="filtroActivo.operador">
                  <option value="equals">Igual a</option>
                  <option value="contains">Contiene</option>
                  <option value="startsWith">Inicia con</option>
                  <option value="endsWith">Termina con</option>
                  <option value="notEquals">Diferente a</option>
                  <option value="gt" v-if="esCampoNumerico(filtroActivo.campo)">Mayor que</option>
                  <option value="lt" v-if="esCampoNumerico(filtroActivo.campo)">Menor que</option>
                </select>
              </div>
            </div>

            <!-- Valor del filtro -->
            <div class="col-md-4" v-if="filtroActivo.campo">
              <label class="form-label">Valor</label>

              <!-- Si es un campo con opciones (select) -->
              <div v-if="tieneOpciones(filtroActivo.campo)" class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list-ul"></i>
                </span>
                <select class="form-select" v-model="filtroActivo.valor">
                  <option value="">Todos los valores...</option>
                  <option
                    v-for="opcion in getOpcionesDelCampo(filtroActivo.campo)"
                    :key="opcion.value"
                    :value="opcion.value"
                  >
                    {{ opcion.label }}
                  </option>
                </select>
              </div>

              <!-- Si es un campo de fecha -->
              <div v-else-if="esCampoFecha(filtroActivo.campo)" class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-calendar"></i>
                </span>
                <input type="date" class="form-control" v-model="filtroActivo.valor" />
              </div>

              <!-- Campo de texto normal -->
              <div v-else class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Valor a buscar..."
                  v-model="filtroActivo.valor"
                />
              </div>
            </div>

            <!-- Botón para aplicar filtro -->
            <div class="col-md-1" v-if="filtroActivo.campo">
              <label class="form-label">&nbsp;</label>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-success btn-sm"
                  @click="agregarFiltro"
                  :disabled="!filtroActivo.valor"
                  title="Agregar filtro"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Filtros activos -->
          <div v-if="filtrosActivos.length > 0" class="mt-3">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="badge bg-secondary">Filtros activos:</span>
              <span
                v-for="(filtro, index) in filtrosActivos"
                :key="index"
                class="badge bg-info text-dark cursor-pointer"
                @click="eliminarFiltro(index)"
              >
                {{ formatFieldName(filtro.campo) }}: {{ getDisplayValueForFilter(filtro) }}
                <i class="fas fa-times ms-2"></i>
              </span>
              <button
                class="btn btn-danger btn-sm"
                @click="limpiarTodosFiltros"
                title="Limpiar todos los filtros"
              >
                <i class="fas fa-trash"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ========== FIN SECCIÓN FILTROS AVANZADOS ========== -->
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons mb-4" v-if="selectedColeccion && !loading.documentos">
      <button
        class="btn btn-primary me-2"
        @click="generarReportePDF"
        :disabled="camposSeleccionados.length === 0 || generandoReporte"
      >
        <i class="fas fa-file-alt me-2"></i>
        <span v-if="generandoReporte">Generando...</span>
        <span v-else>Generar Reporte ({{ documentosFiltrados.length }} docs)</span>
      </button>

      <button
        class="btn btn-secondary me-2"
        @click="previsualizarReporte"
        :disabled="camposSeleccionados.length === 0"
      >
        <i class="fas fa-eye me-2"></i>
        Vista Previa ({{ documentosFiltrados.length }} docs)
      </button>

      <button class="btn btn-outline-danger" @click="limpiarConfiguracion">
        <i class="fas fa-trash me-2"></i>
        Limpiar
      </button>
    </div>

    <!-- Vista previa del reporte -->
    <div class="form-section" v-if="mostrarPreview && datosReporte.length > 0">
      <h6 class="section-title">
        <i class="fas fa-eye me-2"></i>
        Vista Previa del Reporte
        <span class="badge bg-primary ms-2">{{ documentosFiltrados.length }} documentos</span>
      </h6>

      <div class="preview-header mb-3">
        <h4>{{ tituloReporte }}</h4>
        <p v-if="incluirFecha" class="text-muted">
          Generado el: {{ new Date().toLocaleDateString('es-MX') }}
        </p>
        <p class="text-muted">
          Total de registros: {{ datosReporte.length }}
          <span v-if="filtrosActivos.length > 0" class="badge bg-info ms-2">
            {{ filtrosActivos.length }} filtro(s) aplicado(s)
          </span>
        </p>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="table-dark">
            <tr>
              <th v-for="campo in camposSeleccionados" :key="campo">
                {{ formatFieldName(campo) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(documento, index) in datosReporte.slice(0, 10)" :key="index">
              <td v-for="campo in camposSeleccionados" :key="campo">
                {{ getFieldValueForReport(documento, campo) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="datosReporte.length > 10" class="text-muted">
        Mostrando los primeros 10 registros de {{ datosReporte.length }} totales.
      </p>
    </div>

    <!-- Estados de carga -->
    <div v-if="loading.colecciones" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando colecciones...</span>
      </div>
      <p class="mt-2">Cargando colecciones...</p>
    </div>

    <div v-if="loading.documentos" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando documentos...</span>
      </div>
      <p class="mt-2">Cargando documentos...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import api from '@/services/api'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  name: 'CrearReportes',

  data() {
    return {
      modoEdicion: false,
      reporteIdEdicion: null,
      colecciones: [],
      selectedColeccion: null,
      documentos: [],
      camposPlantilla: [],
      camposDocumento: [],

      camposSeleccionados: [],
      tituloReporte: '',
      incluirFecha: true,

      mostrarPreview: false,
      datosReporte: [],

      loading: {
        colecciones: false,
        documentos: false,
      },
      generandoReporte: false,
      // ========== FILTROS AVANZADOS ==========
      filtroActivo: {
        campo: '',
        operador: 'equals',
        valor: '',
      },
      filtrosActivos: [],
      // ========== ORDENAMIENTO ==========
      ordenamientoActivo: {
        campo: '',
        direccion: 'asc',
        prioridad: 1,
      },
      criteriosOrdenamiento: [],
    }
  },

  computed: {
    camposDisponibles() {
      return this.camposDocumento.filter((campo) => {
        const campoDef = this.getCampoDefinition(campo)
        return campoDef?.type !== 'file' && !['_id', 'created_at', 'updated_at'].includes(campo)
      })
    },

    // ========== CAMPOS FILTRABLES (para filtros avanzados) ==========
    camposFiltrables() {
      if (!this.camposPlantilla?.secciones) return []

      const campos = []

      this.camposPlantilla.secciones.forEach((seccion) => {
        if (seccion.fields) {
          seccion.fields.forEach((campo) => {
            // Campos normales (no subforms y no archivos)
            if (campo.type !== 'subform' && campo.type !== 'file') {
              campos.push({
                ...campo,
                displayName: campo.alias || campo.name,
                fullPath: campo.name,
              })
            }

            // Campos dentro de subformularios (primer nivel)
            if (campo.type === 'subform' && campo.subcampos) {
              campo.subcampos.forEach((subcampo) => {
                if (subcampo.type !== 'subform' && subcampo.type !== 'file') {
                  campos.push({
                    ...subcampo,
                    displayName: `${campo.alias || campo.name} → ${subcampo.alias || subcampo.name}`,
                    fullPath: `${campo.name}.${subcampo.name}`,
                    parentSubform: campo.name,
                  })
                }

                // Campos dentro de subformularios anidados (segundo nivel)
                if (subcampo.type === 'subform' && subcampo.subcampos) {
                  subcampo.subcampos.forEach((subsubcampo) => {
                    if (subsubcampo.type !== 'subform' && subsubcampo.type !== 'file') {
                      campos.push({
                        ...subsubcampo,
                        displayName: `${campo.alias || campo.name} → ${subcampo.alias || subcampo.name} → ${subsubcampo.alias || subsubcampo.name}`,
                        fullPath: `${campo.name}.${subcampo.name}.${subsubcampo.name}`,
                        parentSubform: campo.name,
                        parentSubSubform: subcampo.name,
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })

      return campos
    },

    // ========== DOCUMENTOS FILTRADOS ==========
    documentosFiltrados() {
      let documentos = [...this.documentos]

      // Aplicar filtros dinámicos
      if (this.filtrosActivos.length > 0) {
        documentos = documentos.filter((doc) => {
          return this.filtrosActivos.every((filtro) => {
            const valor = this.getFieldValueFromDocument(doc, filtro.campo)
            return this.aplicarFiltro(valor, filtro)
          })
        })
      }

      // Aplicar ordenamiento
      if (this.criteriosOrdenamiento.length > 0) {
        documentos = this.aplicarOrdenamiento(documentos)
      }

      return documentos
    },

    // ========== COMPUTED PARA ORDENAMIENTO ==========
    criteriosOrdenamientoOrdenados() {
      return [...this.criteriosOrdenamiento].sort((a, b) => a.prioridad - b.prioridad)
    },
  },

  methods: {

    async getColecciones() {
      this.loading.colecciones = true
      try {
        const response = await api.get('/documentos/plantillas-redable')
        this.colecciones = response.data
      } catch {
        this.showError('No se pudieron cargar las colecciones')
      } finally {
        this.loading.colecciones = false
      }
    },


    async getCamposPlantilla(plantillaId) {
      try {
        const response = await api.get(`/plantillas/${plantillaId}/secciones`)
        return response.data?.secciones ? response.data : { secciones: [] }
      } catch {
        return { secciones: [] }
      }
    },

    async obtenerDocumentos() {
      if (!this.selectedColeccion) return
      this.loading.documentos = true
      try {
        const [camposPlantilla, documentos] = await Promise.all([
          this.getCamposPlantilla(this.selectedColeccion.id),
          api.get(`/documentos/${this.selectedColeccion.id}`).then(res => res.data),
        ])

        this.camposPlantilla = camposPlantilla
        this.documentos = documentos
        this.procesarCamposDocumento()

        // Limpiar filtros al cambiar de colección
        this.limpiarTodosFiltros()

        if (this.camposDisponibles.length > 0) {
          this.camposSeleccionados = this.camposDisponibles.slice(0, 5)
        }
        if (!this.tituloReporte) {
          this.tituloReporte = `Reporte de ${this.selectedColeccion.nombre_coleccion}`
        }
      } catch {
        this.documentos = []
        this.camposDocumento = []
        this.showError('Error al cargar los documentos')
      } finally {
        this.loading.documentos = false
      }
    },

    procesarCamposDocumento() {
      if (this.camposPlantilla?.secciones) {
        this.procesarCamposConSecciones()
      } else {
        this.camposDocumento = []
      }
    },

    procesarCamposConSecciones() {
      const todosLosCampos = []
      this.camposPlantilla.secciones.forEach((seccion) => {
        if (Array.isArray(seccion.fields)) {
          seccion.fields.forEach((campo) => todosLosCampos.push(campo))
        }
      })
      this.camposDocumento = todosLosCampos.map((campo) => campo.name)
    },

    // ========== MÉTODO MEJORADO PARA DEFINICIÓN DE CAMPOS ==========
    getCampoDefinition(fieldPath) {
      if (!this.camposPlantilla?.secciones) return null

      // Si es un path simple (sin puntos), buscar en campos principales
      if (!fieldPath.includes('.')) {
        for (const seccion of this.camposPlantilla.secciones) {
          if (seccion.fields && Array.isArray(seccion.fields)) {
            const campo = seccion.fields.find((f) => f.name === fieldPath)
            if (campo) return campo
          }
        }
      } else {
        // Si es un path con puntos, dividir y buscar en subformularios
        const pathParts = fieldPath.split('.')

        for (const seccion of this.camposPlantilla.secciones) {
          if (seccion.fields && Array.isArray(seccion.fields)) {
            // Buscar el campo principal (subformulario)
            const campoSubform = seccion.fields.find((f) => f.name === pathParts[0])
            if (campoSubform && campoSubform.type === 'subform' && campoSubform.subcampos) {
              if (pathParts.length === 2) {
                // Primer nivel de subformulario
                const subcampo = campoSubform.subcampos.find((sc) => sc.name === pathParts[1])
                if (subcampo) return subcampo
              } else if (pathParts.length === 3) {
                // Segundo nivel de subformulario
                const subcampo = campoSubform.subcampos.find((sc) => sc.name === pathParts[1])
                if (subcampo && subcampo.type === 'subform' && subcampo.subcampos) {
                  const subsubcampo = subcampo.subcampos.find((ssc) => ssc.name === pathParts[2])
                  if (subsubcampo) return subsubcampo
                }
              }
            }
          }
        }
      }

      return null
    },

    // ========== MÉTODO MEJORADO PARA OBTENER VALORES ==========
    getFieldValueFromDocument(documento, fieldPath) {
      // Si no es un path con puntos, buscar directamente
      if (!fieldPath.includes('.')) {
        // Buscar en secciones primero
        if (documento.secciones) {
          for (const seccion of documento.secciones) {
            if (seccion.fields && seccion.fields.hasOwnProperty(fieldPath)) {
              return seccion.fields[fieldPath]
            }
          }
        }
        // Buscar directamente en el documento
        return documento[fieldPath]
      }

      // Para paths con puntos (subformularios anidados)
      const pathParts = fieldPath.split('.')
      let currentValue = documento

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]

        if (currentValue === null || currentValue === undefined) {
          return null
        }

        // Buscar en secciones si existe
        if (currentValue.secciones) {
          let foundInSecciones = false
          for (const seccion of currentValue.secciones) {
            if (seccion.fields && seccion.fields.hasOwnProperty(part)) {
              currentValue = seccion.fields[part]
              foundInSecciones = true
              break
            }
          }
          if (!foundInSecciones) {
            currentValue = currentValue[part]
          }
        } else {
          currentValue = currentValue[part]
        }

        // Si es un array y no es el último elemento del path, tomar el primer elemento
        if (Array.isArray(currentValue) && i < pathParts.length - 1) {
          if (currentValue.length > 0) {
            currentValue = currentValue[0]
          } else {
            return null
          }
        }
      }

      return currentValue
    },

    getFieldValueForReport(documento, fieldName) {
      const valor = this.getFieldValueFromDocument(documento, fieldName)
      if (!valor) return '-'

      const campo = this.getCampoDefinition(fieldName)
      if (!campo) return valor

      if (campo.type === 'date' && valor) {
        return this.formatoFecha(valor)
      }
      if (campo.options) {
        const option = campo.options.find((o) => o.campoGuardar === valor)
        return option ? option.campoMostrar : valor
      }
      if (Array.isArray(valor)) {
        return `${valor.length} elementos`
      }
      return valor
    },

    formatoFecha(dateString) {
      const date = new Date(dateString)
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },

    formatFieldName(fieldName) {
      const fieldMap = {
        created_at: 'Fecha de creación',
        updated_at: 'Última actualización',
      }
      return (
        fieldMap[fieldName] ||
        fieldName
          .replace(/_/g, ' ')
          .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      )
    },

    async onColeccionSelected() {
      if (this.selectedColeccion) {
        await this.obtenerDocumentos()
      } else {
        this.resetData()
      }
    },

    resetData() {
      this.documentos = []
      this.camposDocumento = []
      this.camposPlantilla = []
      this.camposSeleccionados = []
      this.tituloReporte = ''
      this.mostrarPreview = false
      this.datosReporte = []
      this.limpiarTodosFiltros()
      this.limpiarOrdenamiento()
    },

    limpiarConfiguracion() {
      this.camposSeleccionados = []
      this.tituloReporte = ''
      this.incluirFecha = true
      this.mostrarPreview = false
      this.datosReporte = []
      this.limpiarTodosFiltros()
      this.limpiarOrdenamiento()
      this.modoEdicion = false
      this.reporteIdEdicion = null
    },

    previsualizarReporte() {
      if (this.camposSeleccionados.length === 0) {
        this.showError('Selecciona al menos un campo para el reporte')
        return
      }
      this.datosReporte = [...this.documentosFiltrados]
      this.mostrarPreview = true
    },

    // ========== MÉTODOS PARA FILTROS AVANZADOS ==========
    onCampoFiltroChange() {
      this.filtroActivo.operador = 'equals'
      this.filtroActivo.valor = ''
    },

    esCampoNumerico(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      return campo && ['number', 'integer'].includes(campo.type)
    },

    esCampoFecha(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      return campo && campo.type === 'date'
    },

    tieneOpciones(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      return campo && campo.options && Array.isArray(campo.options) && campo.options.length > 0
    },

    getOpcionesDelCampo(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      if (!campo || !campo.options || !Array.isArray(campo.options)) return []

      if (campo.options.length === 0) return []

      const primerElemento = campo.options[0]

      // Select dinámico: [{"campoGuardar": "id", "campoMostrar": "texto"}]
      if (typeof primerElemento === 'object' && primerElemento !== null) {
        return campo.options.map((opcion) => ({
          value: opcion.campoGuardar || opcion.value || opcion,
          label:
            opcion.campoMostrar || opcion.label || opcion.campoGuardar || opcion.value || opcion,
        }))
      }

      // Select manual
      if (typeof primerElemento === 'string') {
        return campo.options.map((opcion) => ({
          value: opcion,
          label: opcion,
        }))
      }

      return []
    },

    agregarFiltro() {
      if (!this.filtroActivo.campo || !this.filtroActivo.valor) return

      // Crear el objeto del filtro con el valor display correcto
      const nuevoFiltro = {
        campo: this.filtroActivo.campo,
        operador: this.filtroActivo.operador,
        valor: this.filtroActivo.valor, // Este será el campoGuardar para selects dinámicos
        valorDisplay: this.getDisplayValueForFilterSave(this.filtroActivo), // El campoMostrar para mostrar
      }

      // Verificar si ya existe un filtro para este campo
      const existeIndex = this.filtrosActivos.findIndex((f) => f.campo === this.filtroActivo.campo)

      if (existeIndex >= 0) {
        // Reemplazar filtro existente
        this.filtrosActivos.splice(existeIndex, 1, nuevoFiltro)
      } else {
        // Agregar nuevo filtro
        this.filtrosActivos.push(nuevoFiltro)
      }

      // Resetear filtro activo
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },
    getDisplayValueForFilterSave(filtroActivo) {
      const campo = this.getCampoDefinition(filtroActivo.campo)

      if (!campo || !filtroActivo.valor) {
        return filtroActivo.valor
      }

      // Si tiene opciones y es select dinámico
      if (campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
        const primerElemento = campo.options[0]

        // Select dinámico (objetos con campoGuardar/campoMostrar)
        if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
          const opcion = campo.options.find((o) => o.campoGuardar === filtroActivo.valor)
          return opcion ? opcion.campoMostrar : filtroActivo.valor
        }
      }

      return filtroActivo.valor
    },

    eliminarFiltro(index) {
      this.filtrosActivos.splice(index, 1)
    },

    limpiarTodosFiltros() {
      this.filtrosActivos = []
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },

    aplicarFiltro(valor, filtro) {
      // Si es un array (subformulario), verificar si algún elemento cumple el filtro
      if (Array.isArray(valor)) {
        return valor.some((item) => {
          if (filtro.campo.includes('.')) {
            const pathParts = filtro.campo.split('.')
            const campoEspecifico = pathParts[pathParts.length - 1]
            const valorItem = item[campoEspecifico]
            return this.aplicarFiltroSimple(valorItem, filtro)
          } else {
            return this.aplicarFiltroSimple(item, filtro)
          }
        })
      }

      return this.aplicarFiltroSimple(valor, filtro)
    },

    aplicarFiltroSimple(valor, filtro) {
      if (valor === null || valor === undefined) {
        return false
      }

      // Obtener la definición del campo para ver si es un select dinámico
      const campo = this.getCampoDefinition(filtro.campo)

      let valorADocumento = valor
      let valorBFiltro = filtro.valor

      // Si es un select dinámico, convertir campoGuardar a campoMostrar para la comparación
      if (campo && campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
        const primerElemento = campo.options[0]

        // Si es select dinámico (objetos con campoGuardar/campoMostrar)
        if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
          // Convertir el valor del documento (campoGuardar) a campoMostrar
          const opcionDoc = campo.options.find((o) => o.campoGuardar === valor)
          if (opcionDoc) {
            valorADocumento = opcionDoc.campoMostrar || valor
          }

          // Convertir el valor del filtro (campoGuardar) a campoMostrar
          const opcionFiltro = campo.options.find((o) => o.campoGuardar === filtro.valor)
          if (opcionFiltro) {
            valorBFiltro = opcionFiltro.campoMostrar || filtro.valor
          }
        }
        // Si es select manual (array de strings), no hacemos conversión
      }

      const valorString = String(valorADocumento).toLowerCase()
      const filtroValor = String(valorBFiltro).toLowerCase()

      switch (filtro.operador) {
        case 'equals':
          return valorString === filtroValor
        case 'contains':
          return valorString.includes(filtroValor)
        case 'startsWith':
          return valorString.startsWith(filtroValor)
        case 'endsWith':
          return valorString.endsWith(filtroValor)
        case 'notEquals':
          return valorString !== filtroValor // FIX: era "filtroValro"
        case 'gt':
          return parseFloat(valor) > parseFloat(filtro.valor)
        case 'lt':
          return parseFloat(valor) < parseFloat(filtro.valor)
        default:
          return true
      }
    },

    getDisplayValueForFilter(filtro) {
      // Si ya tenemos valorDisplay guardado, usarlo
      if (filtro.valorDisplay) {
        return filtro.valorDisplay
      }

      // Fallback al método anterior para compatibilidad
      const campo = this.getCampoDefinition(filtro.campo)

      if (!campo) {
        return filtro.valor
      }

      // Si tiene opciones y es select dinámico
      if (campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
        const primerElemento = campo.options[0]

        // Select dinámico (objetos con campoGuardar/campoMostrar)
        if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
          const opcion = campo.options.find((o) => o.campoGuardar === filtro.valor)
          return opcion ? opcion.campoMostrar : filtro.valor
        }
        // Select manual (array de strings)
        if (typeof primerElemento === 'string') {
          return filtro.valor // Ya es el texto que queremos mostrar
        }
      }

      return filtro.valor
    },

    // ========== GENERACIÓN DE PDF CON FILTROS ==========
    async generarReportePDF() {
      if (this.camposSeleccionados.length === 0) {
        this.showError('Selecciona al menos un campo para el reporte')
        return
      }

      this.generandoReporte = true
      try {
        const doc = new jsPDF('l', 'mm', 'a4')

        doc.setFontSize(18)
        doc.text(this.tituloReporte, 20, 20)

        let yPosition = 30
        if (this.incluirFecha) {
          doc.setFontSize(12)
          doc.text(`Generado el: ${new Date().toLocaleString('es-MX')}`, 20, yPosition)
          yPosition += 10
        }

        // Información de registros y filtros
        doc.text(`Total de registros: ${this.documentosFiltrados.length}`, 20, yPosition)
        yPosition += 10

        // Información de filtros
        if (this.filtrosActivos.length > 0) {
          doc.text(`Filtros aplicados: ${this.filtrosActivos.length}`, 20, yPosition)
          yPosition += 10

          this.filtrosActivos.forEach((filtro, index) => {
            const campoNombre = this.formatFieldName(filtro.campo)
            const operadorTexto = this.getOperadorTexto(filtro.operador)
            const valorMostrar = filtro.valorDisplay || filtro.valor

            const filtroTexto = `${index + 1}. ${campoNombre} ${operadorTexto} "${valorMostrar}"`

            doc.setFontSize(10)
            doc.text(filtroTexto, 25, yPosition)
            yPosition += 7
          })

          yPosition += 5
        }

        // Información de ordenamiento
        if (this.criteriosOrdenamiento.length > 0) {
          doc.setFontSize(12)
          doc.text(
            `Ordenamiento aplicado: ${this.criteriosOrdenamiento.length} criterio(s)`,
            20,
            yPosition,
          )
          yPosition += 10

          this.criteriosOrdenamientoOrdenados.forEach((criterio, index) => {
            const campoNombre = this.formatFieldName(criterio.campo)
            const direccionTexto = criterio.direccion === 'asc' ? 'Ascendente' : 'Descendente'

            const criterioTexto = `${index + 1}. ${campoNombre} (${direccionTexto})`

            doc.setFontSize(10)
            doc.text(criterioTexto, 25, yPosition)
            yPosition += 7
          })

          yPosition += 5
        } else {
          yPosition += 10
        }

        const headers = this.camposSeleccionados.map((campo) => this.formatFieldName(campo))
        const rows = this.documentosFiltrados.map((doc) =>
          this.camposSeleccionados.map((campo) => this.getFieldValueForReport(doc, campo) || '-'),
        )

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: yPosition,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 20, right: 20 },
          tableWidth: 'auto',
        })

        const nombreArchivo = `${this.tituloReporte.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        doc.save(nombreArchivo)
        this.guardarEnHistorial()

        let mensaje = `PDF generado con ${this.documentosFiltrados.length} documentos`
        if (this.filtrosActivos.length > 0) {
          mensaje += ` filtrados`
        }
        if (this.criteriosOrdenamiento.length > 0) {
          mensaje += ` y ordenados`
        }

        this.showSuccess(mensaje)
      } catch (error) {
        console.error('Error generando PDF:', error)
        this.showError('Error al generar el PDF.')
      } finally {
        this.generandoReporte = false
      }
    },

    getOperadorTexto(operador) {
      const operadores = {
        equals: 'es igual a',
        contains: 'contiene',
        startsWith: 'inicia con',
        endsWith: 'termina con',
        notEquals: 'es diferente a',
        gt: 'es mayor que',
        lt: 'es menor que',
      }
      return operadores[operador] || operador
    },

    async guardarEnHistorial() {
      try {
        const filtrosParaGuardar = this.filtrosActivos.map((filtro) => ({
          campo: filtro.campo,
          operador: filtro.operador,
          valor: filtro.valor,
          valorDisplay: filtro.valorDisplay || this.getDisplayValueForFilter(filtro),
        }))

        const reporteData = {
          titulo: this.tituloReporte,
          coleccionId: this.selectedColeccion.id,
          coleccionNombre: this.selectedColeccion.nombre_coleccion,
          camposSeleccionados: this.camposSeleccionados,
          filtrosAplicados: filtrosParaGuardar,
          criteriosOrdenamiento: this.criteriosOrdenamiento,
          cantidadDocumentos: this.documentosFiltrados.length,
          incluirFecha: this.incluirFecha,
        }

        // Si estamos en modo edición, hacer PUT, si no, hacer POST
        if (this.modoEdicion && this.reporteIdEdicion) {
          await api.put(`/reportes/${this.reporteIdEdicion}`, reporteData)
          console.log('Reporte actualizado exitosamente')
        } else {
          await api.post('/reportes', reporteData)
          console.log('Reporte guardado exitosamente')
        }
      } catch (error) {
        console.error('Error guardando/actualizando reporte:', error)
      }
    },

    cancelarEdicion() {
      this.modoEdicion = false
      this.reporteIdEdicion = null
      this.$router.replace({ name: 'CrearReportes' })
      this.limpiarConfiguracion()
    },
    // ========== MÉTODOS DE ORDENAMIENTO ==========

    agregarOrdenamiento() {
      if (!this.ordenamientoActivo.campo) return

      // Verificar si ya existe un criterio para este campo
      const existeIndex = this.criteriosOrdenamiento.findIndex(
        (c) => c.campo === this.ordenamientoActivo.campo,
      )

      const nuevoCriterio = {
        campo: this.ordenamientoActivo.campo,
        direccion: this.ordenamientoActivo.direccion,
        prioridad: this.ordenamientoActivo.prioridad,
      }

      if (existeIndex >= 0) {
        // Reemplazar criterio existente
        this.criteriosOrdenamiento.splice(existeIndex, 1, nuevoCriterio)
      } else {
        // Agregar nuevo criterio
        this.criteriosOrdenamiento.push(nuevoCriterio)
      }

      // Ajustar prioridades para evitar duplicados
      this.ajustarPrioridades()

      // Resetear ordenamiento activo
      this.ordenamientoActivo = {
        campo: '',
        direccion: 'asc',
        prioridad: this.getNextPrioridad(),
      }
    },

    eliminarOrdenamiento(campo) {
      const index = this.criteriosOrdenamiento.findIndex((c) => c.campo === campo)
      if (index >= 0) {
        this.criteriosOrdenamiento.splice(index, 1)
        this.ajustarPrioridades()
      }
    },

    limpiarOrdenamiento() {
      this.criteriosOrdenamiento = []
      this.ordenamientoActivo = {
        campo: '',
        direccion: 'asc',
        prioridad: 1,
      }
    },

    getNextPrioridad() {
      if (this.criteriosOrdenamiento.length === 0) return 1
      const maxPrioridad = Math.max(...this.criteriosOrdenamiento.map((c) => c.prioridad))
      return Math.min(maxPrioridad + 1, 5)
    },

    ajustarPrioridades() {
      // Ordenar por prioridad actual
      this.criteriosOrdenamiento.sort((a, b) => a.prioridad - b.prioridad)

      // Reasignar prioridades secuenciales
      this.criteriosOrdenamiento.forEach((criterio, index) => {
        criterio.prioridad = index + 1
      })
    },

    aplicarOrdenamiento(documentos) {
      if (this.criteriosOrdenamiento.length === 0) return documentos

      return documentos.sort((a, b) => {
        // Aplicar cada criterio en orden de prioridad
        for (const criterio of this.criteriosOrdenamientoOrdenados) {
          const valorA = this.getFieldValueFromDocument(a, criterio.campo)
          const valorB = this.getFieldValueFromDocument(b, criterio.campo)

          const resultado = this.compararValores(valorA, valorB, criterio.direccion)

          // Si son diferentes, usar este resultado
          if (resultado !== 0) {
            return resultado
          }
          // Si son iguales, continuar con el siguiente criterio
        }

        return 0 // Todos los criterios son iguales
      })
    },

    compararValores(valorA, valorB, direccion) {
      // Manejar valores nulos/undefined
      if (valorA == null && valorB == null) return 0
      if (valorA == null) return direccion === 'asc' ? -1 : 1
      if (valorB == null) return direccion === 'asc' ? 1 : -1

      // Obtener valores para comparación
      let a = this.prepararValorParaComparacion(valorA)
      let b = this.prepararValorParaComparacion(valorB)

      let resultado = 0

      // Comparar según el tipo
      if (typeof a === 'number' && typeof b === 'number') {
        resultado = a - b
      } else if (a instanceof Date && b instanceof Date) {
        resultado = a.getTime() - b.getTime()
      } else {
        // Comparación de strings (case-insensitive)
        const strA = String(a).toLowerCase()
        const strB = String(b).toLowerCase()
        resultado = strA.localeCompare(strB, 'es', { numeric: true })
      }

      // Aplicar dirección
      return direccion === 'desc' ? -resultado : resultado
    },

    prepararValorParaComparacion(valor) {
      // Si es un array, usar su longitud para comparar
      if (Array.isArray(valor)) {
        return valor.length
      }

      // Intentar convertir a número si parece un número
      if (typeof valor === 'string' && !isNaN(valor) && !isNaN(parseFloat(valor))) {
        return parseFloat(valor)
      }

      // Intentar convertir a fecha si parece una fecha
      if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
        const fecha = new Date(valor)
        if (!isNaN(fecha.getTime())) {
          return fecha
        }
      }

      return valor
    },

    showSuccess(message) {
      Swal.fire({ title: 'Éxito', text: message, icon: 'success', confirmButtonText: 'Aceptar' })
    },

    showError(message) {
      Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonText: 'Aceptar' })
    },
    // Cargar reporte existente para editar
    async cargarReporteParaEditar(reporteId) {
      this.modoEdicion = true
      this.reporteIdEdicion = reporteId

      try {
        const response = await api.get(`/reportes/${reporteId}`)
        const reporte = response.data.data || response.data

        const plantillaId = reporte.coleccionId

        if (!plantillaId) {
          this.showError('El reporte no contiene información de la colección')
          this.modoEdicion = false
          this.reporteIdEdicion = null
          return
        }

        const coleccion = this.colecciones.find((c) => c.id === plantillaId)

        if (!coleccion) {
          this.showError(`No se pudo encontrar la colección del reporte (ID: ${plantillaId})`)
          this.modoEdicion = false
          this.reporteIdEdicion = null
          return
        }

        this.selectedColeccion = coleccion
        await this.obtenerDocumentos()
        await this.$nextTick()

        this.tituloReporte = reporte.titulo
        this.incluirFecha = reporte.incluirFecha !== false
        this.camposSeleccionados = reporte.camposSeleccionados || []

        if (reporte.filtrosAplicados && Array.isArray(reporte.filtrosAplicados)) {
          this.filtrosActivos = reporte.filtrosAplicados.map((filtro) => ({
            campo: filtro.campo,
            operador: filtro.operador,
            valor: filtro.valor,
            valorDisplay: filtro.valorDisplay || filtro.valor,
          }))
        }

        if (reporte.criteriosOrdenamiento && Array.isArray(reporte.criteriosOrdenamiento)) {
          this.criteriosOrdenamiento = reporte.criteriosOrdenamiento.map((criterio) => ({
            campo: criterio.campo,
            direccion: criterio.direccion,
            prioridad: criterio.prioridad,
          }))
        }

        this.showSuccess('Reporte cargado correctamente. Puedes modificarlo y regenerarlo.')
      } catch (error) {
        console.error('Error al cargar reporte:', error)
        this.showError('No se pudo cargar el reporte para editar')
        this.modoEdicion = false
        this.reporteIdEdicion = null
      }
    },

    // Verificar si hay un ID en la URL al montar el componente
    async verificarEdicion() {
      const reporteId = this.$route.query.id

      if (reporteId) {
        // Esperar a que se carguen las colecciones primero
        if (this.colecciones.length === 0) {
          await this.getColecciones()
        }

        await this.cargarReporteParaEditar(reporteId)
      }
    },
  },

  async mounted() {
    await this.getColecciones()
    await this.verificarEdicion()
  },
}
</script>

<style scoped>
.crear-reportes-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 1.1rem;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.modern-input {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #007bff;
}

.info-item {
  margin-bottom: 0.5rem;
}

.campos-selection {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
}

.campo-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.campo-item input[type='checkbox'] {
  margin-right: 0.5rem;
}

.action-buttons {
  text-align: center;
}

.preview-header {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Estilos para filtros */
.filters-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.cursor-pointer {
  cursor: pointer;
}

.badge {
  font-size: 0.75em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
