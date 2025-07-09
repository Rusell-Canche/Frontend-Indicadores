<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-users-cog"></i>
          </div>
          <div class="header-title-section">
            <h3>Gestión de Roles</h3>
            <p class="header-subtitle">
              Administra los roles del sistema: visualiza, edita y elimina
            </p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <!-- Filtros y controles -->
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="input-group modern-input">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Buscar roles por nombre o descripción..."
              />
            </div>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <button type="button" class="btn btn-primary me-2" @click="loadRoles">
              <i class="fas fa-sync-alt me-2"></i>
              Actualizar
            </button>
          </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando roles...</p>
        </div>

        <!-- Lista de roles -->
        <div v-else-if="filteredRoles.length > 0" class="roles-grid">
          <div v-for="role in filteredRoles" :key="role.id" class="role-card mb-4">
            <!-- Header del rol -->
            <div class="role-header">
              <div class="role-info">
                <h5 class="role-name">
                  <i class="fas fa-user-tag me-2"></i>
                  {{ role.nombre }}
                </h5>
                <p class="role-description">{{ role.descripcion }}</p>
                <div class="role-meta">
                  <span class="badge bg-primary me-2">
                    <i class="fas fa-shield-alt me-1"></i>
                    {{ getTotalPermissions(role) }} permisos
                  </span>
                  <span class="badge bg-info">
                    <i class="fas fa-calendar me-1"></i>
                    {{ formatDate(role.created_at) }}
                  </span>
                </div>
              </div>
              <div class="role-actions">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary me-2"
                  @click="toggleRoleDetails(role.id)"
                >
                  <i class="fas fa-eye me-1"></i>
                  {{ expandedRoles.includes(role.id) ? 'Ocultar' : 'Ver' }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-warning me-2"
                  @click="editRole(role)"
                >
                  <i class="fas fa-edit me-1"></i>
                  Editar
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteRole(role)"
                >
                  <i class="fas fa-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Detalles expandibles del rol -->
            <div v-if="expandedRoles.includes(role.id)" class="role-details">
              <div class="permissions-section">
                <h6 class="mb-3">
                  <i class="fas fa-list me-2"></i>
                  Permisos Asignados
                </h6>

                <div
                  v-for="permiso in role.permisos"
                  :key="permiso.id"
                  class="permission-detail mb-3"
                >
                  <div class="permission-resource">
                    <h6 class="resource-name">
                      <i class="fas fa-database me-2"></i>
                      {{ getResourceName(permiso.recurso) }}
                    </h6>
                    <p class="resource-description">
                      {{ getResourceDescription(permiso.recurso) }}
                    </p>
                  </div>

                  <div class="actions-grid">
                    <div v-for="accionId in permiso.acciones" :key="accionId" class="action-badge">
                      <span class="badge bg-secondary">
                        <i :class="getActionIcon(getActionName(accionId))" class="me-1"></i>
                        {{ capitalizeFirst(getActionName(accionId)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="no-roles-state">
          <div class="text-center py-5">
            <i class="fas fa-users-cog fa-3x text-muted mb-3"></i>
            <h6 class="text-muted">No hay roles disponibles</h6>
            <p class="text-muted small">
              {{
                searchTerm
                  ? 'No se encontraron roles que coincidan con tu búsqueda'
                  : 'Crea el primer rol para comenzar'
              }}
            </p>
            <button
              v-if="!searchTerm"
              type="button"
              class="btn btn-primary mt-3"
              @click="$emit('create-role')"
            >
              <i class="fas fa-plus me-2"></i>
              Crear Primer Rol
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div
      v-if="editingRole"
      class="modal fade show"
      style="display: block; background-color: rgba(0, 0, 0, 0.5)"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              Editar Rol: {{ editingRole.nombre }}
            </h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateRole">
              <!-- Información básica -->
              <div class="form-section mb-4">
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
                        v-model="editForm.nombre"
                        type="text"
                        class="form-control"
                        required
                        placeholder="ej: super_usuario, administrador"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Descripción*</label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-align-left"></i>
                      </span>
                      <input
                        v-model="editForm.descripcion"
                        type="text"
                        class="form-control"
                        required
                        placeholder="Describe las funciones de este rol"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Permisos -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="fas fa-shield-alt me-2"></i>
                  Permisos del Rol
                </h6>

                <!-- Selector de recurso -->
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Agregar Recurso</label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-database"></i>
                      </span>
                      <select v-model="editForm.selectedResource" class="form-control">
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
                      @click="addResourceToEdit"
                      :disabled="!editForm.selectedResource"
                    >
                      <i class="fas fa-plus me-2"></i>
                      Agregar Recurso
                    </button>
                  </div>
                </div>

                <!-- Permisos asignados -->
                <div v-if="editForm.permisos.length > 0">
                  <div
                    v-for="(permiso, index) in editForm.permisos"
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
                        @click="removeResourceFromEdit(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>

                    <div class="permissions-grid">
                      <div v-for="accion in acciones" :key="accion.id" class="permission-item">
                        <label class="checkbox-container">
                          <input
                            type="checkbox"
                            class="custom-checkbox"
                            v-model="permiso.acciones"
                            :value="accion.id"
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
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">
              <i class="fas fa-times me-2"></i>
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="updateRole">
              <i class="fas fa-save me-2"></i>
              Guardar Cambios
            </button>
          </div>
        </div>
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
      // Lista de roles
      roles: [],

      // Filtros
      searchTerm: '',

      // Estados
      loading: false,
      expandedRoles: [],

      // Datos auxiliares
      recursos: [],
      acciones: [],

      // Edición
      editingRole: null,
      editForm: {
        nombre: '',
        descripcion: '',
        permisos: [],
        selectedResource: '',
      },
    }
  },
  computed: {
    filteredRoles() {
      if (!this.searchTerm) {
        return this.roles
      }

      return this.roles.filter(
        (role) =>
          role.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          role.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    },
  },
  async mounted() {
    await this.loadInitialData()
  },
  methods: {
    // Cargar datos iniciales
    async loadInitialData() {
      await Promise.all([this.loadRoles(), this.loadRecursos(), this.loadAcciones()])
    },

    // Cargar roles
    async loadRoles() {
      this.loading = true
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.roles = response.data.roles
        }
      } catch (error) {
        console.error('Error al cargar roles:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los roles',
        })
      } finally {
        this.loading = false
      }
    },

    // Cargar recursos
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
      }
    },

    // Cargar acciones
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
        }
      } catch (error) {
        console.error('Error al cargar acciones:', error)
      }
    },

    // Alternar detalles del rol
    toggleRoleDetails(roleId) {
      const index = this.expandedRoles.indexOf(roleId)
      if (index > -1) {
        this.expandedRoles.splice(index, 1)
      } else {
        this.expandedRoles.push(roleId)
      }
    },

    // Obtener nombre del recurso
    getResourceName(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.nombre : 'Recurso no encontrado'
    },

    // Obtener descripción del recurso
    getResourceDescription(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.descripcion : ''
    },

    // Obtener nombre de la acción
    getActionName(actionId) {
      const accion = this.acciones.find((a) => a.id === actionId)
      return accion ? accion.nombre : 'Acción no encontrada'
    },

    // Obtener icono de la acción
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

    // Obtener total de permisos
    getTotalPermissions(role) {
      return role.permisos.reduce((total, permiso) => {
        return total + (permiso.acciones ? permiso.acciones.length : 0)
      }, 0)
    },

    // Formatear fecha
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    // Editar rol
    editRole(role) {
      this.editingRole = role
      this.editForm = {
        nombre: role.nombre,
        descripcion: role.descripcion,
        permisos: role.permisos.map((p) => ({
          recurso: p.recurso,
          acciones: [...p.acciones],
        })),
        selectedResource: '',
      }
    },

    // Cerrar modal de edición
    closeEditModal() {
      this.editingRole = null
      this.editForm = {
        nombre: '',
        descripcion: '',
        permisos: [],
        selectedResource: '',
      }
    },

    // Agregar recurso en edición
    addResourceToEdit() {
      if (!this.editForm.selectedResource) return

      const exists = this.editForm.permisos.find(
        (p) => p.recurso === this.editForm.selectedResource,
      )
      if (exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Este recurso ya ha sido asignado',
        })
        return
      }

      this.editForm.permisos.push({
        recurso: this.editForm.selectedResource,
        acciones: [],
      })

      this.editForm.selectedResource = ''
    },

    // Remover recurso en edición
    removeResourceFromEdit(index) {
      this.editForm.permisos.splice(index, 1)
    },

    // Actualizar rol
    async updateRole() {
      if (!this.editForm.nombre.trim() || !this.editForm.descripcion.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nombre y la descripción son obligatorios',
        })
        return
      }

      if (this.editForm.permisos.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe asignar al menos un permiso',
        })
        return
      }

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres actualizar el rol "${this.editForm.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('apiToken')
          const formData = {
            nombre: this.editForm.nombre.trim(),
            descripcion: this.editForm.descripcion.trim(),
            permisos: this.editForm.permisos.map((p) => ({
              recurso: p.recurso,
              acciones: p.acciones,
            })),
          }

          const response = await axios.put(
            `http://127.0.0.1:8000/api/roles/${this.editingRole.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          )

          Swal.fire({
            icon: 'success',
            title: '¡Rol actualizado!',
            text: `El rol "${this.editForm.nombre}" ha sido actualizado exitosamente`,
          })

          this.closeEditModal()
          await this.loadRoles()
        } catch (error) {
          console.error('Error al actualizar rol:', error)
          let errorMessage = 'Hubo un error al actualizar el rol.'

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          })
        }
      }
    },

    // Eliminar rol
    async deleteRole(role) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar el rol "${role.nombre}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
      })

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('apiToken')
          await axios.delete(`http://127.0.0.1:8000/api/roles/${role.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          Swal.fire({
            icon: 'success',
            title: '¡Rol eliminado!',
            text: `El rol "${role.nombre}" ha sido eliminado exitosamente`,
          })

          await this.loadRoles()
        } catch (error) {
          console.error('Error al eliminar rol:', error)
          let errorMessage = 'Hubo un error al eliminar el rol.'

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          })
        }
      }
    },
  },
}
</script>

<style scoped>
/* Estilos del header */
.medico-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px 12px 0 0;
  color: white;
  position: relative;
  overflow: hidden;
}

.medico-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-icon i {
  font-size: 24px;
}

.header-title-section h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Estilos del body */
.medico-body {
  padding: 2rem;
  background: #f8f9fa;
}

/* Estilos de las tarjetas de roles */
.role-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.role-info {
  flex: 1;
}

.role-name {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.role-description {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.role-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Estilos de los detalles del rol */
.role-details {
  padding: 1.5rem;
  background: #f8f9fa;
}

.permission-detail {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.permission-resource {
  margin-bottom: 1rem;
}

.resource-name {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.resource-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-badge .badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
}

/* Estilos del modal y formularios */
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.modern-input {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.modern-input .input-group-text {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;
}

.modern-input .form-control {
  border: 1px solid #dee2e6;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.modern-input .form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-color: #007bff;
}

/* Estilos de permisos */
.resource-permission-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.permission-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #eee;
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-container:hover .checkmark {
  background-color: #f0f0f0;
  border-color: #007bff;
}

.custom-checkbox:checked ~ .checkmark {
  background-color: #007bff;
  border-color: #007bff;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.checkmark:after {
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.permission-content {
  flex: 1;
}

.permission-title {
  display: block;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.permission-description {
  display: block;
  color: #6c757d;
  font-size: 0.8rem;
  line-height: 1.3;
}

/* Estados vacíos */
.no-roles-state {
  padding: 3rem 1rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.no-roles-state i {
  color: #adb5bd;
}

/* Botones personalizados */
.btn-save {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .medico-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .medico-body {
    padding: 1rem;
  }

  .role-header {
    flex-direction: column;
    gap: 1rem;
  }

  .role-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    justify-content: flex-start;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.role-card {
  animation: fadeIn 0.3s ease-out;
}

/* Spinner personalizado */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Badges personalizados */
.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.bg-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
}

.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
}

.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%) !important;
}

/* Modal personalizado */
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 1.5rem;
}

.modal-title {
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

/* Scrollbar personalizada */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Efectos de hover en botones */
.btn-outline-primary:hover {
  background-color: #007bff;
  border-color: #007bff;
  transform: translateY(-1px);
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  border-color: #ffc107;
  transform: translateY(-1px);
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  transform: translateY(-1px);
}

/* Transiciones suaves */
.btn {
  transition: all 0.2s ease;
}

.role-card,
.permission-detail,
.resource-permission-card {
  transition: all 0.3s ease;
}

/* Mejoras en la accesibilidad */
.btn:focus,
.form-control:focus,
.custom-checkbox:focus ~ .checkmark {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Estados de loading */
.loading-overlay {
  position: relative;
}

.loading-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Mejoras en el contraste */
.text-muted {
  color: #6c757d !important;
}

.form-text {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Estilos adicionales para la búsqueda */
.search-highlight {
  background-color: #fff3cd;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
}

/* Animación de carga */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.loading .role-card {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
