<template>
  <div class="subform-container">
    <div class="subform-header">
      <i class="fas fa-indent me-2"></i>
      <span>Subformulario para {{ campo.alias || campo.name }}</span>
    </div>
    
    <button type="button" @click="agregarEntrada" class="add-campo-button">
      <i class="fas fa-plus me-2"></i> Agregar entrada
    </button>

    <!-- Tabla para mostrar entradas existentes -->
    <div class="table-responsive mt-3" v-if="filas.length > 0">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th v-for="subcampo in campo.subcampos" :key="subcampo.name">
              {{ subcampo.alias || subcampo.name }}
            </th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, index) in filas" :key="index">
            <td v-for="subcampo in campo.subcampos" :key="subcampo.name">
              <!-- Renderizar subcampo normal -->
              <template v-if="subcampo.type !== 'subform'">
                <template v-if="subcampo.type === 'file'">
                  {{ fila[subcampo.name]?.name || 'Sin archivo' }}
                </template>
                <template v-else-if="subcampo.type === 'select' && !isManualSelect(subcampo)">
                  {{
                    subcampo.options.find((opt) => opt.campoGuardar === fila[subcampo.name])
                      ?.campoMostrar || fila[subcampo.name]
                  }}
                </template>
                <template v-else>
                  {{ fila[subcampo.name] }}
                </template>
              </template>
              
              <!-- Renderizar subformulario anidado (recursivo) -->
              <template v-else>
                <SubFormularioDocumento
                  :campo="subcampo"
                  :valor="fila[subcampo.name] || []"
                  @actualizar="actualizarSubformularioAnidado(index, subcampo.name, $event)"
                  :nivel="nivel + 1"
                />
              </template>
            </td>
            <td class="text-center">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary me-2"
                @click="editarEntrada(index)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="eliminarEntrada(index)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para editar/agregar entrada -->
    <div v-if="mostrarModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-xl">
        <div class="modal-content modern-modal">
          <!-- Header del modal -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-plus-circle" v-if="indiceEditando === -1"></i>
                <i class="fas fa-edit" v-else></i>
              </div>
              <div class="header-title-section">
                <h3>{{ indiceEditando === -1 ? 'Agregar' : 'Editar' }} entrada</h3>
                <p class="header-subtitle">{{ campo.alias || campo.name }}</p>
              </div>
            </div>
            <button type="button" @click="cerrarModal" class="close-button" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal -->
          <div class="medico-body modal-body-custom">
            <div class="alert alert-info mb-4">
              <i class="fas fa-info-circle me-2"></i>
              Complete los campos del subformulario según sus necesidades
            </div>

            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Campos del Subformulario
              </h6>

              <div
                v-for="subcampo in campo.subcampos"
                :key="subcampo.name"
                class="campo-container"
              >
                <div class="campo-header">
                  <div class="campo-title">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span class="campo-index">{{ subcampo.alias || subcampo.name }}</span>
                    <span v-if="subcampo.required" class="required-badge">*</span>
                  </div>
                </div>

                <div class="campo-body">
                  <!-- Renderizar campos normales en el modal -->
                  <template v-if="subcampo.type !== 'subform'">
                    <!-- Campo de archivo -->
                    <div v-if="subcampo.type === 'file'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-paperclip"></i>
                        </span>
                        <input
                          type="file"
                          class="form-control"
                          @change="onCambioArchivo($event, subcampo.name)"
                        />
                      </div>
                      <div v-if="datosTemporales[subcampo.name]?.name" class="file-info mt-2">
                        <div class="current-file">
                          <i class="fas fa-file me-2"></i>
                          <span>{{ datosTemporales[subcampo.name].name }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Campo numérico -->
                    <div v-else-if="subcampo.type === 'number'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-hashtag"></i>
                        </span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required"
                          placeholder="Ingrese un valor numérico"
                        />
                      </div>
                    </div>

                    <!-- Campo select -->
                    <div v-else-if="subcampo.type === 'select'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-list-ul"></i>
                        </span>
                        <select
                          class="form-select"
                          v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required"
                        >
                          <option value="" disabled selected>Seleccione una opción</option>
                          <template v-if="isManualSelect(subcampo)">
                            <option
                              v-for="(option, index) in subcampo.options"
                              :key="index"
                              :value="option"
                            >
                              {{ option }}
                            </option>
                          </template>
                          <template v-else>
                            <option
                              v-for="(option, index) in subcampo.options"
                              :key="index"
                              :value="option.campoGuardar"
                            >
                              {{ option.campoMostrar }}
                            </option>
                          </template>
                        </select>
                      </div>
                      <div
                        v-if="!isManualSelect(subcampo) && subcampo.dataSource"
                        class="form-text mt-1"
                      >
                        <small class="text-info">
                          <i class="fas fa-database me-1"></i>
                          Datos de: {{ subcampo.dataSource.plantillaNombre }} -
                          {{ subcampo.dataSource.seccion }}
                        </small>
                      </div>
                    </div>

                    <!-- Campo fecha -->
                    <div v-else-if="subcampo.type === 'date'" class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-calendar-alt"></i>
                        </span>
                        <input
                          type="date"
                          class="form-control"
                          v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required || subcampo.filterable"
                        />
                      </div>
                    </div>

                    <!-- Campo texto -->
                    <div v-else class="form-field">
                      <label class="form-label">
                        {{ subcampo.alias || subcampo.name }}
                        <span v-if="subcampo.required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-font"></i>
                        </span>
                        <input
                          type="text"
                          class="form-control"
                          v-model="datosTemporales[subcampo.name]"
                          :required="subcampo.required"
                          placeholder="Ingrese texto"
                        />
                      </div>
                    </div>
                  </template>

                  <!-- Renderizar subformulario anidado en el modal -->
                  <div v-else class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <SubFormularioDocumento
                      :campo="subcampo"
                      :valor="datosTemporales[subcampo.name] || []"
                      @actualizar="(nuevoValor) => actualizarSubcampoAnidado(subcampo.name, nuevoValor)"
                      :nivel="nivel + 1"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer con botones -->
              <div class="medico-footer">
                <button type="button" class="btn btn-cancel" @click="cerrarModal">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="button" class="btn btn-save" @click="guardarEntrada">
                  <i class="fas fa-check me-2"></i>
                  {{ indiceEditando === -1 ? 'Agregar' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubFormularioDocumento',
  props: {
    campo: {
      type: Object,
      required: true
    },
    valor: {
      type: Array,
      default: () => []
    },
    nivel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      filas: [...this.valor],
      mostrarModal: false,
      indiceEditando: -1,
      datosTemporales: {}
    }
  },
  watch: {
    valor: {
      handler(nuevoValor) {
        this.filas = [...nuevoValor];
      },
      deep: true
    }
  },
  methods: {
    isManualSelect(campo) {
      if (!campo.options || !Array.isArray(campo.options) || campo.options.length === 0) {
        return true;
      }
      
      const primeraOpcion = campo.options[0];
      return typeof primeraOpcion === 'string';
    },
    
    agregarEntrada() {
      this.indiceEditando = -1;
      this.datosTemporales = this.inicializarDatosTemporales();
      this.mostrarModal = true;
    },
    
    editarEntrada(index) {
      this.indiceEditando = index;
      this.datosTemporales = {...this.filas[index]};
      this.mostrarModal = true;
    },
    
    eliminarEntrada(index) {
      this.filas.splice(index, 1);
      this.emitirActualizacion();
    },
    
    cerrarModal() {
      this.mostrarModal = false;
      this.indiceEditando = -1;
      this.datosTemporales = {};
    },
    
    guardarEntrada() {
      // Validar campos requeridos
      const camposRequeridos = this.campo.subcampos.filter(sub => sub.required);
      const esValido = camposRequeridos.every(sub => {
        if (sub.type === 'subform') {
          return this.datosTemporales[sub.name] && this.datosTemporales[sub.name].length > 0;
        }
        return this.datosTemporales[sub.name] !== undefined && 
               this.datosTemporales[sub.name] !== null && 
               this.datosTemporales[sub.name] !== '';
      });
      
      if (!esValido) {
        this.mostrarError('Complete todos los campos requeridos');
        return;
      }
      
      if (this.indiceEditando === -1) {
        this.filas.push({...this.datosTemporales});
      } else {
        this.filas[this.indiceEditando] = {...this.datosTemporales};
      }
      
      this.emitirActualizacion();
      this.cerrarModal();
    },
    
    inicializarDatosTemporales() {
      const datos = {};
      this.campo.subcampos.forEach(sub => {
        if (sub.type === 'subform') {
          datos[sub.name] = [];
        } else {
          datos[sub.name] = '';
        }
      });
      return datos;
    },
    
    onCambioArchivo(event, nombreCampo) {
      const archivo = event.target.files[0];
      if (archivo) {
        this.datosTemporales[nombreCampo] = archivo;
      }
    },
    
    actualizarSubcampoAnidado(nombreCampo, nuevoValor) {
      this.datosTemporales[nombreCampo] = nuevoValor;
    },
    
    actualizarSubformularioAnidado(indiceFila, nombreCampo, nuevoValor) {
      this.filas[indiceFila][nombreCampo] = nuevoValor;
      this.emitirActualizacion();
    },
    
    emitirActualizacion() {
      this.$emit('actualizar', this.filas);
    },
    
    mostrarError(mensaje) {
      // Puedes implementar tu propio sistema de notificaciones aquí
      alert(mensaje);
    }
  }
}
</script>

<style scoped>
/* Contenedor principal del subformulario */
.subform-container {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
}

/* Header del subformulario */
.subform-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.subform-header i {
  color: #6c757d;
}

/* Botón para agregar entrada */
.add-campo-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.add-campo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Tabla responsive */
.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
}

.table th {
  background: #f8f9fa;
  border-color: #dee2e6;
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
  border-color: #dee2e6;
}

/* Fixed modal z-index and positioning issues for nested subforms */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: calc(1050 + var(--modal-level, 0) * 10);
}

/* Dynamic z-index based on nesting level */
.subform-container {
  --modal-level: 0;
}

.subform-container .subform-container {
  --modal-level: 1;
}

.subform-container .subform-container .subform-container {
  --modal-level: 2;
}

.subform-container .subform-container .subform-container .subform-container {
  --modal-level: 3;
}

/* Fixed modal dialog sizing and positioning */
.modal-dialog {
  margin: 1.75rem auto;
  max-width: 90%;
  width: 100%;
  pointer-events: none;
  position: relative;
}

.modal-xl {
  max-width: 1140px;
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
  pointer-events: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
}

/* Header del modal */
.medico-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 2rem;
  border-bottom: none;
  position: relative;
}

.modal-header-custom {
  padding: 2rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 1.5rem;
}

.header-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
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
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Body del modal */
.medico-body {
  padding: 2rem;
  background: white;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.modal-body-custom {
  padding: 2rem;
  background: white;
}

/* Sección de formulario */
.form-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #007bff;
}

/* Contenedor de campos */
.campo-container {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.campo-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.campo-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.campo-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #495057;
}

.campo-index {
  margin-left: 0.5rem;
}

.required-badge {
  background: #dc3545;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.campo-body {
  padding: 1.5rem;
}

/* Campos de formulario */
.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.modern-input {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modern-input:focus-within {
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transform: translateY(-1px);
}

.modern-input .input-group-text {
  background: #f8f9fa;
  border: none;
  color: #6c757d;
}

.modern-input .form-control,
.modern-input .form-select {
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  box-shadow: none;
  border-color: transparent;
}

/* Información de archivo */
.file-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
}

.current-file {
  display: flex;
  align-items: center;
  color: #495057;
  font-size: 0.9rem;
}

.current-file i {
  color: #007bff;
}

/* Footer del modal */
.medico-footer {
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-cancel:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* Alertas */
.alert {
  border-radius: 8px;
  border: none;
}

.alert-info {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  color: #0c5460;
}

/* Responsive design fixes for mobile */
@media (max-width: 768px) {
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

  .medico-header {
    padding: 1.5rem;
  }

  .medico-body {
    padding: 1.5rem;
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

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .modal-header-custom {
    padding: 1rem;
  }

  .modal-body-custom {
    padding: 1rem;
  }
}

/* Prevent modal backdrop from interfering with nested modals */
.modal-backdrop {
  z-index: calc(1040 + var(--modal-level, 0) * 10);
}
</style>
