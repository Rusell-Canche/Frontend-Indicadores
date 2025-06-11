<template>
  <div class="form-container">
    <!-- Modal para subformulario -->
    <div v-if="showSubformModal" class="modal-background">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingIndex === -1 ? 'Agregar' : 'Editar' }} entrada</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div
            v-for="subcampo in currentSubformField?.subcampos"
            :key="subcampo.name"
            class="form-section"
          >
            <label class="section-title">
              {{ subcampo.alias || subcampo.name }}
              <span v-if="subcampo.required" class="required-mark">*</span>
            </label>

            <!-- Campo de archivo en modal -->
            <div v-if="subcampo.type === 'file'" class="file-input-container">
              <label class="file-input-label">
                <div class="file-upload-button-small">
                  <i class="fas fa-paperclip"></i> Seleccionar archivo
                </div>
                <input
                  type="file"
                  class="file-input"
                  @change="onModalFileChange($event, subcampo.name)"
                />
              </label>
              <span v-if="currentSubformData[subcampo.name]?.name" class="file-name-badge">
                {{ currentSubformData[subcampo.name].name }}
              </span>
            </div>

            <!-- Campo numérico en modal -->
            <input
              v-else-if="subcampo.type === 'number'"
              type="number"
              class="form-input"
              v-model="currentSubformData[subcampo.name]"
              :required="subcampo.required"
            />

            <!-- Campo fecha en modal -->
            <input
              v-else-if="subcampo.type === 'date'"
              type="date"
              class="form-input"
              v-model="currentSubformData[subcampo.name]"
              :required="subcampo.required"
            />

            <!-- Campo texto en modal -->
            <input
              v-else
              type="text"
              class="form-input"
              v-model="currentSubformData[subcampo.name]"
              :required="subcampo.required"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-button" @click="saveSubformEntry">Guardar</button>
          <button class="reset-button" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Cabecera del formulario -->
    <div class="form-header">
      <div class="color-bar"></div>
      <h1 class="form-title">Crear Documento</h1>
    </div>

    <!-- Contenedor principal del formulario -->
    <div class="form-body">
      <!-- Selector de Plantillas -->
      <div class="form-card form-section">
        <label class="section-title">Selecciona una plantilla</label>
        <select
          id="plantillaSelector"
          class="form-select"
          v-model="selectedPlantilla"
          @change="onPlantillaSelected"
        >
          <option value="" disabled selected>Selecciona una plantilla</option>
          <option
            v-for="plantilla in plantillas"
            :key="plantilla.nombre_plantilla"
            :value="plantilla.id"
          >
            {{ plantilla.title || plantilla.nombre_plantilla }}
          </option>
        </select>
      </div>

      <div v-if="camposPlantilla.length > 0">
        <!-- Sección para los campos dinámicos -->
        <form ref="form" @submit.prevent="onSubmit" enctype="multipart/form-data">
          <div v-for="(campo, campoIndex) in camposPlantilla" :key="campo.name">
            <div v-if="campo.name !== '_id'" class="form-card form-section">
              <label class="section-title" :for="campo.name">
                {{ campo.alias || campo.name }}
                <span v-if="campo.required" class="required-mark">*</span>
              </label>

              <!-- Campo de tipo subform -->
              <div v-if="campo.type === 'subform'" class="subform-container">
                <div class="subform-controls">
                  <button type="button" class="add-row-button" @click="openModal(campo)">
                    <i class="fas fa-plus-circle"></i> Agregar entrada
                  </button>
                </div>

                <!-- Tabla para mostrar entradas existentes -->
                <div class="table-responsive" v-if="getSubformRows(campo.name).length > 0">
                  <table class="subform-table">
                    <thead>
                      <tr>
                        <th v-for="subcampo in campo.subcampos" :key="subcampo.name">
                          {{ subcampo.alias || subcampo.name }}
                        </th>
                        <th class="actions-column">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in getSubformRows(campo.name)" :key="rowIndex">
                        <td v-for="subcampo in campo.subcampos" :key="subcampo.name">
                          <template v-if="subcampo.type === 'file'">
                            {{ row[subcampo.name]?.name || 'Sin archivo' }}
                          </template>
                          <template v-else>
                            {{ row[subcampo.name] }}
                          </template>
                        </td>
                        <!-- En la sección de acciones de la tabla -->
                        <td class="actions-column">
                          <button
                            type="button"
                            class="edit-button"
                            @click="openModal(campo, rowIndex)"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            class="delete-row-button"
                            @click="removeSubformRow(campo.name, rowIndex)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Campo de archivos -->
              <div v-else-if="campo.type === 'file'" class="file-input-container">
                <label class="file-input-label">
                  <div class="file-upload-button">
                    <i class="fas fa-cloud-upload-alt"></i> Seleccionar archivos
                  </div>
                  <input
                    type="file"
                    class="file-input"
                    :id="campo.name"
                    :name="campo.name"
                    @change="onFileChange($event, campo.name)"
                    multiple
                  />
                </label>
              </div>

              <!-- Campo numérico -->
              <input
                v-else-if="campo.type === 'number'"
                type="number"
                class="form-input"
                :id="campo.name"
                v-model="documentData[campo.name]"
                :required="campo.required"
              />

              <!-- Campo de fecha -->
              <input
                v-else-if="campo.type === 'date'"
                type="date"
                class="form-input"
                :id="campo.name"
                v-model="documentData[campo.name]"
                :required="campo.required"
              />

              <!-- Campo de texto -->
              <input
                v-else
                type="text"
                class="form-input"
                :id="campo.name"
                v-model="documentData[campo.name]"
                :required="campo.required"
              />

              <!-- Vista previa de archivos -->
              <div v-if="campo.type === 'file' && files[campo.name]" class="file-preview">
                <h5 class="preview-title">Archivos seleccionados:</h5>
                <div class="file-thumbnails">
                  <div
                    class="file-thumbnail-item"
                    v-for="(file, index) in files[campo.name]"
                    :key="index"
                  >
                    <div class="thumbnail-container">
                      <img
                        v-if="isImageFile(file)"
                        :src="getThumbnailUrl(file)"
                        alt="Miniatura"
                        class="thumbnail-img"
                      />
                      <div v-else class="file-icon">
                        <i class="fas fa-file-alt"></i>
                      </div>
                      <span class="file-name">{{ file.name }}</span>
                    </div>
                    <button
                      type="button"
                      class="delete-button"
                      @click="removeFile(campo.name, index)"
                    >
                      <i class="fas fa-times-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="field-description">
                <small v-if="campo.required" class="required-field">Campo obligatorio</small>
                <small v-else class="optional-field">Campo opcional</small>
              </div>
            </div>
          </div>

          <!-- Botón de envío -->
          <div class="form-actions">
            <button type="submit" class="submit-button">Crear Documento</button>
            <button type="button" class="reset-button" @click="resetForm">
              Limpiar formulario
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

export default {
  data() {
    return {
      plantillas: [],
      selectedPlantilla: null,
      camposPlantilla: [],
      documentData: {},
      files: {},
      subformData: {}, // Guarda los datos de texto/número/fecha
      subformFiles: {}, // Guarda referencias a archivos
      showSubformModal: false,
      currentSubformField: null,
      currentSubformData: {},
      editingIndex: -1,
    }
  },
  methods: {
    async fetchPlantillas() {
      try {
        const response = await axios.get('/plantillas/consultar')
        this.plantillas = response.data
      } catch (error) {
        console.error('Error obteniendo plantillas', error)
        this.showError('No se pudieron cargar las plantillas')
      }
    },

    async onPlantillaSelected() {
      if (this.selectedPlantilla) {
        try {
          const response = await axios.get(`/plantillas/${this.selectedPlantilla}/campos`)
          if (response.data) {
            this.camposPlantilla = response.data.campos
            // Inicializar arrays para cada subformulario
            this.camposPlantilla.forEach((campo) => {
              if (campo.type === 'subform') {
                // En Vue 3 podemos asignar directamente gracias a la reactividad mejorada
                this.subformData[campo.name] = []
                this.subformFiles[campo.name] = []
              }
            })
            this.resetForm() // Limpiar formulario al cambiar de plantilla
          }
        } catch (error) {
          console.error('Error al obtener los campos:', error)
          this.showError('Error al cargar los campos de la plantilla')
        }
      }
    },

    onFileChange(event, fieldName) {
      const fileList = event.target.files
      if (fileList.length > 0) {
        // En Vue 3 podemos asignar directamente
        this.files[fieldName] = Array.from(fileList)
      }
    },

    isImageFile(file) {
      return file && file.type && file.type.startsWith('image/')
    },

    getThumbnailUrl(file) {
      return this.isImageFile(file) ? URL.createObjectURL(file) : null
    },

    removeFile(fieldName, index) {
      if (this.files[fieldName]) {
        this.files[fieldName].splice(index, 1)
        if (this.files[fieldName].length === 0) {
          // En Vue 3 podemos eliminar propiedades directamente
          delete this.files[fieldName]
        }
      }
    },

    // Métodos para subforms
    getSubformRows(fieldName) {
      return this.subformData[fieldName] || []
    },

    openModal(campo, rowIndex = -1) {
      this.currentSubformField = campo
      this.editingIndex = rowIndex

      // Inicializar datos del subformulario
      const emptyData = campo.subcampos.reduce((acc, sub) => {
        acc[sub.name] = sub.type === 'file' ? null : ''
        return acc
      }, {})

      if (rowIndex === -1) {
        // Nuevo registro
        this.currentSubformData = { ...emptyData }
      } else {
        // Editar registro existente
        const baseData = this.subformData[campo.name][rowIndex] || {}

        // Combinar datos básicos con archivos
        this.currentSubformData = { ...emptyData, ...baseData }

        // Agregar archivos si existen
        if (this.subformFiles[campo.name] && this.subformFiles[campo.name][rowIndex]) {
          const fileData = this.subformFiles[campo.name][rowIndex]
          // Iterar sobre cada nombre de campo
          Object.keys(fileData).forEach((fieldName) => {
            if (fileData[fieldName]) {
              this.currentSubformData[fieldName] = fileData[fieldName]
            }
          })
        }
      }

      this.showSubformModal = true
    },

    closeModal() {
      this.showSubformModal = false
      this.currentSubformField = null
      this.currentSubformData = {}
      this.editingIndex = -1
    },

    saveSubformEntry() {
      const fieldName = this.currentSubformField.name

      // Validar campos requeridos
      const isValid = this.currentSubformField.subcampos.every((sub) => {
        if (!sub.required) return true

        // Para archivos, validar si hay archivo nuevo o existente
        if (sub.type === 'file') {
          return !!this.currentSubformData[sub.name]
        }

        return (
          this.currentSubformData[sub.name] !== null &&
          this.currentSubformData[sub.name] !== undefined &&
          this.currentSubformData[sub.name] !== ''
        )
      })

      if (!isValid) {
        this.showError('Complete los campos requeridos')
        return
      }

      // Asegurar que los arrays existen
      if (!this.subformData[fieldName]) {
        this.subformData[fieldName] = []
      }

      if (!this.subformFiles[fieldName]) {
        this.subformFiles[fieldName] = []
      }

      // Separar datos normales de archivos
      const dataSinArchivos = {}
      const soloArchivos = {}

      // Clasificar datos
      Object.keys(this.currentSubformData).forEach((key) => {
        const valor = this.currentSubformData[key]

        if (valor instanceof File) {
          // Es un archivo
          soloArchivos[key] = valor
        } else {
          // Es un dato normal
          dataSinArchivos[key] = valor
        }
      })

      // Guardar o actualizar según corresponda
      if (this.editingIndex === -1) {
        // Nuevo registro
        this.subformData[fieldName].push(dataSinArchivos)
        this.subformFiles[fieldName].push(soloArchivos)
      } else {
        // Actualizar registro existente
        this.subformData[fieldName][this.editingIndex] = dataSinArchivos

        // Asegurar que existe el objeto para los archivos
        if (!this.subformFiles[fieldName][this.editingIndex]) {
          this.subformFiles[fieldName][this.editingIndex] = {}
        }

        // Solo actualizar los campos de archivo que se hayan modificado
        Object.keys(soloArchivos).forEach((key) => {
          if (soloArchivos[key]) {
            this.subformFiles[fieldName][this.editingIndex][key] = soloArchivos[key]
          }
        })
      }

      this.closeModal()
    },

    onModalFileChange(event, subcampoName) {
      const file = event.target.files[0]
      if (file) {
        // Asignación directa en Vue 3
        this.currentSubformData[subcampoName] = file
      }
    },

    removeSubformRow(fieldName, rowIndex) {
      if (this.subformData[fieldName] && this.subformData[fieldName].length > rowIndex) {
        // Eliminar la fila de datos
        this.subformData[fieldName].splice(rowIndex, 1)

        // Eliminar los archivos correspondientes
        if (this.subformFiles[fieldName] && this.subformFiles[fieldName].length > rowIndex) {
          this.subformFiles[fieldName].splice(rowIndex, 1)
        }
      }
    },

    async onSubmit() {
      // Validar campos requeridos en el formulario principal
      const requiredFieldsEmpty = this.camposPlantilla.some((campo) => {
        if (campo.required && campo.type !== 'subform') {
          if (campo.type === 'file') {
            return !this.files[campo.name] || this.files[campo.name].length === 0
          }
          return !this.documentData[campo.name]
        }
        return false
      })

      // Validar subformularios requeridos
      const subformsEmpty = this.camposPlantilla.some((campo) => {
        if (campo.type === 'subform' && campo.required) {
          return !this.subformData[campo.name] || this.subformData[campo.name].length === 0
        }
        return false
      })

      if (requiredFieldsEmpty || subformsEmpty) {
        this.showError('Complete todos los campos obligatorios')
        return
      }

      const formData = new FormData()

      // Datos principales del documento
      this.camposPlantilla.forEach((campo) => {
        if (campo.type !== 'file' && campo.type !== 'subform') {
          // Convertir a string para evitar problemas con valores nulos o undefined
          const valor =
            this.documentData[campo.name] !== undefined && this.documentData[campo.name] !== null
              ? this.documentData[campo.name]
              : ''
          formData.append(`document_data[${campo.name}]`, valor)
        }
      })

      // Datos de subformularios
      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'subform') {
          // Agregar datos del subformulario como JSON
          formData.append(
            `document_data[${campo.name}]`,
            JSON.stringify(this.subformData[campo.name] || []),
          )

          // Agregar archivos del subformulario
          if (this.subformFiles[campo.name]) {
            this.subformFiles[campo.name].forEach((rowFiles, rowIndex) => {
              Object.entries(rowFiles).forEach(([subName, file]) => {
                if (file instanceof File) {
                  formData.append(`subform_files[${campo.name}][${rowIndex}][${subName}]`, file)
                }
              })
            })
          }
        }
      })

      // Archivos principales del documento
      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'file' && this.files[campo.name]) {
          this.files[campo.name].forEach((file) => {
            formData.append(`files[${campo.name}][]`, file)
          })
        }
      })

      try {
        const response = await axios.post(`/documentos/${this.selectedPlantilla}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        Swal.fire({
          title: 'Éxito',
          text: 'Documento creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })

        this.resetForm()
      } catch (error) {
        console.error('Error al crear documento:', error)
        this.showError(
          'Error al crear el documento: ' +
            (error.response?.data?.message || error.message || 'Error desconocido'),
        )
      }
    },

    resetForm() {
      this.documentData = {}
      this.files = {}

      // Reiniciar subformularios
      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'subform') {
          this.subformData[campo.name] = []
          this.subformFiles[campo.name] = []
        }
      })

      if (this.$refs.form) this.$refs.form.reset()
    },

    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    },
  },
  mounted() {
    this.fetchPlantillas()
  },
}
</script>

<style scoped>
/* Importar fuentes de Google */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Estilos generales */
* {
  box-sizing: border-box;
}

.form-container {
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.form-header {
  position: relative;
  padding: 24px;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.color-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 10px;
  width: 100%;
  background-color: #4285f4;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-title {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 400;
  color: #202124;
}

.form-body {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.form-card:hover {
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #202124;
}

.required-mark {
  color: #d93025;
  margin-left: 4px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  color: #202124;
  transition: border 0.3s;
}

.form-input:focus,
.form-select:focus {
  border-color: #4285f4;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.file-input-container {
  margin-bottom: 12px;
}

.file-input {
  display: none;
}

.file-input-label {
  display: block;
  cursor: pointer;
}

.file-upload-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #4285f4;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.file-upload-button:hover {
  background-color: #3367d6;
}

.file-upload-button i {
  margin-right: 8px;
  font-size: 16px;
}

.file-upload-button-small {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #4285f4;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.file-upload-button-small:hover {
  background-color: #3367d6;
}

.file-upload-button-small i {
  margin-right: 4px;
  font-size: 14px;
}

.file-preview {
  margin-top: 16px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #5f6368;
}

.file-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.file-thumbnail-item {
  position: relative;
  width: 120px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 8px;
  background-color: #f8f9fa;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.thumbnail-img {
  width: 100%;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
}

.file-icon {
  font-size: 24px;
  color: #5f6368;
  margin: 12px 0;
}

.file-name {
  font-size: 12px;
  color: #5f6368;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.delete-button {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #fff;
  border: none;
  color: #d93025;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #d93025;
  color: white;
}

.field-description {
  margin-top: 8px;
  font-size: 12px;
}

.required-field {
  color: #d93025;
}

.optional-field {
  color: #5f6368;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}

.submit-button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3367d6;
}

.reset-button {
  background-color: transparent;
  color: #5f6368;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-button:hover {
  background-color: #f1f3f4;
  color: #202124;
}

/* Estilos específicos para subforms */
.subform-container {
  margin-top: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.subform-controls {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.add-row-button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.add-row-button i {
  font-size: 16px;
  color: white;
}

.add-row-button:hover {
  background-color: #3367d6;
}

.subform-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.subform-table th {
  background-color: #f8f9fa;
  color: #5f6368;
  font-weight: 500;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
}

.subform-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
}

.subform-table tr:hover {
  background-color: #f8f9fa;
}

.actions-column {
  width: 80px;
  text-align: center;
}

.delete-row-button {
  background: none;
  border: none;
  color: #d93025;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-row-button i {
  font-size: 14px;
  color: inherit;
}

.delete-row-button:hover {
  background-color: #ffeceb;
}

.file-name-badge {
  display: inline-block;
  background-color: #e8f0fe;
  color: #1a73e8;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-table-message {
  color: #5f6368;
  text-align: center;
  padding: 24px;
  background-color: #f8f9fa;
}

.subform-table .form-input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  width: 100%;
  transition: all 0.3s;
}

.subform-table .form-input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

@media (max-width: 768px) {
  .form-container {
    margin: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .submit-button,
  .reset-button {
    width: 100%;
  }

  .subform-table {
    min-width: 600px;
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .subform-table th,
  .subform-table td {
    min-width: 150px;
  }
}
/* Estilos para el modal */
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: modalEnter 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #202124;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #5f6368;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
  line-height: 1;
  margin-left: auto;
}

.modal-close:hover {
  color: #d93025;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-body .form-section {
  margin-bottom: 1.25rem;
}

.modal-body .form-section:last-child {
  margin-bottom: 0;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-radius: 0 0 8px 8px;
}

/* Animación de entrada del modal */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Ajustes específicos para inputs en el modal */
.modal-body .form-input {
  padding: 0.75rem;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-body .form-input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

/* Mejoras para el file input en modal */
.modal-body .file-input-container {
  position: relative;
  margin-top: 0.5rem;
}

.modal-body .file-name-badge {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
}

/* Ajustes responsive */
@media (max-width: 640px) {
  .modal-content {
    margin: 0.5rem;
    max-width: 95%;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
