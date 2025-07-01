
<template>
  <div v-if="show" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-xl">
      <div class="modal-content modern-modal">
        <!-- Header del modal con el diseño moderno -->
        <div class="medico-header modal-header-custom">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-plus-circle" v-if="editingIndex === -1"></i>
              <i class="fas fa-edit" v-else></i>
            </div>
            <div class="header-title-section">
              <h3>{{ editingIndex === -1 ? 'Agregar' : 'Editar' }} entrada</h3>
              <p class="header-subtitle">{{ subformField?.name || 'Subformulario' }}</p>
            </div>
          </div>
          <button type="button" @click="closeModal" class="close-button" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body del modal con el diseño moderno -->
        <div class="medico-body modal-body-custom">
          <!-- Nota informativa -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>
            Complete los campos del subformulario según sus necesidades
          </div>

          <!-- Sección para los campos del subformulario -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-list me-2"></i>
              Campos del Subformulario
            </h6>

            <div
              v-for="subcampo in subformField?.subcampos"
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
                      @change="handleFileChange($event, subcampo.name)"
                      :accept="getFileAccept(subcampo)"
                    />
                  </div>
                  <div
                    v-if="getCurrentValue(subcampo.name)"
                    class="file-info mt-2"
                  >
                    <div class="current-file">
                      <i class="fas fa-file me-2"></i>
                      <span>Archivo actual: {{ getFileName(getCurrentValue(subcampo.name)) }}</span>
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
                      v-model="localData[subcampo.name]"
                      :required="subcampo.required"
                      :placeholder="`Ingrese ${subcampo.alias || subcampo.name}`"
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
                      v-model="localData[subcampo.name]"
                      :required="subcampo.required"
                    >
                      <option value="">Seleccione una opción</option>
                      <option 
                        v-for="(option, index) in subcampo.options" 
                        :key="index" 
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
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
                      v-model="localData[subcampo.name]"
                      :required="subcampo.required"
                    />
                  </div>
                </div>

                <!-- Campo de texto largo -->
                <div v-else-if="subcampo.type === 'textarea'" class="form-field">
                  <label class="form-label">
                    {{ subcampo.alias || subcampo.name }}
                    <span v-if="subcampo.required" class="text-danger">*</span>
                  </label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-align-left"></i>
                    </span>
                    <textarea
                      class="form-control"
                      v-model="localData[subcampo.name]"
                      :required="subcampo.required"
                      :placeholder="`Ingrese ${subcampo.alias || subcampo.name}`"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <!-- Campo texto por defecto -->
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
                      v-model="localData[subcampo.name]"
                      :required="subcampo.required"
                      :placeholder="`Ingrese ${subcampo.alias || subcampo.name}`"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer con botones -->
            <div class="medico-footer">
              <button type="button" class="btn btn-cancel" @click="closeModal">
                <i class="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button type="button" class="btn btn-save" @click="saveEntry">
                <i class="fas fa-check me-2"></i>
                {{ editingIndex === -1 ? 'Agregar' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
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

/* Header con el diseño moderno - GRIS */
.medico-header {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
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
  background: linear-gradient(90deg, #6c757d, #5a6268);
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
  color: #6c757d;
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
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
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
  border-color: #6c757d;
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
  transform: translateY(-1px);
}

.alert {
  border-radius: 12px;
  border: 1px solid #b8daff;
  background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

/* Estilos específicos para campos */
.campo-container {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 1px solid rgba(108, 117, 125, 0.1);
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
  gap: 0.5rem;
}

.campo-index {
  font-size: 0.95rem;
}

.required-badge {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.campo-body {
  margin-top: 1rem;
}

.form-field {
  margin-bottom: 1rem;
}

/* Información de archivo */
.file-info {
  margin-top: 0.75rem;
}

.current-file {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(145deg, #e9ecef 0%, #f8f9fa 100%);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  color: #495057;
}

.current-file i {
  color: #6c757d;
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
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

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }
}
</style>

<script>
export default {
  name: 'SubformEditModal',
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    subformField: {
      type: Object,
      default: null
    },
    subformData: {
      type: Object,
      default: () => ({})
    },
    editingIndex: {
      type: Number,
      default: -1
    }
  },

  emits: ['close', 'save', 'file-change'],

  data() {
    return {
      localData: {}
    }
  },

  watch: {
    subformData: {
      handler(newData) {
        console.log('🟡 SubformEditModal - subformData cambió:', newData)
        this.localData = { ...newData }
      },
      immediate: true,
      deep: true
    },

    show(newVal) {
      console.log('🟡 SubformEditModal - show cambió:', newVal)
      if (newVal && this.subformField) {
        this.initializeData()
      }
    }
  },

  methods: {
    initializeData() {
      console.log('🟡 SubformEditModal - initializeData')
      console.log('🟡 subformField:', this.subformField)
      console.log('🟡 subformData:', this.subformData)
      
      // Inicializar con datos vacíos basados en la estructura del subformulario
      const emptyData = {}
      
      if (this.subformField?.subcampos) {
        this.subformField.subcampos.forEach(subcampo => {
          emptyData[subcampo.name] = subcampo.type === 'file' ? null : ''
        })
      }
      
      // Combinar con datos existentes
      this.localData = { ...emptyData, ...this.subformData }
      console.log('🟡 localData inicializado:', this.localData)
    },

    getCurrentValue(fieldName) {
      return this.localData[fieldName]
    },

    getFileName(value) {
      if (!value) return ''
      
      if (typeof value === 'object' && value.name) {
        return value.name
      }
      
      if (typeof value === 'string') {
        return value.split('/').pop() || value
      }
      
      return 'Archivo'
    },

    getFileAccept(subcampo) {
      if (subcampo.accept) {
        return subcampo.accept
      }
      
      return 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx'
    },

    handleFileChange(event, fieldName) {
      const file = event.target.files[0]
      console.log('🟡 SubformEditModal - handleFileChange:', fieldName, file)
      if (file) {
        this.localData[fieldName] = file
        this.$emit('file-change', event, fieldName)
      }
    },

    closeModal() {
      console.log('🟡 SubformEditModal - closeModal')
      this.$emit('close')
    },

    saveEntry() {
      console.log('🟡 SubformEditModal - saveEntry')
      console.log('🟡 Datos a guardar:', this.localData)
      
      // Validar campos requeridos
      if (!this.validateForm()) {
        return
      }

      // Emitir los datos actualizados
      console.log('🟡 Emitiendo save con:', { ...this.localData })
      this.$emit('save', { ...this.localData })
    },

    validateForm() {
      if (!this.subformField?.subcampos) return true

      const invalidFields = []

      this.subformField.subcampos.forEach(subcampo => {
        if (subcampo.required) {
          const value = this.localData[subcampo.name]
          
          if (subcampo.type === 'file') {
            if (!value) {
              invalidFields.push(subcampo.alias || subcampo.name)
            }
          } else if (subcampo.type === 'select') {
            if (!value || value === '') {
              invalidFields.push(subcampo.alias || subcampo.name)
            }
          } else {
            if (!value || value === '') {
              invalidFields.push(subcampo.alias || subcampo.name)
            }
          }
        }
      })

      if (invalidFields.length > 0) {
        alert(`Por favor complete los siguientes campos requeridos: ${invalidFields.join(', ')}`)
        return false
      }

      return true
    }
  }
}
</script>
