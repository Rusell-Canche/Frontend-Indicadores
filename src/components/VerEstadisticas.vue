<template>
  <div class="container-fluid py-4 ">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">

        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-text"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear estadística</h3>
            <p class="header-subtitle">Configura los campos para tu nueva estadística</p>
          </div>
        </div>
      </div>


      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <form @submit.prevent="submitForm">


          <!-- Sección de información básica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Información básica
            </h6>
            <div>
              <div class="col-md-12">
                <label class="form-label">Titulo*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-font"></i>
                  </span>
                  <input v-solo-texto v-model="titulo" type="text" id="nombre" name="nombre" class="form-control"
                    required placeholder="Ingrese el nombre de la gráfica" />
                </div>
              </div>


              <div class="col-md-12">
                <label class="form-label">Descripción*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-font"></i>
                  </span>
                  <input v-solo-correo v-model="descripcion" type="text" id="email" name="email" class="form-control"
                    required placeholder="Ingrese alguna descripción de para la gráfica" />
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">Tipo de gráfica*</label>
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-font"></i>
                  </span>
                  <select v-model="tipoGrafica" id="genero" name="genero" class="form-control" required>
                    <option value="">Seleccione el tipo de gráfica</option>
                    <option value="bar">Barras</option>
                    <option value="line">Linea</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <!-- Sección para el rango de rangos de la gráfica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-arrows-h me-2"></i>
              Rangos de fecha
            </h6>

            <!-- Selector de tipo global -->
            <div class="mb-4">
              <label class="form-label d-block">Tipo de rango:</label>
              <div class="d-flex flex-wrap gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="tipo-libre" v-model="tipoGlobal" value="libre"
                    @change="confirmarCambioTipo" />
                  <label class="form-check-label" for="tipo-libre">Libre</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="tipo-mes" v-model="tipoGlobal" value="mes"
                    @change="confirmarCambioTipo" />
                  <label class="form-check-label" for="tipo-mes">Por mes</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="tipo-ciclo" v-model="tipoGlobal" value="ciclo"
                    @change="confirmarCambioTipo" />
                  <label class="form-check-label" for="tipo-ciclo">Por ciclo escolar</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="tipo-semestre" v-model="tipoGlobal" value="semestre"
                    @change="confirmarCambioTipo" />
                  <label class="form-check-label" for="tipo-semestre">Por semestre</label>
                </div>
              </div>
            </div>

            <!-- Interfaz ÚNICA de selección -->
            <div class="date-filter-simple mb-4 d-flex justify-content-center">
              <!-- Libre: dos calendarios -->
              <div v-if="tipoGlobal === 'libre'" class="d-flex gap-3 flex-wrap" style="max-width: 600px">
                <div class="date-field" style="flex: 1; min-width: 220px">
                  <label for="fechaInicio" class="date-label">Fecha Inicio:</label>
                  <Calendar id="fechaInicio" v-model="tempInicio" dateFormat="dd-mm-yy" placeholder="Seleccionar fecha"
                    :showIcon="true" class="w-100" />
                </div>
                <div class="date-field" style="flex: 1; min-width: 220px">
                  <label for="fechaFin" class="date-label">Fecha Fin:</label>
                  <Calendar id="fechaFin" v-model="tempFin" dateFormat="dd-mm-yy" placeholder="Seleccionar fecha"
                    :showIcon="true" class="w-100" />
                </div>
              </div>

              <!-- Por mes -->
              <div v-else-if="tipoGlobal === 'mes'" class="date-field" style="width: 250px">
                <label for="mes" class="date-label">Seleccionar mes/año:</label>
                <Calendar id="mes" v-model="tempValor" view="month" dateFormat="mm/yy" placeholder="Ej: 10/2025"
                  :showIcon="true" class="w-100" />
              </div>

              <!-- Por ciclo (año) -->
              <div v-else-if="tipoGlobal === 'ciclo'" class="date-field" style="width: 250px">
                <label for="anio" class="date-label">Seleccionar año:</label>
                <Calendar id="anio" v-model="tempValor" view="year" dateFormat="yy" placeholder="Ej: 2025"
                  :showIcon="true" class="w-100" />
              </div>

              <!-- Por semestre -->
              <div v-else-if="tipoGlobal === 'semestre'" class="date-field" style="width: 250px">
                <label for="semestreSelect" class="date-label">Seleccionar semestre:</label>
                <select id="semestreSelect" v-model="tempValor" class="form-control modern-input w-100">
                  <option value="">Seleccione un semestre</option>
                  <option v-for="sem in SEMESTRES" :key="sem.inicio" :value="sem.inicio + '|' + sem.fin">
                    {{ sem.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Botón Agregar (siempre visible, centrado) -->
            <div class="text-center mb-4">
              <button type="button" @click="agregarRangoDesdeTemp" :disabled="!puedeAgregarRango"
                class="btn btn-primary" style="padding: 0.5rem 1.5rem">
                <i class="fas fa-plus me-1"></i> Agregar rango
              </button>
            </div>

            <!-- Tabla de rangos agregados -->
            <div v-if="rangos.length > 0" class="mt-4">
              <h6 class="section-title">Rangos seleccionados</h6>
              <DataTable :value="rangos" tableStyle="min-width: 40rem" :showGridlines="true">
                <Column header="Fecha Inicio" style="width: 30%">
                  <template #body="slotProps">
                    {{ slotProps.data.inicio }}
                  </template>
                </Column>
                <Column header="Fecha Fin" style="width: 30%">
                  <template #body="slotProps">
                    {{ slotProps.data.fin }}
                  </template>
                </Column>
                <Column header="Acciones" style="width: 20%; text-align: center">
                  <template #body="slotProps">
                    <Button icon="fas fa-trash" @click="eliminarRango(slotProps.index)" text severity="danger"
                      size="small" v-tooltip="'Eliminar rango'" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>


          <!-- Sección de las series o configuracion de la estadistica de la grafica -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-cog me-2"></i>
              Configuración estadística de la gráfica
            </h6>
            <div>
              <!-- Tabla de series agregadas -->
              <div v-if="series.length > 0" class="form-section mt-3">
                <h6 class="section-title">
                  <i class="fas fa-list me-2"></i>
                  Series configuradas ({{ series.length }})
                </h6>

                <DataTable :value="series" tableStyle="min-width: 50rem" :showGridlines="true">
                  <Column field="name" header="Nombre de la serie" style="width: 15%" />

                  <Column header="Colección" style="width: 15%">
                    <template #body="slotProps">
                      {{ slotProps.data.configuracion.coleccion || '—' }}
                    </template>
                  </Column>

                  <Column header="Operación" style="width: 12%">
                    <template #body="slotProps">
                      {{ slotProps.data.configuracion.operacion || '—' }}
                    </template>
                  </Column>

                  <Column header="Sección(es)" style="width: 20%">
                    <template #body="slotProps">
                      {{
                        Array.isArray(slotProps.data.configuracion.secciones)
                          ? slotProps.data.configuracion.secciones.join(', ')
                          : slotProps.data.configuracion.secciones || '—'
                      }}
                    </template>
                  </Column>

                  <Column header="Campo fecha" style="width: 20%">
                    <template #body="slotProps">
                      {{
                        slotProps.data.configuracion.campoFechaFiltro?.[1] || '—'
                      }}
                    </template>
                  </Column>
                  <Column header="Acciones" style="width: 15%; text-align: center">
                    <template #body="slotProps">
                      <!-- Botón Editar -->
                      <Button icon="fas fa-edit" @click="editarSerie(slotProps.index)" text severity="info" size="small"
                        v-tooltip="'Editar serie'" class="me-2" />
                      <!-- Botón Clonar -->
                      <Button icon="fas fa-copy" @click="clonarSerie(slotProps.index)" text severity="secondary"
                        size="small" v-tooltip="'Clonar serie'" class="me-2" />
                      <!-- Botón Eliminar -->
                      <Button icon="fas fa-trash" @click="eliminarSerie(slotProps.index)" text severity="danger"
                        size="small" v-tooltip="'Eliminar serie'" />
                    </template>
                  </Column>
                </DataTable>
              </div>
              <!-- Botón para agregar serie -->
              <button type="button" @click="abrirModalIndicadores" class="btn-add-campo ">
                <i class="fas fa-plus"></i>
                <span>Agregar Serie</span>
              </button>
              <ConfigurarIndicador v-if="mostrarModal" :noRedirigir="true" :modoEstadisticas="true"
                :configuracion-edicion="serieEnEdicion" @cerrar="mostrarModal = false; serieEnEdicion = null"
                @configuracion-lista="manejarConfiguracionRecibida" />

            </div>
          </div>

          <!-- Footer con botones -->
          <div class="medico-footer">
            <button type="button" v-if="!ModoEditarGrafica" class="btn btn-cancel" @click="resetForm">
              <i class="fas fa-eraser me-2"></i>
              Limpiar Formulario
            </button>
            <!-- Cancelar y limpiar todo -->
            <button v-if="ModoEditarGrafica" type="button" class="btn btn-cancel" @click="cancelarEdicion">
              <i class="fas fa-eraser me-2"></i>
              Cancelar
            </button>
            <button type="submit" class="btn btn-save" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
              <span v-if="!isHovered" class="default-icon"><i class="fas fa-user-plus me-2"></i></span>
              <span v-else class="hover-icon"><i class="fas fa-user-check me-2"></i></span>
              {{ ModoEditarGrafica ? 'Crear nueva gráfica a partir de esta configuración' : 'Crear Gráfica' }}
            </button>
            <!-- Botones de modo editar grafica -->
            <!-- Actualizar gráfica -->
            <button v-if="ModoEditarGrafica" type="button" class="btn btn-save" @click="submitForm">
              <i class="fas fa-sync-alt me-2"></i>
              Actualizar Gráfica
            </button>


          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/services/api'
import ConfigurarIndicador from '@/components/ConfigurarIndicador.vue'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import Swal from 'sweetalert2'
import axios from 'axios'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// 👇 Define SEMESTRES AQUÍ, fuera del export
const SEMESTRES = [
  { label: '2023 Ene - Jul', inicio: '2023-01-01', fin: '2023-07-31' },
  { label: '2023 Ago - Dic', inicio: '2023-08-01', fin: '2023-12-31' },
  { label: '2024 Ene - Jul', inicio: '2024-01-01', fin: '2024-07-31' },
  { label: '2024 Ago - Dic', inicio: '2024-08-01', fin: '2024-12-31' },
  { label: '2025 Ene - Jul', inicio: '2025-01-01', fin: '2025-07-31' },
  { label: '2025 Ago - Dic', inicio: '2025-08-01', fin: '2025-12-31' }
];

export default {
  components: {
    ConfigurarIndicador,
    Calendar,
    Button,
    DataTable,
    Column,


  },
  computed: {
    puedeAgregarRango() {
      if (this.tipoGlobal === 'libre') {
        return this.tempInicio && this.tempFin;
      } else if (this.tipoGlobal === 'semestre') {
        return !!this.tempValor;
      } else {
        // mes o ciclo
        return !!this.tempValor;
      }
    }
  },
  data() {

    return {
      titulo: '',
      descripcion: '',
      tipoGrafica: '',
      color: '',
      tipoGlobal: 'libre', // nuevo
      tipoGlobalAnterior: 'libre',
      serieEnEdicion: null, // 👈 nueva propiedad para guardar la serie que se está editando
      SEMESTRES, // para usar en el template
      ModoEditarGrafica: false,
      rangos: [],
      tempInicio: null,
      tempFin: null,
      tempValor: null,
      series: [],
      mostrarModal: false,
      isHovered: false
    }
  },

  methods: {
    cancelarEdicion() {
      this.ModoEditarGrafica = false; // Desactiva el modo edición
      this.resetForm();               // Limpia el formulario
    },
    async obtenerGraficaPorId(id) {
      try {
        const response = await api.get(`/graficas/${id}`);
        this.grafica = response.data.graficas; // o response.data según tu API
        console.log("Gráfica obtenida:", this.grafica);
        this.ModoEditarGrafica = true;
        this.graficaId = id;
        // Rellenar el formulario con los datos de la consulta con el id obtenido de ver graficas
        this.titulo = this.grafica.titulo;
        this.descripcion = this.grafica.descripcion;
        this.tipoGrafica = this.grafica.chartOptions.chart.type;
        this.series = this.grafica.series;
        this.tipoGlobal = this.grafica.tipoRango;
        this.rangos = this.grafica.rangos;

      } catch (error) {
        console.error('Error al obtener la gráfica:', error);
      }
    },
    abrirModalIndicadores() {
      this.mostrarModal = true
    },

    // Confirmar cambio de tipo si ya hay rangos
    confirmarCambioTipo() {
      if (this.rangos.length > 0) {
        Swal.fire({
          title: '¿Cambiar tipo de rango?',
          text: 'Perderás todos los rangos agregados.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cambiar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.rangos = [];
            this.tipoGlobalAnterior = this.tipoGlobal;
            this.limpiarTemporales();
          } else {
            this.$nextTick(() => {
              this.tipoGlobal = this.tipoGlobalAnterior;
            });
          }
        });
      } else {
        this.tipoGlobalAnterior = this.tipoGlobal;
        this.limpiarTemporales();
      }
    },

    limpiarTemporales() {
      this.tempInicio = null;
      this.tempFin = null;
      this.tempValor = null;
    },
    agregarRangoDesdeTemp() {
      let inicioDate = null;
      let finDate = null;

      if (this.tipoGlobal === 'libre') {
        if (!this.tempInicio || !this.tempFin) return;
        inicioDate = new Date(this.tempInicio);
        finDate = new Date(this.tempFin);
      } else if (this.tipoGlobal === 'mes' && this.tempValor) {
        const d = new Date(this.tempValor);
        const year = d.getFullYear();
        const month = d.getMonth();
        inicioDate = new Date(year, month, 1);
        finDate = new Date(year, month + 1, 0);
      } else if (this.tipoGlobal === 'ciclo' && this.tempValor) {
        const year = new Date(this.tempValor).getFullYear();
        inicioDate = new Date(year, 0, 1);
        finDate = new Date(year, 11, 31);
      } else if (this.tipoGlobal === 'semestre' && this.tempValor) {
        const [inicioStr, finStr] = this.tempValor.split('|');
        inicioDate = new Date(inicioStr);
        finDate = new Date(finStr);
      } else {
        return;
      }

      if (isNaN(inicioDate) || isNaN(finDate)) return;

      // ✅ Generar label usando los objetos Date
      const label = this.generarLabelRango(inicioDate, finDate);

      // ✅ Formatear fechas a string ANTES de guardar
      const inicioStr = this.formatDateToDDMMYYYY(inicioDate);
      const finStr = this.formatDateToDDMMYYYY(finDate);

      // ✅ Guardar en el array como strings + label
      this.rangos.push({
        inicio: inicioStr,
        fin: finStr,
        label: label
      });
      console.log(this.rangos);
      this.limpiarTemporales();
    },
    eliminarRango(index) {
      this.rangos.splice(index, 1);
    },


    eliminarSerie(index) {
      this.series.splice(index, 1);
    },
    clonarSerie(index) {
      const serieOriginal = this.series[index];
      // Clonación profunda usando JSON.parse(JSON.stringify(...))
      const serieClonada = {
        name: `${serieOriginal.name} (Copia)`,
        configuracion: JSON.parse(JSON.stringify(serieOriginal.configuracion))
      };
      this.series.push(serieClonada);
    },
    editarSerie(index) {
      this.serieEnEdicion = { ...this.series[index] }; // Hacemos una copia
      this.mostrarModal = true;
    },


    formatDateToDDMMYYYY(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() empieza en 0
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },

    manejarConfiguracionRecibida(data) {
      if (!data || !data.nombre || !data.configuracion) {
        Swal.fire('Error', 'Datos incompletos desde el modal', 'error');
        return;
      }

      const nuevaSerie = {
        name: data.nombre,
        configuracion: data.configuracion
      };

      if (this.serieEnEdicion) {
        // ✅ Modo edición: encontrar el índice y reemplazar
        const index = this.series.findIndex(
          serie => serie.name === this.serieEnEdicion.name &&
            // Opcional: comparar también la configuración si el nombre puede repetirse
            JSON.stringify(serie.configuracion) === JSON.stringify(this.serieEnEdicion.configuracion)
        );

        if (index !== -1) {
          this.series.splice(index, 1, nuevaSerie);
        } else {
          // Si no se encuentra (raro, pero posible), agregar como nueva
          this.series.push(nuevaSerie);
        }
      } else {
        // ✅ Modo creación: agregar nueva
        this.series.push(nuevaSerie);
      }

      this.mostrarModal = false;
      this.serieEnEdicion = null; // Limpiar por seguridad
    },

    resetForm() {
      this.titulo = ''
      this.descripcion = ''
      this.tipoGrafica = ''
      this.color = ''
      this.series = []
      this.rangos = []
      this.tipoGlobal = 'libre'
      this.ModoEditarGrafica = false
    },

    generarLabelRango(inicio, fin) {
      const startYear = new Date(inicio).getFullYear()
      const endYear = new Date(fin).getFullYear()
      return startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`
    },
    async submitForm() {
      if (!this.titulo || !this.descripcion || !this.tipoGrafica) {
        Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
        return;
      }

      if (this.series.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos una serie estadística', 'error');
        return;
      }

      if (this.rangos.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos un rango de fechas válido', 'error');
        return;
      }

      const action = this.ModoEditarGrafica ? 'actualizar' : 'crear';
      const result = await Swal.fire({
        title: this.ModoEditarGrafica ? '¿Actualizar gráfica?' : '¿Crear gráfica?',
        text: this.ModoEditarGrafica
          ? `Se actualizará la gráfica "${this.titulo}".`
          : `Se creará una gráfica de tipo "${this.tipoGrafica}" con el título "${this.titulo}".`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      const payload = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        series: this.series,
        tipoRango: this.tipoGlobal,
        rangos: this.rangos,
        chartOptions: {
          chart: { height: 350, type: this.tipoGrafica },
          dataLabels: { enabled: false },
          stroke: { show: true, width: 2 }
        }
      };

      try {
        if (this.ModoEditarGrafica) {
          // ✅ PUT usando tu servicio `api`
          await api.put(`graficas/${this.graficaId}`, payload);
          Swal.fire('¡Éxito!', 'Gráfica actualizada correctamente', 'success');
        } else {
          // ✅ POST usando tu servicio `api`
          await api.post('graficas', payload);
          Swal.fire('¡Éxito!', 'Gráfica creada correctamente', 'success');
        }

        this.resetForm();
      } catch (error) {
        console.error('Error en submitForm:', error);
        Swal.fire('Error', error.response?.data?.message || 'No se pudo completar la operación', 'error');
      }
    }
  },


  mounted() {
    console.log('se recibio la id', this.$route.query.id);
    if (this.$route.query.id) {
      this.obtenerGraficaPorId(this.$route.query.id);
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


:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.015rem 0.75rem;
  /* Reduce el padding interno */


}

.date-field {
  margin-bottom: 1rem;
}

.date-label {
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 500;
  color: #495057;
}

/* Botón de eliminar: redondo, a la derecha, sin afectar layout */
.btn-remove-periodo {
  position: absolute;
  right: -70px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ef4444;
  /* rojo moderno */
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
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%)!important;
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
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);

}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%);
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
  color: #ff8c00;
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
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%);
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
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%);
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

.custom-checkbox:checked~.checkmark {
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

.custom-checkbox:checked~.checkmark:after {
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
