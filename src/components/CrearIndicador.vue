<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-plus"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Nuevo Indicador</h3>
            <p class="header-subtitle">Ingresa la información para crear un nuevo indicador</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="mostrarConfirmacion">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>Los campos marcados con
            <span class="text-danger">*</span> son obligatorios
          </div>

          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-tag me-2"></i>
              Información del Indicador
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Nombre del Indicador*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-tag"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.nombre"
                    class="form-control"
                    required
                    placeholder="Ej: Indicador de rendimiento"
                  />
                </div>
                <div class="form-text">Ingrese un nombre descriptivo para el indicador</div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-folder me-2"></i>
              Configuración del Proyecto
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Proyecto*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-folder"></i>
                  </span>
                  <select v-model="nuevoIndicador.proyecto" class="form-select" required>
                    <option value="">Seleccione un proyecto</option>
                    <option value="1.1.2">Proyecto 1.1.2</option>
                    <option value="1.1.3">Proyecto 1.1.3</option>
                    <option value="1.1.4">Proyecto 1.1.4</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Número</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-hashtag"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.numero"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-calculator me-2"></i>
              Valores Numéricos
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Denominador</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-arrow-up"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.denominador"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div class="form-text">Valor numérico para el cálculo</div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-calculator me-2"></i>
              Departamentos
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Departamento</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fa-solid fa-tent"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.departamento"
                    class="form-control"
                    required
                    placeholder="Ej: Computo"
                  />
                </div>
                <div class="form-text">Asociar Un indicador a un departamento</div>
              </div>
            </div>
          </div>

          <!-- seccion para agregar una fecha_inicio y fecha_fin a los indicadores -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-calendar-alt me-2"></i>
              Fechas del Indicador
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Fecha de Inicio</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-check"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.fecha_inicio"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-text">Fecha de inicio del indicador</div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha de Fin</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-calendar-times"></i>
                  </span>
                  <input
                    v-model="nuevoIndicador.fecha_fin"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="form-text">Fecha de fin del indicador</div>
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
              <template v-if="guardando">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </template>
              <template v-else>
                <i class="fas fa-save me-2"></i>
                Guardar Indicador
              </template>
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
      nuevoIndicador: {
        nombre: '',
        proyecto: '',
        numero: 0,
        denominador: 0,
        departamento: '',
        fecha_inicio: '',
        fecha_fin: '',
      },
      guardando: false,
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
        this.nuevoIndicador.denominador === '' ||
        !this.nuevoIndicador.departamento.trim() ||
        !this.nuevoIndicador.fecha_inicio ||
        !this.nuevoIndicador.fecha_fin
      ) {
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
              <p class="mb-2"><strong>Indicador:</strong> ${this.nuevoIndicador.nombre}</p>
              <p><strong>Proyecto:</strong> ${this.nuevoIndicador.proyecto}</p>
              <p><strong>Numero:</strong> ${this.nuevoIndicador.numero}</p>
              <p><strong>Denominador:</strong> ${this.nuevoIndicador.denominador}</p>
              <p><strong>Departamento:</strong> ${this.nuevoIndicador.departamento}</p>
              <p><strong>Fecha de Inicio:</strong> ${this.nuevoIndicador.fecha_inicio}</p>
              <p><strong>Fecha de Fin:</strong> ${this.nuevoIndicador.fecha_fin}</p>
            </div>
          `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, crear Indicador',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarIndicador()
        }
      })
    },
    /**
     * Envia el formulario de creación del indicador a la API
     * @async
     */
    async guardarIndicador() {
      //
      this.guardando = true

      try {
        const token = localStorage.getItem('apiToken')
        // Configurar axios para enviar como indicadorFormData
        const indicadorFormData = new FormData()

        // Insertamos la información del formulario
        indicadorFormData.append('nombreIndicador', this.nuevoIndicador.nombre)
        indicadorFormData.append('_idProyecto', this.nuevoIndicador.proyecto)
        indicadorFormData.append('numero', this.nuevoIndicador.numero)
        indicadorFormData.append('denominador', this.nuevoIndicador.denominador)
        indicadorFormData.append('departamento', this.nuevoIndicador.departamento)
        indicadorFormData.append('fecha_inicio', this.nuevoIndicador.fecha_inicio)
        indicadorFormData.append('fecha_fin', this.nuevoIndicador.fecha_fin)

        // Mandamos la solicitud POST a la API
        const response = await axios.post(
          'http://127.0.0.1:8000/api/indicador/insert',
          indicadorFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log('Respuesta de la API:', response)

        // Verificamos si la respuesta es exitosa
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: '¡Completado!',
            text: response.data.message || 'Indicador creado exitosamente',
            confirmButtonColor: '#0d6efd',
          })

          this.limpiarFormulario()
        }
      } catch (error) {
        // Imprimimos el error en la consola
        console.error('Error al guardar el indicador:', error)

        // Revisamos si hubo una respuesta del servidor
        if (error.response) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error inesperado: ${error.response.status}`,
            confirmButtonColor: '#0d6efd',
          })
        }
        // Revisamos si hubo un error en la solicitud
        else if (error.request) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se recibió respuesta del servidor.',
            confirmButtonColor: '#0d6efd',
          })
        }
      } finally {
        // Independientemente de si hubo un error o no, cambiamos el estado de guardando
        this.guardando = false
      }
    },

    limpiarFormulario() {
      this.nuevoIndicador = {
        nombre: '',
        proyecto: '',
        numero: 0,
        denominador: 0,
        departamento: '',
      }
    },
  },
}
</script>

<style scoped>
/* Estilos para el contenedor principal */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
}

/* Header con el diseño moderno */
.medico-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(90deg, #667eea, #764ba2);
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
  color: #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  transform: translateY(-1px);
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.alert {
  border-radius: 12px;
  border: 1px solid #b3d4fc;
  background: linear-gradient(145deg, #e7f3ff 0%, #f0f8ff 100%);
  color: #0c5460;
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
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
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
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-save:disabled:hover {
  transform: none;
  box-shadow: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
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
