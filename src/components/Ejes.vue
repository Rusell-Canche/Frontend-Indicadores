<template>
  <div class="medicos-container">
    <!-- Header principal con diseño más pequeño -->
    <div class="main-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="main-title">
            <i class="fas fa-project-diagram me-3"></i>
            Ejes
          </h1>
          <p class="main-subtitle">Sistema de gestión de Ejes</p>
        </div>
      </div>
    </div>

    <!-- Navegación de pestañas moderna más ancha horizontalmente -->
    <div class="tabs-navigation">
      <div class="tabs-container">
        <div class="tabs-header">
          <div
            class="tab"
            :class="{ active: $route.name === 'VerEjes' }"
            @click="$router.push({ name: 'VerEjes' })"
          >
            <div class="tab-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Ver Ejes</span>
              <span class="tab-description">Visualiza los ejes que se han creado</span>
            </div>
          </div>
          <div
            class="tab"
            :class="{ active: $route.name === 'CrearEjes' }"
            @click="$router.push({ name: 'CrearEjes' })"
          >
            <div class="tab-icon">
              <i class="fas fa-drafting-compass"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Crear Ejes</span>
              <span class="tab-description">Crea un Eje de manera manual</span>
            </div>
          </div>
          <!-- Indicador deslizante mejorado -->
          <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas usando rutas hijas -->
    <div class="tab-content-wrapper">
      <div class="tab-content">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Si la ruta actual es exactamente '/Ejes', redirigir a VerEjes
    if (this.$route.path === '/Ejes') {
      this.$router.replace('/Ejes/VerEjes')
    }
  },
  computed: {
    indicatorStyle() {
      // Calcula el índice según la ruta activa
      const tabNames = ['VerEjes', 'CrearEjes']
      const index = tabNames.indexOf(this.$route.name)
      const width = 100 / tabNames.length
      return {
        transform: `translateX(${index * 100}%)`,
        width: `${width}%`,
      }
    },
  },
  methods: {
    handleLogout() {
      this.showLogoutModal = false
      localStorage.removeItem('apiToken')
      this.$router.push('/')
    },
  },
  data() {
    return {
      showLogoutModal: false,
    }
  },
}
</script>

<style scoped>
.medicos-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header principal más pequeño */
.main-header {
  background: linear-gradient(135deg, #4e73df 0%, #3c5dd4 100%);
  padding: 1.5rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(78, 115, 223, 0.3);
}

.main-header::before {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  text-align: left;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.main-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

/* Navegación de pestañas más ancha horizontalmente */
.tabs-navigation {
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.tabs-header {
  display: flex;
  position: relative;
  background: white;
  overflow: hidden;
  justify-content: space-around; /* Distribuye el espacio uniformemente */
}

.tab {
  flex: 1;
  padding: 1.75rem 3rem; /* Aumentado padding horizontal */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem; /* Aumentado para más espacio horizontal entre icono y texto */
  position: relative;
  background: transparent;
  border: none;
  color: #6b7280;
  font-weight: 500;
  min-height: 90px;
  min-width: 350px; /* Añadido para garantizar un ancho mínimo */
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(78, 115, 223, 0.05) 0%, rgba(60, 93, 212, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab:hover::before {
  opacity: 1;
}

.tab:hover {
  color: #4e73df;
  transform: translateY(-2px);
}

.tab.active {
  color: #4e73df;
  font-weight: 600;
}

.tab.active::before {
  opacity: 1;
  background: linear-gradient(135deg, rgba(78, 115, 223, 0.1) 0%, rgba(60, 93, 212, 0.1) 100%);
}

.tab-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tab:hover .tab-icon {
  background: linear-gradient(135deg, #4e73df 0%, #3c5dd4 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(78, 115, 223, 0.3);
}

.tab.active .tab-icon {
  background: linear-gradient(135deg, #4e73df 0%, #3c5dd4 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(78, 115, 223, 0.4);
}

.tab-content-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 200px; /* Añadido para garantizar un ancho mínimo del texto */
}

.tab-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.tab-description {
  font-size: 0.9rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Indicador deslizante mejorado */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #4e73df 0%, #3c5dd4 100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 -2px 8px rgba(78, 115, 223, 0.3);
}

/* Contenido de pestañas mejorado */
.tab-content-wrapper {
  max-width: 1600px; /* Aumentado para coincidir con la navegación */
  margin: 0 auto;
  padding: 2rem 3rem; /* Aumentado padding horizontal */
  width: 95%;
}

.tab-content {
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 0;
}

/* Animaciones de transición mejoradas */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Animación de shimmer */
@keyframes shimmer {
  0%,
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Responsive Design mejorado */
@media (max-width: 1200px) {
  .tabs-container {
    padding: 0 2rem;
  }

  .tab {
    padding: 1.75rem 2rem;
    gap: 1.5rem;
    min-width: 300px;
  }

  .tab-content-wrapper {
    padding: 2rem;
  }
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 1.5rem;
  }

  .main-subtitle {
    font-size: 0.85rem;
  }

  .tab {
    padding: 1.75rem 1.5rem;
    gap: 1.25rem;
    min-width: 250px;
  }

  .tab-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .tab-content-text {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .main-header {
    padding: 1.25rem 0;
  }

  .header-content {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .header-left {
    text-align: center;
  }

  .main-title {
    font-size: 1.5rem;
    justify-content: center;
  }

  .main-subtitle {
    font-size: 0.8rem;
  }

  .tabs-navigation {
    border-radius: 0;
    max-width: 100%;
    width: 100%;
  }

  .tabs-container {
    padding: 0;
  }

  .tabs-header {
    flex-direction: column;
    border-radius: 0;
  }

  .tab {
    padding: 1.5rem;
    min-height: auto;
    justify-content: flex-start;
    min-width: 0;
  }

  .tab-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .tab-content-text {
    min-width: 0;
  }

  .tab-indicator {
    display: none;
  }

  .tab.active {
    background: linear-gradient(135deg, rgba(78, 115, 223, 0.1) 0%, rgba(60, 93, 212, 0.1) 100%);
    border-left: 4px solid #4e73df;
  }

  .tab-content-wrapper {
    max-width: 100%;
    width: 100%;
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 1.5rem;
  }

  .main-title {
    font-size: 1.25rem;
  }

  .tab {
    padding: 1.25rem;
    gap: 1rem;
  }

  .tab-title {
    font-size: 1rem;
  }

  .tab-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .main-header {
    padding: 1rem 0;
  }

  .main-title {
    font-size: 1.125rem;
  }

  .main-subtitle {
    font-size: 0.75rem;
  }

  .tab {
    padding: 1rem;
    gap: 0.75rem;
  }

  .tab-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
</style>
