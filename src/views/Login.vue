<template>
  <!-- Animación del avión de papel -->
  <div v-if="showPaperPlane" class="paper-plane-container">
    <div class="paper-plane jello-horizontal">
      <i class="fas fa-paper-plane"></i>
    </div>
    <div class="success-message">
      <h3>¡Bienvenido al Sistema!</h3>
      <p>Accediendo a tu panel de indicadores...</p>
    </div>
  </div>

  <!-- Modal de creación/edición -->
  <div v-if="showModal" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="modal-title-section">
            <h3>Registro</h3>
            <p class="modal-subtitle">Regístrate aquí</p>
          </div>
        </div>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body del modal -->
      <div class="modal-body">
        <form @submit.prevent="registrarUsuario">
          <div class="form-group">
            <label class="form-label">Nombre*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-user"></i>
              </div>
              <input
                v-model="registerForm.username"
                type="text"
                class="form-input"
                placeholder="Ej: Juan"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <input
                v-model="registerForm.email"
                type="email"
                class="form-input"
                placeholder="tu@email.com"
                required
                :class="{ error: errors.email }"
              />
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Tu contraseña"
                required
                :class="{ error: errors.password }"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
        </form>
      </div>

      <!-- Footer del modal -->
      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-cancel">
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button @click="registrarUsuario" class="btn btn-save" :disabled="registrando">
          <template v-if="registrando">
            <div class="spinner-container">
              <div class="spinner"></div>
            </div>
            Registrando...
          </template>
          <template v-else> <i class="fas fa-save me-2"></i> Registrarse </template>
        </button>
      </div>
    </div>
  </div>

  <div class="login-container">
    <!-- Fondo animado -->
    <div class="animated-background">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
    </div>

    <!-- Contenido principal -->
    <div class="login-content">
      <!-- Panel izquierdo - Información -->
      <div class="info-panel">
        <div class="info-content">
          <div class="logo-section">
            <div class="logo-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <p class="logo-subtitle">Sistema de Gestión de Indicadores</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-plus-circle"></i>
              </div>
              <div class="feature-text">
                <h3>Crear Indicadores</h3>
                <p>Diseña y configura indicadores personalizados</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="feature-text">
                <h3>Gestión de Plantillas</h3>
                <p>Crea y administra plantillas reutilizables</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-folder-open"></i>
              </div>
              <div class="feature-text">
                <h3>Documentos Inteligentes</h3>
                <p>Organiza y completa documentación</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario de login -->
      <div class="login-panel">
        <div class="login-form-container">
          <div class="form-header">
            <h2 class="form-title">Bienvenido de vuelta</h2>
            <p class="form-subtitle">Accede a tu panel de indicadores</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <input
                  v-model="loginForm.email"
                  type="email"
                  class="form-input"
                  placeholder="tu@email.com"
                  required
                  :class="{ error: errors.email }"
                />
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Tu contraseña"
                  required
                  :class="{ error: errors.password }"
                />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <button type="submit" class="login-button" :disabled="isLoading">
              <template v-if="isLoading">
                <div class="loading-spinner"></div>
                Iniciando sesión...
              </template>
              <template v-else> <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión </template>
            </button>
          </form>

          <div class="signup-link">
            <p>¿No tienes una cuenta? <a href="#" @click="abrirModal">Regístrate aquí</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
      },
      showModal: false,
      showPassword: false,
      rememberMe: false,
      isLoading: false,
      showPaperPlane: false,
      errors: {},
      apiBaseUrl: 'http://127.0.0.1:8000/api/',
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.errors = {}

      console.log('searchig...')
      try {
        const response = await axios.post(`${this.apiBaseUrl}login`, this.loginForm)
        console.log(response)

        // Guarda el token recibido (corrección principal)
        localStorage.setItem('apiToken', response.data.token)

        // Mostrar animación del avión de papel
        this.showPaperPlane = true

        // Esperar a que termine la animación antes de redirigir
        setTimeout(() => {
          this.showPaperPlane = false
          this.$router.push('/PanelDeControl')
        }, 3000)
      } catch (error) {
        console.error(error)
        if (error.response && error.response.data) {
          this.errors = error.response.data.errors || { general: error.response.data.message }
        } else {
          this.errors = { general: 'Error de red o del servidor' }
        }
      } finally {
        this.isLoading = false
      }
    },
    async registrarUsuario() {
      if (!this.validarFormulario()) return

      this.payload = {
        ...this.registerForm,
      }

      await axios
        .post(`${this.apiBaseUrl}/usuarios`, this.payload)
        .then((response) => {
          console.log(response.data)

          if (response.data.status === 500) {
            this.mostrarError(response.data.message)
            return
          }
          this.closeModal()
          this.resetRegisterForm()
          this.mostrarMensaje('Usuario registrado exitosamente', 'success')
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error)
          this.mostrarError('Error al registrar usuario')
        })
    },
    abrirModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    validarFormulario() {
      if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password) {
        this.mostrarError('Los campos marcados con * son obligatorios')
        return false
      }

      if (!this.validarEmail(this.registerForm.email)) {
        this.mostrarError('Por favor ingrese un email válido')
        return false
      }

      return true
    },

    validarEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    resetRegisterForm() {
      this.registerForm = {
        username: '',
        email: '',
        password: '',
      }
    },
    mostrarMensaje(texto, tipo = 'success') {
      Swal.fire({
        title: texto,
        icon: tipo,
        position: 'center',
        showConfirmButton: true,
        timer: tipo === 'success' ? 2500 : undefined,
        timerProgressBar: tipo === 'success',
        confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33',
      })
    },

    mostrarError(texto) {
      this.mostrarMensaje(`ERROR: ${texto}`, 'error')
    },
  },
}
</script>

<style scoped>
/* Animación del avión de papel mejorada */
.paper-plane-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.paper-plane {
  font-size: 12rem; /* Aumenté el tamaño aún más */
  color: #667eea;
  margin-bottom: 2rem;
  animation: paperPlaneFly 2s ease-in-out;
}

.success-message {
  text-align: center;
  color: white;
  opacity: 0;
  animation: fadeInMessage 0.5s ease-in-out 1s forwards;
}

.success-message h3 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.success-message p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Animación jello-horizontal personalizada */
.jello-horizontal {
  animation: jello-horizontal 0.9s linear both;
}

@keyframes jello-horizontal {
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

@keyframes paperPlaneFly {
  0% {
    transform: translateX(-100vw) translateY(50px) rotate(-45deg) scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateX(50px) translateY(-20px) rotate(15deg) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateX(100vw) translateY(-100px) rotate(45deg) scale(0.8);
    opacity: 0;
  }
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para el modal moderno */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  backdrop-filter: blur(8px);
  animation: backdropFadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 20px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.modal-icon {
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

.modal-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  background: white;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-save:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

/* Fondo animado */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 10%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 20%;
  animation-delay: 3s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* Contenido principal */
.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  z-index: 2;
  min-height: 600px;
}

/* Panel de información */
.info-panel {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.info-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 4s ease-in-out infinite;
}

.info-content {
  position: relative;
  z-index: 1;
  color: white;
}

.logo-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.feature-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.feature-text p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

/* Panel de login */
.login-panel {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #4f46e5;
}

.login-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.login-button a {
  color: inherit;
  text-decoration: none;
  font-weight: inherit;
  font-size: inherit;
}

.login-button a:hover {
  color: inherit;
  text-decoration: none;
}

.login-button a:visited {
  color: inherit;
  text-decoration: none;
}

.login-button a:focus {
  color: inherit;
  text-decoration: none;
  outline: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
  color: #9ca3af;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-login {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-button {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-button:hover {
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-button.google:hover {
  border-color: #ea4335;
  color: #ea4335;
}

.social-button.microsoft:hover {
  border-color: #0078d4;
  color: #0078d4;
}

.signup-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  color: #4f46e5;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    max-width: 500px;
  }

  .info-panel {
    padding: 2rem;
  }

  .features-list {
    flex-direction: row;
    gap: 1rem;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .feature-text h3 {
    font-size: 1rem;
  }

  .feature-text p {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }

  .info-panel {
    padding: 1.5rem;
  }

  .login-panel {
    padding: 2rem 1.5rem;
  }

  .logo-title {
    font-size: 2rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .features-list {
    gap: 1rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  /* Ajustar tamaño del avión en móviles */
  .paper-plane {
    font-size: 8rem;
  }

  .success-message h3 {
    font-size: 1.5rem;
  }

  .success-message p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 1.5rem 1rem;
  }

  .social-login {
    flex-direction: column;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  /* Ajustar más el tamaño del avión en pantallas muy pequeñas */
  .paper-plane {
    font-size: 7rem;
  }
}
</style>
