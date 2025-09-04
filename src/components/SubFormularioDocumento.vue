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