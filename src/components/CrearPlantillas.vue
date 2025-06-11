<template>
  <div class="form-container">
    <!-- Cabecera del formulario -->
    <div class="form-header">
      <div class="color-bar"></div>
      <h1 class="form-title">Crear Plantilla</h1>
    </div>

    <!-- Contenedor principal del formulario -->
    <div class="form-body">
      <!-- Sección para el nombre de la plantilla -->
      <div class="form-card form-section">
        <label class="section-title">Nombre de la plantilla</label>
        <input
          v-model="plantillaName"
          v-validacion-input
          class="form-input"
          placeholder="Ingrese el nombre de la plantilla"
        />
      </div>

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
              <select v-model="campo.type" class="form-select" @change="handleTypeChange(campo)">
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
                      <input type="checkbox" class="custom-checkbox" v-model="subcampo.required" />
                      <span class="checkbox-label">Obligatorio</span>
                    </label>
                  </div>
                </div>
              </div>

              <button type="button" @click="agregarSubcampo(campo)" class="add-subcampo-button">
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
        <button type="button" class="reset-button" @click="resetForm">Limpiar formulario</button>
        <button type="button" class="submit-button" @click="crearPlantilla">Crear Plantilla</button>
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
      camposPlantilla: [{ name: '', type: 'string', required: false }],
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
      this.camposPlantilla.push({ name: '', type: 'string', required: false })
    },

    quitarCampo(index) {
      this.camposPlantilla.splice(index, 1)
    },

    handleTypeChange(campo) {
      if (campo.type === 'subform' && !campo.subcampos) {
        // Si el tipo es 'subform', inicializar subcampos
        campo.subcampos = []
        this.agregarSubcampo(campo)
      }
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

    resetForm() {
      this.plantillaName = ''
      this.camposPlantilla = [{ name: '', type: 'string', required: false }]
      this.selectedEje = ''
    },

    async crearPlantilla() {
      try {
        const response = await axios.post('/plantillas/crear', {
          plantilla_name: this.plantillaName,
          fields: this.camposPlantilla,
          eje_asociado: this.selectedEje,
          indicador_asociado: this.selectedIndicador,
        })

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

  mounted() {
    
  },
}
</script>

<style scoped>
/* Importar fuentes de Google */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Estilos generales */
* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

/* Contenedor principal */
.form-container {
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Cabecera del formulario */
.form-header {
  position: relative;
  padding: 24px;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.color-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 10px;
  width: 100%;
  background-color: #4285f4;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-title {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 400;
  color: #202124;
}

/* Cuerpo del formulario */
.form-body {
  padding: 24px;
}

/* Secciones del formulario */
.form-section {
  margin-bottom: 24px;
}

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

/* Campos de entrada */
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

/* Contenedor de campos */
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

/* Estilos para el checkbox */
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

/* Botón para eliminar campo */
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

/* Botón para agregar campo */
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

/* Estilos para el subformulario */
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

/* Botones de acción */
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

/* Estilos responsivos */
@media (max-width: 768px) {
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

