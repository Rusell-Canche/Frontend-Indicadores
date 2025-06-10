<template>
  <div class="upload-container">
    <div class="upload-card">
      <div class="upload-header">
        <h3 class="upload-title">Cargar Indicadores</h3>
        <p class="upload-subtitle">Sube tu archivo de indicadores en formato Excel o CSV</p>
      </div>

      <div class="upload-area" @dragover.prevent @drop="handleDrop">
        <input
          type="file"
          id="file-upload"
          @change="handleFileUpload"
          accept=".xlsx, .xls, .csv"
          class="file-input"
        />
        <label for="file-upload" class="upload-label">
          <svg class="upload-icon" viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          <span v-if="!file">Selecciona un archivo o arrástralo aquí</span>
          <span v-else class="file-selected">{{ file.name }}</span>
          <span class="file-types">Formatos soportados: .xlsx, .xls, .csv</span>
        </label>
      </div>

      <button
        @click="submitFile"
        :disabled="!file || isLoading"
        class="upload-button"
        :class="{ disabled: !file || isLoading }"
      >
        <span v-if="!isLoading">Subir Archivo</span>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      file: null,
      isLoading: false,
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
          confirmButtonColor: '#3498db',
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
          confirmButtonColor: '#3498db',
        })
        return
      }

      const formData = new FormData()
      formData.append('excel_file', this.file)

      this.isLoading = true

      try {
        const response = await axios.post('api/indicador/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message || 'Archivo subido correctamente',
          confirmButtonColor: '#2ecc71',
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
          confirmButtonColor: '#e74c3c',
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 2rem;
}

.upload-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  transition: all 0.3s ease;
}

.upload-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.upload-subtitle {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

.upload-area {
  border: 2px dashed #dfe6e9;
  border-radius: 8px;
  padding: 2rem 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #b2bec3;
  background-color: #f8f9fa;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.upload-icon {
  width: 48px;
  height: 48px;
  fill: #3498db;
  margin-bottom: 1rem;
}

.file-selected {
  font-weight: 500;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.file-types {
  font-size: 0.8rem;
  color: #95a5a6;
  margin-top: 0.5rem;
}

.upload-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-button:hover:not(.disabled) {
  background-color: #2980b9;
}

.upload-button.disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
