<template>
  <div class="container mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light">
        <h3 class="mb-0">Crear Nuevo Eje</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="mostrarConfirmacion">
          <div class="mb-3">
            <label for="eje-clave" class="form-label"
              >Clave Oficial <span class="text-danger">*</span></label
            >
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

          <div class="mb-3">
            <label for="eje-descripcion" class="form-label"
              >Descripción <span class="text-danger">*</span></label
            >
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

          <div class="button-group d-flex justify-content-end gap-2 mt-4">
            <button type="button" @click="limpiarFormulario" class="btn btn-light me-2">
              Limpiar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              <span v-if="guardando">
                <span
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </span>
              <span v-else>Guardar Eje</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

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

        const response = await axios.post('http://127.0.0.1:8000/api/eje', data, {
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

<style scoped>
.card:hover {
  transform: none !important;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.card {
  border-radius: 0.5rem;
  transition: none !important;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.25rem;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-light {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.btn-light:hover {
  background-color: #e2e6ea;
  border-color: #dae0e5;
}
</style>
