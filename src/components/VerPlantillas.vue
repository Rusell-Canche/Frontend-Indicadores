<template>
  <div>
    <!-- Listado de plantillas con diseño mejorado -->
    <div class="plantilla-list">
      <div v-for="plantilla in plantillas" :key="plantilla.id" class="plantilla-card">
        <div class="plantilla-header">
          <i class="fas fa-file-alt card-icon"></i>
          <h4>{{ plantilla.nombre_plantilla }}</h4>
        </div>
        <div class="plantilla-actions">
          <button
            @click="openEditModal(plantilla.id)"
            class="btn btn-edit"
            title="Editar plantilla"
          >
            <i class="fas fa-edit"></i> Editar
          </button>
          <button
            @click="eliminarPlantilla(plantilla.id)"
            class="btn btn-delete"
            title="Eliminar plantilla"
          >
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para editar plantilla con diseño mejorado -->
    <div
      v-if="mostrarModalEdit"
      class="modal fade show"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
      style="display: block"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="editModalLabel">Editar Plantilla: {{ nombrePlantilla }}</h5>
            <button
              type="button"
              @click="closeEditModal"
              class="close text-white"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Sección para los campos de la plantilla -->
            <div class="form-card form-section">
              <label class="section-title">Campos de la Plantilla</label>

              <div v-for="(campo, index) in camposPlantilla" :key="index" class="campo-container">
                <div class="campo-header">
                  <span class="campo-index">Campo #{{ index + 1 }}</span>
                  <button type="button" @click="quitarCampo(index)" class="delete-button">
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>

                <div class="campo-body">
                  <div class="campo-item">
                    <label class="campo-label">Nombre del campo</label>
                    <input
                      v-model="campo.name"
                      class="form-input"
                      placeholder="Ej: título, descripción, fecha_entrega"
                    />
                  </div>

                  <div class="campo-item">
                    <label class="campo-label">Tipo del campo</label>
                    <select
                      v-model="campo.type"
                      class="form-select"
                      @change="handleTypeChange(campo)"
                    >
                      <option value="string">Texto</option>
                      <option value="number">Numérico</option>
                      <option value="file">Archivo (pdf, png, mp4, mp3, wav, gif)</option>
                      <option value="date">Fecha</option>
                      <option value="subform">Subformulario</option>
                    </select>
                  </div>

                  <div class="campo-checkbox">
                    <label class="checkbox-container">
                      <input type="checkbox" class="custom-checkbox" v-model="campo.required" />
                      <span class="checkbox-label">Campo obligatorio</span>
                    </label>
                  </div>

                  <!-- Subformulario - solo se muestra si el tipo es 'subform' -->
                  <div v-if="campo.type === 'subform'" class="subform-container">
                    <div class="subform-header">
                      <i class="fas fa-indent"></i>
                      <span>Subformulario para {{ campo.name || 'este campo' }}</span>
                    </div>

                    <div
                      v-for="(subcampo, subindex) in campo.subcampos || []"
                      :key="subindex"
                      class="subcampo-container"
                    >
                      <div class="subcampo-header">
                        <span class="subcampo-index">Apartado #{{ subindex + 1 }}</span>
                        <button
                          type="button"
                          @click="quitarSubcampo(campo, subindex)"
                          class="delete-button"
                        >
                          <i class="fas fa-times-circle"></i>
                        </button>
                      </div>

                      <div class="subcampo-body">
                        <div class="campo-item">
                          <label class="campo-label">Nombre del apartado</label>
                          <input
                            v-model="subcampo.name"
                            class="form-input"
                            placeholder="Ej: nombre, cantidad, descripción"
                          />
                        </div>

                        <div class="campo-item">
                          <label class="campo-label">Tipo del apartado</label>
                          <select v-model="subcampo.type" class="form-select">
                            <option value="string">Texto</option>
                            <option value="number">Numérico</option>
                            <option value="file">Archivo</option>
                            <option value="date">Fecha</option>
                          </select>
                        </div>

                        <div class="campo-checkbox">
                          <label class="checkbox-container">
                            <input
                              type="checkbox"
                              class="custom-checkbox"
                              v-model="subcampo.required"
                            />
                            <span class="checkbox-label">Obligatorio</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="agregarSubcampo(campo)"
                      class="add-subcampo-button"
                    >
                      <i class="fas fa-plus-circle"></i> Agregar Apartado
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" @click="agregarCampo" class="add-campo-button">
                <i class="fas fa-plus-circle"></i> Agregar Campo
              </button>
            </div>

            <!-- Botones de acción -->
            <div class="form-actions">
              <button type="button" @click="closeEditModal" class="reset-button">Cancelar</button>
              <button type="button" @click="submitEditForm" class="submit-button">
                Actualizar Plantilla
              </button>
            </div>
          </div>
        </div>
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
      plantillas: [], // Lista de plantillas obtenidas del servidor
      nombrePlantilla: '', // Nombre de la plantilla seleccionada para edición
      idPlantilla: '', // ID de la plantilla seleccionada para edición
      camposPlantilla: [], // Campos de la plantilla seleccionada para edición
      mostrarModalEdit: false, // Control de visibilidad del modal de edición
      nuevoCampo: {
        // Nuevo campo que se agregará dinámicamente
        name: '',
        type: '',
        alias: '',
        required: false,
      },
    }
  },
  methods: {
    async fetchPlantillas() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/plantillas/consultar', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        this.plantillas = response.data

        //Verificar si hay plantillas
        if (this.plantillas.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin plantillas',
            text: 'No hay plantillas disponibles.',
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener las plantillas.',
        })
        console.log('Error al obtener las plantillas:', error)
      }
    },
    async fetchCamposPlantilla(id) {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get(`http://127.0.0.1:8000/api/plantillas/${id}/campos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        this.nombrePlantilla = response.data.nombre_plantilla
        this.idPlantilla = id
        this.camposPlantilla = response.data.campos
        this.mostrarModalEdit = true
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los campos de la plantilla.',
        })
        console.log('Error al obtener los campos de la plantilla:', error)
      }
    },
    async submitEditForm() {
      const token = localStorage.getItem('apiToken')
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres actualizar la plantilla?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          const updateData = {
            campos: this.camposPlantilla.map((campo) => {
              const campoData = {
                name: campo.name,
                type: campo.type,
                required: Boolean(campo.required),
              }

              // Solo agrega subcampos si existe y tiene elementos
              if (campo.subcampos && campo.subcampos.length > 0) {
                campoData.subcampos = campo.subcampos
              }

              return campoData
            }),
          }

          console.log('Datos a enviar:', updateData)

          const response = await axios.put(
            `http://127.0.0.1:8000/api/plantillas/${this.idPlantilla}`,
            updateData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            },
          )

          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: response.data.message || 'Plantilla actualizada correctamente',
          })
          this.closeEditModal()
          this.fetchPlantillas()
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar la plantilla',
          })
          console.error('Error al actualizar la plantilla:', error)
        }
      }
    },
    eliminarCampo(index) {
      this.camposPlantilla.splice(index, 1)
    },
    agregarCampo() {
      this.camposPlantilla.push({ ...this.nuevoCampo })
      this.nuevoCampo = {
        name: '',
        type: '',
        alias: '',
        required: false,
      }
    },
    openEditModal(id) {
      this.fetchCamposPlantilla(String(id))
    },
    closeEditModal() {
      this.mostrarModalEdit = false
    },
    async eliminarPlantilla(id) {
      const token = localStorage.getItem('apiToken')
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas eliminar la plantilla?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
      })

      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/api/plantillas/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: response.data.message,
          })
          this.fetchPlantillas()
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message || 'Error al eliminar la plantilla',
          })
          console.error('Error al eliminar la plantilla:', error)
        }
      }
    },
    handleTypeChange(campo) {
      if (campo.type === 'subform' && !campo.subcampos) {
        // Si el tipo es 'subform', inicializar subcampos
        campo.subcampos = []
        this.agregarSubcampo(campo)
      }
    },
    quitarCampo(index) {
      this.camposPlantilla.splice(index, 1)
    },
    agregarSubcampo(campo) {
      if (!campo.subcampos) {
        // Asegurarse de que subcampos esté inicializado
        campo.subcampos = []
      }
      campo.subcampos.push({ name: '', type: 'string', required: false })
    },
    quitarSubcampo(campo, index) {
      campo.subcampos.splice(index, 1)
    },
  },
  created() {
    this.fetchPlantillas()
  },
}
</script>

<style scoped>
/* Estilos para las tarjetas de plantillas */
.plantilla-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 15px;
}
.plantilla-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}
.plantilla-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
.plantilla-header {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  text-align: center;
  position: relative;
}
.card-icon {
  font-size: 2.5rem;
  color: #4e73df;
  margin-bottom: 15px;
  display: block;
}
.plantilla-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}
.plantilla-actions {
  display: flex;
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  justify-content: space-between;
}
.btn {
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
.btn-edit {
  background-color: #4e73df;
  color: white;
}
.btn-edit:hover {
  background-color: #3a56b0;
}
.btn-delete {
  background-color: #e74a3b;
  color: white;
}
.btn-delete:hover {
  background-color: #be2617;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Modal fade */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.5);
}

/* Formulario de edición */
.form-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.form-card:hover {
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
}
.section-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #202124;
}
.form-input,
.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  color: #202124;
  transition: border 0.3s;
}
.form-input:focus,
.form-select:focus {
  border-color: #4285f4;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}
.campo-container {
  background-color: #f8f9fa;
  border: 1px solid #dadce0;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}
.campo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e8f0fe;
  padding: 12px 16px;
  border-bottom: 1px solid #dadce0;
}
.campo-index {
  font-weight: 500;
  color: #1a73e8;
}
.campo-body {
  padding: 16px;
}
.campo-item {
  margin-bottom: 16px;
}
.campo-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #5f6368;
}
.campo-checkbox {
  margin-top: 8px;
}
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.custom-checkbox {
  margin-right: 8px;
}
.checkbox-label {
  font-size: 14px;
  color: #5f6368;
}
.delete-button {
  background-color: transparent;
  border: none;
  color: #d93025;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-button:hover {
  background-color: #fadad9;
  color: #c5221f;
}
.add-campo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #1a73e8;
  border: 1px dashed #4285f4;
  border-radius: 4px;
  padding: 12px;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}
.add-campo-button i {
  margin-right: 8px;
}
.add-campo-button:hover {
  background-color: #e8f0fe;
}
.subform-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f1f3f4;
  border-radius: 6px;
  border-left: 4px solid #4285f4;
}
.subform-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #5f6368;
  font-weight: 500;
}
.subform-header i {
  margin-right: 8px;
  color: #4285f4;
}
.subcampo-container {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}
.subcampo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
}
.subcampo-index {
  font-size: 13px;
  font-weight: 500;
  color: #5f6368;
}
.subcampo-body {
  padding: 12px;
}
.add-subcampo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #5f6368;
  border: 1px dashed #5f6368;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}
.add-subcampo-button i {
  margin-right: 8px;
}
.add-subcampo-button:hover {
  background-color: #e8e8e8;
}
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}
.submit-button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #3367d6;
}
.reset-button {
  background-color: transparent;
  color: #5f6368;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}
.reset-button:hover {
  background-color: #f1f3f4;
  color: #202124;
}

/* Responsive */
@media (max-width: 768px) {
  .plantilla-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  .plantilla-actions {
    flex-direction: column;
    gap: 10px;
  }
  .btn {
    justify-content: center;
    width: 100%;
  }
  .modal-dialog {
    margin: 1rem auto;
  }
  .form-row {
    flex-direction: column;
  }
  .form-group.col-md-6 {
    width: 100%;
    margin-bottom: 15px;
  }
  .form-container {
    margin: 1rem;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .submit-button,
  .reset-button {
    width: 100%;
  }
}
</style>
