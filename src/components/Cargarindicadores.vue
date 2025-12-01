<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal con el diseño moderno -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-upload"></i>
          </div>
          <div class="header-title-section">
            <h3>Cargar Indicadores</h3>
            <p class="header-subtitle">Sube tu archivo de indicadores en formato Excel o CSV</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <div class="form-section">
          <h6 class="section-title">
            <i class="fas fa-cloud-upload-alt me-2"></i>
            Seleccionar Archivo
          </h6>

          <!-- Área de carga con diseño moderno -->
          <div
            class="upload-area"
            @dragover.prevent
            @drop="handleDrop"
            :class="{ 'file-selected': file }"
          >
            <input
              type="file"
              id="file-upload"
              @change="handleFileUpload"
              accept=".xlsx, .xls, .csv"
              class="file-input"
            />
            <label for="file-upload" class="upload-label">
              <div class="upload-icon-container">
                <i class="fas fa-file-excel upload-icon" v-if="!file"></i>
                <i class="fas fa-check-circle upload-icon success" v-else></i>
              </div>

              <div class="upload-text">
                <span v-if="!file" class="upload-main-text"
                  >Selecciona un archivo o arrástralo aquí</span
                >
                <span v-else class="file-selected-name">
                  <i class="fas fa-file-alt me-2"></i>
                  {{ file.name }}
                </span>
                <span class="file-types">Formatos soportados: .xlsx, .xls, .csv</span>
              </div>
            </label>
          </div>

          <!-- Información adicional -->
          <div class="upload-info">
            <div class="info-item">
              <i class="fas fa-info-circle"></i>
              <span>El archivo debe contener las columnas requeridas para los indicadores</span>
            </div>
            <div class="info-item">
              <i class="fas fa-file-alt"></i>
              <span>Tamaño máximo: 10MB</span>
            </div>
          </div>
        </div>

                <!-- Selección de dependencia -->
        <div class="form-group mt-4">
          <label for="dependencia" class="form-label fw-bold">Tipo de indicador:</label>
          <select id="dependencia" v-model="selectedDependencia" class="form-select">
            <option value="" disabled>Selecciona un tipo de indicador</option>
            <option value="Subdireccion">Subdirección Académica</option>
            <option value="Planeacion">Planeación y Presupuesto</option>
          </select>
        </div>

        <!-- Footer con botón -->
        <div class="medico-footer">
          <button
            @click="submitFile"
            :disabled="!file || isLoading"
            class="btn btn-save"
            :class="{ disabled: !file || isLoading }"
          >
            <template v-if="!isLoading">
              <i class="fas fa-upload me-2"></i>
              Subir Archivo
            </template>
            <template v-else>
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Procesando...
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      file: null,
      isLoading: false,
      selectedDependencia: '',
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]
    },
    handleDrop(event) {
      event.preventDefault()
      if (event.dataTransfer.files.length) {
        this.file = event.dataTransfer.files[0]
      }
    },
    async submitFile() {
      if (!this.file) {
        Swal.fire({
          icon: 'warning',
          title: 'Archivo requerido',
          text: 'Por favor selecciona un archivo para subir',
          confirmButtonColor: '#667eea',
        })
        return
      }

      // Validar extensión del archivo
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const fileExt = this.file.name.substring(this.file.name.lastIndexOf('.')).toLowerCase()

      if (!validExtensions.includes(fileExt)) {
        Swal.fire({
          icon: 'error',
          title: 'Formato no válido',
          text: 'Por favor sube un archivo Excel (.xlsx, .xls) o CSV',
          confirmButtonColor: '#667eea',
        })
        return
      }

            // Validar que se haya seleccionado una dependencia
      if (!this.selectedDependencia) {
        Swal.fire({
          icon: 'warning',
          title: 'Dependencia requerida',
          text: 'Por favor selecciona un tipo de indicador',
          confirmButtonColor: '#667eea',
        })
        return
      }

      const formData = new FormData()
      formData.append('excel_file', this.file)
      formData.append('dependencia', this.selectedDependencia)

      this.isLoading = true

      try {
        const response = await api.post('/indicadores/upload', formData,)

        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message || 'Archivo subido correctamente',
          confirmButtonColor: '#667eea',
          timer: 3000,
          timerProgressBar: true,
        })

        this.file = null
        document.getElementById('file-upload').value = ''
      } catch (error) {
        console.error('Error al subir el archivo:', error)

        let errorMessage = 'Error al procesar el archivo'
        if (error.response) {
          errorMessage = error.response.data.message || errorMessage
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#667eea',
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
/* Estilos para el contenedor principal - más grande */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

/* Header con el diseño moderno - más grande */
.medico-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 2.5rem;
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
  gap: 1.25rem;
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

/* Body con el diseño moderno - más grande */
.medico-body {
  padding: 2rem 2.5rem;
  background: white;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.75rem;
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
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 16px 16px 0 0;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #667eea;
  font-size: 0.9rem;
}

/* Área de carga moderna - más grande */
.upload-area {
  border: 2px dashed #e9ecef;
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
}

.upload-area:hover {
  border-color: #667eea;
  background: linear-gradient(145deg, #f8f9ff 0%, #f0f4ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.upload-area.file-selected {
  border-color: #28a745;
  background: linear-gradient(145deg, #f8fff9 0%, #f0fff4 100%);
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.upload-icon-container {
  margin-bottom: 1.5rem;
}

.upload-icon {
  font-size: 4rem;
  color: #667eea;
  transition: all 0.3s ease;
}

.upload-icon.success {
  color: #28a745;
}

.upload-area:hover .upload-icon {
  transform: scale(1.1);
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-main-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.file-selected-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #28a745;
  display: flex;
  align-items: center;
}

.file-types {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Información adicional - más grande */
.upload-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.info-item i {
  color: #667eea;
  font-size: 0.85rem;
}

/* Footer con botones - más grande */
.medico-footer {
  padding: 1.5rem 0 0.5rem 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-size: 1rem;
  min-width: 200px;
  justify-content: center;
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

.btn-save:hover:not(.disabled) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-save.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-save.disabled:hover {
  transform: none;
  box-shadow: none;
}

.spinner-border-sm {
  width: 1.125rem;
  height: 1.125rem;
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
  .card {
    max-width: 100%;
    margin: 0;
  }

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
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .upload-area {
    padding: 2rem 1rem;
  }

  .upload-icon {
    font-size: 3rem;
  }

  .upload-main-text,
  .file-selected-name {
    font-size: 1.1rem;
  }

  .btn-save {
    width: 100%;
    min-width: auto;
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

  .upload-area {
    padding: 1.5rem 0.75rem;
  }

  .upload-icon {
    font-size: 2.5rem;
  }

  .upload-main-text,
  .file-selected-name {
    font-size: 1rem;
  }
}
</style>
