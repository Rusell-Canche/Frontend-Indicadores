<template>
  <div class="max-w-6xl mx-auto p-4 font-sans">
    <!-- Modal de edición mejorado -->
    <div v-if="showEditModal" class="eje-modal-backdrop">
      <div class="eje-modal-content">
        <div class="eje-modal-header bg-primary">
          <h3 class="text-white">Editar Eje</h3>
          <button @click="closeEditModal" class="eje-close-button">
            <i class="fas fa-times text-white"></i>
          </button>
        </div>
        <div class="eje-modal-body">
          <div class="form-group">
            <label for="clave">Clave Oficial</label>
            <input type="text" id="clave" v-model="editForm.clave_oficial" class="eje-form-input" />
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              v-model="editForm.descripcion"
              class="eje-form-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="eje-modal-footer">
          <button @click="closeEditModal" class="eje-btn eje-btn-cancel">Cancelar</button>
          <button @click="guardarEdicion" class="eje-btn eje-btn-save">Guardar Cambios</button>
        </div>
      </div>
    </div>

    <!-- Lista de ejes -->
    <div v-if="ejes.length > 0" class="eje-list">
      <div v-for="eje in ejes" :key="eje._id?.$oid || eje._id" class="eje-card">
        <div class="eje-header">
          <i class="fas fa-cog eje-card-icon"></i>
          <h4>Eje {{ eje.clave_oficial }}</h4>
        </div>
        <div class="eje-info">
          <p class="eje-description">{{ eje.descripcion }}</p>
          <p class="eje-date">
            Creado: {{ formatDate(eje.created_at) }} | Actualizado: {{ formatDate(eje.updated_at) }}
          </p>
        </div>
        <div class="eje-actions">
          <button @click="editarEje(eje)" class="eje-btn eje-btn-edit">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button @click="eliminarEje(eje)" class="eje-btn eje-btn-delete">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-gray-500 text-center">Cargando ejes...</div>
    <div v-else class="text-red-500 text-center">No se encontraron ejes</div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      ejes: [],
      loading: true,
      showEditModal: false,
      editForm: {
        _id: null,
        clave_oficial: '',
        descripcion: '',
      },
    }
  },
  mounted() {
    this.fetchEjes()
  },
  methods: {
    getCsrfToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]')
      if (!metaTag) {
        throw new Error('No se encontró el token CSRF')
      }
      return metaTag.content
    },

    async fetchEjes() {
      try {
        this.loading = true
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/eje', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && Array.isArray(response.data.ejes)) {
          this.ejes = response.data.ejes
          console.log('Datos de ejes recibidos:', this.ejes)
        } else {
          console.error('Formato de respuesta inesperado:', response.data)
          this.ejes = []
        }
      } catch (error) {
        console.error('Error al obtener los ejes:', error)
        this.ejes = []
      } finally {
        this.loading = false
      }
    },

    formatDate(dateObj) {
      if (!dateObj) return 'Fecha no disponible'

      if (dateObj.$date) {
        const timestamp = dateObj.$date.$numberLong || dateObj.$date
        return new Date(parseInt(timestamp)).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (typeof dateObj === 'string') {
        return new Date(dateObj).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (typeof dateObj === 'number') {
        return new Date(dateObj).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }

      return 'Formato de fecha no reconocido'
    },

    editarEje(eje) {
      this.editForm = {
        _id: eje._id || eje.id,
        clave_oficial: eje.clave_oficial,
        descripcion: eje.descripcion,
      }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editForm = {
        _id: null,
        clave_oficial: '',
        descripcion: '',
      }
    },

    async guardarEdicion() {
      try {
        const token = localStorage.getItem('apiToken')

        const formData = new FormData()
        formData.append('descripcion', this.editForm.descripcion)
        formData.append('clave_oficial', this.editForm.clave_oficial)

        const response = await axios.put(
          `http://127.0.0.1:8000/api/eje/${this.editForm._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        )

        if (response.data.message === 'Eje actualizado exitosamente') {
          this.closeEditModal()
          this.fetchEjes()
          this.mostrarNotificacion('¡Éxito!', 'Eje actualizado correctamente', 'success')
        }
      } catch (error) {
        console.error('Error al actualizar el eje:', error)
        let mensaje = 'Error de conexión'

        if (error.response) {
          if (error.response.status === 419) {
            mensaje = 'Error de autenticación CSRF. Por favor recarga la página.'
          } else if (error.response.data && error.response.data.message) {
            mensaje = error.response.data.message
          } else {
            mensaje = 'Error al actualizar el eje'
          }
        }

        this.mostrarNotificacion('Error', mensaje, 'error')
      }
    },

    async eliminarEje(eje) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Se eliminará el eje "${eje.clave_oficial}"`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        })

        if (result.isConfirmed) {
          const csrfToken = this.getCsrfToken()
          const token = localStorage.getItem('apiToken')
          const ejeId = eje._id || eje.id

          const formData = new FormData()
          formData.append('_token', csrfToken)
          formData.append('_method', 'DELETE')

          const response = await axios.delete(`http://127.0.0.1:8000/api/eje/${ejeId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          })

          if (response.data.message === 'Eje eliminado exitosamente') {
            this.mostrarNotificacion('Eliminado', 'Eje eliminado correctamente', 'success')
            this.fetchEjes()
          }
        }
      } catch (error) {
        console.error('Error al eliminar el eje:', error)
        let mensaje = 'Error de conexión'

        if (error.response) {
          if (error.response.status === 419) {
            mensaje = 'Error de autenticación CSRF. Por favor recarga la página.'
          } else if (error.response.data && error.response.data.message) {
            mensaje = error.response.data.message
          } else {
            mensaje = 'Error al eliminar el eje'
          }
        }

        this.mostrarNotificacion('Error', mensaje, 'error')
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
  },
}
</script>

<style scoped>
/* Estilos renovados para ejes */
.eje-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 15px;
}

.eje-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}

.eje-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.eje-header {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  text-align: center;
  position: relative;
}

.eje-card-icon {
  font-size: 2.5rem;
  color: #4e73df;
  margin-bottom: 15px;
  display: block;
}

.eje-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.eje-info {
  padding: 15px 20px;
  flex-grow: 1;
}

.eje-description {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.eje-date {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 10px;
}

.eje-actions {
  display: flex;
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  justify-content: space-between;
  gap: 10px;
}

.eje-btn {
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.eje-btn-edit {
  background-color: #4e73df;
  color: white;
}

.eje-btn-edit:hover {
  background-color: #3a56b0;
}

.eje-btn-delete {
  background-color: #e74a3b;
  color: white;
}

.eje-btn-delete:hover {
  background-color: #be2617;
}

.eje-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Estilos mejorados para el modal */
.eje-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.eje-modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: ejeModalFadeIn 0.3s ease;
}

@keyframes ejeModalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.eje-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #4e73df 0%, #3a56b0 100%);
}

.eje-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.eje-close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.eje-modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.eje-form-input,
.eje-form-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}

.eje-form-input:focus,
.eje-form-textarea:focus {
  border-color: #4e73df;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.25);
}

.eje-modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e9ecef;
}

.eje-btn-cancel {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #6c757d;
}

.eje-btn-cancel:hover {
  background-color: #e9ecef;
}

.eje-btn-save {
  background-color: #4e73df;
  border: 1px solid #3a56b0;
  color: white;
}

.eje-btn-save:hover {
  background-color: #3a56b0;
  box-shadow: 0 2px 5px rgba(58, 86, 176, 0.3);
}

@media (max-width: 768px) {
  .eje-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .eje-actions {
    flex-direction: column;
  }

  .eje-btn {
    justify-content: center;
    width: 100%;
  }
}
</style>
