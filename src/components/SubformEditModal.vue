<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editingIndex === -1 ? 'Agregar' : 'Editar' }} entrada
          </h5>
          <button type="button" class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div
            v-for="subcampo in subformField?.subcampos"
            :key="subcampo.name"
            class="mb-3"
          >
            <label class="form-label">
              {{ subcampo.alias || subcampo.name }}
              <span v-if="subcampo.required" class="text-danger">*</span>
            </label>

            <!-- Campo de archivo -->
            <div v-if="subcampo.type === 'file'" class="input-group modern-input">
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
              v-if="subcampo.type === 'file' && getCurrentValue(subcampo.name)"
              class="form-text"
            >
              Archivo actual: {{ getFileName(getCurrentValue(subcampo.name)) }}
            </div>

            <!-- Campo numérico -->
            <div v-else-if="subcampo.type === 'number'" class="input-group modern-input">
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

            <!-- Campo select -->
            <div v-else-if="subcampo.type === 'select'" class="input-group modern-input">
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

            <!-- Campo fecha -->
            <div v-else-if="subcampo.type === 'date'" class="input-group modern-input">
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

            <!-- Campo de texto largo -->
            <div v-else-if="subcampo.type === 'textarea'" class="input-group modern-input">
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

            <!-- Campo texto por defecto -->
            <div v-else class="input-group modern-input">
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
        
        <div class="modal-footer">
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
</template>

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

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content {
  padding: 0;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #6c757d;
}

.btn-close:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.modern-input {
  margin-bottom: 0.5rem;
}

.modern-input .input-group-text {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #6c757d;
}

.modern-input .form-control,
.modern-input .form-select {
  border-color: #ced4da;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-save {
  background-color: #007bff;
  color: white;
}

.btn-save:hover {
  background-color: #0056b3;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.text-danger {
  color: #dc3545;
}
</style>