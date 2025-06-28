<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-plus-circle"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Nuevo Eje</h3>
            <p class="header-subtitle">Configura la información básica del eje</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="mostrarConfirmacion">
          <!-- Sección Clave Oficial -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-key me-2"></i>
              Clave Oficial
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-hashtag"></i>
                  </span>
                  <input
                    type="text"
                    id="eje-clave"
                    v-model="nuevoEje.clave_oficial"
                    v-ejes
                    class="form-control"
                    placeholder="Ej: EJ-001"
                    required
                  />
                </div>
                <div class="form-text">
                  <small class="text-danger">Campo obligatorio</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección Descripción -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-align-left me-2"></i>
              Descripción
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-edit"></i>
                  </span>
                  <textarea
                    id="eje-descripcion"
                    v-model="nuevoEje.descripcion"
                    rows="4"
                    v-descripcion
                    class="form-control"
                    placeholder="Describe el propósito y contenido de este eje..."
                    required
                  ></textarea>
                </div>
                <div class="form-text">
                  <small class="text-danger">Campo obligatorio</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button @click="limpiarFormulario" class="btn btn-cancel" type="button">
              <i class="fas fa-eraser me-2"></i>
              Limpiar
            </button>
            <button type="submit" class="btn btn-save" :disabled="guardando">
              <span v-if="guardando">
                <span
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </span>
              <span v-else>
                <i class="fas fa-save me-2"></i>
                Guardar Eje
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
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
  background: linear-gradient(90deg, #4e73df, #224abe);
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
  color: #4e73df;
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
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control,
.modern-input .form-select {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
  transform: translateY(-1px);
}

.form-text {
  font-size: 0.875rem;
  color: #4e73df;
  margin-top: 0.25rem;
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
  background: linear-gradient(135deg, #adb5bd 0%, #6c757d 100%);
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
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
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
  background: linear-gradient(135deg, #224abe 0%, #1e3a8a 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(78, 115, 223, 0.4);
  color: white;
}

.btn-save:disabled {
  background: linear-gradient(135deg, #adb5bd 0%, #6c757d 100%);
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-save:disabled:hover {
  background: linear-gradient(135deg, #adb5bd 0%, #6c757d 100%);
  transform: none;
  box-shadow: none;
}

/* Spinner personalizado */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
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

/* Responsive */
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

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }
}
</style>
<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      nuevoEje: {
        clave_oficial: '',
        descripcion: '',
      },
      guardando: false,
    }
  },
  methods: {
    mostrarConfirmacion() {
      if (!this.nuevoEje.clave_oficial.trim() || !this.nuevoEje.descripcion.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor complete todos los campos requeridos.',
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'Entendido',
        })
        return
      }

      Swal.fire({
        title: '¿Confirmar creación?',
        html: `
          <div class="text-start">
            <p class="mb-2"><strong>Clave:</strong> ${this.nuevoEje.clave_oficial}</p>
            <p><strong>Descripción:</strong> ${this.nuevoEje.descripcion}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, crear eje',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarEje()
        }
      })
    },

    async guardarEje() {
      this.guardando = true

      try {
        const token = localStorage.getItem('apiToken')

        if (!token) {
          this.mostrarNotificacion(
            'Error',
            'No hay sesión activa. Por favor inicia sesión.',
            'error',
          )
          this.$router.push('/')
          return
        }

        const data = {
          clave_oficial: this.nuevoEje.clave_oficial,
          descripcion: this.nuevoEje.descripcion,
        }

        const response = await axios.post('http://127.0.0.1:8000/api/ejes', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        })

        if (response.status === 200 || response.status === 201) {
          this.mostrarNotificacion('¡Completado!', 'Eje creado exitosamente', 'success')
          this.limpiarFormulario()
        } else {
          this.mostrarNotificacion(
            'Advertencia',
            'Estado inesperado: ' + response.status,
            'warning',
          )
        }
      } catch (error) {
        console.error('Error completo:', error)

        if (error.response) {
          const status = error.response.status

          switch (status) {
            case 401:
              this.mostrarNotificacion(
                'Error',
                'Sesión expirada. Por favor inicia sesión nuevamente.',
                'error',
              )
              localStorage.removeItem('apiToken')
              localStorage.removeItem('user')
              this.$router.push('/')
              break

            case 422:
              this.mostrarNotificacion('Error', 'Datos de validación incorrectos', 'error')
              break

            case 500:
              this.mostrarNotificacion('Error', 'Error interno del servidor', 'error')
              break

            default:
              this.mostrarNotificacion('Error', `Error inesperado: ${status}`, 'error')
              break
          }
        } else if (error.request) {
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
        }
      } finally {
        this.guardando = false
      }
    },

    mostrarNotificacion(titulo, mensaje, tipo) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33',
        timer: tipo === 'success' ? 2500 : undefined,
        timerProgressBar: tipo === 'success',
      })
    },

    limpiarFormulario() {
      this.nuevoEje = {
        clave_oficial: '',
        descripcion: '',
      }
    },
  },
}
</script>
