<template>
  <!-- Modal de creación/edición (estático para diseño) -->
  <div class="modal-backdrop" style="display: none">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="modal-title-section">
            <h3>Registro</h3>
            <p class="modal-subtitle">Regístrate aquí</p>
          </div>
        </div>
        <button class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body del modal -->
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label class="form-label">Nombre*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-user"></i>
              </div>
              <input type="text" class="form-input" placeholder="Ej: Juan" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <input type="email" class="form-input" placeholder="tu@email.com" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña*</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <input type="password" class="form-input" placeholder="Tu contraseña" required />
              <button type="button" class="password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer del modal -->
      <div class="modal-footer">
        <button class="btn btn-cancel">
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button class="btn btn-save"><i class="fas fa-save me-2"></i> Registrarse</button>
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
              <i class="fas fa-chart-bar"></i>
            </div>
            <p class="logo-subtitle">Sistema de Gestión de Indicadores</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="feature-text">
                <h3>Indicadores</h3>
                <p>Visualiza Indicadores y Crea</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="feature-text">
                <h3>Plantillas</h3>
                <p>Realiza Plantillas</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div class="feature-text">
                <h3>Dashboard Inteligente</h3>
                <p>Reportes en tiempo real</p>
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
            <p class="form-subtitle">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form class="login-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <input type="email" class="form-input" placeholder="tu@email.com" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <input type="password" class="form-input" placeholder="Tu contraseña" required />
                <button type="button" class="password-toggle">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="login-button" @click="redirectToPanel">
              <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
            </button>
          </form>

          <div class="signup-link">
            <p>¿No tienes una cuenta? <a href="#">Regístrate aquí</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToPanel() {
      this.$router.push('/PanelDeControl')
    },
  },
}
</script>

<style scoped>
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
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  background: linear-gradient(135deg, #1e40af 0%, #ea580c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
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
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  border-color: #1e3a8a;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
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
  color: #1e3a8a;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.login-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%);
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
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 2rem;
}

.signup-link a {
  color: #1e3a8a;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  color: #f97316;
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

/* Animaciones adicionales */
@keyframes backdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
}

@media (max-width: 480px) {
  .login-panel {
    padding: 1.5rem 1rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
