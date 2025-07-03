<template>
  <div class="container-fluid py-4">
    <!-- Header principal -->
    <div class="card shadow border-0 rounded-3 mb-4">
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-cog"></i>
          </div>
          <div class="header-title-section">
            <h3>Gestión de Ejes</h3>
            <p class="header-subtitle">Administra y edita tus ejes existentes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición mejorado -->
    <div v-if="showEditModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modern-modal">
          <!-- Header del modal con el diseño moderno -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-edit"></i>
              </div>
              <div class="header-title-section">
                <h3>Editar Eje</h3>
                <p class="header-subtitle">Modifica la información del eje</p>
              </div>
            </div>
            <button type="button" @click="closeEditModal" class="close-button" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal con el diseño moderno -->
          <div class="medico-body modal-body-custom">
            <!-- Nota informativa -->
            <div class="alert alert-info mb-4">
              <i class="fas fa-info-circle me-2"></i>
              Modifica los campos del eje según tus necesidades
            </div>

            <!-- Formulario de edición -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-cog me-2"></i>
                Información del Eje
              </h6>

              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Clave Oficial*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-key"></i>
                    </span>
                    <input
                      v-solo-texto-y-numeros
                      type="text"
                      v-model="editForm.clave_oficial"
                      class="form-control"
                      placeholder="Ingrese la clave oficial"
                      required
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Descripción*</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-align-left"></i>
                    </span>
                    <textarea
                      v-model="editForm.descripcion"
                      class="form-control"
                      rows="4"
                      placeholder="Ingrese la descripción del eje"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer con botones -->
            <div class="medico-footer">
              <button @click="closeEditModal" class="btn btn-cancel" type="button">
                <i class="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button @click="guardarEdicion" class="btn btn-save" type="button">
                <i class="fas fa-save me-2"></i>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de ejes con diseño mejorado -->
    <div v-if="ejes.length > 0" class="eje-list">
      <div v-for="eje in ejes" :key="eje._id?.$oid || eje._id" class="eje-card">
        <div class="eje-card-header">
          <div class="eje-icon">
            <i class="fas fa-cog"></i>
          </div>
          <div class="eje-info">
            <h4 class="eje-title">Eje {{ eje.clave_oficial }}</h4>
            <p class="eje-subtitle">{{ eje.descripcion }}</p>
            <p class="eje-date">
              Creado: {{ formatDate(eje.created_at) }} | Actualizado: {{ formatDate(eje.updated_at) }}
            </p>
          </div>
        </div>
        <div class="eje-actions">
          <button
            @click="editarEje(eje)"
            class="btn btn-edit"
            title="Editar eje"
          >
            <i class="fas fa-edit"></i>
            <span>Editar</span>
          </button>
          <button
            @click="eliminarEje(eje)"
            class="btn btn-delete"
            title="Eliminar eje"
          >
            <i class="fas fa-trash-alt"></i>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando ejes...</span>
      </div>
      <p class="mt-3 text-muted">Cargando ejes...</p>
    </div>
    
    <div v-else class="text-center py-5">
      <i class="fas fa-exclamation-circle text-muted mb-3" style="font-size: 3rem;"></i>
      <p class="text-muted">No se encontraron ejes</p>
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

/* Header con el diseño moderno usando #4e73df */
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

/* Estilos mejorados para las tarjetas de ejes */
.eje-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.eje-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(78, 115, 223, 0.1);
  position: relative;
}

.eje-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4e73df, #224abe);
  border-radius: 16px 16px 0 0;
}

.eje-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(78, 115, 223, 0.2);
}

.eje-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.eje-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.3);
  flex-shrink: 0;
}

.eje-info {
  flex: 1;
  min-width: 0;
}

.eje-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.eje-subtitle {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 400;
  line-height: 1.4;
  word-wrap: break-word;
}

.eje-date {
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 400;
}

.eje-actions {
  display: flex;
  padding: 1rem 1.5rem;
  background: white;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-edit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

/* Modal con diseño moderno */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
}

.modal-header-custom {
  padding: 2rem;
  border-bottom: none;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body-custom {
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

.modern-input textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.alert {
  border-radius: 12px;
  border: 1px solid rgba(78, 115, 223, 0.2);
  background: linear-gradient(145deg, rgba(78, 115, 223, 0.1) 0%, rgba(78, 115, 223, 0.05) 100%);
  color: #224abe;
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

/* Estados de carga y vacío */
.spinner-border {
  width: 3rem;
  height: 3rem;
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

  .eje-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .eje-card-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .eje-actions {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .btn {
    justify-content: center;
    width: 100%;
  }

  .modal-dialog {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-header-custom {
    padding: 1.5rem;
  }

  .modal-body-custom {
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
  .eje-list {
    grid-template-columns: 1fr;
  }

  .modal-header-custom {
    padding: 1rem;
  }

  .modal-body-custom {
    padding: 1rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .eje-card-header {
    flex-direction: row;
    align-items: flex-start;
  }

  .eje-info {
    min-width: 0;
  }

  .eje-title {
    font-size: 1rem;
  }

  .eje-subtitle {
    font-size: 0.85rem;
  }

  .eje-date {
    font-size: 0.75rem;
  }
}
</style>


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
    async fetchEjes() {
      try {
        this.loading = true
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

        const response = await axios.get('http://127.0.0.1:8000/api/ejes', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        if (response.status === 200) {
          if (Array.isArray(response.data.ejes)) {
            this.ejes = response.data.ejes
          } else {
            this.ejes = []
          }
        }
      } catch (error) {
        console.error('Error completo:', error)

        if (error.response) {
          const status = error.response.status

          if (status === 401) {
            this.mostrarNotificacion(
              'Error',
              'Sesión expirada. Por favor inicia sesión nuevamente.',
              'error',
            )
            localStorage.removeItem('apiToken')
            localStorage.removeItem('user')
            this.$router.push('/')
          } else {
            this.mostrarNotificacion('Error', `Error inesperado: ${status}`, 'error')
          }
        } else if (error.request) {
          this.mostrarNotificacion('Error', 'No se pudo conectar con el servidor', 'error')
          console.error('Sin respuesta del servidor:', error.request)
        } else {
          this.mostrarNotificacion('Error', 'Error inesperado en la petición', 'error')
          console.error('Error inesperado:', error)
        }
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
          descripcion: this.editForm.descripcion,
          clave_oficial: this.editForm.clave_oficial,
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/ejes/${this.editForm._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        )

        if (response.status === 200) {
          this.closeEditModal()
          this.fetchEjes()
          this.mostrarNotificacion('¡Éxito!', 'Eje actualizado correctamente', 'success')
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

            case 404:
              this.mostrarNotificacion('Error', 'Eje no encontrado', 'error')
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
      }
    },

    async eliminarEje(eje) {
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

        const respuesta = await Swal.fire({
          title: '¿Estás seguro que quieres borrarlo?',
          text: 'No podrás revertir esto.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        })

        if (respuesta.isConfirmed) {
          const ejeId = eje._id || eje.id

          const response = await axios.delete(`http://127.0.0.1:8000/api/ejes/${ejeId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          })

          if (response.status === 200) {
            this.mostrarNotificacion('¡Completado!', 'Eje eliminado exitosamente', 'success')
            this.fetchEjes()
          } else {
            this.mostrarNotificacion(
              'Advertencia',
              'Estado inesperado: ' + response.status,
              'warning',
            )
          }
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

            case 404:
              this.mostrarNotificacion('Error', 'Eje no encontrado', 'error')
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
