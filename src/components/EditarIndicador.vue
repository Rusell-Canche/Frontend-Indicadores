<template>
  <div class="medico-modal-backdrop" @click.self="cerrarModal">
    <div class="medico-modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="medico-modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-edit"></i>
          </div>
          <div class="modal-title-section">
            <h3>Editar Indicador</h3>
            <p class="modal-subtitle">Actualiza la información del indicador seleccionado</p>
          </div>
        </div>
        <button @click="cerrarModal" class="medico-close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body del modal -->
      <div class="medico-modal-body">
        <form @submit.prevent="guardarEdicion">
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
                    v-model="indicadorEditForm.nombreIndicador"
                    class="form-control"
                    required
                    placeholder="Ej: Indicador de calidad"
                  />
                </div>
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
                  <select v-model="indicadorEditForm._idProyecto" class="form-select" required>
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
                    v-model="indicadorEditForm.numero"
                    type="number"
                    class="form-control"
                    placeholder="Ej: 1"
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
              <div class="col-md-6">
                <label class="form-label">Numerador</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-arrow-down"></i>
                  </span>
                  <input
                    v-model="indicadorEditForm.numerador"
                    type="number"
                    class="form-control"
                    placeholder="Ej: 100"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Denominador</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-arrow-up"></i>
                  </span>
                  <input
                    v-model="indicadorEditForm.denominador"
                    type="number"
                    class="form-control"
                    placeholder="Ej: 200"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer del modal -->
      <div class="medico-modal-footer">
        <button @click="cerrarModal" class="btn btn-cancel">
          <i class="fas fa-times me-2"></i>
          Cancelar
        </button>
        <button @click="guardarEdicion" class="btn btn-save">
          <i class="fas fa-save me-2"></i>
          Actualizar Indicador
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  props: ['id'],
  data() {
    return {
      indicadorEditForm: {
        _id: this.id || this._id,
        nombreIndicador: '',
        numerador: '',
        numero: '',
        denominador: '',
        _idProyecto: '',
      },
    }
  },
  mounted() {
    this.cargarIndicador()
  },
  methods: {
    async cargarIndicador() {
      try {
        const token = localStorage.getItem('apiToken')
        // Obtener todos los indicadores
        const response = await axios.get('http://127.0.0.1:8000/api/indicador/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        if (response.status === 200 && Array.isArray(response.data.indicadores)) {
          // Buscar el indicador por ID
          const indicador = response.data.indicadores.find(
            (i) => i._id === this.id || i.id === this.id,
          )

          if (indicador) {
            this.indicadorEditForm = {
              _id: this.id,
              nombreIndicador: indicador.nombreIndicador,
              numerador: indicador.numerador,
              numero: indicador.numero,
              denominador: indicador.denominador,
              _idProyecto: indicador._idProyecto,
            }
          } else {
            throw new Error('Indicador no encontrado')
          }
        } else {
          throw new Error('Respuesta inválida de la API')
        }
      } catch (error) {
        console.error('Error cargando indicador:', error)
        this.mostrarNotificacion(
          'Error',
          'No se pudo cargar el indicador: ' + error.message,
          'error',
        )
        this.cerrarModal()
      }
    },

    async guardarEdicion() {
      try {
        const token = localStorage.getItem('apiToken')
        const formData = new FormData()
        formData.append('nombreIndicador', this.indicadorEditForm.nombreIndicador)
        formData.append('numerador', this.indicadorEditForm.numerador)
        formData.append('numero', this.indicadorEditForm.numero)
        formData.append('_idProyecto', this.indicadorEditForm._idProyecto)

        const response = await axios.post(
          `http://127.0.0.1:8000/api/indicador/update/${this.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (response.status === 200) {
          this.mostrarNotificacion('¡Completado!', 'Indicador editado exitosamente', 'success')
          this.$emit('indicador-actualizado')
          this.cerrarModal()
        }
      } catch (error) {
        console.error('Error guardando indicador:', error)
        this.mostrarNotificacion('Error', 'Error al guardar el indicador', 'error')
      }
    },

    cerrarModal() {
      this.$router.push({ name: 'ver-indicadores' })
    },

    mostrarNotificacion(titulo, mensaje, tipo) {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33',
      })
    },
  },
}
</script>
