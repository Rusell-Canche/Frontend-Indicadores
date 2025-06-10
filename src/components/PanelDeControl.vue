<template>
  <div class="control-panel-container">
    <!-- Barra lateral vertical -->
    <div class="vertical-navigation">
      <div class="sidebar-logo">
        <img src="../assets/logo.png" alt="Logo" />
      </div>
      <ul class="navigation-list">
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/dashboard' }"
          @click="$router.push('/dashboard')"
        >
          <i class="fas fa-home"></i>
          <span>PANEL DE CONTROL</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/indicador' }"
          @click="$router.push('/indicador')"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Indicadores</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/ejes' }"
          @click="$router.push('/ejes')"
        >
          <i class="fas fa-arrows-alt-v"></i>
          <span>Ejes</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/plantillas' }"
          @click="$router.push('/plantillas')"
        >
          <i class="fas fa-file"></i>
          <span>Plantillas</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/documentos' }"
          @click="$router.push('/documentos')"
        >
          <i class="fas fa-file-alt"></i>
          <span>Documentos</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/usuarios' }"
          @click="$router.push('/usuarios')"
        >
          <i class="fas fa-users"></i>
          <span>Usuarios</span>
        </li>
      </ul>
      <button class="logout-button" @click="showLogoutModal = true">
        <i class="fas fa-sign-out-alt"></i>
        <span>Cerrar Sesión</span>
      </button>
    </div>

    <!-- Contenido dinámico -->
    <div class="content-wrapper">
      <router-view />
    </div>

    <!-- Modal de logout -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Cierre de Sesión</h3>
          <button @click="showLogoutModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
        </div>
        <div class="modal-footer">
          <button @click="showLogoutModal = false" class="btn-cancel">Cancelar</button>
          <button @click="handleLogout" class="btn-confirm">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLogoutModal: false,
    }
  },
  methods: {
    handleLogout() {
      this.showLogoutModal = false
      localStorage.removeItem('apiToken')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.control-panel-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
}

/* Sidebar vertical moderno */
.vertical-navigation {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Logo mejorado */
.sidebar-logo {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.sidebar-logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.sidebar-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Lista de navegación */
.navigation-list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

/* Items de navegación modernos */
.navigation-item {
  width: calc(100% - 1rem);
  margin: 0.25rem 0.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.navigation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.navigation-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navigation-item:hover::before {
  opacity: 1;
}

.navigation-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  transform: translateX(8px);
}

.navigation-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: white;
  border-radius: 2px 0 0 2px;
}

/* Iconos mejorados */
.navigation-item i {
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.navigation-item:hover i {
  transform: scale(1.1);
}

.navigation-item.active i {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Texto de navegación */
.navigation-item span {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
}

.navigation-item.active span {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Botón de logout moderno */
.logout-button {
  width: calc(100% - 1rem);
  margin: 1rem 0.5rem 0;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.logout-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.logout-button:hover::before {
  left: 100%;
}

.logout-button:active {
  transform: translateY(0);
}

.logout-button i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.logout-button:hover i {
  transform: rotate(-10deg) scale(1.1);
}

/* Contenido principal */
.content-wrapper {
  flex: 1;
  background: #f8fafc;
  overflow-y: auto;
  position: relative;
}

/* Modal moderno */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 420px;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-header h3::before {
  content: '⚠️';
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem 2rem;
}

.modal-body p {
  margin: 0;
  color: #4b5563;
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f9fafb;
}

.btn-cancel {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(107, 114, 128, 0.4);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-confirm::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-confirm:hover::before {
  left: 100%;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .vertical-navigation {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .control-panel-container {
    flex-direction: column;
  }

  .vertical-navigation {
    width: 100%;
    height: auto;
    padding: 1rem 0;
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
  }

  .sidebar-logo {
    width: 60px;
    height: 60px;
    margin-bottom: 0;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .navigation-list {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    overflow-x: auto;
    padding: 0 1rem;
  }

  .navigation-item {
    min-width: 120px;
    margin: 0;
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .navigation-item i {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }

  .navigation-item span {
    font-size: 0.8rem;
  }

  .logout-button {
    min-width: 100px;
    margin: 0;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    flex-shrink: 0;
  }

  .content-wrapper {
    height: calc(100vh - 120px);
  }

  .modal-content {
    margin: 1rem;
    width: auto;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .modal-body {
    padding: 1rem 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .vertical-navigation {
    padding: 0.75rem 0;
  }

  .sidebar-logo {
    width: 50px;
    height: 50px;
  }

  .navigation-item {
    min-width: 80px;
    padding: 0.5rem;
  }

  .navigation-item span {
    font-size: 0.7rem;
  }

  .logout-button {
    min-width: 80px;
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .modal-header h3 {
    font-size: 1.25rem;
  }

  .modal-body p {
    font-size: 1rem;
  }
}

/* Animaciones adicionales */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.navigation-item.active {
  animation: pulse 2s infinite;
}

/* Scrollbar personalizado para el contenido */
.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}
</style>
