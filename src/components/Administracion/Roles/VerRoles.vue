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
            <button type="button" class="btn btn-primary me-2" @click="$router.push({name : 'CrearRoles'})">
              <i class="fas fa-plus me-2"></i>
              Crear rol
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
        <div v-else class="roles-grid">
          <div v-for="role in roles" :key="role._id" class="role-card mb-4">
            <!-- Header del rol -->
            <div class="role-header">
              <div class="role-info">
                <h5 class="role-name">
                  <i class="fas fa-user-tag me-2"></i>
                  {{ role.nombre }}
                </h5>
                <p class="role-description">{{ role.descripcion }}</p>
                
              </div>
              <div class="role-actions">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary me-2"
                  
                >
                  <i class="fas fa-eye me-1"></i>

                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-warning me-2"
               
                >
                  <i class="fas fa-edit me-1"></i>
                  Editar
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  
                >
                  <i class="fas fa-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Detalles expandibles del rol -->

          </div>
        </div>

        <!-- Estado vacío -->

      </div>
    </div>

    <!-- Modal de edición -->

  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import axios from 'axios'
import type { Rol } from '@/models/rol'
import { RolService, rolState } from '@/services/Administracion/rol.service'
export default {
  data() {
    return {
      rolState,

      // Lista de roles
      roles: [] as Rol[],

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
    
    await RolService.fetchRoles(); // trae y actualiza automáticamente el state
    this.roles = rolState.roles || []
    console.table(this.rolState.roles, ['nombre', 'descripcion']);

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
/* Estilos base del diseño moderno */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
}

/* Header con el diseño moderno - ACTUALIZADO CON PALETA VERDE */
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

/* Estilos de inputs modernos - ACTUALIZADOS CON PALETA VERDE */
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

/* Estilos de las tarjetas de roles */
.role-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(4, 120, 87, 0.1);
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.15);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.role-info {
  flex: 1;
}

.role-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
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
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 3px solid #047857;
}

.permission-detail {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(4, 120, 87, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.permission-resource {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.resource-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
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
  border-radius: 8px;
}

/* Estilos del modal y formularios */
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

/* Estilos de permisos */
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

/* Checkbox personalizado mejorado - ACTUALIZADO CON PALETA VERDE */
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

/* Estados vacíos */
.no-roles-state {
  background: white;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  margin-top: 1rem;
}

/* Botones personalizados - ACTUALIZADOS CON PALETA VERDE */
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

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

/* Badges personalizados - ACTUALIZADOS CON PALETA VERDE */
.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
}

.bg-primary {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
}

.bg-info {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%) !important;
}

.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%) !important;
}

/* Modal personalizado - ACTUALIZADO CON PALETA VERDE */
.modal-content {
  border-radius: 20px;
  border: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  border-radius: 0;
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.modal-title {
  font-weight: 600;
  margin: 0;
  z-index: 1;
  position: relative;
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
  z-index: 1;
  position: relative;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  background: white;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Spinner personalizado - ACTUALIZADO CON PALETA VERDE */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-primary {
  color: #047857 !important;
}

/* Efectos de hover en botones outline - ACTUALIZADOS CON PALETA VERDE */
.btn-outline-primary {
  color: #047857;
  border-color: #047857;
}

.btn-outline-primary:hover {
  background-color: #047857;
  border-color: #047857;
  transform: translateY(-1px);
  color: white;
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

/* Transiciones suaves */
.btn {
  transition: all 0.2s ease;
}

.role-card,
.permission-detail,
.resource-permission-card {
  transition: all 0.3s ease;
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
  background: #047857;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #065f46;
}

/* Mejoras en la accesibilidad */
.btn:focus,
.form-control:focus,
.custom-checkbox:focus ~ .checkmark {
  outline: 2px solid #047857;
  outline-offset: 2px;
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
    gap: 0.5rem;
  }

  .actions-grid {
    justify-content: flex-start;
  }

  .modal-footer {
    padding: 1rem;
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
