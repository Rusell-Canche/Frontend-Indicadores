<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-user-tag"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Rol</h3>
            <p class="header-subtitle">Define un nuevo rol con sus permisos correspondientes</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="submitForm">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>
            Completa la información básica y asigna los permisos necesarios para el rol
          </div>

          <!-- Sección de información básica del rol -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Información del Rol
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre del Rol*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-tag"></i>
                  </span>
                  <input
                    v-solo-texto
                    v-model="nombre"
                    type="text"
                    id="nombre"
                    name="nombre"
                    class="form-control"
                    required
                    placeholder="ej: super_usuario, administrador"
                  />
                </div>
                <small class="form-text text-muted">
                  Se recomienda usar snake_case (ej: super_usuario)
                </small>
              </div>
              <div class="col-md-6">
                <label class="form-label">Descripción*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-align-left"></i>
                  </span>
                  <input
                    v-solo-texto
                    v-model="descripcion"
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    class="form-control"
                    required
                    placeholder="Describe las funciones de este rol"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de permisos -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-shield-alt me-2"></i>
              Permisos del Rol
            </h6>

            <!-- Selector de recurso -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Seleccionar Recurso</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-database"></i>
                  </span>
                  <select
                    v-model="selectedResource"
                    class="form-control"
                    @change="onResourceChange"
                  >
                    <option value="">Seleccione un recurso</option>
                    <option v-for="recurso in recursos" :key="recurso.id" :value="recurso.id">
                      {{ recurso.nombre }} - {{ recurso.descripcion }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="addResourcePermission"
                  :disabled="!selectedResource"
                >
                  <i class="fas fa-plus me-2"></i>
                  Agregar Recurso
                </button>
              </div>
            </div>

            <!-- Lista de recursos asignados -->
            <div v-if="permisos.length > 0" class="assigned-resources">
              <h6 class="mb-3">
                <i class="fas fa-list me-2"></i>
                Recursos Asignados ({{ permisos.length }})
              </h6>

              <div
                v-for="(permiso, index) in permisos"
                :key="index"
                class="resource-permission-card mb-3"
              >
                <div class="resource-header">
                  <div class="resource-info">
                    <h6 class="resource-name">
                      {{ getResourceName(permiso.recurso) }}
                    </h6>
                    <p class="resource-description">
                      {{ getResourceDescription(permiso.recurso) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="removeResourcePermission(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>

                <!-- Grid de acciones dinámico -->
                <div class="permissions-grid">
                  <div v-for="accion in acciones" :key="accion.id" class="permission-item">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="permiso.acciones"
                        :value="accion.id"
                        :disabled="hasWildcardPermission(permiso.acciones)"
                      />
                      <span class="checkmark"></span>
                      <div class="permission-content">
                        <span class="permission-title">
                          <i :class="getActionIcon(accion.nombre)" class="me-2"></i>
                          {{ capitalizeFirst(accion.nombre) }}
                        </span>
                        <span class="permission-description">{{ accion.descripcion }}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Resumen de permisos seleccionados -->
                <div v-if="permiso.acciones.length > 0" class="permissions-summary mt-2">
                  <small class="text-muted">
                    <i class="fas fa-check-circle me-1"></i>
                    {{ permiso.acciones.length }} acción(es) seleccionada(s)
                  </small>
                </div>
              </div>
            </div>

            <!-- Estado cuando no hay permisos -->
            <div v-else class="no-permissions-state">
              <div class="text-center py-5">
                <i class="fas fa-shield-alt fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No hay permisos asignados</h6>
                <p class="text-muted small">
                  Selecciona un recurso y agrégalo para comenzar a configurar los permisos
                </p>
              </div>
            </div>
          </div>

          <!-- Vista previa del JSON (opcional - para desarrollo) -->
          <div v-if="showPreview" class="form-section">
            <h6 class="section-title">
              <i class="fas fa-code me-2"></i>
              Vista Previa del JSON
            </h6>
            <div class="json-preview">
              <pre>{{ getPreviewJson() }}</pre>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button type="button" class="btn btn-secondary me-2" @click="togglePreview">
              <i class="fas fa-eye me-2"></i>
              {{ showPreview ? 'Ocultar' : 'Ver' }} Preview
            </button>
            <button type="button" class="btn btn-cancel" @click="resetForm">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button
              type="submit"
              class="btn btn-save"
              :disabled="!canSubmit"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
            >
              <span v-if="!isHovered" class="default-icon">
                <i class="fas fa-user-tag me-2"></i>
              </span>
              <span v-else class="hover-icon">
                <i class="fas fa-check me-2"></i>
              </span>
              Crear Rol
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  data() {
    return {
      // Campos básicos del rol
      nombre: '',
      descripcion: '',

      // Permisos del rol
      permisos: [],

      // Recursos y acciones disponibles
      recursos: [],
      acciones: [],
      selectedResource: '',

      // Estados de la UI
      isHovered: false,
      showPreview: false,

      // Para funcionalidad wildcard
      wildcardActionId: null,
    }
  },
  computed: {
    canSubmit() {
      return this.nombre.trim() && this.descripcion.trim() && this.permisos.length > 0
    },
  },
  async mounted() {
    await this.loadRecursos()
    await this.loadAcciones()
  },
  methods: {
    // Cargar recursos desde la API
    async loadRecursos() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/recursos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.recursos = response.data.recursos
        }
      } catch (error) {
        console.error('Error al cargar recursos:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los recursos disponibles',
        })
      }
    },

    // Cargar acciones desde la API
    async loadAcciones() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/acciones', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.acciones = response.data.acciones
          // Buscar el ID de la acción "*" (wildcard)
          const wildcardAction = this.acciones.find((accion) => accion.nombre === '*')
          if (wildcardAction) {
            this.wildcardActionId = wildcardAction.id
          }
        }
      } catch (error) {
        console.error('Error al cargar acciones:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las acciones disponibles',
        })
      }
    },

    // Obtener nombre del recurso por ID
    getResourceName(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.nombre : 'Recurso no encontrado'
    },

    // Obtener descripción del recurso por ID
    getResourceDescription(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.descripcion : ''
    },

    // Obtener icono según la acción
    getActionIcon(actionName) {
      const iconMap = {
        '*': 'fas fa-star',
        crear: 'fas fa-plus',
        leer: 'fas fa-eye',
        actualizar: 'fas fa-edit',
        eliminar: 'fas fa-trash',
      }
      return iconMap[actionName] || 'fas fa-cog'
    },

    // Capitalizar primera letra
    capitalizeFirst(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    // Verificar si tiene permiso wildcard
    hasWildcardPermission(acciones) {
      return this.wildcardActionId && acciones.includes(this.wildcardActionId)
    },

    // Agregar recurso con permisos
    addResourcePermission() {
      if (!this.selectedResource) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Debe seleccionar un recurso',
        })
        return
      }

      // Verificar si el recurso ya está asignado
      const exists = this.permisos.find((p) => p.recurso === this.selectedResource)
      if (exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Este recurso ya ha sido asignado',
        })
        return
      }

      // Buscar el recurso seleccionado
      const recurso = this.recursos.find((r) => r.id === this.selectedResource)

      // Crear objeto de permisos
      let accionesDefault = []

      // Si el recurso es "*" (permisos totales), activar todas las acciones
      if (
        recurso &&
        recurso.nombre === '*' &&
        recurso.descripcion === 'Permisos en todas las tablas'
      ) {
        accionesDefault = this.acciones.map((accion) => accion.id)
      }

      // Agregar el permiso
      this.permisos.push({
        recurso: this.selectedResource,
        acciones: [...accionesDefault],
      })

      // Limpiar la selección
      this.selectedResource = ''
    },

    // Remover recurso asignado
    removeResourcePermission(index) {
      this.permisos.splice(index, 1)
    },

    // Evento de cambio de recurso
    onResourceChange() {
      // Lógica adicional si es necesaria
    },

    // Alternar vista previa
    togglePreview() {
      this.showPreview = !this.showPreview
    },

    // Obtener JSON de vista previa
    getPreviewJson() {
      const previewData = {
        nombre: this.nombre || 'nombre_del_rol',
        descripcion: this.descripcion || 'Descripción del rol',
        permisos: this.permisos,
      }
      return JSON.stringify(previewData, null, 2)
    },

    // Limpiar formulario
    resetForm() {
      this.nombre = ''
      this.descripcion = ''
      this.permisos = []
      this.selectedResource = ''
      this.showPreview = false
    },

    // Enviar formulario
    async submitForm() {
      // Validaciones
      if (!this.nombre.trim()) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'El nombre del rol es obligatorio',
        })
        return
      }

      if (!this.descripcion.trim()) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'La descripción del rol es obligatoria',
        })
        return
      }

      if (this.permisos.length === 0) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Debe asignar al menos un permiso al rol',
        })
        return
      }

      // Validar que cada permiso tenga al menos una acción
      const permisosVacios = this.permisos.filter((p) => p.acciones.length === 0)
      if (permisosVacios.length > 0) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Todos los recursos deben tener al menos una acción seleccionada',
        })
        return
      }

      // Confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres crear el rol "${this.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        // Crear el JSON con el formato requerido
        const formData = {
          nombre: this.nombre.trim(),
          descripcion: this.descripcion.trim(),
          permisos: this.permisos.map((p) => ({
            recurso: p.recurso,
            acciones: p.acciones,
          })),
        }

        // Mostrar el JSON en consola para verificar
        console.log('JSON a enviar:', JSON.stringify(formData, null, 2))

        try {
          const token = localStorage.getItem('apiToken')
          const response = await axios.post('http://127.0.0.1:8000/api/roles', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          Swal.fire({
            icon: 'success',
            title: '¡Rol creado!',
            text: `El rol "${this.nombre}" ha sido creado exitosamente`,
          }).then(() => {
            this.resetForm()
          })

          // Mostrar respuesta del servidor
          console.log('Respuesta del servidor:', response.data)
        } catch (error) {
          console.error('Error al crear rol:', error)

          let errorMessage = 'Hubo un error al crear el rol.'

          if (error.response && error.response.data) {
            if (error.response.data.message) {
              errorMessage = error.response.data.message
            } else if (error.response.data.errors) {
              const errors = error.response.data.errors
              if (errors.nombre) {
                errorMessage = 'El nombre del rol ya existe o no es válido.'
              }
            }
          }

          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: errorMessage,
          })
        }
      }
    },
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
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
  background: linear-gradient(90deg, #047857, #065f46);
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
  color: #047857;
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus {
  border-color: #047857;
  box-shadow: 0 0 0 0.2rem rgba(4, 120, 87, 0.25);
  transform: translateY(-1px);
}

.alert {
  border-radius: 12px;
  border: 1px solid #b3d9ff;
  background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
  color: #0d47a1;
}

/* Estilos para recursos y permisos */
.assigned-resources {
  margin-top: 1.5rem;
}

.resource-permission-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.resource-permission-card:hover {
  box-shadow: 0 4px 15px rgba(4, 120, 87, 0.1);
  transform: translateY(-1px);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.resource-info {
  flex: 1;
}

.resource-name {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.resource-description {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.permission-item:hover {
  background: #f8f9fa;
  border-color: rgba(4, 120, 87, 0.1);
}

/* Checkbox personalizado mejorado */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2.75rem;
  width: 100%;
  line-height: 1.4;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 2px;
  height: 22px;
  width: 22px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.checkbox-container:hover .checkmark {
  border-color: #047857;
  box-shadow: 0 4px 8px rgba(4, 120, 87, 0.15);
  transform: translateY(-1px);
}

.custom-checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-color: #047857;
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.permission-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.permission-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.permission-description {
  font-size: 0.8rem;
  color: #6c757d;
}

.permissions-summary {
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.no-permissions-state {
  background: white;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  margin-top: 1rem;
}

.json-preview {
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.json-preview pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #2c3e50;
}

/* Footer con botones */
.medico-footer {
  padding: 1.5rem 0 0.5rem 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.btn-secondary {
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

.btn-secondary:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
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

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-save:disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn-primary {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.default-icon,
.hover-icon {
  transition: all 0.3s ease;
}

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
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

/* Responsive mejorado */
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

  .permissions-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .medico-footer {
    padding: 1rem 0;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save,
  .btn-secondary,
  .btn-primary {
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

  .modern-input .form-control {
    font-size: 0.9rem;
  }

  .checkbox-container {
    padding-left: 2.5rem;
  }

  .checkmark {
    height: 20px;
    width: 20px;
  }

  .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 9px;
  }
}
</style>
