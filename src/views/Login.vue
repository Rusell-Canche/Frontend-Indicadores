<template>
  <div class="login-container">
    <!-- Fondo animado mejorado -->
    <div class="animated-background">
      <!-- Partículas flotantes -->
      <div class="floating-particles">
        <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle(n)"></div>
      </div>

      <!-- Ondas de fondo -->
      <div class="wave-container">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>

      <!-- Formas geométricas animadas -->
      <div class="geometric-shapes">
        <div class="shape hexagon"></div>
        <div class="shape triangle"></div>
        <div class="shape circle-pulse"></div>
        <div class="shape diamond"></div>
      </div>
    </div>

    <!-- Contenido principal con efecto glassmorphism -->
    <div class="login-content">
      <!-- Panel izquierdo - Información -->
      <div class="info-panel">
        <div class="info-content">
          <!-- Logo section mejorado -->
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-glow"></div>
              <img src="../assets/logo.png" alt="Logo" class="logo-image" />
              <div class="logo-ring"></div>
            </div>
            <h1 class="logo-title">Sistema Avanzado</h1>
            <p class="logo-subtitle">Gestión Inteligente de Indicadores</p>
          </div>

          <!-- Features mejoradas -->
          <div class="features-list">
            <div class="feature-item" v-for="(feature, index) in features" :key="index">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
                <div class="icon-glow"></div>
              </div>
              <div class="feature-text">
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
              <div class="feature-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>

          <!-- Stats section -->
          <div class="stats-section">
            <div class="stat-item" v-for="stat in stats" :key="stat.label">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario de login -->
      <div class="login-panel">
        <div class="login-form-container">
          <!-- Header mejorado -->
          <div class="form-header">
            <div class="welcome-badge">
              <i class="fas fa-shield-alt"></i>
              <span>Acceso Seguro</span>
            </div>
            <h2 class="form-title">
              <span class="title-gradient">Bienvenido</span>
              <span class="title-normal">de vuelta</span>
            </h2>
            <p class="form-subtitle">Accede a tu panel de control personalizado</p>
          </div>

          <!-- Formulario mejorado -->
          <form class="login-form" @submit.prevent>
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-envelope label-icon"></i>
                Correo Electrónico
              </label>
              <div class="input-container">
                <div class="input-background"></div>
                <input
                  type="email"
                  class="form-input"
                  placeholder="tu@empresa.com"
                  v-model="email"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                  required
                />
                <div class="input-border"></div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-lock label-icon"></i>
                Contraseña
              </label>
              <div class="input-container">
                <div class="input-background"></div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Tu contraseña segura"
                  v-model="password"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                  required
                />
                <button type="button" class="password-toggle" @click="togglePassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Opciones adicionales -->
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Recordarme</span>
              </label>
              <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <!-- Botón de login mejorado -->
            <router-link to="/PanelDeControl" class="login-button" @click="onLoginClick">
              <div class="button-background"></div>
              <div class="button-content">
                <i class="fas fa-rocket button-icon"></i>
                <span class="button-text">Acceder al Sistema</span>
                <div class="button-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
              </div>
              <div class="button-glow"></div>
            </router-link>
          </form>

          <!-- Enlaces adicionales -->
          <div class="additional-links">
            <div class="divider">
              <span>o</span>
            </div>
            <div class="signup-link">
              <p>¿Primera vez aquí? <a href="#" class="signup-cta">Solicita acceso</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de carga -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="loading-text">Iniciando sesión...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado reactivo
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

// Datos para las características
const features = ref([
  {
    icon: 'fas fa-chart-pie',
    title: 'Análisis Avanzado',
    description: 'IA para insights profundos',
  },
  {
    icon: 'fas fa-chart-line',
    title: 'KPIs en Tiempo Real',
    description: 'Monitoreo continuo 24/7',
  },
  {
    icon: 'fas fa-tachometer-alt',
    title: 'Dashboard Inteligente',
    description: 'Visualización predictiva',
  },
])

// Estadísticas
const stats = ref([
  { value: '99.9%', label: 'Uptime' },
  { value: '2.5s', label: 'Carga' },
  { value: '256bit', label: 'Seguridad' },
])

// Métodos
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const onInputFocus = (event) => {
  event.target.parentElement.classList.add('focused')
}

const onInputBlur = (event) => {
  event.target.parentElement.classList.remove('focused')
}

const onLoginClick = () => {
  isLoading.value = true
  // Simular carga
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: Math.random() * 3 + 2 + 's',
  }
}

onMounted(() => {
  // Animaciones de entrada
  document.querySelector('.login-content').classList.add('animate-in')
})
</script>

<style scoped>
/* Variables CSS para nueva paleta de colores vibrantes */
:root {
  --navy-dark: #0f172a;
  --navy-primary: #1e293b;
  --navy-light: #334155;
  --purple-primary: #7c3aed;
  --purple-light: #8b5cf6;
  --cyan-primary: #06b6d4;
  --cyan-light: #22d3ee;
  --orange-primary: #f97316;
  --orange-light: #fb923c;
  --green-primary: #10b981;
  --green-light: #34d399;
  --pink-primary: #ec4899;
  --pink-light: #f472b6;
  --yellow-primary: #f59e0b;
  --yellow-light: #fbbf24;
  --gray-dark: #1f2937;
  --gray-medium: #374151;
  --gray-light: #6b7280;
  --text-light: #e5e7eb;
  --text-lighter: #f3f4f6;
}

/* Contenedor principal */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--navy-dark) 0%,
    var(--navy-primary) 30%,
    var(--purple-primary) 70%,
    var(--cyan-primary) 100%
  );
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

/* Fondo animado mejorado */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

/* Partículas flotantes */
.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--cyan-light);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--cyan-light);
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

/* Ondas de fondo */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 120px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
  animation: waveMove 8s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
}
.wave-2 {
  animation-delay: 2s;
  opacity: 0.7;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
}
.wave-3 {
  animation-delay: 4s;
  opacity: 0.5;
  background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent);
}

@keyframes waveMove {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-15px);
  }
}

/* Formas geométricas */
.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  opacity: 0.3;
}

.hexagon {
  width: 80px;
  height: 80px;
  background: var(--purple-light);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  top: 20%;
  right: 15%;
  animation: rotate 10s linear infinite;
  box-shadow: 0 0 20px var(--purple-light);
}

.triangle {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 60px solid var(--orange-primary);
  top: 60%;
  left: 10%;
  animation: pulse 3s ease-in-out infinite;
  filter: drop-shadow(0 0 15px var(--orange-primary));
}

.circle-pulse {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--cyan-primary), var(--cyan-light));
  border-radius: 50%;
  top: 30%;
  left: 80%;
  animation: pulse 4s ease-in-out infinite;
  box-shadow: 0 0 30px var(--cyan-primary);
}

.diamond {
  width: 50px;
  height: 50px;
  background: var(--yellow-primary);
  transform: rotate(45deg);
  bottom: 20%;
  right: 30%;
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 0 20px var(--yellow-primary);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

@keyframes float {
  0%,
  100% {
    transform: rotate(45deg) translateY(0px);
  }
  50% {
    transform: rotate(45deg) translateY(-20px);
  }
}

/* Contenido principal */
.login-content {
  display: flex;
  width: 100%;
  max-width: 1400px;
  background: linear-gradient(135deg, var(--gray-dark) 0%, var(--navy-primary) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(34, 211, 238, 0.2);
  overflow: hidden;
  position: relative;
  z-index: 2;
  min-height: 700px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(34, 211, 238, 0.3);
}

.login-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Panel de información mejorado */
.info-panel {
  flex: 1;
  background: linear-gradient(
    135deg,
    var(--navy-dark) 0%,
    var(--purple-primary) 60%,
    var(--cyan-primary) 100%
  );
  padding: 4rem;
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
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(34, 211, 238, 0.2), transparent);
  animation: rotate 20s linear infinite;
}

.info-content {
  position: relative;
  z-index: 1;
  color: var(--text-lighter);
  width: 100%;
}

/* Logo section mejorado */
.logo-section {
  text-align: center;
  margin-bottom: 4rem;
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 20px var(--cyan-light));
}

.logo-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(34, 211, 238, 0.3);
  border-radius: 50%;
  border-top-color: var(--orange-primary);
  border-right-color: var(--purple-light);
  animation: rotate 3s linear infinite;
}

.logo-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--cyan-light) 0%, var(--orange-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(34, 211, 238, 0.5);
}

.logo-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
  color: var(--text-light);
}

/* Features mejoradas */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 211, 238, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-item:hover {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(139, 92, 246, 0.2));
  transform: translateX(10px);
  box-shadow: 0 10px 30px rgba(34, 211, 238, 0.3);
  border-color: var(--cyan-primary);
}

.feature-icon {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--cyan-primary), var(--purple-light));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: var(--text-lighter);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}

.icon-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--orange-primary), transparent);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-item:hover .icon-glow {
  opacity: 0.4;
}

.feature-text {
  flex: 1;
}

.feature-text h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-lighter);
}

.feature-text p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  color: var(--text-light);
}

.feature-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--orange-primary);
  font-size: 1.2rem;
}

.feature-item:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Stats section */
.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 2rem 0;
  border-top: 1px solid rgba(34, 211, 238, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--orange-primary);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px var(--orange-primary);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-light);
}

/* Panel de login mejorado */
.login-panel {
  flex: 1;
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gray-dark) 0%, var(--navy-light) 100%);
}

.login-form-container {
  width: 100%;
  max-width: 450px;
}

/* Header del formulario */
.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--green-primary), var(--cyan-primary));
  color: var(--text-lighter);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.form-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.title-gradient {
  background: linear-gradient(135deg, var(--cyan-primary), var(--purple-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-normal {
  color: var(--text-light);
}

.form-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
  margin: 0;
}

/* Formulario mejorado */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--text-lighter);
  font-size: 1rem;
}

.label-icon {
  color: var(--cyan-primary);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--gray-medium), var(--gray-dark));
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(34, 211, 238, 0.3);
  border-radius: 16px;
  font-size: 1.1rem;
  background: transparent;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  color: var(--text-lighter);
}

.form-input::placeholder {
  color: var(--gray-light);
}

.form-input:focus {
  outline: none;
  border-color: var(--cyan-primary);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}

.input-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--cyan-primary), var(--orange-primary)) border-box;
  -webkit-mask:
    linear-gradient(var(--gray-dark) 0 0) padding-box,
    linear-gradient(var(--gray-dark) 0 0);
  -webkit-mask-composite: exclude;
  mask:
    linear-gradient(var(--gray-dark) 0 0) padding-box,
    linear-gradient(var(--gray-dark) 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-container.focused .input-border {
  opacity: 1;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--gray-light);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 2;
}

.password-toggle:hover {
  color: var(--cyan-primary);
  background: rgba(34, 211, 238, 0.1);
}

/* Opciones del formulario */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
}

.checkbox-container input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(34, 211, 238, 0.5);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  background: var(--gray-medium);
}

.checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid var(--text-lighter);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-container input[type='checkbox']:checked + .checkmark {
  background: var(--cyan-primary);
  border-color: var(--cyan-primary);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

.checkbox-container input[type='checkbox']:checked + .checkmark::after {
  opacity: 1;
}

.checkbox-text {
  color: var(--text-light);
  font-weight: 500;
}

.forgot-password {
  color: var(--cyan-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--orange-primary);
}

/* Botón de login espectacular */
.login-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-lighter);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 1rem 0;
}

.button-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--purple-primary) 0%,
    var(--cyan-primary) 50%,
    var(--orange-primary) 100%
  );
  transition: all 0.4s ease;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.button-text {
  font-size: 1.1rem;
}

.button-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.button-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, var(--cyan-primary), var(--orange-primary));
  border-radius: 18px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s ease;
  z-index: 0;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
}

.login-button:hover .button-background {
  background: linear-gradient(135deg, var(--cyan-primary) 0%, var(--orange-primary) 100%);
}

.login-button:hover .button-icon {
  transform: scale(1.1);
}

.login-button:hover .button-arrow {
  opacity: 1;
  transform: translateX(0);
}

.login-button:hover .button-glow {
  opacity: 0.6;
}

.login-button:active {
  transform: translateY(-1px);
}

/* Enlaces adicionales */
.additional-links {
  margin-top: 2rem;
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.5), transparent);
}

.divider span {
  background: var(--gray-dark);
  padding: 0 1rem;
  color: var(--text-light);
  font-weight: 500;
}

.signup-link {
  text-align: center;
  color: var(--text-light);
  font-size: 1rem;
}

.signup-cta {
  color: var(--cyan-primary);
  text-decoration: none;
  font-weight: 700;
  position: relative;
  transition: color 0.3s ease;
}

.signup-cta::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--cyan-primary), var(--orange-primary));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.signup-cta:hover {
  color: var(--orange-primary);
}

.signup-cta:hover::after {
  transform: scaleX(1);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  text-align: center;
  color: var(--text-lighter);
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(34, 211, 238, 0.2);
  border-top: 4px solid var(--orange-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .login-content {
    max-width: 1000px;
  }

  .info-panel,
  .login-panel {
    padding: 3rem;
  }
}

@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    max-width: 600px;
  }

  .info-panel {
    padding: 3rem 2rem;
  }

  .features-list {
    flex-direction: row;
    gap: 1rem;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .stats-section {
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }

  .info-panel,
  .login-panel {
    padding: 2rem 1.5rem;
  }

  .logo-title {
    font-size: 2rem;
  }

  .form-title {
    font-size: 2rem;
  }

  .features-list {
    gap: 0.75rem;
  }

  .feature-item {
    padding: 0.75rem;
  }

  .feature-text h3 {
    font-size: 1rem;
  }

  .feature-text p {
    font-size: 0.9rem;
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

  .stats-section {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
