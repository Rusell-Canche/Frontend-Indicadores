<template>
  <div class="subform-container">
    <div class="subform-header">
      <i class="fas fa-indent me-2"></i>
      <span>Subformulario para {{ campo.alias || campo.name }}</span>
    </div>

    <button type="button" @click="agregarEntrada" class="add-campo-button">
      <i class="fas fa-plus me-2"></i> Agregar entrada
    </button>

    <!-- Tabla para mostrar entradas existentes -->
    <div class="table-responsive mt-3" v-if="filas.length > 0">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th v-for="subcampo in campo.subcampos" :key="subcampo.name">
              {{ subcampo.alias || subcampo.name }}
            </th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, index) in filas" :key="index">
            <td v-for="subcampo in campo.subcampos" :key="subcampo.name">
              <!-- Renderizar subcampo normal -->
              <template v-if="subcampo.type !== 'subform' && subcampo.type !== 'tabla'">
                <template v-if="subcampo.type === 'file'">
                  <button type="button"
                    class="p-button p-component p-button-icon-only p-button-text p-button-info p-button-sm"
                    @click="mostrarModalImagen = true; archivo = fila[subcampo.name]"
                    v-tooltip="'Ver Archivo'"
                    style="width: 2rem; height: 2rem; padding: 0; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-eye" style="color: #3b82f6; font-size: 0.875rem;"></i>
                  </button>
                </template>
                <template v-else-if="subcampo.type === 'select' && !isManualSelect(subcampo)">
                  {{
                  subcampo.options.find((opt) => opt.campoGuardar === fila[subcampo.name])
                  ?.campoMostrar || fila[subcampo.name]
                  }}
                </template>
                <template v-else>
                  {{ fila[subcampo.name] }}
                </template>
              </template>

              <!-- Botón para tabla -->
              <template v-else-if="subcampo.type === 'tabla'">
                <span class="badge bg-info">
                  {{ Array.isArray(fila[subcampo.name]) ? fila[subcampo.name].length : 0 }}
                  registro(s)
                </span>
              </template>

              <!-- Botón para abrir modal del subformulario anidado -->
              <template v-else>
                <button type="button" class="btn btn-sm btn-outline-primary"
                  @click="abrirModalSubformulario(index, subcampo.name, subcampo)"
                  :title="`Ver/Editar ${subcampo.alias || subcampo.name}`">
                  <i class="fa-solid fa-magnifying-glass me-1"></i>
                  <span class="d-none d-md-inline">Ver/Editar</span>
                </button>
              </template>
            </td>
            <td class="text-center">
              <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="editarEntrada(index)">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="eliminarEntrada(index)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal principal para editar/agregar entrada -->
    <div v-if="mostrarModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-xl">
        <div class="modal-content modern-modal">
          <!-- Header del modal -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-plus-circle" v-if="indiceEditando === -1"></i>
                <i class="fas fa-edit" v-else></i>
              </div>
              <div class="header-title-section">
                <h3>{{ indiceEditando === -1 ? 'Agregar' : 'Editar' }} entrada</h3>
                <p class="header-subtitle">{{ campo.alias || campo.name }}</p>
              </div>
            </div>
            <button type="button" @click="cerrarModal" class="close-button" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal -->
          <div class="medico-body modal-body-custom">
            <div class="alert alert-info mb-4">
              <i class="fas fa-info-circle me-2"></i>
              Complete los campos del subformulario según sus necesidades
            </div>

            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Campos del Subformulario
              </h6>

              <div v-for="subcampo in campo.subcampos" :key="subcampo.name" class="campo-container">
                <div class="campo-header">
                  <div class="campo-title">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span class="campo-index">{{ subcampo.alias || subcampo.name }}</span>
                    <span v-if="subcampo.required" class="required-badge">*</span>
                  </div>
                </div>

                <div class="campo-body">
                  <!-- Renderizar campos normales en el modal -->
                  <template v-if="subcampo.type !== 'subform' && subcampo.type !== 'tabla'">
                    <!-- Campo de archivo -->
                    <!-- Campo de archivos - misma estructura que CrearDocumentos.vue -->
                    <div v-if="subcampo.type === 'file'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>

                      <!-- Un solo input de archivo con múltiple -->
                      <div class="file-input-group mb-3">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-file"></i>
                          </span>
                          <input type="file" class="form-control" :id="`subform_${campo.name}_${subcampo.name}`"
                            @change="onCambioArchivo($event, subcampo.name)" multiple :key="fileInputKey" />
                        </div>
                      </div>

                      <!-- Vista previa de archivos -->
                      <div v-if="
                          archivosSubformulario[subcampo.name] &&
                          archivosSubformulario[subcampo.name].length > 0
                        " class="file-preview mt-3">
                        <h6 class="preview-title">
                          Archivos seleccionados ({{
                          archivosSubformulario[subcampo.name].length
                          }}):
                        </h6>
                        <div class="d-flex flex-wrap gap-3">
                          <div class="file-item" v-for="(file, index) in archivosSubformulario[subcampo.name]"
                            :key="index">
                            <div class="file-content">
                              <div v-if="isImageFile(file)" class="file-thumbnail">
                                <img :src="getThumbnailUrl(file)" alt="Miniatura" class="img-fluid" />
                              </div>
                              <div v-else class="file-icon">
                                <i class="fas fa-file-alt"></i>
                              </div>
                              <span class="file-name">{{ file.name }}</span>
                            </div>
                            <button type="button" class="delete-button"
                              @click="removeArchivoSubcampo(subcampo.name, index)">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Botón para limpiar todos los archivos -->
                        <div class="mt-3">
                          <button type="button" class="btn btn-outline-danger btn-sm"
                            @click="clearAllArchivosSubcampo(subcampo.name)">
                            <i class="fas fa-trash me-1"></i>
                            Limpiar todos los archivos
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- Campo numérico -->
                    <div v-else-if="subcampo.type === 'number'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-hashtag"></i>
                        </span>
                        <input type="number" class="form-control" v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required" placeholder="Ingrese un valor numérico" />
                      </div>
                    </div>

                    <!-- Campo de tipo checkbox -->
                    <div v-else-if="subcampo.type === 'checkBox'" class="form-field">
                      <label class="form-label d-block mb-3">
                        <i class="fas fa-check-square me-2"></i>
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="checkbox-container d-block">
                        <div class="form-check mb-2" v-for="(option, index) in subcampo.options" :key="index">
                          <input class="form-check-input" type="checkbox" :id="subcampo.name + '_' + index"
                            :value="getSaveValue(option, subcampo)" v-model="datosTemporales[subcampo.name]" />
                          <label class="form-check-label" :for="subcampo.name + '_' + index">
                            {{ getDisplayValue(option, subcampo) }}
                          </label>
                        </div>
                      </div>
                      <small class="form-text text-muted mt-2">
                        Seleccione una o más opciones
                      </small>
                    </div>

                    <!-- Campo select -->
                    <div v-else-if="subcampo.type === 'select'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-list-ul"></i>
                        </span>
                        <select class="form-select" v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required">
                          <option value="" disabled selected>Seleccione una opción</option>
                          <template v-if="isManualSelect(subcampo)">
                            <option v-for="(option, index) in subcampo.options" :key="index" :value="option">
                              {{ option }}
                            </option>
                          </template>
                          <template v-else>
                            <option v-for="(option, index) in subcampo.options" :key="index"
                              :value="option.campoGuardar">
                              {{ option.campoMostrar }}
                            </option>
                          </template>
                        </select>
                      </div>
                      <div v-if="!isManualSelect(subcampo) && subcampo.dataSource" class="form-text mt-1">
                        <small class="text-info">
                          <i class="fas fa-database me-1"></i>
                          Datos de: {{ subcampo.dataSource.plantillaNombre }} -
                          {{ subcampo.dataSource.seccion }}
                        </small>
                      </div>
                    </div>

                    <!-- Campo fecha -->
                    <div v-else-if="subcampo.type === 'date'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date" class="form-control" v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required || subcampo.filterable" />
                      </div>
                    </div>

                    <!-- Campo texto -->
                    <div v-else class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-font"></i>
                        </span>
                        <input type="text" class="form-control" v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required" placeholder="Ingrese texto" />
                      </div>
                    </div>
                  </template>

                  <!-- Campo tipo tabla -->
                  <div v-else-if="subcampo.type === 'tabla'" class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>

                    <button type="button" class="btn btn-outline-primary mb-3" @click="abrirModalTabla(subcampo)">
                      <i class="fas fa-plus me-2"></i>
                      Seleccionar datos para la tabla
                    </button>

                    <!-- Vista previa de IDs seleccionados -->
                    <div v-if="
                        datosTemporales[subcampo.name] && datosTemporales[subcampo.name].length > 0
                      " class="alert alert-success">
                      <i class="fas fa-check-circle me-2"></i>
                      {{ datosTemporales[subcampo.name].length }} registro(s) seleccionado(s)
                    </div>
                    <div v-else class="alert alert-info">
                      <i class="fas fa-info-circle me-2"></i>
                      No se han seleccionado registros
                    </div>
                  </div>

                  <!-- Botón para subformulario anidado en el modal principal -->
                  <div v-else class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="d-flex align-items-center">
                      <button type="button" class="btn btn-outline-primary me-3"
                        @click="abrirModalSubformularioDesdeModal(subcampo.name, subcampo)">
                        <i class="fa-solid fa-magnifying-glass me-2"></i>
                        Ver/Editar {{ subcampo.alias || subcampo.name }}
                      </button>
                      <small class="text-muted">
                        {{ (datosTemporales[subcampo.name] || []).length }} entradas
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer con botones -->
              <div class="medico-footer">
                <button type="button" class="btn btn-cancel" @click="cerrarModal">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="button" class="btn btn-save" @click="guardarEntrada">
                  <i class="fas fa-check me-2"></i>
                  {{ indiceEditando === -1 ? 'Agregar' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para subformulario anidado -->
    <div v-if="mostrarModalSubformulario" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-xxl">
        <div class="modal-content modern-modal">
          <!-- Header del modal de subformulario -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-list-ul"></i>
              </div>
              <div class="header-title-section">
                <h3>Gestionar {{ subformularioActual?.alias || subformularioActual?.name }}</h3>
                <p class="header-subtitle">Subformulario anidado</p>
              </div>
            </div>
            <button type="button" @click="cerrarModalSubformulario" class="close-button" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal de subformulario -->
          <div class="medico-body modal-body-custom">
            <SubFormularioDocumento v-if="subformularioActual" :campo="subformularioActual"
              :valor="valoresSubformulario" @actualizar="actualizarValoresSubformulario" :nivel="nivel + 1" />
          </div>

          <!-- Footer del modal de subformulario -->
          <div class="medico-footer">
            <button type="button" class="btn btn-cancel" @click="cerrarModalSubformulario">
              <i class="fas fa-times me-2"></i>
              Cerrar
            </button>
            <button type="button" class="btn btn-save" @click="guardarSubformulario">
              <i class="fas fa-check me-2"></i>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para tabla dinámica -->
    <div v-if="modalTablaVisible" class="modal fade show" style="display: block; z-index: 1060">
      <div class="modal-dialog modal-xl">
        <div class="modal-content modern-modal">
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-table"></i>
              </div>
              <div class="header-title-section">
                <h3>Seleccionar datos para {{ tablaActual?.alias || tablaActual?.name }}</h3>
                <p class="header-subtitle">
                  Plantilla: {{ tablaActual?.tableConfig?.plantillaNombre }} - Sección:
                  {{ tablaActual?.tableConfig?.seccion }}
                </p>
              </div>
            </div>
            <button type="button" @click="cerrarModalTabla" class="close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="medico-body modal-body-custom">
            <!-- Barra de búsqueda y controles -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input type="text" class="form-control" v-model="busquedaTabla"
                    placeholder="Buscar en los datos disponibles..." @keyup.enter="paginaActual = 1" />
                </div>
              </div>
              <div class="col-md-6 d-flex justify-content-between align-items-center">
                <div class="form-text">
                  Mostrando {{ datosPaginados.length }} de {{ datosFiltrados.length }} registros
                  (Total: {{ datosTablaDisponibles.length }})
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <label class="form-label mb-0 me-2">Mostrar:</label>
                  <select v-model="elementosPorPagina" class="form-select form-select-sm" style="width: auto">
                    <option value="5">5</option>
                  </select>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="paginaActual = 1"
                    :disabled="paginaActual === 1">
                    <i class="fas fa-angle-double-left"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="paginaActual--"
                    :disabled="paginaActual === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span class="mx-2 align-self-center">
                    Página {{ paginaActual }} de {{ totalPaginas }}
                  </span>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="paginaActual++"
                    :disabled="paginaActual >= totalPaginas">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="paginaActual = totalPaginas"
                    :disabled="paginaActual >= totalPaginas">
                    <i class="fas fa-angle-double-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Datos disponibles -->
              <div class="col-md-6">
                <h6>Datos disponibles ({{ datosFiltrados.length }}):</h6>
                <div class="table-responsive" style="max-height: 400px">
                  <table class="table table-bordered table-sm table-hover">
                    <thead class="table-light sticky-top">
                      <tr>
                        <th>Seleccionar</th>
                        <th v-for="columna in tablaActual.tableConfig.campos" :key="columna.name">
                          {{ columna.name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(fila, index) in datosPaginados" :key="index">
                        <td>
                          <button type="button" class="btn btn-sm btn-success" @click="seleccionarFilaTabla(fila)"
                            :disabled="
                              tablaSeleccionada.some((f) => f._documentId === fila._documentId)
                            " :title="
                              tablaSeleccionada.some((f) => f._documentId === fila._documentId)
                                ? 'Ya seleccionado'
                                : 'Seleccionar'
                            ">
                            <i class="fas fa-plus"></i>
                          </button>
                        </td>
                        <td v-for="columna in tablaActual.tableConfig.campos" :key="columna.name">
                          {{ obtenerValorCampo(fila, columna.name) || '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="datosPaginados.length === 0" class="text-center py-3 text-muted">
                  <i class="fas fa-inbox fa-2x mb-2"></i>
                  <p>No se encontraron registros</p>
                </div>
              </div>

              <!-- Datos seleccionados -->
              <div class="col-md-6">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Datos seleccionados ({{ tablaSeleccionada.length }}):</h6>
                  <button v-if="tablaSeleccionada.length > 0" type="button" class="btn btn-sm btn-outline-danger"
                    @click="tablaSeleccionada = []">
                    <i class="fas fa-trash me-1"></i> Limpiar todo
                  </button>
                </div>
                <div class="table-responsive" style="max-height: 400px">
                  <table class="table table-bordered table-sm table-hover">
                    <thead class="table-light sticky-top">
                      <tr>
                        <th>Acción</th>
                        <th v-for="columna in tablaActual.tableConfig.campos" :key="columna.name">
                          {{ columna.name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(fila, index) in tablaSeleccionada" :key="index">
                        <td>
                          <button type="button" class="btn btn-sm btn-danger" @click="deseleccionarFilaTabla(index)"
                            title="Quitar selección">
                            <i class="fas fa-times"></i>
                          </button>
                        </td>
                        <td v-for="columna in tablaActual.tableConfig.campos" :key="columna.name">
                          {{ obtenerValorCampo(fila, columna.name) || '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="tablaSeleccionada.length === 0" class="text-center py-3 text-muted">
                  <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                  <p>No hay registros seleccionados</p>
                </div>
              </div>
            </div>
          </div>

          <div class="medico-footer">
            <button type="button" class="btn btn-cancel" @click="cerrarModalTabla">
              <i class="fas fa-times me-2"></i>
              Cancelar
            </button>
            <button type="button" class="btn btn-save" @click="guardarSeleccionTabla">
              <i class="fas fa-check me-2"></i>
              Guardar selección ({{ tablaSeleccionada.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL PARA VER IMÁGENES -->
  <VistaArchivos :mostrar="mostrarModalImagen" :archivos="archivo" @cerrar="mostrarModalImagen = false" />
</template>

<script>
import VistaArchivos from "./VistaArchivos.vue"; 
import api, { downloadStorageFile } from '@/services/api'
export default {
  components: {
            VistaArchivos,
        },
  name: 'SubFormularioDocumento',
  props: {
    campo: {
      type: Object,
      required: true,
    },
    valor: {
      type: Array,
      default: () => [],
    },
    nivel: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      //VARIABLES PARA EL MODAL DE IMAGEN
      mostrarModalImagen: false, // Para controlar si se muestra el modal
      archivo: null,            // Para pasar el archivo al modal
      
      filas: [...this.valor],
      mostrarModal: false,
      indiceEditando: -1,
      datosTemporales: {},
      // Variables para subformularios anidados
      mostrarModalSubformulario: false,
      subformularioActual: null,
      valoresSubformulario: [],
      indiceFilaSubformulario: null,
      nombreCampoSubformulario: null,
      // Variables para tablas dinámicas
      modalTablaVisible: false,
      tablaActual: null,
      datosTablaDisponibles: [],
      tablaSeleccionada: [],
      // Nuevas propiedades para paginación y búsqueda
      busquedaTabla: '',
      paginaActual: 1,
      elementosPorPagina: 5,
      archivosSubformulario: {}, // { nombreSubcampo: [array de archivos] }
      fileInputKey: 0, // Para forzar el reset del input file
    }
  },
  watch: {
    valor: {
      handler(nuevoValor) {
        this.filas = [...nuevoValor]
      },
      deep: true,
    },
  },
  computed: {
    // Filtra los datos según la búsqueda
    datosFiltrados() {
      if (!this.busquedaTabla) {
        return this.datosTablaDisponibles
      }

      const busqueda = this.busquedaTabla.toLowerCase()
      return this.datosTablaDisponibles.filter((fila) => {
        return this.tablaActual.tableConfig.campos.some((columna) => {
          const valor = this.obtenerValorCampo(fila, columna)?.toString().toLowerCase() || ''
          return valor.includes(busqueda)
        })
      })
    },

    // Pagina los datos filtrados
    datosPaginados() {
      const start = (this.paginaActual - 1) * this.elementosPorPagina
      const end = start + this.elementosPorPagina
      return this.datosFiltrados.slice(start, end)
    },

    // Calcula el total de páginas
    totalPaginas() {
      return Math.ceil(this.datosFiltrados.length / this.elementosPorPagina)
    },
  },
  methods: {
    async onArchivoDesdeUrl(url, nombreSubcampo) {
      try {
        // Descargar el archivo desde la URL
        const file = await downloadStorageFile(url)

        // Inicializar si no existe
        if (!this.archivosSubformulario[nombreSubcampo]) {
          this.archivosSubformulario[nombreSubcampo] = []
        }

        this.archivosSubformulario[nombreSubcampo].push(file)
        this.datosTemporales[nombreSubcampo] = [...this.archivosSubformulario[nombreSubcampo]]
      } catch (error) {
        console.error('❌ Error al cargar archivo desde URL en subformulario:', error)
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Data:', error.response.data)
        }
      }
    },
    // Métodos para manejar opciones de checkbox y select
    getSaveValue(option, campo) {
      if (typeof option === 'string') {
        return option
      }
      return option.campoGuardar || option.value || option
    },

    getDisplayValue(option, campo) {
      if (typeof option === 'string') {
        return option
      }
      return option.campoMostrar || option.label || option.text || option
    },

    getDisplayValueFromSaved(savedValue, campo) {
      if (!campo.options) return savedValue

      if (this.isManualSelect(campo)) {
        return savedValue
      }

      const option = campo.options.find((opt) => (opt.campoGuardar || opt.value) === savedValue)
      return option ? option.campoMostrar || option.label || option.text : savedValue
    },

    // Métodos para subformularios anidados
    abrirModalSubformulario(indice, nombreCampo, campo) {
      this.indiceFilaSubformulario = indice
      this.nombreCampoSubformulario = nombreCampo
      this.subformularioActual = campo
      this.valoresSubformulario = [...(this.filas[indice][nombreCampo] || [])]
      this.mostrarModalSubformulario = true
    },

    abrirModalSubformularioDesdeModal(nombreCampo, campo) {
      this.nombreCampoSubformulario = nombreCampo
      this.subformularioActual = campo
      this.valoresSubformulario = [...(this.datosTemporales[nombreCampo] || [])]
      this.mostrarModalSubformulario = true
    },

    cerrarModalSubformulario() {
      this.mostrarModalSubformulario = false
      this.subformularioActual = null
      this.valoresSubformulario = []
      this.indiceFilaSubformulario = null
      this.nombreCampoSubformulario = null
    },

    actualizarValoresSubformulario(nuevosValores) {
      this.valoresSubformulario = nuevosValores
    },

    guardarSubformulario() {
      if (this.indiceFilaSubformulario !== null) {
        // Actualizar desde la tabla
        this.filas[this.indiceFilaSubformulario][this.nombreCampoSubformulario] = [
          ...this.valoresSubformulario,
        ]
        this.actualizarSubformularioAnidado(
          this.indiceFilaSubformulario,
          this.nombreCampoSubformulario,
          this.valoresSubformulario,
        )
      } else {
        // Actualizar desde el modal principal
        this.datosTemporales[this.nombreCampoSubformulario] = [...this.valoresSubformulario]
      }
      this.cerrarModalSubformulario()
    },

    // Métodos para tablas dinámicas
    async abrirModalTabla(campo) {
  this.tablaActual = campo
  this.modalTablaVisible = true
  this.busquedaTabla = '' // Resetear búsqueda
  this.paginaActual = 1 // Resetear a primera página

  try {
    const token = localStorage.getItem('apiToken')
    const api = (await import('@/services/api')).default

    const response = await api.get(`/plantillas/${campo.tableConfig.plantillaId}/secciones`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const seccion = response.data?.secciones?.find(
      (s) => s.nombre === campo.tableConfig.seccion,
    )
    
    if (seccion && seccion.fields) {
      const documentosResponse = await api.get(`/documentos/${campo.tableConfig.plantillaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      this.datosTablaDisponibles = this.procesarDatosParaTabla(
        documentosResponse.data,
        seccion,
        campo.tableConfig.campos,
      )

      // Maneja ambos casos (crear y editar)
      const datosGuardados = this.datosTemporales[campo.name] || []
      
      if (datosGuardados.length > 0) {
        // Verificar si son objetos completos o solo IDs
        const primerElemento = datosGuardados[0]
        
        if (primerElemento && typeof primerElemento === 'object' && primerElemento._documentId) {
          // Caso CREAR: Ya tenemos objetos completos
          this.tablaSeleccionada = [...datosGuardados]
        } else {
          // Caso EDITAR: Solo tenemos IDs, necesitamos reconstruir los objetos
          this.tablaSeleccionada = this.datosTablaDisponibles.filter((fila) => 
            datosGuardados.includes(fila._documentId)
          )
        }
      } else {
        // No hay datos guardados
        this.tablaSeleccionada = []
      }
    }
  } catch (error) {
    console.error('Error al cargar datos de tabla:', error)
    this.mostrarError('No se pudieron cargar los datos para la tabla')
  }
},

    procesarDatosParaTabla(documentos, seccion, camposConfigurados) {
      const datosProcesados = []

      documentos.forEach((documento) => {
        const seccionDoc = documento.secciones?.find((s) => s.nombre === seccion.nombre)
        if (seccionDoc) {
          const fila = {
            _documentId: documento._id || documento.id,
          }
          camposConfigurados.forEach((campoConfig) => {
            const campoNombre = campoConfig.name // Acceder al nombre
            const campo = seccionDoc.fields?.[campoNombre]
            fila[campoNombre] = campo || '-'
          })
          datosProcesados.push(fila)
        }
      })

      return datosProcesados
    },

    obtenerValorCampo(fila, nombreCampo) {
      return fila[nombreCampo] || '-'
    },

    cerrarModalTabla() {
      this.modalTablaVisible = false
      this.tablaActual = null
      this.datosTablaDisponibles = []
      this.tablaSeleccionada = []
      this.busquedaTabla = ''
      this.paginaActual = 1
    },

    seleccionarFilaTabla(fila) {
      const existe = this.tablaSeleccionada.some((f) => f._documentId === fila._documentId)
      if (!existe) {
        this.tablaSeleccionada.push({ ...fila })
      }
    },

    deseleccionarFilaTabla(index) {
      this.tablaSeleccionada.splice(index, 1)
    },

    guardarSeleccionTabla() {
      if (this.tablaActual) {
        // Extraer solo los IDs
        const tablaIds = this.tablaSeleccionada.map((fila) => fila._documentId).filter((id) => id)
        this.datosTemporales[this.tablaActual.name] = tablaIds
        this.cerrarModalTabla()
      }
    },

    eliminarFilaTabla(nombreCampo, index) {
      if (Array.isArray(this.datosTemporales[nombreCampo])) {
        this.datosTemporales[nombreCampo].splice(index, 1)
      }
    },

    isManualSelect(campo) {
      if (!campo.options || !Array.isArray(campo.options) || campo.options.length === 0) {
        return true
      }

      const primeraOpcion = campo.options[0]
      return typeof primeraOpcion === 'string'
    },

    agregarEntrada() {
      this.indiceEditando = -1
      this.datosTemporales = this.inicializarDatosTemporales()
      this.mostrarModal = true
    },

    editarEntrada(index) {
      this.indiceEditando = index
      this.datosTemporales = { ...this.filas[index] }
      this.archivosSubformulario = {}

      // INICIALIZAR ARCHIVOS INTERNOS DESDE DATOS EXISTENTES
      this.archivosSubformulario = {}
      this.campo.subcampos.forEach((sub) => {
        if (sub.type === 'file') {
          const archivosExistentes = this.datosTemporales[sub.name] || []
          const listaArchivos = Array.isArray(archivosExistentes)
            ? archivosExistentes
            : archivosExistentes
              ? [archivosExistentes]
              : []

          // Limpiar archivos previos
          this.archivosSubformulario[sub.name] = []

          // Convertir cada URL en File (asincrónicamente)
          listaArchivos.forEach((archivo) => {
            if (typeof archivo === 'string') {
              // Es una URL → convertir a File
              this.onArchivoDesdeUrl(archivo, sub.name)
            } else if (archivo instanceof File) {
              // Ya es un File → agregar directamente
              this.archivosSubformulario[sub.name].push(archivo)
              this.datosTemporales[sub.name] = [...this.archivosSubformulario[sub.name]]
            }
          })

          // Si no hay ninguno, inicializar vacío
          if (!this.archivosSubformulario[sub.name]) {
            this.archivosSubformulario[sub.name] = []
            this.datosTemporales[sub.name] = []
          }
        }

        if (sub.type === 'checkBox') {
          let valor = this.datosTemporales[sub.name]

          if (typeof valor === 'string') {
            try {
              valor = JSON.parse(valor)
            } catch {
              valor = []
            }
          }

          if (!Array.isArray(valor)) {
            valor = []
          }

          this.datosTemporales[sub.name] = [...valor]
        }
      })

      this.mostrarModal = true
    },

    eliminarEntrada(index) {
      this.filas.splice(index, 1)
      this.emitirActualizacion()
    },

    cerrarModal() {
      this.mostrarModal = false
      this.indiceEditando = -1
      this.datosTemporales = {}
      this.archivosSubformulario = {}
    },

    guardarEntrada() {
      // Validar campos requeridos
      const camposRequeridos = this.campo.subcampos.filter((sub) => sub.required)
      const esValido = camposRequeridos.every((sub) => {
        if (sub.type === 'subform') {
          return this.datosTemporales[sub.name] && this.datosTemporales[sub.name].length > 0
        }
        if (sub.type === 'checkBox') {
          return this.datosTemporales[sub.name] && this.datosTemporales[sub.name].length > 0
        }
        if (sub.type === 'tabla') {
          return this.datosTemporales[sub.name] && this.datosTemporales[sub.name].length > 0
        }
        if (sub.type === 'file') {
          // ✅ VALIDAR USANDO archivosSubformulario (fuente de verdad)
          const archivos = this.archivosSubformulario[sub.name] || []
          return archivos.length > 0
        }
        return (
          this.datosTemporales[sub.name] !== undefined &&
          this.datosTemporales[sub.name] !== null &&
          this.datosTemporales[sub.name] !== ''
        )
      })

      if (!esValido) {
        this.mostrarError('Complete todos los campos requeridos')
        return
      }

      // PREPARAR DATOS PARA GUARDAR - CON ARRAYS DE ARCHIVOS
      const datosParaGuardar = {}

      this.campo.subcampos.forEach((sub) => {
        if (sub.type === 'file') {
          // ✅ SIEMPRE usar archivosSubformulario, y clonar el array
          datosParaGuardar[sub.name] = [...(this.archivosSubformulario[sub.name] || [])]
        } else {
          // Para otros tipos de campos, copiar el valor directamente
          datosParaGuardar[sub.name] = this.datosTemporales[sub.name]
        }
      })

      // 🔥 AGREGAR ESTO: Actualizar archivosSubformulario del padre
      this.campo.subcampos.forEach((sub) => {
        if (sub.type === 'file' && this.archivosSubformulario[sub.name]) {
          const claveArchivo = `${this.campo.name}_${this.indiceEditando >= 0 ? this.indiceEditando : this.filas.length}_${sub.name}`
          this.$emit(
            'actualizar-archivos-subform',
            claveArchivo,
            this.archivosSubformulario[sub.name],
          )
        }
      })
      if (this.indiceEditando === -1) {
        // Agregar nueva fila
        this.filas.push(datosParaGuardar)
      } else {
        // Actualizar fila existente
        this.filas[this.indiceEditando] = datosParaGuardar
      }

      this.emitirActualizacion()
      this.cerrarModal()
    },

    inicializarDatosTemporales() {
      const datos = {}
      this.archivosSubformulario = {} // Limpiar archivos al inicializar

      this.campo.subcampos.forEach((sub) => {
        if (sub.type === 'subform') {
          datos[sub.name] = []
        } else if (sub.type === 'checkBox') {
          datos[sub.name] = []
        } else if (sub.type === 'tabla') {
          datos[sub.name] = []
        } else if (sub.type === 'file') {
          datos[sub.name] = [] // ARRAY VACÍO para múltiples archivos
        } else {
          datos[sub.name] = ''
        }
      })
      return datos
    },

    onCambioArchivo(event, nombreSubcampo) {
      const fileList = event.target.files
      if (fileList.length > 0) {
        // Convertir FileList a Array
        const newFiles = Array.from(fileList)

        // Inicializar el array si no existe
        if (!this.archivosSubformulario[nombreSubcampo]) {
          this.archivosSubformulario[nombreSubcampo] = []
        }

        // Agregar los nuevos archivos al array existente (ACUMULAR)
        this.archivosSubformulario[nombreSubcampo] = [
          ...this.archivosSubformulario[nombreSubcampo],
          ...newFiles,
        ]

        // Actualizar datos temporales con el array de archivos
        this.datosTemporales[nombreSubcampo] = this.archivosSubformulario[nombreSubcampo]

        // Forzar reset del input file para permitir seleccionar más archivos
        this.resetFileInput()
      }
    },

    resetFileInput() {
      // Incrementar la key para forzar el re-render del input
      this.fileInputKey += 1
    },

    triggerFileInput(nombreSubcampo) {
      const inputElement = document.getElementById(`subform_${this.campo.name}_${nombreSubcampo}`)
      if (inputElement) {
        inputElement.click()
      }
    },
    removeArchivoSubcampo(nombreSubcampo, index) {
      if (this.archivosSubformulario[nombreSubcampo]) {
        this.archivosSubformulario[nombreSubcampo].splice(index, 1)

        // Actualizar datos temporales
        this.datosTemporales[nombreSubcampo] = this.archivosSubformulario[nombreSubcampo]

        // Si no quedan archivos, limpiar el array
        if (this.archivosSubformulario[nombreSubcampo].length === 0) {
          delete this.archivosSubformulario[nombreSubcampo]
          this.datosTemporales[nombreSubcampo] = []
        }
      }
    },

    clearAllArchivosSubcampo(nombreSubcampo) {
      if (this.archivosSubformulario[nombreSubcampo]) {
        delete this.archivosSubformulario[nombreSubcampo]
      }
      this.datosTemporales[nombreSubcampo] = []
      this.resetFileInput()
    },

    isImageFile(file) {
      return file && file.type && file.type.startsWith('image/')
    },

    getThumbnailUrl(file) {
      return this.isImageFile(file) ? URL.createObjectURL(file) : null
    },

    actualizarSubcampoAnidado(nombreCampo, nuevoValor) {
      this.datosTemporales[nombreCampo] = nuevoValor
    },

    actualizarSubformularioAnidado(indiceFila, nombreCampo, nuevoValor) {
      this.filas[indiceFila][nombreCampo] = nuevoValor
      this.emitirActualizacion()
    },

    emitirActualizacion() {
      this.$emit('actualizar', this.filas)
    },

    mostrarError(mensaje) {
      // Puedes implementar tu propio sistema de notificaciones aquí
      alert(mensaje)
    },
  },
}
</script>

<style scoped>
/* Contenedor principal del subformulario */
.subform-container {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
}

/* Header del subformulario */
.subform-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.subform-header i {
  color: #6c757d;
}

/* Botón para agregar entrada */
.add-campo-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.add-campo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Tabla responsive */
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
}

.table th {
  background: #f8f9fa;
  border-color: #dee2e6;
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
  border-color: #dee2e6;
}

/* Fixed modal z-index and positioning issues for nested subforms */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: calc(1050 + var(--modal-level, 0) * 10);
}

/* Dynamic z-index based on nesting level */
.subform-container {
  --modal-level: 0;
}

.subform-container .subform-container {
  --modal-level: 1;
}

.subform-container .subform-container .subform-container {
  --modal-level: 2;
}

.subform-container .subform-container .subform-container .subform-container {
  --modal-level: 3;
}

/* Fixed modal dialog sizing and positioning */
.modal-dialog {
  margin: 1.75rem auto;
  max-width: 90%;
  width: 100%;
  pointer-events: none;
  position: relative;
}

.modal-xl {
  max-width: 1140px;
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
  pointer-events: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
}

/* Header del modal */
.medico-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 2rem;
  border-bottom: none;
  position: relative;
}

.modal-header-custom {
  padding: 2rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 1.5rem;
}

.header-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
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
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Body del modal */
.medico-body {
  padding: 2rem;
  background: white;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.modal-body-custom {
  padding: 2rem;
  background: white;
}

/* Sección de formulario */
.form-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #007bff;
}

/* Contenedor de campos */
.campo-container {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.campo-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.campo-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.campo-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
}

.campo-index {
  margin-left: 0.5rem;
}

.required-badge {
  background: #dc3545;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.campo-body {
  padding: 1.5rem;
}

/* Campos de formulario */
.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.modern-input {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modern-input:focus-within {
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transform: translateY(-1px);
}

.modern-input .input-group-text {
  background: #f8f9fa;
  border: none;
  color: #6c757d;
}

.modern-input .form-control,
.modern-input .form-select {
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  box-shadow: none;
  border-color: transparent;
}

/* Información de archivo */
.file-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
}

.current-file {
  display: flex;
  align-items: center;
  color: #495057;
  font-size: 0.9rem;
}

.current-file i {
  color: #007bff;
}

/* Footer del modal */
.medico-footer {
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-cancel:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* Alertas */
.alert {
  border-radius: 8px;
  border: none;
}

.alert-info {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  color: #0c5460;
}

/* Responsive design fixes for mobile */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-header-custom {
    padding: 1.5rem;
  }

  .modal-body-custom {
    padding: 1.5rem;
  }

  .medico-header {
    padding: 1.5rem;
  }

  .medico-body {
    padding: 1.5rem;
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

  .campo-container {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .modal-header-custom {
    padding: 1rem;
  }

  .modal-body-custom {
    padding: 1rem;
  }
}

/* Prevent modal backdrop from interfering with nested modals */
.modal-backdrop {
  z-index: calc(1040 + var(--modal-level, 0) * 10);
}

/* Estilos para la tabla con paginación y búsqueda */
.sticky-top {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.075);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Mejoras para la paginación */
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6c757d;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .modal-dialog.modal-xl {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }

  .medico-body.modal-body-custom {
    padding: 1rem;
  }

  .table-responsive {
    font-size: 0.8rem;
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
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

.file-item {
  position: relative;
  width: 120px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.file-thumbnail {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.file-thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.file-icon {
  font-size: 2rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.file-name {
  font-size: 0.75rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.delete-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  position: absolute;
  top: -8px;
  right: -8px;
}

.delete-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}
</style>
