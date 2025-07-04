<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Plantilla</h3>
            <p class="header-subtitle">Configura los campos y estructura de tu nueva plantilla</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="crearPlantilla">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>Los campos marcados con
            <span class="text-danger">*</span> son obligatorios
          </div>

          <!-- Sección para el nombre de la plantilla -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-tag me-2"></i>
              Información de la Plantilla
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">Nombre de la Plantilla*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-file-alt"></i>
                  </span>
                  <input
                    v-solo-texto-y-numeros
                    v-model="plantillaName"
                    v-validacion-input
                    class="form-control"
                    required
                    placeholder="Ingrese el nombre de la plantilla"
                  />
                </div>
                <div class="form-text">Ingrese un nombre descriptivo para la plantilla</div>
              </div>
            </div>
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
                        v-solo-texto-y-numeros
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
                        <option value="">Seleccione un tipo</option>
                        <option value="string">Texto</option>
                        <option value="number">Numérico</option>
                        <option value="file">Archivo (pdf, png, mp4, mp3, wav, gif)</option>
                        <option value="date">Fecha</option>
                        <option value="select">Lista de Selección</option>
                        <option value="subform">Subformulario</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="d-flex">
                    <div class="campo-checkbox me-5">
                      <label class="checkbox-container">
                        <input type="checkbox" class="custom-checkbox" v-model="campo.required" />
                        <span class="checkmark"></span>
                        <span class="checkbox-label">Campo obligatorio</span>
                      </label>
                    </div>

                    <!--<div class="campo-checkbox" v-if="campo.type === 'date'">
                      <label class="checkbox-container">
                        <input type="checkbox" class="custom-checkbox" v-model="campo.filterable" />
                        <span class="checkmark"></span>
                        <span class="checkbox-label">Aplicar para filtro</span>
                      </label>
                    </div>-->
                  </div>
                  </div>
                </div>

                <!-- Configuración de opciones para Select -->
                <div v-if="campo.type === 'select'" class="select-options-container">
                  <div class="select-options-header">
                    <i class="fas fa-list-ul me-2"></i>
                    <span>Opciones para "{{ campo.name || 'este campo' }}"</span>
                  </div>

                  <div class="select-options-body">
                    <div
                      v-for="(option, optionIndex) in campo.options || []"
                      :key="optionIndex"
                      class="option-item"
                    >
                      <div class="option-content">
                        <div class="input-group modern-input">
                          <span class="input-group-text">
                            <i class="fas fa-tag"></i>
                          </span>
                          <input
                            v-solo-texto-y-numeros
                            v-model="campo.options[optionIndex]"
                            class="form-control"
                            placeholder="Texto de la opción"
                            required
                          />
                          <button
                            type="button"
                            @click="quitarOpcion(campo, optionIndex)"
                            class="btn btn-outline-danger"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="add-option-section">
                      <div class="row g-2">
                        <div class="col-md-10">
                          <input
                            v-solo-texto-y-numeros
                            v-model="campo.newOption"
                            class="form-control"
                            placeholder="Texto de la opción (ej: Activo, Inactivo, Pendiente)"
                            @keyup.enter="agregarOpcion(campo)"
                          />
                        </div>
                        <div class="col-md-2">
                          <button
                            type="button"
                            @click="agregarOpcion(campo)"
                            class="btn btn-primary w-100"
                            :disabled="!campo.newOption"
                          >
                            <i class="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
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
                              v-solo-texto-y-numeros
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
                            <select
                              v-model="subcampo.type"
                              class="form-select"
                              required
                              
                            >
                              <option value="">Seleccione un tipo</option>
                              <option value="string">Texto</option>
                              <option value="number">Numérico</option>
                              <option value="file">Archivo</option>
                              <option value="date">Fecha</option>
                              <option value="select">Lista de Selección</option>
                            </select>
                          </div>
                        </div>

                        <div class="col-md-12">
                          <div class="d-flex">
                            <div class="campo-checkbox me-5">
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
                                <div class="campo-radio" v-if="subcampo.type === 'date'">
                                  <label class="radio-container">
                                    <input
                                      type="radio"
                                      :name="'filterOptionSubform_' + index"
                                      class="custom-radio"
                                      v-model="subcampo.filterable"
                                      :value="true"
                                    />
                                    <span class="radiomark"></span>
                                    <span class="radio-label">Aplicar para filtro</span>
                                  </label>
                                </div>
                          </div>
                        </div>
                      </div>

                      <!-- Opciones para subcampos de tipo select -->
                      <div v-if="subcampo.type === 'select'" class="select-options-container mt-3">
                        <div class="select-options-header">
                          <i class="fas fa-list-ul me-2"></i>
                          <span
                            >Opciones para subcampo "{{ subcampo.name || 'este subcampo' }}"</span
                          >
                        </div>

                        <div class="select-options-body">
                          <div
                            v-for="(option, optionIndex) in subcampo.options || []"
                            :key="optionIndex"
                            class="option-item"
                          >
                            <div class="option-content">
                              <div class="input-group modern-input">
                                <span class="input-group-text">
                                  <i class="fas fa-tag"></i>
                                </span>
                                <input
                                  v-solo-texto-y-numeros
                                  v-model="subcampo.options[optionIndex]"
                                  class="form-control"
                                  placeholder="Texto de la opción"
                                  required
                                />
                                <button
                                  type="button"
                                  @click="quitarOpcion(subcampo, optionIndex)"
                                  class="btn btn-outline-danger"
                                >
                                  <i class="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div class="add-option-section">
                            <div class="row g-2">
                              <div class="col-md-10">
                                <input
                                  v-model="subcampo.newOption"
                                  class="form-control"
                                  placeholder="Texto de la opción"
                                  @keyup.enter="agregarOpcion(subcampo)"
                                />
                              </div>
                              <div class="col-md-2">
                                <button
                                  type="button"
                                  @click="agregarOpcion(subcampo)"
                                  class="btn btn-primary w-100"
                                  :disabled="!subcampo.newOption"
                                >
                                  <i class="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="button" @click="agregarSubcampo(campo)" class="add-subcampo-button">
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
            <button @click="resetForm" class="btn btn-cancel" type="button">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button type="submit" class="btn btn-save">
              <i class="fas fa-save me-2"></i>
              Crear Plantilla
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
      plantillaName: '',
      camposPlantilla: [{ name: '', type: 'string', required: false, filterable: false }],
      ejes: [],
      selectedEje: '',
      indicadores: [],
      loading: true,
    }
  },

  computed: {
    filteredEjes() {
      if (Array.isArray(this.ejes)) {
        const excludedEjes = []
        return this.ejes.filter((eje) => !excludedEjes.includes(eje.clave_oficial))
      } else {
        console.warn('ejes no es un array válido:', this.ejes)
        return []
      }
    },
  },

  methods: {
    agregarCampo() {
      this.camposPlantilla.push({ name: '', type: 'string', required: false, filterable: false })
    },

    quitarCampo(index) {
      this.camposPlantilla.splice(index, 1)
    },

    handleTypeChange(campo) {
      if (campo.type === 'subform' && !campo.subcampos) {
        campo.subcampos = []
        this.agregarSubcampo(campo)
      } else if (campo.type === 'select' && !campo.options) {
        // Inicializar como array vacío
        campo.options = []
        campo.newOption = '' // Asegurarse de que newOption esté inicializado
      }
      
      // Reset filterable when type changes to non-date
      if (campo.type !== 'date') {
        campo.filterable = false
      }
    },

    agregarSubcampo(campo) {
      if (!campo.subcampos) {
        // Asegurarse de que subcampos esté inicializado
        campo.subcampos = []
      }
      else {
        campo.subcampos.push({ name: '', type: 'string', required: false, filterable: false })
      }
    },

    quitarSubcampo(campo, index) {
      campo.subcampos.splice(index, 1)
    },

    // Métodos para manejar las opciones del select
    agregarOpcion(campo) {
      if (!campo.options) {
        campo.options = []
      }

      if (campo.newOption && campo.newOption.trim() !== '') {
        const opcionTrimmed = campo.newOption.trim()

        // Verificar que no exista ya esta opción (case insensitive)
        const existeOpcion = campo.options.some(
          (option) => option && option.toString().toLowerCase() === opcionTrimmed.toLowerCase(),
        )

        if (existeOpcion) {
          Swal.fire({
            icon: 'warning',
            title: 'Opción duplicada',
            text: 'Esta opción ya existe',
            confirmButtonColor: '#f39c12',
          })
          return
        }

        campo.options.push(opcionTrimmed)
        campo.newOption = ''
      }
    },

    quitarOpcion(campo, index) {
      if (campo.options && campo.options.length > index) {
        campo.options.splice(index, 1)
      }
    },

    resetForm() {
      this.plantillaName = ''
      this.camposPlantilla = [{ name: '', type: 'string', required: false, filterable: false }]
      this.selectedEje = ''
    },

    // Método para limpiar datos específicos del campo antes de enviar
    prepararDatosParaEnvio() {
      return this.camposPlantilla.map((campo) => {
        const campoLimpio = {
          name: campo.name,
          type: campo.type,
          required: campo.required,
          
        }

        // Si es un select, incluir las opciones como array de strings
        if (campo.type === 'select' && campo.options) {
          // usar directamente las opciones sin mapear a .label
          campoLimpio.options = campo.options.filter(
            (option) => option !== null && option !== undefined && option.trim() !== '',
          )
        }

        // Si es un subform, procesar subcampos
        if (campo.type === 'subform' && campo.subcampos) {
          campoLimpio.subcampos = campo.subcampos.map((subcampo) => {
            const subcampoLimpio = {
              name: subcampo.name,
              type: subcampo.type,
              required: subcampo.required,
              filterable: subcampo.filterable || false,
            }

            // Si el subcampo es un select, incluir opciones como array de strings
            if (subcampo.type === 'select' && subcampo.options) {
              // Cambio importante aquí también
              subcampoLimpio.options = subcampo.options.filter(
                (option) => option !== null && option !== undefined && option.trim() !== '',
              )
            }

            return subcampoLimpio
          })
        }

        return campoLimpio
      })
    },

    async crearPlantilla() {
      try {
        // Validar que los campos de tipo select tengan al menos una opción
        const camposInvalidos = this.camposPlantilla.filter((campo) => {
          if (campo.type === 'select') {
            return !campo.options || campo.options.length === 0
          }
          if (campo.type === 'subform' && campo.subcampos) {
            return campo.subcampos.some((subcampo) => {
              return (
                subcampo.type === 'select' && (!subcampo.options || subcampo.options.length === 0)
              )
            })
          }
          return false
        })

        if (camposInvalidos.length > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Los campos de tipo "Lista de Selección" deben tener al menos una opción',
            confirmButtonColor: '#f39c12',
          })
          return
        }

        const token = localStorage.getItem('apiToken')
        const camposLimpios = this.prepararDatosParaEnvio()

        // Imprimir en consola los campos limpios y filtrar los de tipo select
        console.log('Campos a enviar:', camposLimpios)
        console.log(
          'Campos tipo select:',
          camposLimpios.filter((campo) => campo.type === 'select'),
        )

        const response = await axios.post(
          'http://127.0.0.1:8000/api/plantillas',
          {
            plantilla_name: this.plantillaName,
            fields: camposLimpios,
            eje_asociado: this.selectedEje,
            indicador_asociado: this.selectedIndicador,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        Swal.fire({
          icon: 'success',
          title: '¡Completado!',
          text: response.data.message || 'Plantilla creada exitosamente',
          confirmButtonColor: '#4285F4',
        })

        this.resetForm()
      } catch (error) {
        console.error('Error al crear la plantilla:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message || 'Ocurrió un error al crear la plantilla',
          confirmButtonColor: '#d93025',
        })
      }
    },
  },

  mounted() {},
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

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
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

  .medico-body {
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
  .medico-header {
    padding: 1rem;
  }

  .medico-body {
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
/* Estilos para las opciones del select */
.select-options-container {
  margin-top: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.select-options-header {
  padding: 12px 15px;
  background-color: #e3f2fd;
  border-bottom: 1px solid #bbdefb;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  color: #1976d2;
}

.select-options-body {
  padding: 15px;
}

.option-item {
  margin-bottom: 10px;
}

.option-content .input-group {
  margin-bottom: 5px;
}

.add-option-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
}

.btn-outline-danger {
  border-left: none;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .add-option-section .row {
    flex-direction: column;
  }

  .add-option-section .col-md-5,
  .add-option-section .col-md-2 {
    width: 100%;
    margin-bottom: 10px;
  }
}
/* Radio button personalizado */
.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}

.custom-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radiomark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.radio-container:hover .radiomark {
  border-color: #dc3545;
}

.custom-radio:checked ~ .radiomark {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-color: #dc3545;
}

.radiomark:after {
  content: '';
  position: absolute;
  display: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

.custom-radio:checked ~ .radiomark:after {
  display: block;
}

.radio-label {
  margin-left: 0.5rem;
  font-weight: 500;
}
/* Radio button personalizado - contenedor */
.campo-radio {
  margin-top: 1rem;
}
</style>
