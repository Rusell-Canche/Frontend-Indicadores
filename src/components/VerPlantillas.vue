<template>
  <div class="container-fluid py-4">
    <!-- Header principal -->
    <div class="card shadow border-0 rounded-3 mb-4">
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="header-title-section">
            <h3>Gestión de Plantillas</h3>
            <p class="header-subtitle">Administra y edita tus plantillas existentes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Listado de plantillas con diseño mejorado -->
    <div class="plantilla-list">
      <div v-for="plantilla in plantillas" :key="plantilla.id" class="plantilla-card">
        <div class="plantilla-card-header">
          <div class="plantilla-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="plantilla-info">
            <h4 class="plantilla-title">{{ plantilla.nombre_plantilla }}</h4>
            <p class="plantilla-subtitle">Plantilla de formulario</p>
          </div>
        </div>
        <div class="plantilla-actions">
          <button
            @click="openEditModal(plantilla.id)"
            class="btn btn-edit"
            title="Editar plantilla"
          >
            <i class="fas fa-edit"></i>
            <span>Editar</span>
          </button>
          <button
            @click="eliminarPlantilla(plantilla.id)"
            class="btn btn-delete"
            title="Eliminar plantilla"
          >
            <i class="fas fa-trash-alt"></i>
            <span>Eliminar</span>
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
      <div class="modal-dialog modal-xl">
        <div class="modal-content modern-modal">
          <!-- Header del modal con el diseño moderno -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-edit"></i>
              </div>
              <div class="header-title-section">
                <h3>Editar Plantilla</h3>
                <p class="header-subtitle">{{ nombrePlantilla }}</p>
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
              Modifica los campos de tu plantilla según tus necesidades
            </div>

            <!-- Sección para los campos de la plantilla -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Campos de la Plantilla
              </h6>

              <div v-for="(campo, index) in camposPlantilla" :key="index" class="campo-container">
                <div class="campo-header">
                  <div class="campo-title">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span class="campo-index">Campo #{{ index + 1 }}</span>
                  </div>
                  <button type="button" @click="quitarCampo(index)" class="delete-button">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div class="campo-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre del Campo*</label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-edit"></i>
                        </span>
                        <input
                          v-model="campo.name"
                          class="form-control"
                          required
                          placeholder="Ej: título, descripción, fecha_entrega"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Tipo del Campo*</label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-cog"></i>
                        </span>
                        <select
                          v-model="campo.type"
                          class="form-select"
                          @change="handleTypeChange(campo)"
                          required
                        >
                          <option value="string">Texto</option>
                          <option value="number">Numérico</option>
                          <option value="file">Archivo (pdf, png, mp4, mp3, wav, gif)</option>
                          <option value="date">Fecha</option>
                          <option value="subform">Subformulario</option>
                          <option value="select">Lista de opciones (Select)</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="campo-checkbox">
                        <label class="checkbox-container">
                          <input type="checkbox" class="custom-checkbox" v-model="campo.required" />
                          <span class="checkmark"></span>
                          <span class="checkbox-label">Campo obligatorio</span>
                        </label>
                      </div>
                    </div>

                    <!-- Campo de opciones para select -->
                    <div v-if="campo.type === 'select'" class="col-md-12">
                      <label class="form-label">Opciones del Select*</label>
                      <div class="select-options-container">
                        <div
                          v-for="(option, optionIndex) in campo.options || []"
                          :key="optionIndex"
                          class="option-row"
                        >
                          <div class="input-group modern-input mb-2">
                            <span class="input-group-text">
                              <i class="fas fa-chevron-right"></i>
                            </span>
                            <input
                              v-model="campo.options[optionIndex]"
                              class="form-control"
                              :placeholder="`Opción ${optionIndex + 1}`"
                              required
                            />
                            <button
                              type="button"
                              @click="removeSelectOption(campo, optionIndex)"
                              class="btn btn-outline-danger"
                            >
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          @click="addSelectOption(campo)"
                          class="btn btn-outline-primary btn-sm"
                        >
                          <i class="fas fa-plus me-2"></i>Agregar Opción
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Subformulario - solo se muestra si el tipo es 'subform' -->
                  <div v-if="campo.type === 'subform'" class="subform-container">
                    <div class="subform-header">
                      <i class="fas fa-indent me-2"></i>
                      <span>Subformulario para {{ campo.name || 'este campo' }}</span>
                    </div>

                    <div
                      v-for="(subcampo, subindex) in campo.subcampos || []"
                      :key="subindex"
                      class="subcampo-container"
                    >
                      <div class="subcampo-header">
                        <div class="subcampo-title">
                          <i class="fas fa-angle-right me-2"></i>
                          <span class="subcampo-index">Apartado #{{ subindex + 1 }}</span>
                        </div>
                        <button
                          type="button"
                          @click="quitarSubcampo(campo, subindex)"
                          class="delete-button-small"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>

                      <div class="subcampo-body">
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label class="form-label">Nombre del Apartado*</label>
                            <div class="input-group modern-input">
                              <span class="input-group-text">
                                <i class="fas fa-edit"></i>
                              </span>
                              <input
                                v-model="subcampo.name"
                                class="form-control"
                                required
                                placeholder="Ej: nombre, cantidad, descripción"
                              />
                            </div>
                          </div>

                          <div class="col-md-6">
                            <label class="form-label">Tipo del Apartado*</label>
                            <div class="input-group modern-input">
                              <span class="input-group-text">
                                <i class="fas fa-cog"></i>
                              </span>
                              <select v-model="subcampo.type" class="form-select" required>
                                <option value="string">Texto</option>
                                <option value="number">Numérico</option>
                                <option value="file">Archivo</option>
                                <option value="date">Fecha</option>
                                <option value="select">Lista de opciones (Select)</option>
                              </select>
                            </div>
                          </div>

                          <!-- Opciones para subcampos select -->
                          <div v-if="subcampo.type === 'select'" class="col-md-12">
                            <label class="form-label">Opciones del Select*</label>
                            <div class="select-options-container">
                              <div
                                v-for="(option, optionIndex) in subcampo.options || []"
                                :key="optionIndex"
                                class="option-row"
                              >
                                <div class="input-group modern-input mb-2">
                                  <span class="input-group-text">
                                    <i class="fas fa-chevron-right"></i>
                                  </span>
                                  <input
                                    v-model="subcampo.options[optionIndex]"
                                    class="form-control"
                                    :placeholder="`Opción ${optionIndex + 1}`"
                                    required
                                  />
                                  <button
                                    type="button"
                                    @click="removeSubcampoSelectOption(subcampo, optionIndex)"
                                    class="btn btn-outline-danger"
                                  >
                                    <i class="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>
                              <button
                                type="button"
                                @click="addSubcampoSelectOption(subcampo)"
                                class="btn btn-outline-primary btn-sm"
                              >
                                <i class="fas fa-plus me-2"></i>Agregar Opción
                              </button>
                            </div>
                          </div>

                          <div class="col-md-12">
                            <div class="campo-checkbox">
                              <label class="checkbox-container">
                                <input
                                  type="checkbox"
                                  class="custom-checkbox"
                                  v-model="subcampo.required"
                                />
                                <span class="checkmark"></span>
                                <span class="checkbox-label">Obligatorio</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="agregarSubcampo(campo)"
                      class="add-subcampo-button"
                    >
                      <i class="fas fa-plus me-2"></i> Agregar Apartado
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" @click="agregarCampo" class="add-campo-button">
                <i class="fas fa-plus me-2"></i> Agregar Campo
              </button>
            </div>

            <!-- Footer con botones -->
            <div class="medico-footer">
              <button @click="closeEditModal" class="btn btn-cancel" type="button">
                <i class="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button @click="submitEditForm" class="btn btn-save" type="button">
                <i class="fas fa-save me-2"></i>
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

              // Agregar opciones si el campo es de tipo select
              if (campo.type === 'select' && campo.options) {
                campoData.options = campo.options.filter((option) => option.trim() !== '')
              }

              // Solo agrega subcampos si existe y tiene elementos
              if (campo.subcampos && campo.subcampos.length > 0) {
                campoData.subcampos = campo.subcampos.map((subcampo) => {
                  const subcampoData = {
                    name: subcampo.name,
                    type: subcampo.type,
                    required: Boolean(subcampo.required),
                  }

                  // Agregar opciones si el subcampo es de tipo select
                  if (subcampo.type === 'select' && subcampo.options) {
                    subcampoData.options = subcampo.options.filter((option) => option.trim() !== '')
                  }

                  return subcampoData
                })
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
      } else if (campo.type === 'select' && !campo.options) {
        // Si el tipo es 'select', inicializar opciones
        campo.options = ['']
      }
    },
    handleSubcampoTypeChange(subcampo) {
      if (subcampo.type === 'select' && !subcampo.options) {
        // Si el tipo es 'select', inicializar opciones
        subcampo.options = ['']
      }
    },
    // Métodos para manejar opciones de select en campos principales
    addSelectOption(campo) {
      if (!campo.options) {
        campo.options = []
      }
      campo.options.push('')
    },

    removeSelectOption(campo, index) {
      if (campo.options && campo.options.length > 1) {
        campo.options.splice(index, 1)
      }
    },

    // Métodos para manejar opciones de select en subcampos
    addSubcampoSelectOption(subcampo) {
      if (!subcampo.options) {
        subcampo.options = []
      }
      subcampo.options.push('')
    },

    removeSubcampoSelectOption(subcampo, index) {
      if (subcampo.options && subcampo.options.length > 1) {
        subcampo.options.splice(index, 1)
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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

/* Estilos mejorados para las tarjetas de plantillas */
.plantilla-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.plantilla-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 53, 69, 0.1);
  position: relative;
}

.plantilla-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #dc3545, #c82333);
  border-radius: 16px 16px 0 0;
}

.plantilla-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(220, 53, 69, 0.2);
}

.plantilla-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.plantilla-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.plantilla-info {
  flex: 1;
}

.plantilla-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.plantilla-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 400;
}

.plantilla-actions {
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
  background: linear-gradient(90deg, #dc3545, #c82333);
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
  color: #dc3545;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  transform: translateY(-1px);
}

.alert {
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  background: linear-gradient(145deg, #f8d7da 0%, #f1b0b7 100%);
  color: #721c24;
}

/* Estilos específicos para campos */
.campo-container {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.1);
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.campo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.campo-title {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
}

.campo-index {
  font-size: 0.95rem;
}

.delete-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.delete-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.campo-body {
  margin-top: 1rem;
}

/* Checkbox personalizado */
.campo-checkbox {
  margin-top: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2rem;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
  border-color: #dc3545;
}

.custom-checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-color: #dc3545;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label {
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Subformulario */
.subform-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  border: 1px solid rgba(220, 53, 69, 0.15);
}

.subform-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
}

.subform-header i {
  color: #dc3545;
}

.subcampo-container {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.subcampo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.subcampo-title {
  display: flex;
  align-items: center;
  color: #495057;
  font-weight: 500;
  font-size: 0.875rem;
}

.subcampo-index {
  font-size: 0.875rem;
}

.delete-button-small {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
}

.delete-button-small:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(220, 53, 69, 0.3);
}

.subcampo-body {
  margin-top: 0.75rem;
}

/* Botones de agregar */
.add-campo-button,
.add-subcampo-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.add-campo-button {
  width: 100%;
}

.add-subcampo-button {
  width: auto;
}

.add-campo-button:hover,
.add-subcampo-button:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
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

  .plantilla-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .plantilla-card-header {
    padding: 1rem;
  }

  .plantilla-actions {
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

  .campo-container {
    padding: 1rem;
  }

  .campo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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
  .plantilla-list {
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

  .campo-container {
    padding: 0.75rem;
  }

  .subform-container {
    padding: 0.75rem;
  }

  .subcampo-container {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }
}
</style>
