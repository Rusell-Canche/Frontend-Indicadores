<template>
  <div class="forbidden-container">
    <div class="forbidden-card">
      <!-- Icono animado -->
      <div class="icon-wrapper">
        <i class="fas fa-shield-alt"></i>
      </div>
      
      <!-- Contenido -->
      <h1 class="title">Acceso Prohibido</h1>
      <p class="subtitle">Error 403</p>
      
      <p class="message">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
      
      
      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="goBack" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i>
          Volver atrás
        </button>
        <button @click="goHome" class="btn btn-primary">
          <i class="fas fa-home"></i>
          Ir al inicio
        </button>
      </div>
      
      <!-- Ayuda adicional -->
      <div class="help-section">
        <p class="help-text">
          <i class="fas fa-question-circle"></i>
          Si crees que esto es un error, contacta al administrador del sistema
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goHome() {
      this.$router.push('/PanelDeControl/Bienvenida')
    }
  }
}
</script>

<style scoped>
.forbidden-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forbidden-card {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  border-radius: 50%;
  margin-bottom: 30px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(255, 107, 107, 0);
  }
}

.icon-wrapper i {
  font-size: 60px;
  color: white;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #718096;
  font-weight: 600;
  margin-bottom: 20px;
}

.message {
  font-size: 16px;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 30px;
}

.suggestions {
  background: #f7fafc;
  border-left: 4px solid #ff6b6b;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.suggestion-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 14px;
}

.suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.suggestions li {
  color: #4a5568;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.help-section {
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.help-text {
  font-size: 14px;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
}

.help-text i {
  color: #667eea;
}

/* Responsive */
@media (max-width: 576px) {
  .forbidden-card {
    padding: 40px 25px;
  }
  
  .title {
    font-size: 26px;
  }
  
  .icon-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .icon-wrapper i {
    font-size: 50px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>