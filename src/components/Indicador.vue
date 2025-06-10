<template>
  <div class="medicos-container">
    <!-- Header principal -->
    <div class="main-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="main-title">
            <i class="fas fa-hospital-alt me-3"></i>
            Indicadores
          </h1>
        </div>
      </div>
    </div>

    <!-- Navegación de pestañas moderna -->
    <div class="tabs-navigation">
      <div class="tabs-container">
        <div class="tabs-header">
          <div
            class="tab"
            :class="{ active: $route.name === 'ver-indicadores' }"
            @click="$router.push({ name: 'ver-indicadores' })"
          >
            <div class="tab-icon">
              <i class="fas fa-user-md"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Indicadores</span>
              <span class="tab-description">Ver Indicadores</span>
            </div>
          </div>
          <div
            class="tab"
            :class="{ active: $route.name === 'CargarIndicador' }"
            @click="$router.push({ name: 'CargarIndicador' })"
          >
            <div class="tab-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Crear Indicadores</span>
              <span class="tab-description">Crea un Indicador desde un Excel</span>
            </div>
          </div>
          <div
            class="tab"
            :class="{ active: $route.name === 'CrarIndicador' }"
            @click="$router.push({ name: 'CrearIndicador' })"
          >
            <div class="tab-icon">
              <i class="fas fa-calendar"></i>
            </div>
            <div class="tab-content-text">
              <span class="tab-title">Crear Indicadores</span>
              <span class="tab-description">Crear Indicadores Manualmente</span>
            </div>
          </div>
          <!-- Indicador deslizante -->
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
  computed: {
    indicatorStyle() {
      // Calcula el índice según la ruta activa
      const tabNames = ['ver-indicadores', 'CargarIndicador', 'CrearIndicador']
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

/* Header principal */
.main-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
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

.header-right {
  display: flex;
  align-items: center;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.main-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

/* Botón de logout */
.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.logout-button i {
  font-size: 1.1rem;
}

/* Modal de logout */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.modal-body p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Navegación de pestañas */
.tabs-navigation {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.tabs-header {
  display: flex;
  position: relative;
  background: white;
  border-radius: 0;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
  background: transparent;
  border: none;
  color: #6b7280;
  font-weight: 500;
  min-height: 80px;
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab:hover::before {
  opacity: 1;
}

.tab:hover {
  color: #4f46e5;
  transform: translateY(-2px);
}

.tab.active {
  color: #4f46e5;
  font-weight: 600;
}

.tab.active::before {
  opacity: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.tab-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.tab:hover .tab-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.tab.active .tab-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.tab-content-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.tab-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.tab-description {
  font-size: 0.875rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Indicador deslizante */
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
}

/* Contenido de pestañas */
.tab-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.tab-content {
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 0;
  margin-top: 2rem;
}

.content-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 600px;
}

/* Animaciones de transición */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-title {
    font-size: 2rem;
  }

  .tabs-container {
    padding: 0 1rem;
  }

  .tab-content-wrapper {
    padding: 0 1rem 2rem;
  }
}

@media (max-width: 768px) {
  .main-header {
    padding: 1.5rem 0;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-left {
    text-align: center;
  }

  .main-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
  }

  .main-subtitle {
    font-size: 1rem;
  }

  .logout-button {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .tabs-header {
    flex-direction: column;
  }

  .tab {
    padding: 1rem;
    min-height: auto;
    justify-content: flex-start;
  }

  .tab-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .tab-indicator {
    display: none;
  }

  .tab.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 12px;
    margin: 0.25rem;
  }

  .modal-content {
    margin: 1rem;
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 1rem;
  }

  .tabs-container {
    padding: 0 0.5rem;
  }

  .tab-content-wrapper {
    padding: 0 0.5rem 1rem;
  }

  .tab {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .tab-content-text {
    align-items: flex-start;
  }

  .tab-title {
    font-size: 0.9rem;
  }

  .tab-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
  }

  .main-subtitle {
    font-size: 0.9rem;
  }

  .logout-button {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  .logout-button span {
    display: none;
  }

  .tab {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .tab-content-text {
    align-items: center;
  }

  .content-panel {
    border-radius: 12px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
