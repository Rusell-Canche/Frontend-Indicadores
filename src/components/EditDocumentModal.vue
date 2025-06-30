<template>
  <!-- Modal de edición -->
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editar Documento</h5>
          <button type="button" class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitEdit">
            <!-- Iterar sobre TODOS los campos del documento -->
            <div v-for="campo in camposDocumentoEdit" :key="campo" class="form-group mb-4">
              <!-- Obtener información del campo desde la plantilla -->
              <template v-if="getCampoPlantilla(campo)">
                <!-- CAMPO DE TIPO SUBFORM -->
                <div v-if="getCampoPlantilla(campo).type === 'subform'" class="subform-section">
                  <label class="form-label">
                    <i class="fas fa-table me-2"></i>
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  
                  <div class="subform-container">
                    <div class="subform-header">
                      <i class="fas fa-indent me-2"></i>
                      <span>Subformulario para {{ getCampoPlantilla(campo).alias || campo }}</span>
                    </div>

                    <button 
                      type="button" 
                      @click="openEditSubformModal(getCampoPlantilla(campo))" 
                      class="add-campo-button mb-3"
                    >
                      <i class="fas fa-plus me-2"></i> Agregar entrada
                    </button>

                    <!-- Tabla para mostrar entradas del subformulario -->
                    <div class="table-responsive" v-if="getSubformDataForEdit(campo).length > 0">
                      <table class="table table-bordered table-hover">
                        <thead class="table-light">
                          <tr>
                            <th v-for="subcampo in getCampoPlantilla(campo).subcampos" :key="subcampo.name">
                              {{ subcampo.alias || subcampo.name }}
                            </th>
                            <th class="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, rowIndex) in getSubformDataForEdit(campo)" :key="rowIndex">
                            <td v-for="subcampo in getCampoPlantilla(campo).subcampos" :key="subcampo.name">
                              <template v-if="subcampo.type === 'file'">
                                {{ row[subcampo.name] || 'Sin archivo' }}
                              </template>
                              <template v-else>
                                {{ row[subcampo.name] || '-' }}
                              </template>
                            </td>
                            <td class="text-center">
                              <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary me-2"
                                @click="openEditSubformModal(getCampoPlantilla(campo), rowIndex)"
                              >
                                <i class="fas fa-edit"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                @click="removeSubformRowFromEdit(campo, rowIndex)"
                              >
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div v-else class="text-muted text-center py-3">
                      No hay entradas en este subformulario
                    </div>
                  </div>
                </div>

                <!-- CAMPO DE TIPO SELECT -->
                <div v-else-if="getCampoPlantilla(campo).type === 'select'" class="form-field">
                  <label class="form-label">
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-list-ul"></i>
                    </span>
                    <select class="form-select" v-model="documentoEdit[campo]">
                      <option value="">Seleccione una opción</option>
                      <option 
                        v-for="(option, index) in getCampoPlantilla(campo).options" 
                        :key="index" 
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- CAMPO DE TIPO FILE -->
                <div v-else-if="getCampoPlantilla(campo).type === 'file'" class="form-field">
                  <label class="form-label">
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-paperclip"></i>
                    </span>
                    <input
                      type="file"
                      class="form-control"
                      multiple
                      @change="handleFileUpload"
                      accept="image/*,video/*,audio/*,.pdf"
                    />
                  </div>

                  <!-- Vista previa de archivos -->
                  <div
                    v-if="documentoEdit[campo] && documentoEdit[campo].length"
                    class="file-preview mt-3"
                  >
                    <h6 class="preview-title">Archivos actuales:</h6>
                    <div class="file-preview-grid">
                      <div
                        v-for="(file, index) in documentoEdit[campo]"
                        :key="index"
                        class="file-preview-item"
                      >
                        <div class="file-preview-content">
                          <div class="file-preview-icon">
                            <i v-if="isImage(file)" class="fas fa-image"></i>
                            <i v-else-if="isVideo(file)" class="fas fa-video"></i>
                            <i v-else-if="isAudio(file)" class="fas fa-volume-up"></i>
                            <i v-else-if="isPDF(file)" class="fas fa-file-pdf"></i>
                            <i v-else class="fas fa-file"></i>
                          </div>
                          <span class="file-preview-name">{{ file }}</span>
                        </div>
                        <button type="button" @click="removeFile(index)" class="remove-file-button">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- CAMPO DE TIPO NUMBER -->
                <div v-else-if="getCampoPlantilla(campo).type === 'number'" class="form-field">
                  <label class="form-label">
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-hashtag"></i>
                    </span>
                    <input
                      type="number"
                      class="form-control"
                      v-model="documentoEdit[campo]"
                      :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                    />
                  </div>
                </div>

                <!-- CAMPO DE TIPO DATE -->
                <div v-else-if="getCampoPlantilla(campo).type === 'date'" class="form-field">
                  <label class="form-label">
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-calendar-alt"></i>
                    </span>
                    <input type="date" class="form-control" v-model="documentoEdit[campo]" />
                  </div>
                </div>

                <!-- CAMPO DE TIPO TEXT (por defecto) -->
                <div v-else class="form-field">
                  <label class="form-label">
                    {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                    <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-font"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="documentoEdit[campo]"
                      :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                    />
                  </div>
                </div>
              </template>

              <!-- Si no se encuentra en la plantilla, mostrar campo básico -->
              <template v-else>
                <label class="form-label">
                  {{ formatFieldName(campo) }}
                </label>
                
                <!-- Recurso Digital (campo especial heredado) -->
                <div v-if="campo === 'Recurso Digital'" class="file-upload-section">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-paperclip"></i>
                    </span>
                    <input
                      type="file"
                      class="form-control"
                      multiple
                      @change="handleFileUpload"
                      accept="image/*,video/*,audio/*,.pdf"
                    />
                  </div>

                  <!-- Vista previa de archivos -->
                  <div
                    v-if="documentoEdit[campo] && documentoEdit[campo].length"
                    class="file-preview mt-3"
                  >
                    <h6 class="preview-title">Archivos actuales:</h6>
                    <div class="file-preview-grid">
                      <div
                        v-for="(file, index) in documentoEdit[campo]"
                        :key="index"
                        class="file-preview-item"
                      >
                        <div class="file-preview-content">
                          <div class="file-preview-icon">
                            <i v-if="isImage(file)" class="fas fa-image"></i>
                            <i v-else-if="isVideo(file)" class="fas fa-video"></i>
                            <i v-else-if="isAudio(file)" class="fas fa-volume-up"></i>
                            <i v-else-if="isPDF(file)" class="fas fa-file-pdf"></i>
                            <i v-else class="fas fa-file"></i>
                          </div>
                          <span class="file-preview-name">{{ file }}</span>
                        </div>
                        <button type="button" @click="removeFile(index)" class="remove-file-button">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Campo de fecha (detección automática) -->
                <div v-else-if="campo === 'Fecha' || campo.toLowerCase().includes('fecha')" class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                  <input type="date" class="form-control" v-model="documentoEdit[campo]" />
                </div>

                <!-- Campo de texto largo (detección automática) -->
                <div v-else-if="campo.toLowerCase().includes('descripcion') || campo.toLowerCase().includes('comentario') || campo.toLowerCase().includes('observacion')" class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-align-left"></i>
                  </span>
                  <textarea
                    class="form-control"
                    v-model="documentoEdit[campo]"
                    :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                    rows="3"
                  ></textarea>
                </div>

                <!-- Otros campos de texto -->
                <div v-else class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-font"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="documentoEdit[campo]"
                    :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                  />
                </div>
              </template>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-cancel">
                <i class="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button type="submit" class="btn btn-save" :disabled="loading">
                <i class="fas fa-check me-2"></i>
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para editar subformulario -->
  <SubformEditModal
    :show="showEditSubformModal"
    :subform-field="currentEditSubformField"
    :subform-data="currentEditSubformData"
    :editing-index="editingSubformIndex"
    @close="closeEditSubformModal"
    @save="saveEditSubformEntry"
    @file-change="onEditModalFileChange"
  />
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import SubformEditModal from './SubformEditModal.vue'

export default {
  name: 'EditDocumentModal',
  
  components: {
    SubformEditModal
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    documento: {
      type: Object,
      default: () => ({})
    },
    camposPlantilla: {
      type: Array,
      default: () => []
    },
    selectedColeccion: {
      type: Object,
      default: null
    }
  },

  emits: ['close', 'save', 'success', 'error'],

  data() {
    return {
      // Datos del documento
      documentoEdit: {},
      camposDocumentoEdit: [],
      uploadedFiles: [],
      
      // Estados de carga
      loading: false,
      
      // Subformularios
      showEditSubformModal: false,
      currentEditSubformField: null,
      currentEditSubformData: {},
      editingSubformIndex: -1,
      editSubformData: {},
      editSubformFiles: {}
    }
  },

  watch: {
    documento: {
      handler(newDoc) {
        if (newDoc && Object.keys(newDoc).length > 0) {
          this.initializeEditData(newDoc)
        }
      },
      immediate: true,
      deep: true
    },

    isOpen(newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },

  methods: {
    // ========== INICIALIZACIÓN ==========
initializeEditData(documento) {
  const todosCampos = Object.keys(documento).filter(campo => campo !== '_id')
  
  this.documentoEdit = todosCampos.reduce((acc, campo) => {
    if (campo === 'Recurso Digital') {
      if (documento[campo] && documento[campo].length > 0) {
        acc[campo] = documento[campo]
      }
      // Si no existe o está vacío, no se agrega el campo
    } else {
      acc[campo] = documento[campo] || ''
    }
    return acc
  }, {})
  
  if (documento._id) this.documentoEdit._id = documento._id
  
  this.camposDocumentoEdit = todosCampos
  this.prepareSubformDataForEdit()
},


    resetData() {
      this.documentoEdit = {}
      this.camposDocumentoEdit = []
      this.editSubformData = {}
      this.editSubformFiles = {}
      this.uploadedFiles = []
      this.closeEditSubformModal()
    },

    // ========== CAMPO HELPERS ==========
    getCampoPlantilla(nombreCampo) {
      return this.camposPlantilla.find(campo => campo.name === nombreCampo) || null
    },

    formatFieldName(fieldName) {
      const fieldMap = {
        created_at: 'Fecha de creación',
        updated_at: 'Última actualización'
      }
      
      return fieldMap[fieldName] || 
        fieldName.replace(/_/g, ' ')
                 .replace(/\w\S*/g, word => 
                   word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
                 )
    },

    // ========== MODAL CONTROL ==========
    closeModal() {
      this.$emit('close')
    },

    // ========== SUBFORMULARIOS ==========
    prepareSubformDataForEdit() {
      this.editSubformData = {}
      this.editSubformFiles = {}
      
      this.camposPlantilla
        .filter(campo => campo.type === 'subform')
        .forEach(campo => {
          const fieldName = campo.name
          this.editSubformData[fieldName] = []
          this.editSubformFiles[fieldName] = []
          
          let subformData = this.documentoEdit[fieldName]
          
          if (typeof subformData === 'string') {
            try {
              subformData = JSON.parse(subformData)
            } catch (e) {
              subformData = []
            }
          }
          
          if (Array.isArray(subformData)) {
            subformData.forEach((row, index) => {
              const { datos, archivos } = this.separarDatosYArchivos(row, campo)
              this.editSubformData[fieldName].push(datos)
              this.editSubformFiles[fieldName].push(archivos)
            })
          }
        })
    },

    separarDatosYArchivos(row, campo) {
      const datos = {}
      const archivos = {}
      
      Object.keys(row).forEach(key => {
        const subcampo = campo.subcampos.find(sub => sub.name === key)
        if (subcampo?.type === 'file') {
          archivos[key] = row[key]
        } else {
          datos[key] = row[key]
        }
      })
      
      return { datos, archivos }
    },

    getSubformDataForEdit(fieldName) {
      if (!this.editSubformData[fieldName]) return []
      
      return this.editSubformData[fieldName].map((row, index) => {
        const combinedRow = { ...row }
        
        const fileData = this.editSubformFiles[fieldName]?.[index]
        if (fileData) {
          Object.keys(fileData).forEach(key => {
            if (fileData[key]) {
              combinedRow[key] = typeof fileData[key] === 'object' 
                ? fileData[key].name 
                : fileData[key]
            }
          })
        }
        
        return combinedRow
      })
    },

    openEditSubformModal(campo, rowIndex = -1) {
      this.currentEditSubformField = campo
      this.editingSubformIndex = rowIndex
      
      const emptyData = campo.subcampos.reduce((acc, sub) => {
        acc[sub.name] = sub.type === 'file' ? null : ''
        return acc
      }, {})
      
      if (rowIndex === -1) {
        this.currentEditSubformData = { ...emptyData }
      } else {
        const baseData = this.editSubformData[campo.name][rowIndex] || {}
        this.currentEditSubformData = { ...emptyData, ...baseData }
        
        const fileData = this.editSubformFiles[campo.name]?.[rowIndex]
        if (fileData) {
          Object.assign(this.currentEditSubformData, fileData)
        }
      }
      
      this.showEditSubformModal = true
    },

    closeEditSubformModal() {
      this.showEditSubformModal = false
      this.currentEditSubformField = null
      this.currentEditSubformData = {}
      this.editingSubformIndex = -1
    },
// ========== SUBFORMULARIOS - MÉTODO CORREGIDO ==========
saveEditSubformEntry(nuevosDatos) {
  console.log('🔵 saveEditSubformEntry llamado con:', nuevosDatos)
  
  const fieldName = this.currentEditSubformField?.name
  if (!fieldName) {
    console.error('❌ No hay campo de subformulario actual')
    return
  }

  console.log('🔵 Campo actual:', fieldName)
  console.log('🔵 Índice de edición:', this.editingSubformIndex)

  this.inicializarArraysSubform(fieldName)

  // Separar archivos y datos simples
  const { datos, archivos } = this.separarDatosYArchivos(nuevosDatos, this.currentEditSubformField)
  console.log('🔵 Datos separados:', { datos, archivos })

  if (this.editingSubformIndex === -1) {
    // Agregar nueva entrada
    this.editSubformData[fieldName].push(datos)
    this.editSubformFiles[fieldName].push(archivos)
    console.log('➕ Nueva entrada agregada')
  } else {
    // Actualizar entrada existente
    this.editSubformData[fieldName][this.editingSubformIndex] = datos
    this.editSubformFiles[fieldName][this.editingSubformIndex] = {
      ...this.editSubformFiles[fieldName][this.editingSubformIndex],
      ...archivos
    }
    console.log('✏️ Entrada existente actualizada')
  }

  // 🔁 ACTUALIZAR documentoEdit - ESTO ES CRÍTICO
  this.documentoEdit[fieldName] = this.combinarSubformData(fieldName)
  console.log('🔵 documentoEdit actualizado para', fieldName, ':', this.documentoEdit[fieldName])

  // ✅ Forzar reactividad de Vue
  this.$forceUpdate()

  this.closeEditSubformModal()
},

// ========== MÉTODO AUXILIAR MEJORADO ==========
combinarSubformData(fieldName) {
  console.log('🔵 Combinando datos para:', fieldName)
  console.log('🔵 editSubformData:', this.editSubformData[fieldName])
  console.log('🔵 editSubformFiles:', this.editSubformFiles[fieldName])
  
  if (!this.editSubformData[fieldName]) return []
  
  const resultado = this.editSubformData[fieldName].map((row, index) => {
    const rowCompleta = { ...row }
    const fileData = this.editSubformFiles[fieldName]?.[index]
    if (fileData) {
      Object.assign(rowCompleta, fileData)
    }
    return rowCompleta
  })
  
  console.log('🔵 Resultado combinado:', resultado)
  return resultado
},

    validarSubformulario() {
      const isValid = this.currentEditSubformField.subcampos.every(sub => {
        if (!sub.required) return true
        
        const value = this.currentEditSubformData[sub.name]
        
        if (sub.type === 'select') {
          return value !== '' && value !== null && value !== undefined
        }
        
        if (sub.type === 'file') {
          return !!value
        }
        
        return value !== null && value !== undefined && value !== ''
      })
      
      if (!isValid) {
        this.showError('Complete los campos requeridos')
      }
      
      return isValid
    },

    inicializarArraysSubform(fieldName) {
      if (!this.editSubformData[fieldName]) {
        this.editSubformData[fieldName] = []
      }
      if (!this.editSubformFiles[fieldName]) {
        this.editSubformFiles[fieldName] = []
      }
    },

    removeSubformRowFromEdit(fieldName, rowIndex) {
      this.editSubformData[fieldName]?.splice(rowIndex, 1)
      this.editSubformFiles[fieldName]?.splice(rowIndex, 1)
    },

    onEditModalFileChange(event, subcampoName) {
      const file = event.target.files[0]
      if (file) {
        this.currentEditSubformData[subcampoName] = file
      }
    },

    // ========== ARCHIVOS ==========
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files)
      
      // Agregar archivos nuevos al documento
      if (!this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'] = []
      }
      
      this.uploadedFiles.forEach(file => {
        this.documentoEdit['Recurso Digital'].push(file)
      })
      
      // Limpiar el input
      event.target.value = ''
    },

    removeFile(index) {
      if (this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'].splice(index, 1)
      }
    },

    // File type checkers
    isImage: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(jpeg|jpg|png|gif)$/i.test(fileName)
    },
    
    isVideo: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(mp4|mov|avi)$/i.test(fileName)
    },
    
    isAudio: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(mp3|wav|ogg)$/i.test(fileName)
    },
    
    isPDF: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.pdf$/i.test(fileName)
    },

    getFileName(file) {
      if (typeof file === 'string') return file
      if (file?.name) return file.name
      return 'Archivo'
    },

    // ========== SUBMIT ==========
    async submitEdit() {
      if (this.loading) return
      
      this.loading = true
      try {
        const formData = this.prepararFormData()

        // 👇 Agrega esto para ver qué contiene el formData
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ':', pair[1])
    }

        this.$emit('save', formData)
      } catch (error) {
        console.error('Error preparando datos:', error)
        this.showError('Error al preparar los datos del documento')
      } finally {
        this.loading = false
      }
    },

    prepararFormData() {
      const documentoParaActualizar = { ...this.documentoEdit }
      
      // Procesar subformularios
      this.camposPlantilla
        .filter(campo => campo.type === 'subform')
        .forEach(campo => {
          if (this.editSubformData[campo.name]) {
            documentoParaActualizar[campo.name] = this.combinarSubformData(campo.name)
          }
        })
      
      const formData = new FormData()
      
      Object.keys(documentoParaActualizar).forEach(campo => {
        this.agregarCampoAFormData(formData, campo, documentoParaActualizar[campo])
      })
      
      return formData
    },



    agregarCampoAFormData(formData, campo, valor) {
      if (campo === '_id') return
      
      if (campo === 'Recurso Digital') {
        this.procesarArchivosRecurso(formData, valor)
      } else {
        const campoInfo = this.getCampoPlantilla(campo)
        
        if (campoInfo?.type === 'subform') {
          this.procesarSubformularioDentroDeDocumentData(formData, campo, valor)

        } else if (campoInfo?.type === 'file' && valor instanceof File) {
          formData.append(campo, valor)
        } else if (valor !== null && valor !== undefined) {
          const valorFinal = typeof valor === 'object' ? JSON.stringify(valor) : valor
          formData.append(`document_data[${campo}]`, valorFinal)
        }
      }
    },

    procesarArchivosRecurso(formData, archivos) {
      if (Array.isArray(archivos)) {
        archivos.forEach((archivo, index) => {
          if (archivo instanceof File) {
            formData.append(`Recurso Digital[${index}]`, archivo)
          } else {
            formData.append('existing_files[]', archivo)
          }
        })
      }
    },

procesarSubformularioDentroDeDocumentData(formData, campo, valor) {
  if (Array.isArray(valor)) {
    valor.forEach((row, rowIndex) => {
      Object.keys(row).forEach(subcampo => {
        const subvalor = row[subcampo]
        
        const clave = `document_data[${campo}][${rowIndex}][${subcampo}]`

        if (subvalor instanceof File) {
          formData.append(clave, subvalor)
        } else if (subvalor !== null && subvalor !== undefined) {
          formData.append(clave, subvalor)
        }
      })
    })
  }
}
,

    // ========== UI HELPERS ==========
    showSuccess(message) {
      Swal.fire({
        title: 'Éxito',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d'
      })
    },
    
    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d'
      })
    }
  }
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
</style>
