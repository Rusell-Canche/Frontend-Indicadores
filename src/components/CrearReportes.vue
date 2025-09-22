<template>
  <div class="crear-reportes-container">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">
        <i class="fas fa-chart-bar me-2"></i>
        Generar Reportes
      </h2>
      <p class="page-description">
        Crea reportes personalizados a partir de los documentos de tus colecciones
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
              <option 
                v-for="coleccion in coleccionesFiltradas" 
                :key="coleccion.id" 
                :value="coleccion"
              >
                {{ coleccion.nombre_coleccion }} ({{ coleccion.total_documentos }} documentos)
              </option>
            </select>
          </div>
        </div>

        <div class="col-md-6" v-if="selectedColeccion">
          <label class="form-label">Información de la Colección</label>
          <div class="info-card">
            <div class="info-item">
              <strong>Nombre:</strong> {{ selectedColeccion.nombre_coleccion }}
            </div>
            <div class="info-item">
              <strong>Total de documentos:</strong> {{ documentos.length }}
            </div>
            <div class="info-item">
              <strong>Campos disponibles:</strong> {{ camposDocumento.length }}
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
              >
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
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Formato de salida</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-file-pdf text-danger"></i>
              </span>
              <input type="text" class="form-control" value="PDF" readonly>
            </div>
          </div>

          <div class="form-check">
            <input 
              type="checkbox" 
              class="form-check-input" 
              id="incluirFecha"
              v-model="incluirFecha"
            >
            <label class="form-check-label" for="incluirFecha">
              Incluir fecha de generación
            </label>
          </div>
        </div>
      </div>
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
        <span v-else>Generar Reporte</span>
      </button>

      <button 
        class="btn btn-secondary me-2"
        @click="previsualizarReporte"
        :disabled="camposSeleccionados.length === 0"
      >
        <i class="fas fa-eye me-2"></i>
        Vista Previa
      </button>

      <button 
        class="btn btn-outline-danger"
        @click="limpiarConfiguracion"
      >
        <i class="fas fa-trash me-2"></i>
        Limpiar
      </button>
    </div>

    <!-- Vista previa del reporte -->
    <div class="form-section" v-if="mostrarPreview && datosReporte.length > 0">
      <h6 class="section-title">
        <i class="fas fa-eye me-2"></i>
        Vista Previa del Reporte
      </h6>

      <div class="preview-header mb-3">
        <h4>{{ tituloReporte }}</h4>
        <p v-if="incluirFecha" class="text-muted">
          Generado el: {{ new Date().toLocaleDateString('es-MX') }}
        </p>
        <p class="text-muted">
          Total de registros: {{ datosReporte.length }}
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
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  name: 'CrearReportes',

  data() {
    return {
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
        documentos: false
      },
      generandoReporte: false,

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
      ]
    }
  },

  computed: {
    coleccionesFiltradas() {
      return this.colecciones.filter(
        col => !this.excludedCollections.includes(col.nombre_coleccion)
      )
    },

    camposDisponibles() {
      return this.camposDocumento.filter(campo => {
        const campoDef = this.getCampoDefinition(campo)
        return campoDef?.type !== 'file' && !['_id', 'created_at', 'updated_at'].includes(campo)
      })
    }
  },

  methods: {
    async apiCall(endpoint, options = {}) {
      const token = localStorage.getItem('apiToken')
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        ...options
      }

      const response = await axios(endpoint, config)
      return response.data
    },

    async getColecciones() {
      this.loading.colecciones = true
      try {
        this.colecciones = await this.apiCall('http://127.0.0.1:8000/api/documentos/plantillas')
      } catch {
        this.showError('No se pudieron cargar las colecciones')
      } finally {
        this.loading.colecciones = false
      }
    },

    async getCamposPlantilla(plantillaId) {
      try {
        const response = await this.apiCall(
          `http://127.0.0.1:8000/api/plantillas/${plantillaId}/secciones`
        )
        return response?.secciones ? response : { secciones: [] }
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
          this.apiCall(`http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.id}`)
        ])

        this.camposPlantilla = camposPlantilla
        this.documentos = documentos
        this.procesarCamposDocumento()

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
      this.camposPlantilla.secciones.forEach(seccion => {
        if (Array.isArray(seccion.fields)) {
          seccion.fields.forEach(campo => todosLosCampos.push(campo))
        }
      })
      this.camposDocumento = todosLosCampos.map(campo => campo.name)
    },

    getCampoDefinition(fieldPath) {
      if (!this.camposPlantilla?.secciones) return null
      for (const seccion of this.camposPlantilla.secciones) {
        const campo = seccion.fields?.find(f => f.name === fieldPath)
        if (campo) return campo
      }
      return null
    },

    getFieldValueFromDocument(documento, fieldPath) {
      if (documento.secciones) {
        for (const seccion of documento.secciones) {
          if (seccion.fields?.hasOwnProperty(fieldPath)) {
            return seccion.fields[fieldPath]
          }
        }
      }
      return documento[fieldPath]
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
        const option = campo.options.find(o => o.campoGuardar === valor)
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
        updated_at: 'Última actualización'
      }
      return fieldMap[fieldName] || 
        fieldName.replace(/_/g, ' ')
                 .replace(/\w\S*/g, w => w[0].toUpperCase() + w.substr(1).toLowerCase())
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
    },

    limpiarConfiguracion() {
      this.camposSeleccionados = []
      this.tituloReporte = ''
      this.incluirFecha = true
      this.mostrarPreview = false
      this.datosReporte = []
    },

    previsualizarReporte() {
      if (this.camposSeleccionados.length === 0) {
        this.showError('Selecciona al menos un campo para el reporte')
        return
      }
      this.datosReporte = [...this.documentos]
      this.mostrarPreview = true
    },

    //Método para generar PDF
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

        doc.text(`Total de registros: ${this.documentos.length}`, 20, yPosition)
        yPosition += 15

        const headers = this.camposSeleccionados.map(campo => this.formatFieldName(campo))
        const rows = this.documentos.map(doc =>
          this.camposSeleccionados.map(campo => this.getFieldValueForReport(doc, campo) || '-')
        )

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: yPosition,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 20, right: 20 },
          tableWidth: 'auto'
        })

        const nombreArchivo = `${this.tituloReporte.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        doc.save(nombreArchivo)

        this.showSuccess('PDF generado y descargado exitosamente')
      } catch (error) {
        console.error('Error generando PDF:', error)
        this.showError('Error al generar el PDF.')
      } finally {
        this.generandoReporte = false
      }
    },

    showSuccess(message) {
      Swal.fire({ title: 'Éxito', text: message, icon: 'success', confirmButtonText: 'Aceptar' })
    },

    showError(message) {
      Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonText: 'Aceptar' })
    }
  },

  mounted() {
    this.getColecciones()
  }
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

.campo-item input[type="checkbox"] {
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
</style>