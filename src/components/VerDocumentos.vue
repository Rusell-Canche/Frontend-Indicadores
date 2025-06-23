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

          <!-- Tabla de documentos -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-file-text me-2"></i>
              Documentos ({{ filteredDocuments.length }})
            </h6>

            <div v-if="paginatedDocumentos.length > 0" class="table-container">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-header">
                    <tr>
                      <th
                        v-for="campo in camposDocumento"
                        :key="campo"
                        class="table-header-cell"
                      >
                        {{ formatFieldName(campo) }}
                      </th>
                      <th class="table-header-cell text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="documento in paginatedDocumentos"
                      :key="documento._id.$oid"
                      class="table-row"
                    >
                      <td v-for="campo in camposDocumento" :key="campo" class="table-cell">
                        <!-- Recurso Digital -->
                        <div v-if="campo === 'Recurso Digital'" class="file-badges">
                          <template v-if="documento[campo] && Array.isArray(documento[campo])">
                            <span
                              v-for="(file, index) in documento[campo]"
                              :key="index"
                              class="file-badge"
                            >
                              <i v-if="isImage(file)" class="fas fa-image me-1"></i>
                              <i v-else-if="isVideo(file)" class="fas fa-video me-1"></i>
                              <i v-else-if="isAudio(file)" class="fas fa-volume-up me-1"></i>
                              <i v-else-if="isPDF(file)" class="fas fa-file-pdf me-1"></i>
                              <i v-else class="fas fa-file me-1"></i>
                              <span class="file-extension">{{ file.split('.').pop()?.toUpperCase() }}</span>
                            </span>
                          </template>
                          <span v-else class="no-files">Sin archivos</span>
                        </div>
                        <!-- Estado -->
                        <span
                          v-else-if="campo === 'Estado'"
                          class="status-badge"
                          :class="{
                            'status-active': documento[campo] === 'Activo',
                            'status-pending': documento[campo] === 'Pendiente',
                            'status-default': documento[campo] !== 'Activo' && documento[campo] !== 'Pendiente'
                          }"
                        >
                          {{ documento[campo] }}
                        </span>
                        <!-- Otros campos -->
                        <span v-else class="table-text">{{ documento[campo] || '-' }}</span>
                      </td>
                      <td class="table-cell text-center">
                        <div class="action-buttons">
                          <button
                            @click="editarDocumento(documento)"
                            class="action-button edit-button"
                            title="Editar documento"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            @click="eliminarDocumento(documento._id.$oid)"
                            class="action-button delete-button"
                            title="Eliminar documento"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-file-text"></i>
              </div>
              <h5 class="empty-title">No se encontraron documentos</h5>
              <p class="empty-text">No hay documentos que coincidan con tu búsqueda</p>
            </div>

            <!-- Paginación -->
            <div v-if="totalPages > 1" class="pagination-container">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="changePage(page)"
                class="pagination-button"
                :class="{ 'active': currentPage === page }"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Documento</h5>
            <button type="button" class="btn-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitEdit">
              <div v-for="campo in camposDocumento" :key="campo" class="form-group">
                <label class="form-label">
                  {{ formatFieldName(campo) }}
                  <span class="text-danger">*</span>
                </label>

                <!-- Recurso Digital -->
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
                        <button
                          type="button"
                          @click="removeFile(index)"
                          class="remove-file-button"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fecha -->
                <div v-else-if="campo === 'Fecha'" class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                  <input
                    type="date"
                    class="form-control"
                    v-model="documentoEdit[campo]"
                  />
                </div>

                <!-- Otros campos -->
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
              </div>

              <div class="modal-footer">
                <button type="button" @click="closeModal" class="btn btn-cancel">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="submit" class="btn btn-save">
                  <i class="fas fa-check me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
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
      colecciones: [],
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
        'carrousel_images'
      ],
      selectedColeccion: null,
      documentos: [],
      camposDocumento: [],
      palabraClave: '',
      currentPage: 1,
      itemsPerPage: 10,
      isModalOpen: false,
      documentoEdit: {},
      uploadedFiles: []
    }
  },
  computed: {
    coleccionesFiltradas() {
      return this.colecciones.filter(coleccion => 
        !this.excludedCollections.includes(coleccion.nombre_coleccion)
      )
    },
    filteredDocuments() {
      if (!this.palabraClave) return this.documentos
      return this.documentos.filter(doc =>
        Object.values(doc).some(value => 
          String(value).toLowerCase().includes(this.palabraClave.toLowerCase())
        )
      )
    },
    paginatedDocumentos() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredDocuments.slice(start, start + this.itemsPerPage)
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage)
    }
  },
  methods: {
    async getColecciones() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/documentos/plantillas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.colecciones = response.data
      } catch (error) {
        console.error('Error obteniendo colecciones', error)
        this.showError('No se pudieron cargar las colecciones')
      }
    },
    async onColeccionSelected() {
      if (this.selectedColeccion) {
        try {
          const token = localStorage.getItem('apiToken')
          const response = await axios.get(
            `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          this.documentos = response.data
          this.currentPage = 1

          if (this.documentos.length > 0) {
            const documentoConMasCampos = this.documentos.reduce((prev, current) =>
              Object.keys(current).length > Object.keys(prev).length ? current : prev
            )
            this.camposDocumento = Object.keys(documentoConMasCampos).filter(
              campo => campo !== '_id'
            )
          } else {
            this.camposDocumento = []
          }
        } catch (error) {
          console.error('Error obteniendo documentos', error)
          this.documentos = []
          this.camposDocumento = []
          this.showError('Error al cargar los documentos')
        }
      } else {
        this.documentos = []
        this.camposDocumento = []
      }
    },
    formatFieldName(fieldName) {
      const fieldMap = {
        created_at: 'Fecha de creación',
        updated_at: 'Última actualización'
      }
      return fieldMap[fieldName] || 
        fieldName
          .replace(/_/g, ' ')
          .replace(/\w\S*/g, word => 
            word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
          )
    },
    editarDocumento(documento) {
      this.documentoEdit = { ...documento }
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.documentoEdit = {}
    },
    async eliminarDocumento(documentoId) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres eliminar este documento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#6c757d',
          cancelButtonColor: '#dc3545',
          confirmButtonText: 'Sí, eliminarlo',
          cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
          const token = localStorage.getItem('apiToken')
          await axios.delete(
            `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${documentoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          this.documentos = this.documentos.filter(doc => doc._id.$oid !== documentoId)
          Swal.fire({
            title: 'Eliminado',
            text: 'El documento se ha eliminado exitosamente.',
            icon: 'success',
            confirmButtonColor: '#6c757d'
          })
        }
      } catch (error) {
        console.error('Error al eliminar el documento', error)
        this.showError('Hubo un problema al eliminar el documento.')
      }
    },
    handleFileUpload(event) {
      const files = event.target.files
      if (files.length > 0) {
        this.uploadedFiles = Array.from(files)
      }
    },
    removeFile(index) {
      if (this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'].splice(index, 1)
      }
    },
    async submitEdit() {
      try {
        const formData = new FormData()

        // Agregar campos del documento
        Object.keys(this.documentoEdit).forEach(key => {
          if (key !== 'Recurso Digital' && key !== '_id') {
            formData.append(`document_data[${key}]`, this.documentoEdit[key])
          }
        })

        // Agregar archivos existentes
        if (this.documentoEdit['Recurso Digital']) {
          this.documentoEdit['Recurso Digital'].forEach(existingFile => {
            formData.append('existing_files[]', existingFile)
          })
        }

        // Agregar archivos nuevos
        this.uploadedFiles.forEach(file => {
          formData.append('files[]', file)
        })

        const token = localStorage.getItem('apiToken')
        await axios.post(
          `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${this.documentoEdit._id.$oid}`,
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )

        Swal.fire({
          title: 'Éxito',
          text: 'Documento actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#6c757d'
        })
        this.closeModal()
        this.onColeccionSelected() // Recargar documentos
      } catch (error) {
        console.error('Error actualizando documento', error)
        this.showError('Hubo un problema al actualizar el documento.')
      }
    },
    changePage(page) {
      this.currentPage = page
    },
    // File type checkers
    isImage(file) {
      return file.match(/\.(jpeg|jpg|png|gif)$/i)
    },
    isVideo(file) {
      return file.match(/\.(mp4|mov|avi)$/i)
    },
    isAudio(file) {
      return file.match(/\.(mp3|wav|ogg)$/i)
    },
    isPDF(file) {
      return file.match(/\.pdf$/i)
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
  },
  mounted() {
    this.getColecciones()
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
  0%, 100% {
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