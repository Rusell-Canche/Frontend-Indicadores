<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="header-title-section">
            <h3>Asignar Permisos</h3>
            <p class="header-subtitle">Selecciona un usuario y asigna recursos con sus acciones</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="loadUsuarios">
            <i class="fas fa-sync-alt me-2"></i>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="submitForm">
          <!-- Sección de selección de usuario -->
          <div class="search-section mb-4">
            <div class="section-header">
              <h6 class="section-title">
                <i class="fas fa-user me-2"></i>
                Seleccionar Usuario
              </h6>
            </div>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Usuario*</label>
                <div class="modern-select-container">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-user"></i>
                    </span>
                    <select
                      v-model="selectedUserId"
                      class="form-control"
                      required
                      @change="onUserChange"
                    >
                      <option value="" disabled>Seleccione un usuario</option>
                      <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                        {{ usuario.nombre }} {{ usuario.apellido_paterno }}
                        {{ usuario.apellido_materno }} - {{ usuario.email }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del usuario seleccionado -->
          <div v-if="selectedUser" class="form-section">
            <h6 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Información del Usuario
            </h6>
            <div class="usuario-card">
              <div class="usuario-header">
                <div class="usuario-avatar">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="usuario-info">
                  <h5 class="usuario-name">
                    {{ selectedUser.nombre }} {{ selectedUser.apellido_paterno }}
                    {{ selectedUser.apellido_materno }}
                  </h5>
                  <p class="usuario-email">{{ selectedUser.email }}</p>
                </div>
              </div>
              <div class="usuario-details">
                <div class="detail-section">
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="detail-label">Edad:</span>
                      <span class="detail-value">{{ selectedUser.edad }} años</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Ocupación:</span>
                      <span class="detail-value">{{ selectedUser.ocupacion }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Estado:</span>
                      <span class="detail-value">{{ selectedUser.estado }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permisos actuales del usuario -->
          <div
            v-if="selectedUser && selectedUser.permisos && selectedUser.permisos.length > 0"
            class="form-section"
          >
            <h6 class="section-title">
              <i class="fas fa-shield-alt me-2"></i>
              Permisos Actuales
            </h6>
            <div class="permisos-list">
              <div
                v-for="(permiso, index) in selectedUser.permisos"
                :key="index"
                class="permiso-item"
              >
                <div class="permiso-header">
                  <strong>{{ getResourceName(permiso.recurso) }}</strong>
                </div>
                <div class="permiso-actions">
                  <span v-for="accionId in permiso.acciones" :key="accionId" class="action-tag">
                    <i :class="getActionIcon(getActionName(accionId))" class="me-1"></i>
                    {{ capitalizeFirst(getActionName(accionId)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de recursos y permisos para asignar -->
          <div v-if="selectedUser" class="form-section">
            <h6 class="section-title">
              <i class="fas fa-plus-circle me-2"></i>
              Asignar Nuevos Permisos
            </h6>

            <!-- Selector de recurso -->
            <div class="search-section mb-4">
              <div class="row g-3">
                <div class="col-md-8">
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
                      <option
                        v-for="recurso in availableResources"
                        :key="recurso.id"
                        :value="recurso.id"
                      >
                        {{ recurso.nombre }} - {{ recurso.descripcion }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    @click="addResourcePermission"
                    :disabled="!selectedResource"
                  >
                    <i class="fas fa-plus me-2"></i>
                    Agregar Recurso
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de recursos a asignar -->
            <div v-if="newResourcePermissions.length > 0" class="assigned-resources">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Nuevos Recursos a Asignar
              </h6>

              <div class="usuarios-grid">
                <div
                  v-for="(resourcePerm, index) in newResourcePermissions"
                  :key="index"
                  class="usuario-card resource-card"
                >
                  <div class="usuario-header">
                    <div class="usuario-avatar">
                      <i class="fas fa-database"></i>
                    </div>
                    <div class="usuario-info">
                      <h5 class="usuario-name">
                        {{ getResourceName(resourcePerm.recurso) }}
                      </h5>
                      <p class="usuario-email">
                        {{ getResourceDescription(resourcePerm.recurso) }}
                      </p>
                    </div>
                    <div class="usuario-actions">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="removeResourcePermission(index)"
                        title="Eliminar recurso"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Grid de permisos -->
                  <div class="usuario-details">
                    <div class="detail-section">
                      <h6><i class="fas fa-cog me-2"></i>Permisos Disponibles</h6>
                      <div class="permissions-grid">
                        <div v-for="accion in acciones" :key="accion.id" class="permission-item">
                          <label class="checkbox-container">
                            <input
                              type="checkbox"
                              class="custom-checkbox"
                              v-model="resourcePerm.acciones"
                              :value="accion.id"
                              :disabled="hasWildcardPermission(resourcePerm.acciones)"
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
              </div>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button type="button" class="btn btn-secondary" @click="resetForm">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!selectedUser || newResourcePermissions.length === 0"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
            >
              <span v-if="!isHovered" class="default-icon">
                <i class="fas fa-user-shield me-2"></i>
              </span>
              <span v-else class="hover-icon">
                <i class="fas fa-check-circle me-2"></i>
              </span>
              Asignar Permisos
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
  name: 'AssignPermissions',
  data() {
    return {
      // Usuarios disponibles
      usuarios: [],
      selectedUserId: '',
      selectedUser: null,

      // Recursos y acciones
      recursos: [],
      acciones: [],
      selectedResource: '',
      newResourcePermissions: [],
      wildcardActionId: null,

      // Estados
      isHovered: false,
      loading: false,
    }
  },
  computed: {
    // Recursos disponibles (excluyendo los que ya tiene el usuario)
    availableResources() {
      if (!this.selectedUser) return this.recursos

      // Asegurar que permisos existe y es un array
      const userPermissions = this.selectedUser.permisos || []
      const userResourceIds = userPermissions.map((p) => p.recurso)
      return this.recursos.filter((recurso) => !userResourceIds.includes(recurso.id))
    },
  },
  async mounted() {
    await this.loadUsuarios()
    await this.loadRecursos()
    await this.loadAcciones()
  },
  methods: {
    // Método para cargar usuarios desde la API
    async loadUsuarios() {
      try {
        this.loading = true
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          // Normalizar los datos para asegurar que todos tengan permisos
          this.usuarios = (response.data.users || []).map((user) => ({
            ...user,
            permisos: user.permisos || [], // Asegurar que permisos siempre sea un array
          }))
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios disponibles',
        })
      } finally {
        this.loading = false
      }
    },

    // Método para cargar recursos desde la API
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

    // Método para cargar acciones desde la API
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

    // Método llamado cuando cambia la selección de usuario
    onUserChange() {
      this.selectedUser = this.usuarios.find((user) => user.id === this.selectedUserId)

      // Asegurar que selectedUser tenga la propiedad permisos inicializada
      if (this.selectedUser && !this.selectedUser.permisos) {
        this.selectedUser.permisos = []
      }

      this.newResourcePermissions = []
      this.selectedResource = ''
    },

    // Método llamado cuando cambia la selección de recurso
    onResourceChange() {
      // Lógica adicional si es necesaria
    },

    // Método para agregar un recurso con permisos
    addResourcePermission() {
      if (!this.selectedResource) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Debe seleccionar un recurso',
        })
        return
      }

      // Verificar si el recurso ya está en los nuevos permisos
      const exists = this.newResourcePermissions.find((rp) => rp.recurso === this.selectedResource)
      if (exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Este recurso ya ha sido agregado a los nuevos permisos',
        })
        return
      }

      // Verificar si el usuario ya tiene este recurso
      if (
        this.selectedUser &&
        this.selectedUser.permisos &&
        this.selectedUser.permisos.some((p) => p.recurso === this.selectedResource)
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'El usuario ya tiene permisos para este recurso',
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

      // Agregar el recurso
      this.newResourcePermissions.push({
        recurso: this.selectedResource,
        acciones: [...accionesDefault],
      })

      // Limpiar la selección
      this.selectedResource = ''
    },

    // Método para remover un recurso de los nuevos permisos
    removeResourcePermission(index) {
      this.newResourcePermissions.splice(index, 1)
    },

    // Método para obtener el nombre del recurso por ID
    getResourceName(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.nombre : 'Recurso no encontrado'
    },

    // Método para obtener la descripción del recurso por ID
    getResourceDescription(resourceId) {
      const recurso = this.recursos.find((r) => r.id === resourceId)
      return recurso ? recurso.descripcion : ''
    },

    // Método para obtener el nombre de la acción por ID
    getActionName(actionId) {
      const accion = this.acciones.find((a) => a.id === actionId)
      return accion ? accion.nombre : 'Acción no encontrada'
    },

    // Método para obtener el icono según la acción
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

    // Método para capitalizar primera letra
    capitalizeFirst(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    // Método para verificar si tiene permiso wildcard
    hasWildcardPermission(acciones) {
      return this.wildcardActionId && acciones.includes(this.wildcardActionId)
    },

    // Método para limpiar el formulario
    resetForm() {
      this.selectedUserId = ''
      this.selectedUser = null
      this.selectedResource = ''
      this.newResourcePermissions = []
    },

    // Método para enviar el formulario
    async submitForm() {
      if (!this.selectedUser) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe seleccionar un usuario',
        })
        return
      }

      if (this.newResourcePermissions.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe agregar al menos un recurso con permisos',
        })
        return
      }

      // Validar que cada recurso tenga al menos una acción seleccionada
      const invalidResources = this.newResourcePermissions.filter((rp) => rp.acciones.length === 0)
      if (invalidResources.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Cada recurso debe tener al menos una acción seleccionada',
        })
        return
      }

      // Confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres asignar estos permisos a ${this.selectedUser.nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, asignar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          // Crear la estructura de datos para enviar
          const permisosCombinados = [...(this.selectedUser.permisos || [])]

          // Recorremos los nuevos permisos a asignar
          this.newResourcePermissions.forEach((nuevo) => {
            const existente = permisosCombinados.find((p) => p.recurso === nuevo.recurso)

            if (existente) {
              // Si ya existe el recurso, fusionamos las acciones sin duplicados
              const accionesUnicas = new Set([...existente.acciones, ...nuevo.acciones])
              existente.acciones = Array.from(accionesUnicas)
            } else {
              // Si es un recurso nuevo, lo agregamos al array
              permisosCombinados.push({
                recurso: nuevo.recurso,
                acciones: [...nuevo.acciones],
              })
            }
          })

          const permissionsData = {
            usuario_id: this.selectedUserId,
            permisos: permisosCombinados,
          }

          console.log('Datos a enviar:', JSON.stringify(permissionsData, null, 2))

          const token = localStorage.getItem('apiToken')
          const response = await axios.put(
            `http://127.0.0.1:8000/api/usuarios/${this.selectedUserId}`,
            permissionsData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          Swal.fire({
            icon: 'success',
            title: '¡Permisos asignados!',
            text: 'Los permisos han sido asignados correctamente al usuario',
          }).then(() => {
            this.resetForm()
            this.loadUsuarios() // Recargar la lista de usuarios
          })
        } catch (error) {
          console.error('Error al asignar permisos:', error)

          let errorMessage = 'Hubo un error al asignar los permisos.'
          if (error.response && error.response.data && error.response.data.message) {
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

.header-actions {
  z-index: 1;
}

/* Body con el diseño moderno */
.medico-body {
  padding: 2rem;
  background: white;
}

/* Sección de búsqueda */
.search-section {
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.search-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #047857, #065f46);
  border-radius: 16px 16px 0 0;
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

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  border-color: #047857;
  box-shadow: 0 0 0 0.2rem rgba(4, 120, 87, 0.25);
  transform: translateY(-1px);
}

/* Secciones del formulario */
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
  font-size: 0.95rem;
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

/* Grid de usuarios/recursos */
.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.usuario-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.usuario-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #047857, #065f46);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.usuario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(4, 120, 87, 0.15);
  border-color: rgba(4, 120, 87, 0.2);
}

.usuario-card:hover::before {
  transform: scaleX(1);
}

.usuario-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.usuario-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.usuario-info {
  flex: 1;
}

.usuario-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.usuario-email {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.usuario-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.usuario-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-section h6 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.detail-section h6 i {
  color: #047857;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Lista de permisos */
.permisos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.permiso-item {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.permiso-header {
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
}

.permiso-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-tag {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #0d47a1;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(13, 71, 161, 0.1);
}

/* Grid de permisos */
.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.permission-item:hover {
  border-color: rgba(4, 120, 87, 0.2);
  box-shadow: 0 2px 8px rgba(4, 120, 87, 0.1);
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  margin: 0;
}

.custom-checkbox {
  margin: 0;
  width: 18px;
  height: 18px;
  accent-color: #047857;
}

.checkmark {
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #dee2e6;
  border-radius: 3px;
  flex-shrink: 0;
  margin-top: 2px;
}

.permission-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.permission-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.permission-description {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.3;
}

/* Botones */
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
  background: #6c757d;
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline-primary {
  border: 2px solid #047857;
  color: #047857;
  background: transparent;
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #047857;
  color: white;
  transform: translateY(-1px);
}

.btn-outline-danger {
  border: 2px solid #dc3545;
  color: #dc3545;
  background: transparent;
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-1px);
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

/* Footer */
.medico-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin: 2rem -2rem -2rem -2rem;
  border-radius: 0 0 20px 20px;
}

/* Recursos asignados */
.assigned-resources {
  margin-top: 1.5rem;
}

.resource-card .usuario-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
    flex-direction: column;
    gap: 1rem;
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

  .search-section {
    padding: 1rem;
  }

  .usuarios-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .usuario-card {
    padding: 1.25rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .medico-footer {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .medico-header {
    padding: 1rem;
  }

  .medico-body {
    padding: 1rem;
  }

  .search-section {
    padding: 0.75rem;
  }

  .usuario-card {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }
}
</style>
