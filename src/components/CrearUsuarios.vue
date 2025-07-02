<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Usuario</h3>
            <p class="header-subtitle">Proporciona los siguientes datos para crear la cuenta</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="submitForm">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>Todos los campos son obligatorios para crear la
            cuenta
          </div>

          <!-- Sección de información personal -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-user me-2"></i>
              Información Personal
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    v-model="nombre"
                    type="text"
                    id="nombre"
                    name="nombre"
                    class="form-control"
                    required
                    placeholder="Ingrese el nombre"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Apellido Paterno*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    v-model="apellido_paterno"
                    type="text"
                    id="apellido_paterno"
                    name="apellido_paterno"
                    class="form-control"
                    required
                    placeholder="Ingrese el apellido paterno"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Apellido Materno*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    v-model="apellido_materno"
                    type="text"
                    id="apellido_materno"
                    name="apellido_materno"
                    class="form-control"
                    required
                    placeholder="Ingrese el apellido materno"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Correo Electrónico*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    v-model="email"
                    type="email"
                    id="email"
                    name="email"
                    class="form-control"
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de seguridad -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-lock me-2"></i>
              Información de Seguridad
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Contraseña*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    v-model="password"
                    type="password"
                    id="password"
                    name="password"
                    class="form-control"
                    required
                    placeholder="Ingrese la contraseña"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Confirmar Contraseña*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    v-model="confirm_password"
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    class="form-control"
                    required
                    placeholder="Confirme la contraseña"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de recursos y permisos -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-shield-alt me-2"></i>
              Recursos y Permisos
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
            <div v-if="resourcePermissions.length > 0" class="assigned-resources">
              <h6 class="mb-3">
                <i class="fas fa-list me-2"></i>
                Recursos Asignados
              </h6>

              <div
                v-for="(resourcePerm, index) in resourcePermissions"
                :key="index"
                class="resource-permission-card mb-3"
              >
                <div class="resource-header">
                  <div class="resource-info">
                    <h6 class="resource-name">
                      {{ getResourceName(resourcePerm.recurso_id) }}
                    </h6>
                    <p class="resource-description">
                      {{ getResourceDescription(resourcePerm.recurso_id) }}
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

                <div class="permissions-grid">
                  <div class="permission-item">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="resourcePerm.permisos.leer"
                      />
                      <span class="checkmark"></span>
                      <div class="permission-content">
                        <span class="permission-title">
                          <i class="fas fa-eye me-2"></i>
                          Leer
                        </span>
                        <span class="permission-description">Consultar información</span>
                      </div>
                    </label>
                  </div>

                  <div class="permission-item">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="resourcePerm.permisos.crear"
                      />
                      <span class="checkmark"></span>
                      <div class="permission-content">
                        <span class="permission-title">
                          <i class="fas fa-plus me-2"></i>
                          Crear
                        </span>
                        <span class="permission-description">Crear nuevos registros</span>
                      </div>
                    </label>
                  </div>

                  <div class="permission-item">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="resourcePerm.permisos.editar"
                      />
                      <span class="checkmark"></span>
                      <div class="permission-content">
                        <span class="permission-title">
                          <i class="fas fa-edit me-2"></i>
                          Editar
                        </span>
                        <span class="permission-description">Modificar registros existentes</span>
                      </div>
                    </label>
                  </div>

                  <div class="permission-item">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="resourcePerm.permisos.eliminar"
                      />
                      <span class="checkmark"></span>
                      <div class="permission-content">
                        <span class="permission-title">
                          <i class="fas fa-trash me-2"></i>
                          Eliminar
                        </span>
                        <span class="permission-description">Eliminar registros</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de roles -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-user-tag me-2"></i>
              Roles del Usuario
            </h6>
            <div class="roles-container">
              <div class="role-item">
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    id="adminSwitch"
                    name="roles[]"
                    value="administrador"
                    @change="updateRoles"
                  />
                  <span class="checkmark"></span>
                  <div class="role-content">
                    <span class="role-title">Administrador</span>
                    <span class="role-description">Acceso completo al sistema</span>
                  </div>
                </label>
              </div>
              <div class="role-item">
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    id="comentariosSwitch"
                    name="roles[]"
                    value="capturista"
                    @change="updateRoles"
                  />
                  <span class="checkmark"></span>
                  <div class="role-content">
                    <span class="role-title">Capturista</span>
                    <span class="role-description">Puede capturar y editar información</span>
                  </div>
                </label>
              </div>
              <div class="role-item">
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    id="validadorSwitch"
                    name="roles[]"
                    value="validador"
                    @change="updateRoles"
                  />
                  <span class="checkmark"></span>
                  <div class="role-content">
                    <span class="role-title">Validador</span>
                    <span class="role-description">Puede validar y aprobar información</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button type="button" class="btn btn-cancel" @click="resetForm">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button
              type="submit"
              class="btn btn-save"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
            >
              <span v-if="!isHovered" class="default-icon"
                ><i class="fas fa-user-plus me-2"></i
              ></span>
              <span v-else class="hover-icon"><i class="fas fa-user-check me-2"></i></span>
              Registrar Usuario
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
      nombre: '',
      apellido_materno: '',
      apellido_paterno: '',
      email: '',
      password: '',
      confirm_password: '',
      roles: [],
      isHovered: false,
      // Nuevas propiedades para recursos
      recursos: [],
      selectedResource: '',
      resourcePermissions: [],
    }
  },
  async mounted() {
    await this.loadRecursos()
  },
  methods: {
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

    // Método llamado cuando cambia la selección de recurso
    onResourceChange() {},

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

      // Verificar si el recurso ya está asignado
      const exists = this.resourcePermissions.find((rp) => rp.recurso_id === this.selectedResource)
      if (exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Este recurso ya ha sido asignado',
        })
        return
      }

      // Agregar el recurso con permisos por defecto
      this.resourcePermissions.push({
        recurso_id: this.selectedResource,
        permisos: {
          leer: false,
          crear: false,
          editar: false,
          eliminar: false,
        },
      })

      // Limpiar la selección
      this.selectedResource = ''
    },

    // Método para remover un recurso asignado
    removeResourcePermission(index) {
      this.resourcePermissions.splice(index, 1)
    },

    updateRoles() {
      this.roles = []
      const checkboxes = document.getElementsByName('roles[]')
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          this.roles.push(checkbox.value)
        }
      })
    },

    resetForm() {
      this.nombre = ''
      this.apellido_materno = ''
      this.apellido_paterno = ''
      this.email = ''
      this.password = ''
      this.confirm_password = ''
      this.roles = []
      this.selectedResource = ''
      this.resourcePermissions = []

      const checkboxes = document.getElementsByName('roles[]')
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false
      })
    },

    async submitForm() {
      // Verificación de campos obligatorios
      if (
        !this.nombre ||
        !this.apellido_materno ||
        !this.apellido_paterno ||
        !this.email ||
        !this.password ||
        !this.confirm_password
      ) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Todos los campos son obligatorios',
        })
        return
      }

      // Verificación de coincidencia de contraseñas
      if (this.password !== this.confirm_password) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Las contraseñas no coinciden',
        })
        return
      }

      // Confirmación de creación del usuario
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres crear el usuario?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
      })

      // Proceder con la creación del usuario si se confirma
      if (result.isConfirmed) {
        const formData = {
          nombre: this.nombre,
          apellido_materno: this.apellido_materno,
          apellido_paterno: this.apellido_paterno,
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password,
          roles: [...this.roles],
          recursos_permisos: [...this.resourcePermissions], // Incluir los permisos de recursos
        }

        try {
          const response = await axios.post('/users', formData)
          Swal.fire({
            icon: 'success',
            title: '¡Usuario creado!',
            text: response.data.message,
          }).then(() => {
            this.resetForm()
          })
        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors
            let errorMessage = 'Hubo un error al crear el usuario.'

            if (errors.email && errors.email.length > 0) {
              errorMessage = 'El correo electrónico ya está en uso.'
            } else if (errors.password && errors.password.length > 0) {
              errorMessage = 'La contraseña no cumple con los requisitos.'
            }

            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: errorMessage,
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'Hubo un error al crear el usuario. Por favor, inténtalo de nuevo.',
            })
          }
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

/* Estilos para roles */
.roles-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.role-item {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(4, 120, 87, 0.1);
  transition: all 0.3s ease;
}

.role-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(4, 120, 87, 0.1);
}

/* Checkbox personalizado */
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2.5rem;
  width: 100%;
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
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
  border-color: #047857;
}

.custom-checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-color: #047857;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.role-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.role-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.role-description {
  font-size: 0.8rem;
  color: #6c757d;
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

.btn-save:hover {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.default-icon,
.hover-icon {
  transition: all 0.3s ease;
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

  .roles-container {
    grid-template-columns: 1fr;
  }

  .medico-footer {
    padding: 1rem 0;
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
}
</style>
