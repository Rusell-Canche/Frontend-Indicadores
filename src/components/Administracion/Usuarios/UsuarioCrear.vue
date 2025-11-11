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
                    v-model="usuario.nombre"
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
                    v-model="usuario.apellido_paterno"
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
                    v-model="usuario.apellido_materno"
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
                    v-model="usuario.email"
                    type="email"
                    id="email"
                    name="email"
                    class="form-control"
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Edad*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                  <input
                    v-model.number="usuario.edad"
                    type="number"
                    id="edad"
                    name="edad"
                    class="form-control"
                    required
                    min="18"
                    max="100"
                    placeholder="Ingrese la edad"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Género*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-venus-mars"></i>
                  </span>
                  <select v-model="usuario.genero" id="genero" name="genero" class="form-control" required>
                    <option value="">Seleccione el género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="noBinario">No binario</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Estado*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                  <input
                    v-model="usuario.estado"
                    type="text"
                    id="estado"
                    name="estado"
                    class="form-control"
                    required
                    placeholder="Ingrese el estado"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ocupación*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-briefcase"></i>
                  </span>
                  <input
                    v-model="usuario.ocupacion"
                    type="text"
                    id="ocupacion"
                    name="ocupacion"
                    class="form-control"
                    required
                    placeholder="Ingrese la ocupación"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Escolaridad*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-graduation-cap"></i>
                  </span>
                  <select
                    v-model="usuario.escolaridad"
                    id="escolaridad"
                    name="escolaridad"
                    class="form-control"
                    required
                  >
                    <option value="">Seleccione la escolaridad</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Maestría">Maestría</option>
                    <option value="Doctorado">Doctorado</option>
                  </select>
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
                    v-model="usuario.password"
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

          <!-- Sección de roles -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-user-tag me-2"></i>
              Roles del Usuario
            </h6>
            <div class="roles-container">
              <div v-for="rol in rolState.roles" :key="rol.id" class="role-item">
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :id="`role_${rol.id}`"
                    :value="rol.id"
                    v-model="usuario.roles"
                  />
                  <span class="checkmark"></span>
                  <div class="role-content">
                    <span class="role-title">{{ rol.nombre }}</span>
                    <span class="role-description">{{ rol.descripcion }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <editar-permisos v-model:permisos="usuario.permisos" v-model:ui-permissions="usuario.ui_permissions"/>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button
              type="submit"
              class="btn btn-save"
            >
              <span class="hover-icon"><i class="fas fa-user-check me-2"/></span>
              Registrar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import EditarPermisos from '../EditarPermisos.vue';
import type { Usuario } from '@/models/usuario';
import type { Rol } from '@/models/rol';
import { UsuarioService } from '@/services/Administracion/usuario.service';
import { RolService, rolState } from '@/services/Administracion/rol.service';
export default {
  components: {
    EditarPermisos
  },
  data() {
    return {
      RolService,
      rolState,
      UsuarioService,

      usuario: {
      nombre: '',
      apellido_materno: '',
      apellido_paterno: '',
      email: '',
      password: '',
            edad: 0,
      genero: '',
      estado: '',
      ocupacion: '',
      escolaridad: '',
      roles: [],
      permisos: { allowed: [], denied: []},
      ui_permissions: {}
      } as Usuario,

      roles: [] as Rol[],
      // Campos básicos

      confirm_password: '',

      wildcardActionId: null, // ID de la acción "*"
    }
  },
  async mounted() {
    try {
      await RolService.fetchRoles();

    } catch(error) {
      console.log(error)
    }
  },
  methods: {
    // Método submitForm con el nuevo formato de JSON
    async submitForm() {
      // Confirmación de creación del usuario
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres crear el usuario?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
      })

            if (result.isDenied || result.isDismissed) {
        return;
      }

      // Intentamos registrar el usuario
      try {
        await this.UsuarioService.createUsuario(this.usuario)

                Swal.fire({
          icon: 'success',
          title: 'Usuario creado!',
          text: `El usuario "${this.usuario.nombre}" ha sido creado exitosamente`,
        }).then(() => {
          this.$router.push({ name: 'VerUsuarios' })
        })
      } catch (error) {
        console.log(error)
        // Errores genericos
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el usuario.',
          icon: 'error'
        });
      }
    },
  },
}
</script>

<style scoped>
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

/* Estilos mejorados para roles - NUEVOS ESTILOS AGREGADOS */
.roles-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.role-item {
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 2px solid rgba(4, 120, 87, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.role-item::before {
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

.role-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.15);
  border-color: rgba(4, 120, 87, 0.2);
}

.role-item:hover::before {
  transform: scaleX(1);
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

.role-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  flex: 1;
}

.role-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.4rem;
  font-size: 1rem;
  line-height: 1.3;
}

.role-description {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
}

/* Estilos para recursos y permisos existentes */
.assigned-resources {
  margin-top: 1.5rem;
}

.resource-permission-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
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

  .roles-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .role-item {
    padding: 1rem;
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

  .role-item {
    padding: 0.875rem;
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
