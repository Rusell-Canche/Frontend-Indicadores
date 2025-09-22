<!-- COMPONENTE PRINCIPAL - Reemplaza el modal inline con el componente -->
<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-text"></i>
          </div>
          <div class="header-title-section">
            <h3>Ver Documentos</h3>
            <p class="header-subtitle">Gestiona y visualiza tus documentos</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <!-- Selector de Colecciones -->
        <div class="form-section">
          <h6 class="section-title">
            <i class="fas fa-tag me-2"></i>
            Selecciona una colección
          </h6>
          <div class="row g-3">
            <div class="col-md-12">
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list-alt"></i>
                </span>
                <select
                  class="form-select"
                  v-model="selectedColeccion"
                  @change="onColeccionSelected"
                >
                  <option value="" disabled>Selecciona una colección</option>
                  <option
                    v-for="coleccion in coleccionesFiltradas"
                    :key="coleccion.id"
                    :value="coleccion"
                  >
                    {{ coleccion.title || coleccion.nombre_plantilla }}
                  </option>
                </select>
              </div>
              <div class="form-text">Selecciona la colección para ver sus documentos</div>
            </div>
          </div>
        </div>

        <div v-if="selectedColeccion">
          <!-- Sección de búsqueda -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-search me-2"></i>
              Buscar documentos
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar en documentos..."
                    v-model="palabraClave"
                  />
                </div>
                <div class="form-text">Busca por cualquier campo del documento</div>
              </div>
            </div>
          </div>
          <div v-if="selectedColeccion" class="form-section">
            <h6 class="section-title">
              <i class="fas fa-filter me-2"></i>
              Filtros avanzados
            </h6>

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
                      <option value="gt" v-if="esCampoNumerico(filtroActivo.campo)">
                        Mayor que
                      </option>
                      <option value="lt" v-if="esCampoNumerico(filtroActivo.campo)">
                        Menor que
                      </option>
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
                  <div
                    v-else-if="esCampoFecha(filtroActivo.campo)"
                    class="input-group modern-input"
                  >
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
                    <Button
                      icon="fas fa-plus"
                      @click="agregarFiltro"
                      severity="success"
                      size="small"
                      v-tooltip="'Agregar filtro'"
                      :disabled="!filtroActivo.valor"
                    />
                  </div>
                </div>
              </div>

              <!-- Filtros activos -->
              <div v-if="filtrosActivos.length > 0" class="mt-3">
                <div class="d-flex flex-wrap gap-2 align-items-center">
                  <span class="badge bg-secondary">Filtros activos:</span>
                  <Tag
                    v-for="(filtro, index) in filtrosActivos"
                    :key="index"
                    :value="`${formatFieldName(filtro.campo)}: ${filtro.valor}`"
                    severity="info"
                    class="cursor-pointer"
                  >
                    <template #default>
                      <span
                        >{{ formatFieldName(filtro.campo) }}:
                        {{ getDisplayValueForFilter(filtro) }}</span
                      >
                      <i
                        class="fas fa-times ms-2 cursor-pointer"
                        @click="eliminarFiltro(index)"
                        style="cursor: pointer"
                      ></i>
                    </template>
                  </Tag>
                  <Button
                    icon="fas fa-trash"
                    @click="limpiarTodosFiltros"
                    severity="danger"
                    size="small"
                    text
                    v-tooltip="'Limpiar todos los filtros'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla PrimeVue -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-file-text me-2"></i>
              Documentos ({{ filteredDocuments.length }})
            </h6>

            <DataTable
              :value="filteredDocuments"
              :paginator="true"
              :rows="itemsPerPage"
              :globalFilterFields="camposDocumento"
              :globalFilter="palabraClave"
              tableStyle="min-width: 50rem"
              :sortMode="'multiple'"
              removableSort
              scrollable
              scrollDirection="both"
              scrollHeight="500px"
            >
              <!-- Columnas dinámicas -->
              <Column
                v-for="campo in camposDocumento"
                :key="campo"
                :field="campo"
                :header="formatFieldName(campo)"
                :sortable="true"
              >
                <template #body="slotProps">
                  <!-- Recurso Digital -->
                  <div v-if="campo === 'Recurso Digital'" class="file-badges">
                    <template
                      v-if="
                        getPrettyFieldValue(slotProps.data, campo) &&
                        Array.isArray(getFieldValueFromDocument(slotProps.data, campo))
                      "
                    >
                      <span
                        v-for="(file, index) in getFieldValueFromDocument(slotProps.data, campo)"
                        :key="index"
                        class="file-badge"
                      >
                        <i v-if="isImage(file)" class="fas fa-image me-1"></i>
                        <i v-else-if="isVideo(file)" class="fas fa-video me-1"></i>
                        <i v-else-if="isAudio(file)" class="fas fa-volume-up me-1"></i>
                        <i v-else-if="isPDF(file)" class="fas fa-file-pdf me-1"></i>
                        <i v-else class="fas fa-file me-1"></i>
                        <span class="file-extension">{{
                          file.split('.').pop()?.toUpperCase()
                        }}</span>
                      </span>
                    </template>
                    <span v-else class="no-files">Sin archivos</span>
                  </div>

                  <!-- Estado -->
                  <Tag
                    v-else-if="campo === 'Estado'"
                    :severity="getStatusSeverity(getFieldValueFromDocument(slotProps.data, campo))"
                    :value="getFieldValueFromDocument(slotProps.data, campo)"
                  />

                  <!-- Subformularios -->
                  <span v-else-if="getCampoDefinition(campo)?.type === 'subform'">
                    <Button
                      icon="fa-solid fa-magnifying-glass"
                      @click="
                        abrirModalSubform(getFieldValueFromDocument(slotProps.data, campo), campo)
                      "
                      text
                      severity="info"
                      size="small"
                      v-tooltip="'Ver subformulario'"
                    />
                  </span>

                  <!-- Otros campos -->
                  <span v-else>
                    {{ getPrettyFieldValue(slotProps.data, campo) || '-' }}
                  </span>
                </template>
              </Column>

              <!-- Columna de acciones -->
              <Column
                header="Acciones"
                :exportable="false"
                frozen
                alignFrozen="right"
                style="min-width: 8rem; border-left: 2px solid; background-color: azure"
              >
                <template #body="slotProps">
                  <Button
                    icon="fas fa-edit"
                    @click="editarDocumento(slotProps.data)"
                    text
                    severity="info"
                    size="small"
                    v-tooltip="'Editar documento'"
                    class="me-2"
                  />
                  <Button
                    icon="fas fa-trash-alt"
                    @click="
                      eliminarDocumento(
                        slotProps.data._id?.$oid || slotProps.data._id || slotProps.data.id,
                      )
                    "
                    text
                    severity="danger"
                    size="small"
                    v-tooltip="'Eliminar documento'"
                  />
                </template>
              </Column>

              <!-- Template para cuando no hay datos -->
              <template #empty>
                <div class="empty-state text-center py-4">
                  <div class="empty-icon">
                    <i class="fas fa-file-text" style="font-size: 3rem; color: #6c757d"></i>
                  </div>
                  <h5 class="empty-title mt-3">No se encontraron documentos</h5>
                  <p class="empty-text text-muted">
                    No hay documentos que coincidan con tu búsqueda
                  </p>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <!-- REEMPLAZAR TODO EL MODAL INLINE CON EL COMPONENTE -->
    <EditDocumentModal
      :is-open="isModalOpen"
      :documento="documentoParaEditar"
      :campos-plantilla="camposPlantilla"
      :selected-coleccion="selectedColeccion"
      @close="closeModal"
      @save="handleSaveDocument"
      @success="handleEditSuccess"
      @error="handleEditError"
    />
    <!-- Modal para ver subformularios - REEMPLAZAR el modal existente -->
    <div v-if="showSubformModal" class="modal-backdrop">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modern-modal">
          <!-- Header con botón de cerrar estilo "Editar Documento" -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-table"></i>
              </div>
              <div class="header-title-section">
                <h3>
                  Subformulario:
                  {{ currentSubformDefinition?.alias || currentSubformDefinition?.name }}
                </h3>
                <p class="header-subtitle">
                  Contenido del subformulario
                  <span v-if="currentModalLevel > 0" class="badge badge-info ml-2">
                    Nivel {{ currentModalLevel + 1 }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Botones de navegación -->
            <div class="modal-nav-buttons">
              <!-- Botón para volver al modal anterior (solo si hay más de un nivel) -->
              <button
                v-if="currentModalLevel > 0"
                type="button"
                @click="cerrarSubformModal"
                class="nav-button back-button"
                v-tooltip="'Volver al nivel anterior'"
                aria-label="Back"
              >
                <i class="fas fa-arrow-left"></i>
              </button>

              <!-- Botón de cerrar todo -->
              <button
                type="button"
                @click="cerrarTodosLosModales"
                class="close-button"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div
              v-if="currentSubformData.length > 0 && currentSubformDefinition?.subcampos"
              class="table-responsive"
            >
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th v-for="subcampo in currentSubformDefinition.subcampos" :key="subcampo.name">
                      {{ subcampo.alias || subcampo.name }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in currentSubformData" :key="rowIndex">
                    <td v-for="subcampo in currentSubformDefinition.subcampos" :key="subcampo.name">
                      <!-- Si es un subform, mostrar botón -->
                      <span v-if="subcampo.type === 'subform'">
                        <Button
                          icon="fa-solid fa-magnifying-glass"
                          @click="abrirModalSubform(row[subcampo.name], subcampo.name)"
                          text
                          severity="info"
                          size="small"
                          v-tooltip="'Ver subformulario anidado'"
                        />
                      </span>

                      <!-- Si es valor normal -->
                      <span v-else>
                        {{ getPrettySubcampoValue(row, subcampo.name) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-muted text-center py-3">
              No hay entradas en este subformulario
            </div>
          </div>

          <!-- Footer con información del nivel actual (opcional) -->
          <div v-if="currentModalLevel > 0" class="modal-footer text-muted">
            <small>
              <i class="fas fa-info-circle"></i>
              Navegando en subformulario anidado (Nivel {{ currentModalLevel + 1 }})
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import EditDocumentModal from './EditDocumentModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'VerDocumentos',

  components: {
    EditDocumentModal,
    DataTable,
    Column,
    InputText,
    IconField,
    InputIcon,
    Button,
    Tag,
  },

  data() {
    return {
      // Por estas que manejan múltiples niveles:
      modalStack: [], // Array que contiene información de cada modal abierto
      currentModalLevel: -1, // Índice del modal actual

      // Estado principal
      colecciones: [],
      selectedColeccion: null,
      documentos: [],
      palabraClave: '',

      // Campos y plantillas (memoizados)
      camposDocumento: [],
      camposPlantilla: [],

      // Paginación
      currentPage: 1,
      itemsPerPage: 10,

      // Modal de edición
      isModalOpen: false,
      documentoParaEditar: {},

      // Configuración
      excludedCollections: [
        'failed_jobs',
        'navbar_colors',
        'password_reset_tokens',
        'migrations',
        'personal_access_tokens',
        'plantillas_predeterminadas',
        'noticias_collection',
        'users',
        'comentarios',
        'carrousel_images',
      ],

      // Estados de carga
      loading: {
        colecciones: false,
        documentos: false,
      },
      // Filtros dinámicos
      filtroActivo: {
        campo: '',
        operador: 'equals',
        valor: '',
      },
      filtrosActivos: [],
    }
  },

  computed: {
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
    // Computed properties para acceder al modal actual
    showSubformModal() {
      return this.currentModalLevel >= 0
    },

    currentSubformData() {
      return this.currentModalLevel >= 0 ? this.modalStack[this.currentModalLevel].data : []
    },

    currentSubformDefinition() {
      return this.currentModalLevel >= 0 ? this.modalStack[this.currentModalLevel].definition : null
    },

    coleccionesFiltradas() {
      return this.colecciones.filter(
        (col) => !this.excludedCollections.includes(col.nombre_coleccion),
      )
    },

    filteredDocuments() {
      let documentos = [...this.documentos]

      // Aplicar filtros dinámicos primero
      if (this.filtrosActivos.length > 0) {
        documentos = documentos.filter((doc) => {
          return this.filtrosActivos.every((filtro) => {
            // Obtener el valor del documento para el campo del filtro
            const valor = this.getFieldValueFromDocument(doc, filtro.campo)
            return this.aplicarFiltro(valor, filtro)
          })
        })
      }

      // Luego aplicar búsqueda por palabra clave
      if (this.palabraClave.trim()) {
        const searchTerm = this.palabraClave.toLowerCase()
        documentos = documentos.filter((doc) => {
          const matchInVisibleFields = this.camposDocumento.some((campo) => {
            const valor = this.getFieldValueFromDocument(doc, campo)
            return valor && String(valor).toLowerCase().includes(searchTerm)
          })
          const matchInId = doc._id && String(doc._id).toLowerCase().includes(searchTerm)
          return matchInVisibleFields || matchInId
        })
      }

      return documentos
    },

    paginatedDocumentos() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredDocuments.slice(start, start + this.itemsPerPage)
    },

    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage)
    },

    nombreColeccion() {
      return this.selectedColeccion?.nombre_coleccion || null
    },
  },

  watch: {
    // Resetear página cuando cambie la búsqueda
    palabraClave() {
      this.currentPage = 1
    },
  },

  // En tu archivo VerDocumentos.vue, reemplaza la sección de methods con esto:

  methods: {
    // ========== MÉTODOS EXISTENTES ==========
    getStatusSeverity(estado) {
      switch (estado) {
        case 'Activo':
          return 'success'
        case 'Pendiente':
          return 'warning'
        default:
          return 'info'
      }
    },

    // ========== SUBFORMULARIOS - MÉTODOS CORREGIDOS ==========
    abrirModalSubform(contenido, fieldName) {
      console.log('=== ABRIENDO MODAL SUBFORM ===')
      console.log('Contenido recibido:', contenido)
      console.log('Field name:', fieldName)
      console.log('Nivel actual antes de abrir:', this.currentModalLevel)

      // Buscar la definición del subcampo
      let subformDefinition = null
      if (this.currentModalLevel >= 0) {
        const currentDef = this.currentSubformDefinition
        if (currentDef?.subcampos) {
          subformDefinition = currentDef.subcampos.find((f) => f.name === fieldName)
        }
      }
      if (!subformDefinition) {
        subformDefinition = this.getCampoDefinition(fieldName)
      }
      if (!subformDefinition) {
        console.error('No se encontró definición para el campo:', fieldName)
        return
      }

      // Inicializar datos correctamente
      let modalData = []
      if (Array.isArray(contenido) && contenido.length > 0) {
        // Solo tomar filas válidas que tengan al menos un valor
        modalData = contenido.filter((row) =>
          Object.values(row).some((val) => val !== null && val !== ''),
        )
      } else if (subformDefinition?.subcampos) {
        // Crear un objeto base con los campos del subform
        const baseObj = {}
        subformDefinition.subcampos.forEach((sc) => (baseObj[sc.name] = sc.default || null))
        modalData = [baseObj]
      }

      const newModalData = {
        data: modalData,
        definition: subformDefinition,
        fieldName: fieldName,
      }

      this.modalStack.push(newModalData)
      this.currentModalLevel = this.modalStack.length - 1

      console.log('Modal agregado al stack')
      console.log('Nuevo nivel:', this.currentModalLevel)
      console.log('Stack actual:', this.modalStack)
      console.log('Datos del nuevo modal:', newModalData)
    },

    cerrarSubformModal() {
      console.log('=== CERRANDO MODAL ===')
      console.log('Nivel actual antes de cerrar:', this.currentModalLevel)

      if (this.currentModalLevel >= 0) {
        // Remover el modal actual del stack
        this.modalStack.pop()
        this.currentModalLevel = this.modalStack.length - 1

        console.log('Modal cerrado, nuevo nivel:', this.currentModalLevel)
        console.log('Stack después de cerrar:', this.modalStack)
      }
    },

    cerrarTodosLosModales() {
      console.log('=== CERRANDO TODOS LOS MODALES ===')
      this.modalStack = []
      this.currentModalLevel = -1
      console.log('Todos los modales cerrados')
    },

    // Método actualizado para obtener subcampo del modal actual
    getCurrentSubcampoWithOptions(subcampoName) {
      const currentDef = this.currentSubformDefinition
      if (!currentDef?.subcampos) return null
      return currentDef.subcampos.find((s) => s.name === subcampoName) || null
    },

    // Método actualizado para mostrar valores bonitos
    getPrettySubcampoValue(row, subcampoName) {
      const subcampoDef = this.getCurrentSubcampoWithOptions(subcampoName)
      const valor = row[subcampoName]

      if (!valor || valor === 'null') return '-'

      if (subcampoDef?.options && Array.isArray(subcampoDef.options)) {
        const option = subcampoDef.options.find((o) => o.campoGuardar === valor)
        return option ? option.campoMostrar : valor
      }

      return valor
    },

    // ========== API CALLS ==========

    async apiCall(endpoint, options = {}) {
      const token = localStorage.getItem('apiToken')
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        ...options,
      }

      try {
        const response = await axios(endpoint, config)
        return response.data
      } catch (error) {
        console.error(`API Error on ${endpoint}:`, error)
        throw error
      }
    },

    async getColecciones() {
      if (this.loading.colecciones) return

      this.loading.colecciones = true
      try {
        this.colecciones = await this.apiCall('http://127.0.0.1:8000/api/documentos/plantillas')
      } catch (error) {
        this.showError('No se pudieron cargar las colecciones')
      } finally {
        this.loading.colecciones = false
      }
    },

    async getCamposPlantilla(plantillaId) {
      try {
        const response = await this.apiCall(
          `http://127.0.0.1:8000/api/plantillas/${plantillaId}/secciones`,
        )

        // Verificar si la respuesta tiene la estructura esperada con secciones
        if (response?.secciones && Array.isArray(response.secciones)) {
          return response
        } else if (response?.campos && Array.isArray(response.campos)) {
          // Mantener compatibilidad con estructura anterior
          return response.campos
        } else if (Array.isArray(response)) {
          // Mantener compatibilidad con estructura anterior
          return response
        }

        console.warn('Estructura de respuesta inesperada:', response)
        return { secciones: [] }
      } catch (error) {
        console.error('Error obteniendo campos de plantilla:', error)
        return { secciones: [] }
      }
    },

    async obtenerDocumentos() {
      if (!this.selectedColeccion || this.loading.documentos) return

      this.loading.documentos = true
      try {
        // Obtener campos de plantilla y documentos en paralelo
        const [camposPlantilla, documentos] = await Promise.all([
          this.getCamposPlantilla(this.selectedColeccion.id),
          this.apiCall(`http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.id}`),
        ])

        this.camposPlantilla = camposPlantilla
        this.documentos = documentos
        this.currentPage = 1

        // DEBUGGING: Verificar qué datos tenemos
        console.log('=== DEBUGGING DATOS ===')
        console.log('Campos plantilla recibidos:', camposPlantilla)
        console.log('Documentos recibidos:', documentos)
        console.log('Primer documento:', documentos[0])
        console.log(
          'Propiedades del primer documento:',
          documentos[0] ? Object.keys(documentos[0]) : 'Sin documentos',
        )

        this.procesarCamposDocumento()

        // DEBUGGING: Verificar campos procesados
        console.log('Campos documento procesados:', this.camposDocumento)

        // DEBUGGING: Verificar si los campos existen en los documentos
        if (documentos[0] && this.camposDocumento.length > 0) {
          console.log('=== VERIFICACIÓN DE CAMPOS ===')
          this.camposDocumento.forEach((campo) => {
            console.log(`Campo "${campo}":`, documentos[0][campo])
          })
        }
      } catch (error) {
        this.documentos = []
        this.camposDocumento = []
        this.showError('Error al cargar los documentos')
      } finally {
        this.loading.documentos = false
      }
    },

    handleEditSuccess() {
      Swal.fire('Éxito', 'El documento fue editado correctamente', 'success')
      this.obtenerDocumentos() // Refresca los documentos si hace falta
      this.closeModal()
    },

    handleEditError(error) {
      console.error('Error al editar:', error)
      Swal.fire('Error', 'Hubo un problema al guardar el documento', 'error')
    },

    // ========== PROCESAMIENTO DE DATOS ==========
    procesarCamposDocumento() {
      // Verificar si tenemos la nueva estructura con secciones
      if (this.camposPlantilla?.secciones && Array.isArray(this.camposPlantilla.secciones)) {
        this.procesarCamposConSecciones()
      } else {
        this.camposDocumento = []
      }
    },

    procesarCamposConSecciones() {
      // Extraer todos los campos de todas las secciones
      const todosLosCampos = []

      console.log('=== PROCESANDO SECCIONES ===')
      console.log('Secciones disponibles:', this.camposPlantilla.secciones)

      this.camposPlantilla.secciones.forEach((seccion, index) => {
        console.log(`Sección ${index + 1} (${seccion.nombre}):`, seccion.fields)

        if (seccion.fields && Array.isArray(seccion.fields)) {
          seccion.fields.forEach((campo) => {
            // Agregamos todos los campos, incluso subforms
            todosLosCampos.push(campo)
            console.log(
              `  - Campo agregado: ${campo.name} (type: ${campo.type}, required: ${campo.required})`,
            )
          })
        }
      })

      // Devolver todos los names
      this.camposDocumento = todosLosCampos.map((campo) => campo.name)
      console.log('=== RESULTADO PROCESAMIENTO ===')
      console.log('Total campos encontrados:', todosLosCampos.length)
      console.log('Campos seleccionados para mostrar:', this.camposDocumento)
    },

    getFieldValueFromDocument(documento, fieldPath) {
      console.log('Obteniendo valor para:', fieldPath)

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
            // Para filtros, necesitamos verificar todos los elementos
            // Pero para obtener un valor específico, tomamos el primero
            currentValue = currentValue[0]
          } else {
            return null
          }
        }
      }

      return currentValue
    },

    // ========== CAMPO HELPERS - MÉTODO MEJORADO ==========
    getDisplayValue(value) {
      if (value === null || value === undefined || value === '' || value === 'null') {
        return '-'
      }
      return value
    },

    /**
     * Busca la definición de un campo (MÉTODO MEJORADO)
     */
    getCampoDefinition(fieldPath) {
      console.log('=== BUSCANDO DEFINICIÓN DE CAMPO ===')
      console.log('Campo/Path buscado:', fieldPath)

      if (!this.camposPlantilla?.secciones) {
        console.log('No hay secciones en camposPlantilla')
        return null
      }

      // Si es un path simple (sin puntos), buscar en campos principales
      if (!fieldPath.includes('.')) {
        for (const seccion of this.camposPlantilla.secciones) {
          if (seccion.fields && Array.isArray(seccion.fields)) {
            const campo = seccion.fields.find((f) => f.name === fieldPath)
            if (campo) {
              console.log('Campo encontrado en plantilla principal:', campo)
              return campo
            }
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
                if (subcampo) {
                  console.log('Subcampo encontrado (nivel 1):', subcampo)
                  return subcampo
                }
              } else if (pathParts.length === 3) {
                // Segundo nivel de subformulario
                const subcampo = campoSubform.subcampos.find((sc) => sc.name === pathParts[1])
                if (subcampo && subcampo.type === 'subform' && subcampo.subcampos) {
                  const subsubcampo = subcampo.subcampos.find((ssc) => ssc.name === pathParts[2])
                  if (subsubcampo) {
                    console.log('Sub-subcampo encontrado (nivel 2):', subsubcampo)
                    return subsubcampo
                  }
                }
              }
            }
          }
        }
      }

      console.log('Campo no encontrado')
      return null
    },

    /**
     * Obtiene un valor "bonito" para mostrar en la tabla
     */
    getPrettyFieldValue(documento, fieldName) {
      const valor = this.getFieldValueFromDocument(documento, fieldName)
      if (!valor) return null

      const campo = this.getCampoDefinition(fieldName)
      if (!campo) return valor

      // Si es subform, solo mostrar el nombre del campo (no su contenido)
      if (campo.type === 'subform') {
        return campo.name
      }

      // Si es campo de fecha
      if (campo.type === 'date' && valor) {
        return this.formatoFecha(valor)
      }

      // Si el campo es dinámico (select con campoGuardar/campoMostrar)
      if (campo.options && Array.isArray(campo.options)) {
        const option = campo.options.find((o) => o.campoGuardar === valor)
        return option ? option.campoMostrar : valor
      }

      // Si es manual o normal, lo mostramos directo
      return valor
    },

    formatoFecha(dateString) {
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString // Si es inválida, devolver original

        // Formato usando toLocaleString
        return date
          .toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')
      } catch (e) {
        return dateString
      }
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
          .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      )
    },

    // ========== MODAL DE EDICIÓN ==========
    editarDocumento(documento) {
      this.documentoParaEditar = { ...documento }
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
      this.documentoParaEditar = {}
    },

    // ========== MANEJADORES DEL MODAL ==========
    async handleSaveDocument(formData) {
      const token = localStorage.getItem('apiToken')
      if (!token) {
        this.showError('No estás autenticado')
        return
      }

      const docId =
        this.documentoParaEditar._id?.$oid ||
        this.documentoParaEditar._id ||
        this.documentoParaEditar.id
      if (!docId) {
        this.showError('ID de documento inválido')
        return
      }

      try {
        console.log('Informacion que se manda a la api')
        for (let pair of formData.entries()) {
          console.log(pair[0], ':', pair[1])
        }
        const response = await axios.post(
          `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${docId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        this.showSuccess('Documento actualizado correctamente')
        this.closeModal()
        await this.obtenerDocumentos()
      } catch (error) {
        console.error('Error completo:', error.response)
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Hubo un problema al actualizar el documento'
        this.showError(errorMsg)
      }
    },

    // ========== ELIMINACIÓN ==========
    async eliminarDocumento(documentoId) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await this.apiCall(
          `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${documentoId}`,
          { method: 'DELETE' },
        )

        this.documentos = this.documentos.filter(
          (doc) => doc._id?.$oid || doc._id || doc.id !== documentoId,
        )
        this.showSuccess('El documento se ha eliminado exitosamente.')
      } catch (error) {
        this.showError('Hubo un problema al eliminar el documento.')
      }
    },

    // ========== UI HELPERS ==========
    changePage(page) {
      this.currentPage = page
    },

    async onColeccionSelected() {
      if (this.selectedColeccion) {
        await this.obtenerDocumentos()
      } else {
        this.resetDocumentData()
      }
    },

    resetDocumentData() {
      this.documentos = []
      this.camposDocumento = []
      this.camposPlantilla = []
      this.filtrosActivos = []
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },

    showSuccess(message) {
      Swal.fire({
        title: 'Éxito',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d',
      })
    },

    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d',
      })
    },

    // ========== MÉTODOS PARA FILTROS DINÁMICOS ==========

    onCampoFiltroChange() {
      // Resetear operador y valor cuando cambia el campo
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
      label: opcion.campoMostrar || opcion.label || opcion.campoGuardar || opcion.value || opcion,
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

      // Verificar si ya existe un filtro para este campo
      const existeIndex = this.filtrosActivos.findIndex((f) => f.campo === this.filtroActivo.campo)

      if (existeIndex >= 0) {
        // Reemplazar filtro existente
        this.filtrosActivos.splice(existeIndex, 1, { ...this.filtroActivo })
      } else {
        // Agregar nuevo filtro
        this.filtrosActivos.push({ ...this.filtroActivo })
      }

      // Resetear filtro activo
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
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
          // Si el campo es anidado (tiene puntos), necesitamos obtener el valor correcto
          if (filtro.campo.includes('.')) {
            const pathParts = filtro.campo.split('.')
            // Obtener el campo específico del item
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

    // Nuevo método para aplicar filtro a valores simples
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
      const opcionDoc = campo.options.find(o => o.campoGuardar === valor)
      if (opcionDoc) {
        valorADocumento = opcionDoc.campoMostrar || valor
      }
      
      // Convertir el valor del filtro (campoGuardar) a campoMostrar
      const opcionFiltro = campo.options.find(o => o.campoGuardar === filtro.valor)
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
      return valorString !== filtroValro
    case 'gt':
      return parseFloat(valor) > parseFloat(filtro.valor)
    case 'lt':
      return parseFloat(valor) < parseFloat(filtro.valor)
    default:
      return true
  }
},

    getDisplayValueForFilter(filtro) {
  // Buscar la definición del campo
  const campo = this.getCampoDefinition(filtro.campo)

  if (!campo) {
    return filtro.valor
  }

  // Si tiene opciones y es select dinámico
  if (campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
    const primerElemento = campo.options[0]
    
    // Select dinámico (objetos con campoGuardar/campoMostrar)
    if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
      const opcion = campo.options.find(o => o.campoGuardar === filtro.valor)
      return opcion ? opcion.campoMostrar : filtro.valor
    }
    
    // Select manual (array de strings)
    if (typeof primerElemento === 'string') {
      return filtro.valor // Ya es el texto que queremos mostrar
    }
  }

  return filtro.valor
},
  },

  mounted() {
    this.getColecciones()
  },
}
</script>

<style scoped>
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
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
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
  background: linear-gradient(90deg, #6c757d, #495057);
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
  color: #6c757d;
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
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
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
  border-color: #6c757d;
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
  transform: translateY(-1px);
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.table-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
}

.table-header-cell {
  color: white;
  font-weight: 600;
  padding: 1rem;
  border: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: transparent;
}

.table-row {
  transition: all 0.2s ease;
  border: none;
}

.table-row:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-cell {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.table-text {
  color: #495057;
  font-weight: 500;
}

/* Badges y estados */
.file-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.file-badge {
  background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%);
  border: 1px solid #dee2e6;
  color: #495057;
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.file-extension {
  font-weight: 600;
}

.no-files {
  color: #6c757d;
  font-style: italic;
  font-size: 0.875rem;
}

.status-badge {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-pending {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-default {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  border: 1px solid #dee2e6;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.edit-button {
  border-color: #6c757d;
  color: #6c757d;
}

.edit-button:hover {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.delete-button {
  border-color: #dc3545;
  color: #dc3545;
}

.delete-button:hover {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 3rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.empty-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: #6c757d;
  margin: 0;
}

/* Paginación */
.pagination-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.pagination-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.pagination-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  background: #f8f9fa;
}

.pagination-button.active {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  border-color: #6c757d;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 600px;
  width: 100%;
  margin: 1.75rem;
}

.modal-content {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Vista previa de archivos en modal */
.file-upload-section {
  margin-top: 0.5rem;
}

.file-preview {
  margin-top: 1rem;
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #495057;
}

.file-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.file-preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.file-preview-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.file-preview-icon {
  color: #6c757d;
  font-size: 1.25rem;
}

.file-preview-name {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  padding: 0;
  border: 1px solid #dc3545;
  color: #dc3545;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-file-button:hover {
  background: #dc3545;
  color: white;
}

/* Footer del modal */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.btn-cancel {
  background: linear-gradient(135deg, #adb5bd 0%, #6c757d 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
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
  cursor: pointer;
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
  background: linear-gradient(135deg, #495057 0%, #343a40 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
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

  .table-container {
    overflow-x: auto;
  }

  .table-header-cell,
  .table-cell {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-button {
    width: 32px;
    height: 32px;
  }

  .modal-footer {
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

  .table-header-cell,
  .table-cell {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }

  .file-preview-grid {
    grid-template-columns: 1fr;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }
}

/* Estilos para la navegación de modales anidados */
.modal-nav-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button {
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 8px 10px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.nav-button:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.back-button {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.back-button:hover {
  background-color: #bbdefb;
  border-color: #1976d2;
  color: #0d47a1;
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

/* Badge para mostrar el nivel */
.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-info {
  color: #fff;
  background-color: #17a2b8;
}

/* Estilos para el modal backdrop con múltiples niveles */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050;
}

/* Ajustar z-index para modales anidados */
.modal-backdrop + .modal-backdrop {
  z-index: 1055;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
