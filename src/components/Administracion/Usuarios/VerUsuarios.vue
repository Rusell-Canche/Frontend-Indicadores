<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="header-title-section">
            <h3>Gestión de Usuarios</h3>
            <p class="header-subtitle"> </p>
          </div>
        </div>
      </div>

      <!-- Cuerpo de la pagina -->
      <div class="medico-body">

        <!-- Barra de búsqueda -->
        <div class="mb-4">
          <div class="row">
            <div class="col-md-10">
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control"
                  placeholder="Buscar por nombre o email..."
                />
              </div>
            </div>
            <div class="col-md-2 d-flex">
                <button type="button" class="btn btn-primary" @click="$router.push({ name: 'CrearRol' })">
                  <i class="fas fa-plus me-2"></i>
                  Crear rol
                </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando usuarios...</p>
        </div>

        <!-- Lista de usuarios -->
        <div v-else-if="filteredUsuarios.length > 0" class="usuarios-grid">
          <div v-for="usuario in paginatedUsuarios" :key="usuario.id" class="usuario-card">
            <!-- Header de la tarjeta -->
            <div class="usuario-header">
              <div class="usuario-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="usuario-info">
                <h5 class="usuario-name">
                  {{ usuario.nombre }} {{ usuario.apellido_paterno }} {{ usuario.apellido_materno }}
                </h5>
                <p class="usuario-email">{{ usuario.email }}</p>
              </div>
              <div class="usuario-actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="editUsuario(usuario)"
                  title="Editar usuario"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteUsuario(usuario)"
                  title="Eliminar usuario"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Información personal -->
            <div class="usuario-details">
              <div class="detail-section">
                <h6><i class="fas fa-user me-2"></i>Información Personal</h6>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Edad:</span>
                    <span class="detail-value">{{ usuario.edad }} años</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Género:</span>
                    <span class="detail-value">{{ capitalizeFirst(usuario.genero) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value">{{ usuario.estado }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ocupación:</span>
                    <span class="detail-value">{{ usuario.ocupacion }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Escolaridad:</span>
                    <span class="detail-value">{{ usuario.escolaridad }}</span>
                  </div>
                </div>
              </div>

              <!-- Roles -->
              <div class="detail-section" v-if="usuario.roles && usuario.roles.length > 0">
                <h6><i class="fas fa-user-tag me-2"></i>Roles</h6>
                <div class="roles-tags">
                  <span v-for="roleId in usuario.roles" :key="roleId" class="role-tag">
                    {{ getRoleName(roleId) }}
                  </span>
                </div>
              </div>

              <!-- Permisos -->
              <div class="detail-section" v-if="usuario.permisos && usuario.permisos.length > 0">
                <h6><i class="fas fa-shield-alt me-2"></i>Permisos</h6>
                <div class="permisos-list">
                  <div
                    v-for="permiso in usuario.permisos"
                    :key="permiso.recurso"
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
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state text-center py-5">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h4>No hay usuarios disponibles</h4>
          <p class="text-muted">
            {{
              searchTerm
                ? 'No se encontraron usuarios que coincidan con tu búsqueda.'
                : 'Aún no hay usuarios registrados en el sistema.'
            }}
          </p>
        </div>

        <!-- Paginación -->
        <div v-if="filteredUsuarios.length > itemsPerPage" class="pagination-section">
          <nav aria-label="Paginación de usuarios">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
                  <i class="fas fa-angle-double-left"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                  <i class="fas fa-angle-left"></i>
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="currentPage = page">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link"
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-angle-right"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link"
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-angle-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          <div class="pagination-info text-center">
            Mostrando {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredUsuarios.length) }} de
            {{ filteredUsuarios.length }} usuarios
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar usuario -->
    <div
      v-if="showEditModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              Editar Usuario
            </h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateUsuario">
              <!-- Información personal -->
              <div class="form-section">
                <h6 class="section-title">
                  <i class="fas fa-user me-2"></i>
                  Información Personal
                </h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Nombre*</label>
                    <input
                      v-model="editingUsuario.nombre"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Apellido Paterno*</label>
                    <input
                      v-model="editingUsuario.apellido_paterno"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Apellido Materno*</label>
                    <input
                      v-model="editingUsuario.apellido_materno"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email*</label>
                    <input
                      v-model="editingUsuario.email"
                      type="email"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Edad*</label>
                    <input
                      v-model.number="editingUsuario.edad"
                      type="number"
                      class="form-control"
                      required
                      min="18"
                      max="100"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Género*</label>
                    <select v-model="editingUsuario.genero" class="form-control" required>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Estado*</label>
                    <input
                      v-model="editingUsuario.estado"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Ocupación*</label>
                    <input
                      v-model="editingUsuario.ocupacion"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label">Escolaridad*</label>
                    <select v-model="editingUsuario.escolaridad" class="form-control" required>
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Maestría">Maestría</option>
                      <option value="Doctorado">Doctorado</option>
                    </select>
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
            <button type="button" class="btn btn-primary" @click="updateUsuario">
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
      usuarios: [],
      recursos: [],
      roles: [],
      acciones: [],
      loading: false,
      searchTerm: '',
      filterGenero: '',
      filterEscolaridad: '',
      currentPage: 1,
      itemsPerPage: 6,
      showEditModal: false,
      editingUsuario: null,
    }
  },
  computed: {
    filteredUsuarios() {
      let filtered = this.usuarios

      // Filtrar por término de búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (usuario) =>
            usuario.nombre.toLowerCase().includes(term) ||
            usuario.apellido_paterno.toLowerCase().includes(term) ||
            usuario.apellido_materno.toLowerCase().includes(term) ||
            usuario.email.toLowerCase().includes(term) ||
            usuario.estado.toLowerCase().includes(term) ||
            usuario.ocupacion.toLowerCase().includes(term),
        )
      }

      // Filtrar por género (manejar mayúsculas y minúsculas)
      if (this.filterGenero) {
        filtered = filtered.filter(
          (usuario) => usuario.genero.toLowerCase() === this.filterGenero.toLowerCase(),
        )
      }

      // Filtrar por escolaridad
      if (this.filterEscolaridad) {
        filtered = filtered.filter((usuario) => usuario.escolaridad === this.filterEscolaridad)
      }

      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredUsuarios.length / this.itemsPerPage)
    },
    paginatedUsuarios() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredUsuarios.slice(start, end)
    },
    visiblePages() {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (
        let i = Math.max(2, this.currentPage - delta);
        i <= Math.min(this.totalPages - 1, this.currentPage + delta);
        i++
      ) {
        range.push(i)
      }

      if (this.currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (this.currentPage + delta < this.totalPages - 1) {
        rangeWithDots.push('...', this.totalPages)
      } else {
        rangeWithDots.push(this.totalPages)
      }

      return rangeWithDots.filter((page) => page !== '...' || rangeWithDots.length > 1)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage
    },
  },
  async mounted() {
    await this.loadInitialData()
  },
  methods: {
    async loadInitialData() {
      this.loading = true
      try {
        await Promise.all([
          this.loadUsuarios(),
          this.loadRecursos(),
          this.loadRoles(),
          this.loadAcciones(),
        ])
      } finally {
        this.loading = false
      }
    },

    async loadUsuarios() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.usuarios = response.data.users || []
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios',
        })
      }
    },

    async loadRecursos() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/recursos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.recursos = response.data.recursos || []
        }
      } catch (error) {
        console.error('Error al cargar recursos:', error)
      }
    },

    async loadRoles() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.roles = response.data.roles || []
        }
      } catch (error) {
        console.error('Error al cargar roles:', error)
      }
    },

    async loadAcciones() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/acciones', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          this.acciones = response.data.acciones || []
        }
      } catch (error) {
        console.error('Error al cargar acciones:', error)
      }
    },

    getRoleName(roleId) {
      const role = this.roles.find((r) => r.id === roleId)
      return role ? role.nombre : 'Rol desconocido'
    },

    getResourceName(resourceId) {
      const resource = this.recursos.find((r) => r.id === resourceId)
      return resource ? resource.nombre : 'Recurso desconocido'
    },

    getActionName(actionId) {
      const action = this.acciones.find((a) => a.id === actionId)
      return action ? action.nombre : 'Acción desconocida'
    },

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

    capitalizeFirst(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    editUsuario(usuario) {
      this.editingUsuario = { ...usuario }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editingUsuario = null
    },

    async updateUsuario() {
      if (!this.editingUsuario) return

      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.put(
          `http://127.0.0.1:8000/api/usuarios/${this.editingUsuario.id}`,
          this.editingUsuario,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente',
          })

          // Actualizar la lista
          await this.loadUsuarios()
          this.closeEditModal()
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario',
        })
      }
    },

    async deleteUsuario(usuario) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar al usuario ${usuario.nombre} ${usuario.apellido_paterno}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('apiToken')
          const response = await axios.delete(`http://127.0.0.1:8000/api/usuarios/${usuario.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado correctamente',
            })

            // Actualizar la lista
            await this.loadUsuarios()
          }
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario',
          })
        }
      }
    },
  },
  watch: {
    searchTerm() {
      this.currentPage = 1
    },
    filterGenero() {
      this.currentPage = 1
    },
    filterEscolaridad() {
      this.currentPage = 1
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

/* Grid de usuarios */
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

/* Tags de roles */
.roles-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-tag {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
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

/* Estado vacío */
.empty-state {
  padding: 3rem 1rem;
}

.empty-state i {
  opacity: 0.3;
}

.empty-state h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

/* Paginación */
.pagination-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.pagination .page-link {
  border: 2px solid #e9ecef;
  color: #047857;
  padding: 0.75rem 1rem;
  margin: 0 0.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination .page-link:hover {
  background: #047857;
  border-color: #047857;
  color: white;
  transform: translateY(-1px);
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-color: #047857;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background: #f8f9fa;
  border-color: #e9ecef;
}

.pagination-info {
  margin-top: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Loading spinner */
.spinner-border.text-primary {
  color: #047857 !important;
}

/* Modal */
.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  border-bottom: none;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}

.form-section {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #047857, #065f46);
  border-radius: 12px 12px 0 0;
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

  .usuario-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .usuario-actions {
    align-self: flex-end;
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

  .search-section .row .col-md-6:last-child .d-flex {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .pagination .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
