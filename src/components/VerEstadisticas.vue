<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->


      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="submitForm">


          <!-- Sección de información básica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-user me-2"></i>
              Información básica
            </h6>
            <div>
              <div class="col-md-12">
                <label class="form-label">Titulo*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    v-solo-texto
                    v-model="titulo"
                    type="text"
                    id="nombre"
                    name="nombre"
                    class="form-control"
                    required
                    placeholder="Ingrese el nombre de la gráfica"
                  />
                </div>
              </div>


              <div class="col-md-12">
                <label class="form-label">Descripción*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    v-solo-correo
                    v-model="descripcion"
                    type="text"
                    id="email"
                    name="email"
                    class="form-control"
                    required
                    placeholder="Ingrese alguna descripción de para la gráfica"
                  />
                </div>
              </div>

            </div>
          </div>

          <!-- Configuración de la gráfica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-lock me-2"></i>
              Configuración de la gráfica
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tipo de gráfica*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-venus-mars"></i>
                  </span>
                  <select v-model="tipoGrafica" id="genero" name="genero" class="form-control" required>
                    <option value="">Seleccione el tipo de gráfica</option>
                    <option value="bar">Barras</option>
                    <option value="line">Linea</option>
              
                    
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Color de la gráfica*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    v-model="color"
                    type="text"
                    id="color"
                    name="color"
                    class="form-control"
                    required
                    placeholder="Confirme el color de la gráfica"
                  />
                </div>
              </div>
            </div>
          </div>


<!-- Sección para el rango de periodos de la gráfica-->
<div class="form-section">
  <h6 class="section-title">
    <i class="fas fa-shield-alt me-2"></i>
    Rangos de fecha
  </h6>

  <!-- Contenedor único para todos los periodos -->
  <div class="date-filter-simple">
    <!-- Cada fila de periodo -->
    <div
      v-for="(periodo, index) in periodos"
      :key="index"
      class="filter-row"
      :class="{ 'has-remove-btn': index > 0 }"
    >
      <div class="date-field">
        <label :for="`fechaInicio-${index}`" class="date-label">Fecha Inicio:</label>
        <Calendar
          :id="`fechaInicio-${index}`"
          v-model="periodo.inicio"
          dateFormat="dd-mm-yy"
          placeholder="Seleccionar fecha"
          :showIcon="true"
          class="w-100"
        />
      </div>

      <div class="date-field">
        <label :for="`fechaFin-${index}`" class="date-label">Fecha Fin:</label>
        <Calendar
          :id="`fechaFin-${index}`"
          v-model="periodo.fin"
          dateFormat="dd-mm-yy"
          placeholder="Seleccionar fecha"
          :showIcon="true"
          class="w-100"
        />
      </div>

      <!-- Botón de eliminar (solo en periodos adicionales) -->
      <button
        v-if="index > 0"
        type="button"
        @click="eliminarPeriodo(index)"
        class="btn-remove-periodo"
        aria-label="Eliminar periodo"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Botón "Agregar periodo" al final -->
    <div class="text-center mt-3">
      <button
        type="button"
        @click="agregarPeriodo"
        class="btn-add-campo"
      >
        <i class="fas fa-plus"></i>
        <span>Agregar periodo</span>
      </button>
    </div>
  </div>
</div>

<!-- Sección de las series o configuracion de la estadistica de la grafica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-user me-2"></i>
              Configuración de la estadística de la gráfica
            </h6>
            <div>
                            <div class="col-md-12">
                <label class="form-label">Nombre de la serie*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input
                    v-solo-texto
                    v-model="nombreSerieTemporal"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Ingrese el nombre de la serie"
                  />
                </div>
              </div>
                    <button
        type="button"
        @click="abrirModalIndicadores"
        class="btn-add-campo"
      >
        <i class="fas fa-plus"></i>
        <span>Agregar Serie</span>
      </button>
<ConfigurarIndicador v-if="mostrarModal" :noRedirigir="true" @cerrar="mostrarModal = false" @configuracion-lista="manejarConfiguracionRecibida" />



            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button type="button" class="btn btn-cancel" @click="resetForm">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <button
              type="submit"
              class="btn btn-save"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
            >
              <span v-if="!isHovered" class="default-icon"
                ><i class="fas fa-user-plus me-2"></i
              ></span>
              <span v-else class="hover-icon"><i class="fas fa-user-check me-2"></i></span>
              Crear Gráfica
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import ConfigurarIndicador from '@/components/ConfigurarIndicador.vue'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  components: {
    ConfigurarIndicador,
    Calendar,
    Button
  },
  data() {
    return {
      titulo: '',
      descripcion: '',
      tipoGrafica: '',
      color: '',
      nombreSerieTemporal: '',
      periodos: [{ inicio: null, fin: null }],
      series: [],
      mostrarModal: false,
      isHovered: false
    }
  },
  methods: {
    abrirModalIndicadores() {
      this.mostrarModal = true
    },

    agregarPeriodo() {
      this.periodos.push({ inicio: null, fin: null })
    },

    eliminarPeriodo(index) {
      if (this.periodos.length <= 1) {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Debe haber al menos un rango de fechas.'
        })
        return
      }
      this.periodos.splice(index, 1)
    },
    formatDateToDDMMYYYY(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() empieza en 0
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
},

    manejarConfiguracionRecibida(configuracion) {
      if (!this.nombreSerieTemporal.trim()) {
        Swal.fire('Error', 'Debe ingresar un nombre para la serie', 'error')
        return
      }

      this.series.push({
        name: this.nombreSerieTemporal.trim(),
        configuracion
      })

      this.mostrarModal = false
    },

    resetForm() {
      this.titulo = ''
      this.descripcion = ''
      this.tipoGrafica = ''
      this.color = ''
      this.series = []
      this.periodos = [{ inicio: null, fin: null }]
      this.nombreSerieTemporal = ''
    },

    generarLabelRango(inicio, fin) {
      const startYear = new Date(inicio).getFullYear()
      const endYear = new Date(fin).getFullYear()
      return startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`
    },

    async submitForm() {
      if (!this.titulo || !this.descripcion || !this.tipoGrafica || !this.color) {
        Swal.fire('Error', 'Complete todos los campos obligatorios', 'error')
        return
      }

      if (this.series.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos una serie estadística', 'error')
        return
      }

      const periodosValidos = this.periodos.filter(p => p.inicio && p.fin)
      if (periodosValidos.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos un rango de fechas válido', 'error')
        return
      }

      const result = await Swal.fire({
        title: '¿Crear gráfica?',
        text: `Se creará una gráfica de tipo "${this.tipoGrafica}" con el título "${this.titulo}".`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      })

      if (!result.isConfirmed) return

      const payload = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        series: this.series,
        rangos: periodosValidos.map(p => ({
  inicio: this.formatDateToDDMMYYYY(p.inicio),
  fin: this.formatDateToDDMMYYYY(p.fin),
  label: this.generarLabelRango(p.inicio, p.fin)
})),
        chartOptions: {
          chart: { height: 350, type: this.tipoGrafica },
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2 }
        }
      }

      try {
        const token = localStorage.getItem('apiToken')
        await axios.post('http://127.0.0.1:8000/api/graficas', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        Swal.fire('¡Éxito!', 'Gráfica creada correctamente', 'success')
        this.resetForm()
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la gráfica', 'error')
      }
    }
  }
}
</script>
<style scoped>



.date-filter-simple {
  width: 100%;
  position: relative;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
  padding-right: 0;
  position: relative;
}



.date-field {
  flex: 1;
  min-width: 0;
}

.date-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #495057;
  font-size: 0.875rem;
}

/* Botón de eliminar: redondo, a la derecha, sin afectar layout */
.btn-remove-periodo {
  position: absolute;
  right: -70px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ef4444; /* rojo moderno */
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 2;
}

.btn-remove-periodo:hover {
  background-color: #dc2626;
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.btn-remove-periodo:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

/* Asegurar que los Calendar de PrimeVue ocupen todo el ancho */
:deep(.p-calendar) {
  width: 100%;
}
:deep(.p-inputtext) {
  width: 100%;
}
.btn-primary {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
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
  background: linear-gradient(90deg, #047857, #065f46);
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
  color: #047857;
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus {
  border-color: #047857;
  box-shadow: 0 0 0 0.2rem rgba(4, 120, 87, 0.25);
  transform: translateY(-1px);
}

.alert {
  border-radius: 12px;
  border: 1px solid #b3d9ff;
  background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
  color: #0d47a1;
}

/* Estilos mejorados para roles - NUEVOS ESTILOS AGREGADOS */
.roles-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.role-item {
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 2px solid rgba(4, 120, 87, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.role-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #047857, #065f46);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.role-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.15);
  border-color: rgba(4, 120, 87, 0.2);
}

.role-item:hover::before {
  transform: scaleX(1);
}

/* Checkbox personalizado mejorado */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2.75rem;
  width: 100%;
  line-height: 1.4;
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
  top: 2px;
  height: 22px;
  width: 22px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.checkbox-container:hover .checkmark {
  border-color: #047857;
  box-shadow: 0 4px 8px rgba(4, 120, 87, 0.15);
  transform: translateY(-1px);
}

.custom-checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-color: #047857;
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.role-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  flex: 1;
}

.role-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.4rem;
  font-size: 1rem;
  line-height: 1.3;
}

.role-description {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
}

/* Estilos para recursos y permisos existentes */
.assigned-resources {
  margin-top: 1.5rem;
}

.resource-permission-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.resource-permission-card:hover {
  box-shadow: 0 4px 15px rgba(4, 120, 87, 0.1);
  transform: translateY(-1px);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.resource-info {
  flex: 1;
}

.resource-name {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.resource-description {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.permission-item:hover {
  background: #f8f9fa;
  border-color: rgba(4, 120, 87, 0.1);
}

.permission-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.permission-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.permission-description {
  font-size: 0.8rem;
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
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
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
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.default-icon,
.hover-icon {
  transition: all 0.3s ease;
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

/* Responsive mejorado */
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

  .roles-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .role-item {
    padding: 1rem;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
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

  .modern-input .form-control {
    font-size: 0.9rem;
  }

  .role-item {
    padding: 0.875rem;
  }

  .checkbox-container {
    padding-left: 2.5rem;
  }

  .checkmark {
    height: 20px;
    width: 20px;
  }

  .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 9px;
  }
}
</style>
