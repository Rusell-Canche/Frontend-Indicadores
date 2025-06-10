<template>
  <div class="container mt-4">
    <div class="card shadow-lg border-0">
      <div class="card-header bg-primary text-white">
        <h3 class="mb-0 fw-semibold"><i class="bi bi-clipboard-data me-2"></i>Crear Nuevo Indicador</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="mostrarConfirmacion">
          <!-- Required Fields Note -->
          <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle-fill me-2"></i>Los campos marcados con <span class="text-danger">*</span> son obligatorios
          </div>

          <!-- NOMBRE DEL INDICADOR -->
          <div class="mb-4">
            <label for="nombre-indicador" class="form-label fw-medium">Nombre del Indicador <span
                class="text-danger">*</span></label>
            <input type="text" id="nombre-indicador" v-model="nuevoIndicador.nombre"
              class="form-control form-control-lg" placeholder="Ej: Indicador de rendimiento" required />
            <div class="form-text">Ingrese un nombre descriptivo para el indicador</div>
          </div>

          <!-- PROYECTO DEL INDICADOR -->
          <div class="mb-4">
            <label for="proyecto" class="form-label fw-medium">Seleccione Proyecto <span
                class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-folder"></i></span>
              <select id="proyecto" v-model="nuevoIndicador.proyecto" class="form-select form-select-lg" required>
                <option value="" disabled>Seleccione un proyecto</option>
                <option value="1.1.2">Proyecto 1.1.2</option>
                <option value="1.1.3">Proyecto 1.1.3</option>
                <option value="1.1.4">Proyecto 1.1.4</option>
              </select>
            </div>
          </div>

          <!-- Number Inputs Grid -->
          <div class="row g-3 mb-4">
            <!-- NUMERO DEL INDICADOR -->
            <div class="col-md-6">
              <label for="numero" class="form-label fw-medium">Número del Indicador</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-123"></i></span>
                <input type="number" id="numero" v-model="nuevoIndicador.numero" class="form-control form-control-lg"
                  placeholder="0" min="0" />
              </div>
            </div>

            <!-- DENOMINADOR DEL INDICADOR -->
            <div class="col-md-6">
              <label for="denominador" class="form-label fw-medium">Valor del denominador</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-percent"></i></span>
                <input type="number" id="denominador" v-model="nuevoIndicador.denominador"
                  class="form-control form-control-lg" placeholder="0" min="0" />
              </div>
              <div class="form-text">Valor numérico para el cálculo</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex justify-content-end gap-3 mt-5">
            <button type="button" @click="limpiarFormulario" class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-eraser me-2"></i>Limpiar
            </button>
            <button type="submit" class="btn btn-primary btn-lg" :disabled="guardando">
              <template v-if="guardando">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </template>
              <template v-else>
                <i class="bi bi-save-fill me-2"></i>Guardar Indicador
              </template>
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
      nuevoIndicador: {
        nombre: '',
        proyecto: '',
        numero: 0,
        denominador: 0
      },
      guardando: false
    }
  },
  methods: {
    mostrarConfirmacion() {
      // Vemos si estan vacios los campos
      if (
        !this.nuevoIndicador.nombre.trim() ||
        !this.nuevoIndicador.proyecto.trim() ||
        this.nuevoIndicador.numero === null ||
        this.nuevoIndicador.numero === '' ||
        this.nuevoIndicador.denominador === null ||
        this.nuevoIndicador.denominador === ''
      ) {
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
              <p class="mb-2"><strong>Indicador:</strong> ${this.nuevoIndicador.nombre}</p>
              <p><strong>Proyecto:</strong> ${this.nuevoIndicador.proyecto}</p>
              <p><strong>Numero:</strong> ${this.nuevoIndicador.numero}</p>
              <p><strong>Denominador:</strong> ${this.nuevoIndicador.denominador}</p>
            </div>
          `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, crear Indicador',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarIndicador();
        }
      });
    },
    /**
     * Envia el formulario de creación del indicador a la API
     * @async
     */
    async guardarIndicador() {
      // 
      this.guardando = true;

      try {

        // Configurar axios para enviar como indicadorFormData
        const indicadorFormData = new FormData();

        // Insertamos la información del formulario
        indicadorFormData.append('nombreIndicador', this.nuevoIndicador.nombre);
        indicadorFormData.append('_idProyecto', this.nuevoIndicador.proyecto);
        indicadorFormData.append('numero', this.nuevoIndicador.numero);
        indicadorFormData.append('denominador', this.nuevoIndicador.denominador);


        // Mandamos la solicitud POST a la API
        const response = await axios.post('api/indicador/insert', indicadorFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        console.log('Respuesta de la API:', response);

        // Verificamos si la respuesta es exitosa
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: '¡Completado!',
            text: response.data.message || 'Eje creado exitosamente',
            confirmButtonColor: '#0d6efd'
          });

          this.limpiarFormulario();
        }

      } catch (error) {
        // Imprimimos el error en la consola
        console.error('Error al guardar el indicador:', error);

        // Revisamos si hubo una respuesta del servidor
        if (error.response) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error inesperado: ${error.response.status}`,
            confirmButtonColor: '#0d6efd'
          });
        } 
        // Revisamos si hubo un error en la solicitud
        else if (error.request) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se recibió respuesta del servidor.',
            confirmButtonColor: '#0d6efd'
          });
        }
      } finally {
        // Independientemente de si hubo un error o no, cambiamos el estado de guardando
        this.guardando = false;
      }
    },

    limpiarFormulario() {
      this.nuevoIndicador = {
        clave_oficial: '',
        descripcion: ''
      };
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  overflow: hidden;
  transform: none !important;
}

.card-header {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
}

.form-control-lg {
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
}

.alert {
  border-radius: 0.75rem;
  border: 1px solid #86b7fe;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.9em;
  color: #6c757d;
  margin-top: 0.25rem;
}
</style>