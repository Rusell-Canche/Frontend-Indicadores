<template>
  <div class="subform-config-section" :class="`nivel-${nivel}`">
    <h6 class="mt-3 mb-3">
      <i class="fas fa-layer-group me-2"></i>
      Configuración del Subformulario - Nivel {{ nivel }}
      <span class="badge badge-nivel ms-2">{{ rutaCampo }}</span>
    </h6>

    <!-- Operación para subformulario -->
    <div class="row g-3">
      <div class="col-md-12">
        <label class="form-label">Operación para Subformulario*</label>
        <div class="input-group modern-input">
          <span class="input-group-text">
            <i class="fas fa-calculator"></i>
          </span>
          <select
            :value="configuracion.tipoOperacion"
            @input="updateTipoOperacion($event.target.value)"
            class="form-select"
            required
          >
            <option value="">Seleccione operación</option>
            <option value="contar">Contar registros (COUNT)</option>
            <option value="distinto">Contar distintos (DISTINCT)</option>
            <option value="sumar">Sumar valores (SUM)</option>
            <option value="promedio">Promedio (AVG)</option>
            <option value="maximo">Valor máximo (MAX)</option>
            <option value="minimo">Valor mínimo (MIN)</option>
            <option value="porcentaje">Porcentaje (%)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Campo para subformulario -->
    <div
      class="row g-3 mt-3"
      v-if="configuracion.tipoOperacion && configuracion.tipoOperacion !== 'contar'"
    >
      <div class="col-md-12">
        <label class="form-label">Campo en Subformulario*</label>
        <div class="input-group modern-input">
          <span class="input-group-text">
            <i class="fas fa-tag"></i>
          </span>
          <select
            :value="configuracion.campoSeleccionado"
            @input="updateCampoSeleccionado($event.target.value)"
            class="form-select"
            required
          >
            <option value="">Seleccione un campo</option>
            <option
              v-for="subcampo in subcamposDisponibles"
              :key="subcampo.name"
              :value="subcampo.name"
            >
              {{ subcampo.alias || subcampo.name }} ({{ getTipoCampo(subcampo) }})
              <span v-if="!esCampoValido(subcampo)"> (No válido para esta operación) </span>
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Configuración anidada recursiva si el campo seleccionado es subform -->
    <div v-if="mostrarSubformAnidado && nivel < maxNivelSubformulario">
      <SubformRecursivo
        :configuracion="configuracion.subConfiguracion"
        :subcampos-disponibles="subcamposAnidados"
        :nivel="nivel + 1"
        :ruta-campo="rutaCampo + '.' + configuracion.campoSeleccionado"
        :max-nivel-subformulario="maxNivelSubformulario"
        @configuracion-updated="onSubconfiguracionUpdated"
      />
    </div>

    <!-- Mensaje si se alcanza el nivel máximo -->
    <div v-if="mostrarSubformAnidado && nivel >= maxNivelSubformulario" class="alert alert-info mt-3">
      <i class="fas fa-info-circle me-2"></i>
      Nivel máximo de anidamiento alcanzado ({{ maxNivelSubformulario }})
    </div>

    <!-- Condiciones de subformulario -->
    <div class="mt-4">
      <h6>Condiciones de Subformulario - Nivel {{ nivel }}</h6>
      <div class="table-responsive">
        <table class="table modern-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Operador</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(condicion, index) in configuracion.condiciones"
              :key="'sub-' + nivel + '-' + index"
            >
              <td>
                <select 
                  :value="condicion.campo"
                  @input="updateCondicionCampo(index, $event.target.value)"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="campo in subcamposFiltrables"
                    :key="campo.name"
                    :value="campo.name"
                  >
                    {{ campo.alias || campo.name }}
                  </option>
                </select>
              </td>
              <td>
                <select 
                  :value="condicion.operador"
                  @input="updateCondicionOperador(index, $event.target.value)"
                  class="form-select form-select-sm"
                >
                  <option value="igual">Igual a</option>
                  <option value="diferente">Diferente de</option>
                  <option value="mayor">Mayor que</option>
                  <option value="menor">Menor que</option>
                  <option value="mayor_igual">Mayor o igual</option>
                  <option value="menor_igual">Menor o igual</option>
                  <option value="contiene">Contiene</option>
                </select>
              </td>
              <td>
                <input
                  :value="condicion.valor"
                  @input="updateCondicionValor(index, $event.target.value)"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Valor"
                />
              </td>
              <td>
                <button
                  @click="eliminarCondicion(index)"
                  class="btn btn-sm btn-danger"
                  title="Eliminar condición"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button @click="agregarCondicion" type="button" class="btn btn-sm btn-primary mt-2">
        <i class="fas fa-plus me-1"></i> Agregar Condición Nivel {{ nivel }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubformRecursivo',
  props: {
    configuracion: {
      type: Object,
      required: true
    },
    subcamposDisponibles: {
      type: Array,
      default: () => []
    },
    nivel: {
      type: Number,
      default: 1
    },
    rutaCampo: {
      type: String,
      default: ''
    },
    maxNivelSubformulario: {
      type: Number,
      default: 2
    }
  },
  computed: {
    subcamposFiltrables() {
      return this.subcamposDisponibles.filter(campo => campo.type !== 'subform')
    },
    
    mostrarSubformAnidado() {
      const campoSeleccionado = this.subcamposDisponibles.find(
        c => c.name === this.configuracion.campoSeleccionado
      )
      return campoSeleccionado && campoSeleccionado.type === 'subform'
    },
    
    subcamposAnidados() {
      const campoSeleccionado = this.subcamposDisponibles.find(
        c => c.name === this.configuracion.campoSeleccionado
      )
      return campoSeleccionado && campoSeleccionado.type === 'subform' 
        ? (campoSeleccionado.subcampos || [])
        : []
    }
  },
  methods: {
    updateTipoOperacion(valor) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.tipoOperacion = valor
      
      // Limpiar configuración anidada si cambia el tipo de operación
      if (valor !== this.configuracion.tipoOperacion) {
        nuevaConfiguracion.campoSeleccionado = ''
        nuevaConfiguracion.subConfiguracion = {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null
        }
      }
      
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    updateCampoSeleccionado(valor) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.campoSeleccionado = valor
      
      // Si el campo cambia, limpiar subconfiguracion
      if (valor !== this.configuracion.campoSeleccionado) {
        nuevaConfiguracion.subConfiguracion = {
          tipoOperacion: '',
          campoSeleccionado: '',
          condiciones: [],
          subConfiguracion: null
        }
      }
      
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    onSubconfiguracionUpdated(nuevaSubconfiguracion) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.subConfiguracion = nuevaSubconfiguracion
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    updateCondicionCampo(index, valor) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.condiciones = [...nuevaConfiguracion.condiciones]
      nuevaConfiguracion.condiciones[index] = {
        ...nuevaConfiguracion.condiciones[index],
        campo: valor
      }
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    updateCondicionOperador(index, valor) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.condiciones = [...nuevaConfiguracion.condiciones]
      nuevaConfiguracion.condiciones[index] = {
        ...nuevaConfiguracion.condiciones[index],
        operador: valor
      }
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    updateCondicionValor(index, valor) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.condiciones = [...nuevaConfiguracion.condiciones]
      nuevaConfiguracion.condiciones[index] = {
        ...nuevaConfiguracion.condiciones[index],
        valor: valor
      }
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    agregarCondicion() {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.condiciones = [
        ...nuevaConfiguracion.condiciones,
        {
          campo: this.subcamposFiltrables[0]?.name || '',
          operador: 'igual',
          valor: ''
        }
      ]
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    eliminarCondicion(index) {
      const nuevaConfiguracion = { ...this.configuracion }
      nuevaConfiguracion.condiciones = nuevaConfiguracion.condiciones.filter((_, i) => i !== index)
      this.$emit('configuracion-updated', nuevaConfiguracion)
    },
    
    esCampoValido(campo) {
      if (this.configuracion.tipoOperacion === 'distinto') {
        return true // Para contar distintos, cualquier campo es válido
      }
      if (['sumar', 'promedio', 'maximo', 'minimo'].includes(this.configuracion.tipoOperacion)) {
        return campo.type === 'number'
      }
      return true
    },
    
    getTipoCampo(campo) {
      const tipos = {
        text: 'Texto',
        string: 'Texto',
        number: 'Numérico',
        date: 'Fecha',
        file: 'Archivo',
        subform: 'Subformulario',
        select: 'Selección'
      }
      return tipos[campo.type] || campo.type
    }
  }
}
</script>

<style scoped>
.nivel-1 {
  border-left: 3px solid #007bff;
  padding-left: 15px;
  margin-left: 10px;
}

.nivel-2 {
  border-left: 3px solid #28a745;
  padding-left: 15px;
  margin-left: 20px;
}

.nivel-3 {
  border-left: 3px solid #ffc107;
  padding-left: 15px;
  margin-left: 30px;
}

.nivel-4 {
  border-left: 3px solid #dc3545;
  padding-left: 15px;
  margin-left: 40px;
}

.badge-nivel {
  font-size: 0.7em;
  background-color: #6c757d;
}

.subform-config-section .table {
  --bs-table-bg: #f8f9fa;
}

.nivel-1 .table {
  --bs-table-bg: #e3f2fd;
}

.nivel-2 .table {
  --bs-table-bg: #e8f5e8;
}

.nivel-3 .table {
  --bs-table-bg: #fff3cd;
}

.nivel-4 .table {
  --bs-table-bg: #f8d7da;
}
</style>