<template>
  <div class="medicos-container">
    <!-- Header principal con diseño más pequeño -->
    <div class="main-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="main-title">
            <i class="fas fa-users me-3"></i>
            Adminstración de usuarios
          </h1>
          <p class="main-subtitle">PLACEHOLDER</p>
        </div>
      </div>
    </div>

    <!-- Navegación de pestañas moderna responsiva -->
    <div class="tabs-navigation">
      <div class="tabs-container">
        <div class="tabs-header">
          <div class="tab" :class="{
            active: ['usuarios', 'CrearUsuarios', 'EditarUsuarios'].includes($route.name)
          }"
            @click="$router.push({ name: 'usuarios' })">
            <div class="tab-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Ver usuarios</span>
              <span class="tab-description">Visualiza los usuarios que se han creado</span>
            </div>
          </div>
          <div class="tab" :class="{
            active: ['VerRoles', 'CrearRol', 'EditarRol'].includes($route.name)
          }" @click="$router.push({ name: 'VerRoles' })">
            <div class="tab-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Roles</span>
              <span class="tab-description"> - </span>
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
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Si la ruta actual es exactamente '/Usuarios', redirigir a CrearUsuarios
    if (this.$route.path === '/administracion') {
      this.$router.push({ name: 'usuarios' })
    }
  },
  computed: {
    indicatorStyle() {
      const tabs = [
        { names: ['usuarios', 'CrearUsuarios', 'EditarUsuarios'] },
        { names: ['VerRoles', 'CrearRol', 'EditarRol'] },
      ]

      // Encuentra el índice de la pestaña actual
      const index = tabs.findIndex(tab =>
        tab.names.includes(this.$route.name)
      )

      const width = 100 / tabs.length

      return {
        transform: `translateX(${index * 100}%)`,
        width: `${width}%`,
      }
    }
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  padding: 1.5rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(4, 120, 87, 0.3);
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

/* Navegación de pestañas completamente responsiva */
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
  justify-content: space-around;
}

.tab {
  flex: 1;
  padding: 1.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  position: relative;
  background: transparent;
  border: none;
  color: #6b7280;
  font-weight: 500;
  min-height: 90px;
  min-width: 200px;
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(4, 120, 87, 0.05) 0%, rgba(6, 95, 70, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab:hover::before {
  opacity: 1;
}

.tab:hover {
  color: #047857;
  transform: translateY(-2px);
}

.tab.active {
  color: #047857;
  font-weight: 600;
}

.tab.active::before {
  opacity: 1;
  background: linear-gradient(135deg, rgba(4, 120, 87, 0.1) 0%, rgba(6, 95, 70, 0.1) 100%);
}

.tab-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tab:hover .tab-icon {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.3);
}

.tab.active .tab-icon {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
}

.tab-content-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
  min-width: 120px;
  max-width: 200px;
  overflow: hidden;
}

.tab-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  width: 100%;
}

.tab-description {
  font-size: 0.85rem;
  opacity: 0.7;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 200px;
}

/* Indicador */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #75ea66 0%, #4ba252 100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
}

/* Contenido de pestañas mejorado */
.tab-content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 3rem;
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
@media (max-width: 1400px) {
  .tab {
    min-width: 180px;
    padding: 1.75rem 1.25rem;
  }

  .tab-title {
    font-size: 0.95rem;
  }

  .tab-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 1200px) {
  .tabs-container {
    padding: 0 0.5rem;
  }

  .tab {
    padding: 1.5rem 1rem;
    gap: 0.75rem;
    min-width: 160px;
  }

  .tab-content-wrapper {
    padding: 2rem;
  }

  .tab-icon {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
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
    padding: 1.5rem 0.75rem;
    gap: 0.75rem;
    min-width: 140px;
  }

  .tab-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .tab-title {
    font-size: 0.9rem;
  }

  .tab-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .tabs-navigation {
    border-radius: 0;
    max-width: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
  }

  .tabs-header {
    border-radius: 0;
    min-width: calc(160px * 5);
    justify-content: flex-start;
  }

  .tab {
    padding: 1.25rem 0.75rem;
    min-height: 80px;
    min-width: 160px;
    max-width: 160px;
    flex: 0 0 160px;
  }

  .tab-content-text {
    min-width: 100px;
  }

  .tab-indicator {
    display: none;
  }

  .tab-title {
    font-size: 0.9rem;
    white-space: normal;
    text-align: center;
  }

  .tab-description {
    font-size: 0.75rem;
    white-space: normal;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 1.5rem;
  }

  .main-title {
    font-size: 1.25rem;
  }

  .tabs-header {
    min-width: calc(120px * 5);
  }

  .tab {
    padding: 1rem 0.25rem;
    min-width: 120px;
  }

  .tab-title {
    font-size: 0.8rem;
  }

  .tab-description {
    font-size: 0.65rem;
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

  .tabs-header {
    min-width: calc(110px * 5);
  }

  .tab {
    padding: 0.75rem 0.25rem;
    min-width: 110px;
  }

  .tab-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .tab-title {
    font-size: 0.75rem;
  }

  .tab-description {
    font-size: 0.6rem;
  }
}

/* Scrollbar personalizado para la navegación horizontal */
.tabs-navigation::-webkit-scrollbar {
  height: 4px;
}

.tabs-navigation::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.tabs-navigation::-webkit-scrollbar-thumb {
  background: #047857;
  border-radius: 2px;
}

.tabs-navigation::-webkit-scrollbar-thumb:hover {
  background: #065f46;
}
</style>
