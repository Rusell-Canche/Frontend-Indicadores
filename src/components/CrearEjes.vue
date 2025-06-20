<template>
  <div class="container mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light">
        <h3 class="mb-0">Crear Nuevo Eje</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="mostrarConfirmacion">
          <div class="mb-3">
            <label for="eje-clave" class="form-label">Clave Oficial <span class="text-danger">*</span></label>
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
            <label for="eje-descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
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
            <button
              type="button"
              @click="limpiarFormulario"
              class="btn btn-light me-2"
            >
              Limpiar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="guardando"
            >
              <span v-if="guardando">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
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
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      nuevoEje: {
        clave_oficial: '',
        descripcion: ''
      },
      guardando: false
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
          confirmButtonText: 'Entendido'
        });
        return;
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
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarEje();
        }
      });
    },
    async guardarEje() {
      this.guardando = true;

      try {
        // Obtener el token CSRF del meta tag
        const csrfToken = this.getCsrfToken();

        // Configurar axios para enviar como FormData
        const formData = new FormData();
        formData.append('_token', csrfToken);
        formData.append('clave_oficial', this.nuevoEje.clave_oficial);
        formData.append('descripcion', this.nuevoEje.descripcion);

        const response = await axios.post('/eje/insert', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        Swal.fire({
          icon: 'success',
          title: '¡Completado!',
          text: response.data.message || 'Eje creado exitosamente',
          confirmButtonColor: '#0d6efd'
        });

        this.limpiarFormulario();
      } catch (error) {
        console.error('Error:', error);

        let errorMessage = 'Error al guardar el eje';

        if (error.response) {
          if (error.response.status === 419) {
            errorMessage = 'Error de autenticación CSRF. Por favor recarga la página.';
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else {
          errorMessage = 'Error de conexión';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#0d6efd'
        });
      } finally {
        this.guardando = false;
      }
    },
    getCsrfToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        throw new Error('No se encontró el token CSRF');
      }
      return metaTag.content;
    },
    limpiarFormulario() {
      this.nuevoEje = {
        clave_oficial: '',
        descripcion: ''
      };
    }
  }
}
</script>

<style scoped>


.card:hover {
  transform: none !important;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
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
