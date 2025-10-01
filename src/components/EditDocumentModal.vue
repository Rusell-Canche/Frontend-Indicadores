<template>
  <!-- Modal de edición -->
  <div v-if="isOpen" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-xl">
      <div class="modal-content modern-modal">
        <!-- Header del modal -->
        <div class="medico-header modal-header-custom">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-edit"></i>
            </div>
            <div class="header-title-section">
              <h3>Editar Documento</h3>
              <p class="header-subtitle">Modifica la información del documento</p>
            </div>
          </div>
          <button type="button" @click="closeModal" class="close-button" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body del modal -->
        <div class="medico-body modal-body-custom">
          <!-- Nota informativa -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>
            Modifica los campos del documento según tus necesidades
          </div>

          <!-- Sección para los campos del documento -->
          <form @submit.prevent="submitEdit">
            <!-- Renderizar por secciones si existen -->
            <div v-if="seccionesPlantilla.length > 0">
              <div
                v-for="(seccion, seccionIndex) in seccionesPlantilla"
                :key="seccionIndex"
                class="seccion-container mb-4"
              >
                <div class="seccion-header">
                  <div class="seccion-header-content">
                    <div class="seccion-title-wrapper">
                      <div class="seccion-icon">
                        <i class="fas fa-folder-open"></i>
                      </div>
                      <div class="seccion-info">
                        <h5 class="seccion-title">
                          {{ seccion.nombre || 'Sección ' + (seccionIndex + 1) }}
                        </h5>
                        <span class="seccion-description">Complete los campos de esta sección</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="seccion-body">
                  <div v-for="(campo, campoIndex) in seccion.fields" :key="campo.name">
                    <div v-if="campo.name !== '_id'" class="form-section">
                      <h6 class="section-title">
                        <i class="fas fa-edit me-2"></i>
                        {{ campo.alias || campo.name }}
                        <span v-if="campo.required" class="text-danger">*</span>
                      </h6>

                      <!-- CAMPO DE TIPO SUBFORM -->
                      <!-- CAMPO DE TIPO SUBFORM -->
<SubFormularioDocumento
  v-if="campo.type === 'subform'"
  :campo="campo"
  :valor="getSubformDataForEdit(campo.name)"
  @actualizar="actualizarSubformulario($event, campo.name)"
/>


                    <!-- Campo de tipo checkbox (CORREGIDO) -->
                    <div v-else-if="campo.type === 'checkBox'" class="form-field">
                      <label class="form-label d-block mb-3">
                        <i class="fas fa-check-square me-2"></i>
                        {{ campo.alias || campo.name }}
                        <span v-if="campo.required" class="text-danger">*</span>
                      </label>
                      <div class="checkbox-container d-block">
                        <div class="form-check mb-2" v-for="(option, index) in campo.options" :key="index">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="campo.name + '_' + index"
                            :value="getSaveValue(option, campo)"
                            v-model="documentoEdit[campo.name]"

                          />
                          <label class="form-check-label" :for="campo.name + '_' + index">
                            {{ getDisplayValue(option, campo) }}
                          </label>
                        </div>
                      </div>
                      <small class="form-text text-muted mt-2">
                        Seleccione una o más opciones
                      </small>
                    </div>



                      <!-- CAMPO DE TIPO SELECT -->
                      <div v-else-if="campo.type === 'select'" class="mt-2">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-list-ul"></i>
                          </span>
                          <select
                            class="form-select"
                            v-model="documentoEdit[campo.name]"
                            :required="campo.required"
                          >
                           <option
  v-for="(option, index) in campo.options"
  :key="index"
  :value="isManualSelect(campo) ? option : option.campoGuardar"
>
  {{ isManualSelect(campo) ? option : option.campoMostrar }}
</option>

                          </select>
                        </div>
                      </div>

                      <!-- CAMPO DE TIPO FILE -->
                      <div v-else-if="campo.type === 'file'" class="mt-2">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-paperclip"></i>
                          </span>
                          <input
                            type="file"
                            class="form-control"
                            multiple
                            @change="handleFileUpload($event, campo.name)"
                            accept="image/*,video/*,audio/*,.pdf"
                          />
                        </div>
                        <!-- Vista previa de archivos -->
                        <div
                          v-if="documentoEdit[campo.name] && documentoEdit[campo.name].length"
                          class="file-preview mt-3"
                        >
                          <h6 class="preview-title">Archivos actuales:</h6>
                          <div class="d-flex flex-wrap gap-3">
                            <div
                              class="file-item"
                              v-for="(file, index) in documentoEdit[campo.name]"
                              :key="index"
                            >
                              <div class="file-content">
                                <div v-if="isImage(file)" class="file-thumbnail">
                                  <img
                                    :src="getThumbnailUrl(file)"
                                    alt="Miniatura"
                                    class="img-fluid"
                                  />
                                </div>
                                <div v-else class="file-icon">
                                  <i class="fas fa-file-alt"></i>
                                </div>
                                <span class="file-name">{{ file.name }}</span>
                              </div>
                              <button
                                type="button"
                                class="delete-button"
                                @click="removeFile(index)"
                              >
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- CAMPO DE TIPO NUMBER -->
                      <div v-else-if="campo.type === 'number'" class="mt-2">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-hashtag"></i>
                          </span>
                          <input
                            v-solo-numeros
                            type="number"
                            class="form-control"
                            v-model="documentoEdit[campo.name]"
                            :required="campo.required"
                            placeholder="Ingrese un valor numérico"
                          />
                        </div>
                      </div>

                      <!-- CAMPO DE TIPO DATE -->
                      <div v-else-if="campo.type === 'date'" class="mt-2">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-calendar-alt"></i>
                          </span>
                          <input
                            type="date"
                            class="form-control"
                            v-model="documentoEdit[campo.name]"
                            :required="campo.required"
                          />
                        </div>
                      </div>

                      <!-- CAMPO DE TIPO TEXT -->
                      <div v-else class="mt-2">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-font"></i>
                          </span>
                          <input
                            v-solo-texto
                            type="text"
                            class="form-control"
                            v-model="documentoEdit[campo.name]"
                            :required="campo.required"
                            placeholder="Ingrese texto"
                          />
                        </div>
                      </div>

                      <!-- Mensaje de requerido u opcional -->
                      <div class="d-flex">
                        <div class="form-text mt-1 me-4">
                          <small v-if="campo.required" class="text-danger">Campo obligatorio</small>
                          <small v-else class="text-muted">Campo opcional</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Si no hay secciones, iterar directamente sobre camposDocumentoEdit -->
            <div v-else>
              <div
                v-for="(campoName, idx) in camposDocumentoEdit"
                :key="idx"
                class="form-section"
              >
                <h6 class="section-title">
                  <i class="fas fa-edit me-2"></i>
                  {{ getCampoPlantilla(campoName)?.alias || formatFieldName(campoName) }}
                  <span v-if="getCampoPlantilla(campoName)?.required" class="text-danger">*</span>
                </h6>

                <!-- Lógica similar a arriba, usando `getCampoPlantilla(campoName)` -->
                <!-- Aquí puedes reutilizar bloques similares a los anteriores -->
              </div>
            </div>

            <!-- Footer con botones -->
            <div class="medico-footer">
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

  
</template>


<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import SubFormularioDocumento from './SubFormularioDocumento.vue'

export default {
  name: 'EditDocumentModal',

  components: {
    SubFormularioDocumento
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
      type: Object,
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

  computed: {
    seccionesPlantilla() {
      return this.camposPlantilla?.secciones ?? []
    }
  },

  methods: {

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

    // ========== INICIALIZACIÓN ==========
   // 4. Corregir el método initializeEditData para manejar mejor los subformularios
initializeEditData(documento) {
  console.log('🔄 Inicializando datos de edición:', documento)
  console.log('📋 Plantilla:', this.camposPlantilla)

  this.documentoEdit = {}
  if (documento._id) this.documentoEdit._id = documento._id

  // Obtener campos planos
  let campos = []
  if (this.camposPlantilla && Array.isArray(this.camposPlantilla.secciones)) {
    this.camposPlantilla.secciones.forEach((seccion) => {
      if (Array.isArray(seccion.fields)) {
        campos.push(...seccion.fields)
      }
    })
  }

  // Inicializar campos normales
  campos
    .filter((campo) => campo.type !== 'subform')
    .forEach((campo) => {
      const nombreCampo = campo.name
      let valorCampo = this.extraerValorCampoDelDocumento(documento, nombreCampo)
      
      this.documentoEdit[nombreCampo] = valorCampo ?? ''

          // ✅ Manejo especial para checkBox
    if (campo.type === 'checkBox') {
      if (typeof valorCampo === 'string') {
        try {
          valorCampo = JSON.parse(valorCampo)
        } catch {
          valorCampo = []
        }
      }
      if (!Array.isArray(valorCampo)) {
        valorCampo = []
      }
      this.documentoEdit[nombreCampo] = [...valorCampo]
      return
    }
      
      // Manejar selects especiales
      if (campo.type === 'select' && !this.isManualSelect(campo)) {
        const option = campo.options?.find(o => o.campoGuardar === valorCampo)
        if (option) {
          this.documentoEdit[nombreCampo] = option.campoGuardar
        }
      }
    })


  // Inicializar subformularios
  campos
    .filter((campo) => campo.type === 'subform')
    .forEach((campo) => {
      const nombreCampo = campo.name
      let valorSubform = this.extraerValorCampoDelDocumento(documento, nombreCampo)
      
      // Parsear si es string JSON
      if (typeof valorSubform === 'string') {
        try {
          valorSubform = JSON.parse(valorSubform)
        } catch (e) {
          console.warn('⚠️ Error parseando subformulario:', valorSubform)
          valorSubform = []
        }
      }
      
      // Asegurar que sea array
      if (!Array.isArray(valorSubform)) {
        valorSubform = []
      }
      
      this.documentoEdit[nombreCampo] = [...valorSubform]
    })

  this.camposDocumentoEdit = campos.map((campo) => campo.name)
  this.prepareSubformDataForEdit()
},
    isManualSelect(campo) {
      if (!campo.options || !Array.isArray(campo.options) || campo.options.length === 0) {
        return true
      }

      const firstOption = campo.options[0]

      if (typeof firstOption === 'string') {
        return true
      }

      if (
        typeof firstOption === 'object' &&
        firstOption.hasOwnProperty('campoMostrar') &&
        firstOption.hasOwnProperty('campoGuardar')
      ) {
        return false
      }

      return true
    },

    resetData() {
      this.documentoEdit = {}
      this.camposDocumentoEdit = []
      this.editSubformData = {}
      this.editSubformFiles = {}
      this.uploadedFiles = []
    },

    getCampoPlantilla(nombreCampo) {
      if (!this.camposPlantilla || !Array.isArray(this.camposPlantilla.secciones)) return null

      for (const seccion of this.camposPlantilla.secciones) {
        if (Array.isArray(seccion.fields)) {
          const campo = seccion.fields.find(campo => campo.name === nombreCampo)
          if (campo) return campo
        } else if (typeof seccion.fields === 'object') {
          for (const key in seccion.fields) {
            if (key === nombreCampo) {
              return { name: key, ...seccion.fields[key] }
            }
          }
        }
      }

      return null
    },

    // ========== MODAL CONTROL ==========
    closeModal() {
      this.$emit('close')
    },

    // ========== SUBFORMULARIOS ==========
    prepareSubformDataForEdit() {
      this.editSubformData = {}
      this.editSubformFiles = {}

      let campos = []

      if (
        this.camposPlantilla &&
        Array.isArray(this.camposPlantilla.secciones)
      ) {
        this.camposPlantilla.secciones.forEach((seccion) => {
          if (Array.isArray(seccion.fields)) {
            seccion.fields.forEach((campo) => {
              campos.push(campo)
            })
          } else if (typeof seccion.fields === 'object') {
            Object.entries(seccion.fields).forEach(([key, value]) => {
              campos.push({ name: key, ...value })
            })
          }
        })
      } else {
        console.warn('⚠️ camposPlantilla.secciones no es un arreglo válido')
      }

      const camposSubform = campos.filter(campo => campo.type === 'subform')

      camposSubform.forEach(campo => {
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
// 5. Método helper para extraer valores de campos del documento
extraerValorCampoDelDocumento(documento, nombreCampo) {
  // Buscar en las secciones del documento
  if (Array.isArray(documento.secciones)) {
    for (const seccion of documento.secciones) {
      if (seccion.fields && typeof seccion.fields === 'object') {
        if (nombreCampo in seccion.fields) {
          return seccion.fields[nombreCampo]
        }
      }
    }
  }
  
  // Buscar en el nivel raíz del documento
  if (documento[nombreCampo] !== undefined) {
    return documento[nombreCampo]
  }
  
  return null
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
    

// ========== MÉTODOS FALTANTES PARA EditDocumentModal.vue ==========

// 1. Agregar el método actualizarSubformulario que falta
actualizarSubformulario(nuevosValores, nombreCampo) {
  console.log('📝 Actualizando subformulario:', nombreCampo, nuevosValores)
  
  // Asegurar que nuevosValores sea un array
  const valoresArray = Array.isArray(nuevosValores) ? nuevosValores : []
  
  // Actualizar el valor en documentoEdit
  this.documentoEdit[nombreCampo] = [...valoresArray]
  
  // También actualizar en editSubformData para mantener consistencia
  if (this.editSubformData[nombreCampo] !== undefined) {
    this.editSubformData[nombreCampo] = valoresArray.map(row => {
      const campo = this.getCampoPlantilla(nombreCampo)
      if (campo && campo.subcampos) {
        const { datos } = this.separarDatosYArchivos(row, campo)
        return datos
      }
      return row
    })
  }
  
  console.log('✅ Subformulario actualizado en documentoEdit:', this.documentoEdit[nombreCampo])
},

// 2. Mejorar el método getSubformDataForEdit para evitar problemas de tipo
getSubformDataForEdit(fieldName) {
  console.log(`🔍 Obteniendo datos de subformulario para: ${fieldName}`)
  
  let valor = this.documentoEdit[fieldName]
  console.log(`📋 Valor actual:`, valor, typeof valor)
  
  // Si es string, intentar parsearlo
  if (typeof valor === 'string') {
    try {
      valor = JSON.parse(valor)
    } catch (e) {
      console.warn('⚠️ Error parseando subformulario como JSON:', valor)
      valor = []
    }
  }
  
  // Asegurar que sea array
  if (Array.isArray(valor)) {
    console.log(`✅ Retornando array con ${valor.length} elementos`)
    return valor
  }
  
  // Fallback: intentar usar editSubformData
  if (this.editSubformData[fieldName] && Array.isArray(this.editSubformData[fieldName])) {
    console.log(`🔄 Usando datos de editSubformData`)
    return this.editSubformData[fieldName]
  }
  
  console.log(`📭 Retornando array vacío para ${fieldName}`)
  return []
},

    // ========== ARCHIVOS ==========
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files)

      if (!this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'] = []
      }

      this.uploadedFiles.forEach(file => {
        this.documentoEdit['Recurso Digital'].push(file)
      })

      event.target.value = ''
    },

    removeFile(index) {
      if (this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'].splice(index, 1)
      }
    },

    // File type checkers
    isImage: (file) => /\.(jpeg|jpg|png|gif)$/i.test(typeof file === 'string' ? file : file?.name || ''),
    isVideo: (file) => /\.(mp4|mov|avi)$/i.test(typeof file === 'string' ? file : file?.name || ''),
    isAudio: (file) => /\.(mp3|wav|ogg)$/i.test(typeof file === 'string' ? file : file?.name || ''),
    isPDF: (file) => /\.pdf$/i.test(typeof file === 'string' ? file : file?.name || ''),

    getFileName(file) {
      if (typeof file === 'string') return file
      if (file?.name) return file.name
      return 'Archivo'
    },

    // ========== SUBMIT ==========
async submitEdit() {
  if (this.loading) return

  // Validar que los subformularios tengan datos válidos
  const camposSubform = this.seccionesPlantilla
    .flatMap(s => s.fields || [])
    .filter(c => c.type === 'subform')
  
  for (const campo of camposSubform) {
    const valor = this.documentoEdit[campo.name]
    if (valor && Array.isArray(valor)) {
      // Filtrar filas vacías
      this.documentoEdit[campo.name] = valor.filter(fila => {
        return Object.values(fila).some(val => val && val !== '')
      })
    }
  }

  this.loading = true
  try {
    const formData = this.prepararFormData()
    this.$emit('save', formData)
  } catch (error) {
    console.error('Error preparando datos:', error)
    this.showError('Error al preparar los datos del documento')
  } finally {
    this.loading = false
  }
},

    // 2. Corregir el método prepararFormData() para manejar subformularios correctamente
prepararFormData() {
  const formData = new FormData()

  if (!Array.isArray(this.camposPlantilla.secciones)) {
    console.warn('❌ Plantilla sin secciones')
    return formData
  }

  // Agregar el ID del documento si existe
  if (this.documentoEdit._id) {
    formData.append('_id', this.documentoEdit._id)
  }

  this.camposPlantilla.secciones.forEach((seccion, indexSeccion) => {
    const nombreSeccion = seccion.nombre
    const fields = seccion.fields

    if (Array.isArray(fields)) {
      fields.forEach(campo => {
        const nombreCampo = campo.name
        const valor = this.documentoEdit[nombreCampo]
        
        // Skip _id field ya que lo manejamos arriba
        if (nombreCampo === '_id') return

        const clave = `document_data[secciones][${indexSeccion}][fields][${nombreCampo}]`

        if (campo.type === 'subform' && valor) {
          // Manejar subformularios
          this.procesarSubformularioEnFormData(formData, clave, valor, campo)
        } else if (campo.type === 'file' && valor instanceof File) {
          formData.append(clave, valor)
        } else if (valor !== null && valor !== undefined && valor !== '') {
          const valorFinal = typeof valor === 'object' ? JSON.stringify(valor) : valor
          formData.append(clave, valorFinal)
        }
      })
    }

    formData.append(`document_data[secciones][${indexSeccion}][nombre]`, nombreSeccion)
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
    // Método recursivo para procesar subformularios en FormData
procesarSubformularioEnFormData(formData, claveBase, valor, campo) {
  if (Array.isArray(valor)) {
    // Si es un array, iteramos sus elementos
    valor.forEach((fila, filaIndex) => {
      if (!fila || typeof fila !== 'object') return

      Object.entries(fila).forEach(([subcampoNombre, subcampoValor]) => {
        const claveCompleta = `${claveBase}[${filaIndex}][${subcampoNombre}]`
        const subcampoConfig = campo.subcampos?.find(sc => sc.name === subcampoNombre)

        // Llamada recursiva si es subform
        if (subcampoConfig?.type === 'subform' && Array.isArray(subcampoValor)) {
          this.procesarSubformularioEnFormData(formData, claveCompleta, subcampoValor, subcampoConfig)
        } else if (subcampoConfig?.type === 'file' && subcampoValor instanceof File) {
          formData.append(claveCompleta, subcampoValor)
        } else if (subcampoValor !== null && subcampoValor !== undefined && subcampoValor !== '') {
          const valorFinal = typeof subcampoValor === 'object' ? JSON.stringify(subcampoValor) : subcampoValor
          formData.append(claveCompleta, valorFinal)
        }
      })
    })
  } else {
    console.warn('⚠️ Valor de subformulario no es array:', valor)
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
    },
    
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
/* Header con el diseño moderno - CAMBIADO A GRIS */
.medico-header {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
}
.section-title i {
  color: #6c757d;
}
.form-section::before {
  background: linear-gradient(90deg, #6c757d, #495057);
}

/* Modal con diseño moderno */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
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

.alert {
  border-radius: 12px;
  border: 1px solid #b8daff;
  background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
</style>
