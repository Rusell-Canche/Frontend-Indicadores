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
          :class="{ active: $route.path === '/PanelDeControl/Bienvenida' }"
          @click="$router.push('/PanelDeControl/Bienvenida')"
        >
          <i class="fas fa-home"></i>
          <span>PANEL DE CONTROL</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/Indicador' }"
          @click="$router.push('/Indicador')"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Indicadores</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/Ejes' }"
          @click="$router.push('/Ejes')"
        >
          <i class="fas fa-arrows-alt-v"></i>
          <span>Ejes</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/Plantillas' }"
          @click="$router.push('/Plantillas')"
        >
          <i class="fas fa-file"></i>
          <span>Plantillas</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/Documentos' }"
          @click="$router.push('/Documentos')"
        >
          <i class="fas fa-file-alt"></i>
          <span>Documentos</span>
        </li>
        <li
          class="navigation-item"
          :class="{ active: $route.path === '/Usuarios' }"
          @click="$router.push('/Usuarios')"
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
  mounted() {
    // Si la ruta actual es exactamente '/PanelDeControl', redirigir a Bienvenida
    if (this.$route.path === '/PanelDeControl') {
      this.$router.replace('/PanelDeControl/Bienvenida')
    }
  },
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
  font-family:
    'Inter',
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Sidebar vertical moderno con glassmorphism */
.vertical-navigation {
  width: 300px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 0;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.vertical-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.05) 50%,
    rgba(15, 23, 42, 0.1) 100%
  );
  pointer-events: none;
}

/* Logo con efecto de levitación */
.sidebar-logo {
  width: 220px;
  height: 100px;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 16px 24px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.sidebar-logo:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.sidebar-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Lista de navegación con espaciado mejorado */
.navigation-list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Items de navegación con efectos avanzados */
.navigation-item {
  width: calc(100% - 2rem);
  margin: 0 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  border: 1px solid transparent;
}

.navigation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.navigation-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.navigation-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(12px);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow:
    0 8px 32px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.navigation-item:hover::before {
  left: 100%;
}

.navigation-item:hover::after {
  opacity: 1;
}

.navigation-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  transform: translateX(12px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow:
    0 12px 40px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.navigation-item.active::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 32px;
  background: linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%);
  border-radius: 2px 0 0 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Iconos con animaciones mejoradas */
.navigation-item i {
  width: 28px;
  height: 28px;
  margin-right: 1.25rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.navigation-item:hover i {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.navigation-item.active i {
  color: white;
  transform: scale(1.1);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Texto con tipografía mejorada */
.navigation-item span {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
  line-height: 1.2;
}

.navigation-item.active span {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

/* Botón de logout premium */
.logout-button {
  width: calc(100% - 2rem);
  margin: 2rem 1rem 0;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 8px 32px rgba(239, 68, 68, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.logout-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-3px);
  box-shadow:
    0 16px 48px rgba(239, 68, 68, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.logout-button:hover::before {
  left: 100%;
}

.logout-button:active {
  transform: translateY(-1px);
}

.logout-button i {
  font-size: 1.2rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logout-button:hover i {
  transform: rotate(-15deg) scale(1.15);
}

/* Contenido principal con gradiente sutil */
.content-wrapper {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow-y: auto;
  position: relative;
}

.content-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent);
}

/* Modal con glassmorphism avanzado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  width: 480px;
  max-width: 90%;
  overflow: hidden;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-40px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2.5rem 2.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.4) 100%);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: -0.025em;
}

.modal-header h3::before {
  content: '⚠️';
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.modal-close {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 1.25rem;
  color: #ef4444;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  backdrop-filter: blur(8px);
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
}

.modal-body {
  padding: 2rem 2.5rem;
}

.modal-body p {
  margin: 0;
  color: #475569;
  font-size: 1.2rem;
  line-height: 1.7;
  text-align: center;
  font-weight: 500;
}

.modal-footer {
  padding: 1.5rem 2.5rem 2.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(241, 245, 249, 0.4) 100%);
}

.btn-cancel {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 16px rgba(100, 116, 139, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(100, 116, 139, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.btn-confirm {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 16px rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.btn-confirm::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.btn-confirm:hover::before {
  left: 100%;
}

/* Responsive Design Mejorado */
@media (max-width: 1024px) {
  .vertical-navigation {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .sidebar-logo {
    width: 100px;
    height: 60px;
    margin-bottom: 0;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }
  .control-panel-container {
    flex-direction: column;
  }

  .vertical-navigation {
    width: 100%;
    height: auto;
    padding: 1.5rem 0;
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
    backdrop-filter: blur(16px);
  }

  .sidebar-logo {
    margin-bottom: 0;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }

  .navigation-list {
    display: flex;
    gap: 0.75rem;
    flex: 1;
    overflow-x: auto;
    padding: 0 1.5rem;
  }

  .navigation-item {
    min-width: 140px;
    margin: 0;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 0.75rem;
  }

  .navigation-item i {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .navigation-item span {
    font-size: 0.85rem;
  }

  .logout-button {
    min-width: 120px;
    margin: 0;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    flex-shrink: 0;
  }

  .content-wrapper {
    height: calc(100vh - 140px);
  }

  .modal-content {
    margin: 1.5rem;
    width: auto;
  }

  .modal-header {
    padding: 2rem 2rem 1.25rem;
  }

  .modal-body {
    padding: 1.5rem 2rem;
  }

  .modal-footer {
    padding: 1.25rem 2rem 2rem;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .sidebar-logo {
    width: 90px;
    height: 50px;
  }
  .vertical-navigation {
    padding: 1rem 0;
  }

  .sidebar-logo {
    width: 60px;
    height: 60px;
  }

  .navigation-item {
    min-width: 100px;
    padding: 0.75rem;
  }

  .navigation-item span {
    font-size: 0.75rem;
  }

  .logout-button {
    min-width: 100px;
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  .modal-header h3 {
    font-size: 1.5rem;
  }

  .modal-body p {
    font-size: 1.1rem;
  }
}

/* Scrollbar personalizado premium */
.content-wrapper::-webkit-scrollbar {
  width: 12px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 6px;
  border: 2px solid rgba(241, 245, 249, 0.5);
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* Animaciones adicionales */
@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 12px 40px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 16px 50px rgba(59, 130, 246, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.navigation-item.active {
  animation: glow 3s ease-in-out infinite;
}

/* Efectos de partículas sutiles */
.vertical-navigation::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);
  pointer-events: none;
  opacity: 0.6;
}
</style>
