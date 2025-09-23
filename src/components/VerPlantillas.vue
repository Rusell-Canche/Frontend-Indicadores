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
  @click="abrirVistaGrafica(plantilla.id)"
  class="btn btn-mapa"
  title="Ver mapa de la plantilla"
>
  <i class="fas fa-project-diagram"></i>
  <span>Mapa</span>
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

    <!-- Modal para seleccionar origen de datos (select dinámicos) -->
    <div
      v-if="modalPlantillaVisible"
      class="medico-modal-backdrop"
      @click.self="cerrarModalPlantilla"
      
    >
      <div class="medico-modal-content" @click.stop style="max-width: 600px;">
        <!-- Header del modal -->
        <div class="medico-modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <i class="fas fa-database"></i>
            </div>
            <div class="modal-title-section">
              <h3>Seleccionar Origen de Datos</h3>
              <p class="modal-subtitle">Selecciona la plantilla y sección para cargar las opciones</p>
            </div>
          </div>
          <button @click="cerrarModalPlantilla" class="medico-close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body del modal -->
        <div class="medico-modal-body">
          <div class="form-section">
            <!-- Selección de plantilla -->
            <div class="mb-3">
              <label class="form-label">Plantilla*</label>
              <select
                v-model="plantillaSeleccionada"
                class="form-select"
                @change="cargarSeccionesPlantilla"
              >
                <option value="">Seleccione una plantilla</option>
                <option
                  v-for="plantilla in plantillasDisponibles"
                  :key="plantilla.id"
                  :value="plantilla.id"
                >
                  {{ plantilla.nombre_plantilla || plantilla.title }}
                </option>
              </select>
            </div>

            <!-- Selección de sección -->
            <div class="mb-3" v-if="seccionesPlantillaModal.length > 0">
              <label class="form-label">Sección*</label>
              <select v-model="seccionSeleccionada" class="form-select">
                <option value="">Seleccione una sección</option>
                <option
                  v-for="seccion in seccionesPlantillaModal"
                  :key="seccion.nombre"
                  :value="seccion.nombre"
                >
                  {{ seccion.nombre }}
                </option>
              </select>
            </div>

            <!-- Campos disponibles -->
            <div v-if="camposSeccion.length > 0">
              <label class="form-label">Campo a mostrar*</label>
              <select v-model="campoMostrar" class="form-select mb-2">
                <option value="">Seleccione campo a mostrar</option>
                <option v-for="campo in camposSeccion" :key="campo.name" :value="campo.name">
                  {{ campo.name }} ({{ campo.type }})
                </option>
              </select>
            </div>

            <!-- Vista previa -->
            <div v-if="campoMostrar" class="mt-3 p-3 bg-light rounded">
              <h6>Vista previa de opciones:</h6>
              <div v-if="cargandoOpciones" class="text-center">
                <i class="fas fa-spinner fa-spin"></i> Cargando...
              </div>
              <div v-else>
                <div
                  v-for="(opcion, index) in opcionesPreview"
                  :key="index"
                  class="badge bg-info me-1 mb-1"
                >
                  {{ opcion }}
                </div>
                <div v-if="opcionesPreview.length === 0" class="text-muted">
                  No hay datos disponibles en esta sección
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="medico-modal-footer">
          <button @click="cerrarModalPlantilla" class="btn btn-cancel">
            <i class="fas fa-times me-2"></i>
            Cancelar
          </button>
          <button
            @click="aplicarConfiguracionPlantilla"
            class="btn btn-save"
            :disabled="!configuracionValida"
          >
            <i class="fas fa-check me-2"></i>
            Aplicar Configuración
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

            <!-- Sección para las secciones de la plantilla -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-layer-group me-2"></i>
                Secciones de la Plantilla
              </h6>

              <div
                v-for="(seccion, seccionIndex) in seccionesPlantilla"
                :key="seccionIndex"
                class="seccion-container mb-4"
              >
                <div class="seccion-header">
                  <div class="seccion-header-content">
                    <div class="seccion-title-wrapper">
                      <div class="seccion-icon">
                        <i class="fas fa-folder"></i>
                      </div>
                      <div class="seccion-info">
                        <span class="seccion-index">Sección #{{ seccionIndex + 1 }}</span>
                        <span class="seccion-description"
                          >Configure los campos de esta sección</span
                        >
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="quitarSeccion(seccionIndex)"
                      class="btn-delete-section"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <div class="seccion-name-input mt-3">
                    <label class="form-label">Nombre de la Sección*</label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-heading"></i>
                      </span>
                      <input
                        v-solo-texto-y-numeros
                        v-model="seccion.nombre"
                        class="form-control"
                        required
                        placeholder="Ej: Información Básica, Detalles del Proyecto"
                      />
                    </div>
                  </div>
                </div>

                <div class="seccion-body">
                  <!-- Campos dentro de la sección -->
                  <div
                    v-for="(campo, campoIndex) in seccion.fields"
                    :key="campoIndex"
                    class="campo-container"
                  >
                    <div class="campo-header">
                      <div class="campo-header-content">
                        <div class="campo-title-wrapper">
                          <div class="campo-icon">
                            <i class="fas fa-grip-vertical"></i>
                          </div>
                          <div class="campo-info">
                            <span class="campo-index">Campo #{{ campoIndex + 1 }}</span>
                            <span class="campo-description"
                              >Configure las propiedades del campo</span
                            >
                          </div>
                        </div>
                        <button
                          type="button"
                          @click="quitarCampo(seccionIndex, campoIndex)"
                          class="btn-delete-field"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
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
                          <div class="campo-options">
                            <div class="campo-checkbox">
                              <label class="checkbox-container">
                                <input
                                  type="checkbox"
                                  class="custom-checkbox"
                                  v-model="campo.required"
                                />
                                <span class="checkmark"></span>
                                <span class="checkbox-label">Campo obligatorio</span>
                              </label>
                            </div>
                            <div class="campo-radio" v-if="campo.type === 'date'">
                              <label class="radio-container">
                                <input
                                  type="radio"
                                  :name="'filterOption_' + seccionIndex + '_' + campoIndex"
                                  class="custom-radio"
                                  v-model="campo.filterable"
                                  :value="true"
                                />
                                <span class="radiomark"></span>
                                <span class="radio-label">Aplicar para filtro</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Configuración de opciones para Select -->
                      <div v-if="campo.type === 'select'" class="select-options-container">
                        <div class="select-options-header">
                          <div class="options-header-content">
                            <i class="fas fa-list-ul"></i>
                            <span>Opciones para "{{ campo.name || 'este campo' }}"</span>
                          </div>
                        </div>

                        <!-- Botón para cargar desde otra plantilla -->
                        <div v-if="campo.type === 'select'">
                          <button
                            type="button"
                            @click="abrirModalPlantilla(campo, false)"
                            class="btn btn-outline-primary btn-sm config-select-btn"
                          >
                            <i class="fas fa-database me-1"></i>
                            Cargar opciones desde otra plantilla
                          </button>
                        </div>

                        <!-- Alert de configuración aplicada -->
                        <div v-if="campo.dataSource" class="alert alert-info mb-3">
                          <div class="d-flex align-items-start">
                            <i class="fas fa-lightbulb me-3 mt-1"></i>
                            <div>
                              <strong>Configuración de opciones dinámicas:</strong><br />
                              Las opciones se cargarán desde la plantilla
                              <strong
                                >"{{
                                  campo.dataSource.plantillaNombre
                                }}"</strong
                              >, sección <strong>"{{ campo.dataSource.seccion }}"</strong><br />
                              <span class="mt-1 d-block">
                                <small>
                                  Campo mostrado:
                                  <strong>{{ campo.dataSource.campoMostrar }}</strong>
                                </small>
                              </span>
                              <button
                                type="button"
                                @click="campo.dataSource = null; campo.mostrarOpcionesManuales = true"
                                class="btn btn-sm btn-outline-danger mt-2 remove-config-btn"
                              >
                                <i class="fas fa-times me-1"></i>
                                Eliminar configuración
                              </button>
                            </div>
                          </div>
                        </div>

                        <div v-if="campo.mostrarOpcionesManuales" class="select-options-body">
                          <div
                            v-for="(option, optionIndex) in campo.options || []"
                            :key="optionIndex"
                            class="option-item"
                          >
                            <div class="option-content">
                              <div class="input-group modern-input-small">
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
                                  @click="removeSelectOption(campo, optionIndex)"
                                  class="btn-delete-option"
                                >
                                  <i class="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div class="add-option-section">
                            <div class="add-option-wrapper">
                              <div class="add-option-input">
                                <input
                                  v-solo-texto-y-numeros
                                  v-model="campo.newOption"
                                  class="form-control modern-input-standalone"
                                  placeholder="Texto de la opción (ej: Activo, Inactivo, Pendiente)"
                                  @keyup.enter="addSelectOption(campo)"
                                />
                              </div>
                              <button
                                type="button"
                                @click="addSelectOption(campo)"
                                class="btn-add-option"
                                :disabled="!campo.newOption"
                              >
                                <i class="fas fa-plus"></i>
                                <span>Agregar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
<!-- Usamos el componente Subformulario para manejar recursividad -->
<Subformulario
  v-if="campo.type === 'subform'"
  :campo="campo"
  :seccionIndex="seccionIndex"
  :campoIndex="campoIndex"
  @abrir-modal-plantilla="abrirModalPlantilla"
/>
                    </div>
                  </div>

                  <button type="button" @click="agregarCampo(seccionIndex)" class="btn-add-campo">
                    <i class="fas fa-plus"></i>
                    <span>Agregar Campo a esta Sección</span>
                  </button>
                </div>
              </div>

              <button type="button" @click="agregarSeccion" class="btn-add-seccion">
                <i class="fas fa-plus"></i>
                <span>Agregar Nueva Sección</span>
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
    <!-- Modal del Mapa de Plantilla -->
<div
  v-if="mostrarModalMapa"
  class="modal fade show"
  style="display: block"
  @click.self="cerrarModalMapa"
>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content mapa-modal">
      <!-- Header del modal -->
      <div class="mapa-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="header-title-section">
            <h3>Mapa de la Plantilla</h3>
            <p class="header-subtitle">{{ nombrePlantillaMapa }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="toggleVistaCompacta" class="btn btn-vista" :class="{ active: vistaCompacta }">
            <i class="fas fa-compress-alt"></i>
            Vista Compacta
          </button>
          <button @click="cerrarModalMapa" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Body del modal con el mapa -->
      <div class="mapa-body">
        <div class="mapa-container" :class="{ 'vista-compacta': vistaCompacta }">
          <!-- Plantilla principal -->
          <div class="plantilla-nodo principal">
            <div class="nodo-header">
              <i class="fas fa-file-alt"></i>
              <h4>{{ nombrePlantillaMapa }}</h4>
            </div>
            <div class="nodo-stats">
              <span class="stat">
                <i class="fas fa-layer-group"></i>
                {{ seccionesMapaPlantilla.length }} secciones
              </span>
              <span class="stat">
                <i class="fas fa-list"></i>
                {{ totalCampos }} campos
              </span>
            </div>
          </div>

          <!-- Secciones -->
          <div class="secciones-container">
            <div
              v-for="(seccion, seccionIndex) in seccionesMapaPlantilla"
              :key="seccionIndex"
              class="seccion-nodo"
              :class="{ expandida: seccionesExpandidas[seccionIndex] }"
            >
              <div class="nodo-header clickable" @click="toggleSeccion(seccionIndex)">
                <div class="header-left">
                  <i class="fas fa-folder" :class="{ 'fa-folder-open': seccionesExpandidas[seccionIndex] }"></i>
                  <h5>{{ seccion.nombre }}</h5>
                </div>
                <div class="header-right">
                  <span class="campos-count">{{ seccion.fields?.length || 0 }} campos</span>
                  <i class="fas fa-chevron-down toggle-icon" :class="{ rotated: seccionesExpandidas[seccionIndex] }"></i>
                </div>
              </div>

              <!-- Campos de la sección -->
              <div v-if="seccionesExpandidas[seccionIndex]" class="campos-container">
                <div
                  v-for="(campo, campoIndex) in seccion.fields"
                  :key="campoIndex"
                  class="campo-nodo"
                  :class="[`tipo-${campo.type}`, { requerido: campo.required, filtrable: campo.filterable }]"
                >
                  <div class="campo-header">
                    <div class="campo-icon">
                      <i :class="getIconoCampo(campo.type)"></i>
                    </div>
                    <div class="campo-info">
                      <h6>{{ campo.name }}</h6>
                      <span class="campo-tipo">{{ getTipoTexto(campo.type) }}</span>
                    </div>
                    <div class="campo-badges">
                      <span v-if="campo.required" class="badge badge-required">Requerido</span>
                      <span v-if="campo.filterable" class="badge badge-filtrable">Filtrable</span>
                    </div>
                  </div>

                  <!-- Detalles específicos del campo -->
                  <div class="campo-detalles" v-if="!vistaCompacta">
                    <!-- Select con opciones -->
                    <div v-if="campo.type === 'select'" class="campo-opciones">
                      <div v-if="campo.dataSource" class="opciones-dinamicas">
                        <i class="fas fa-database"></i>
                        <span>Opciones dinámicas desde:</span>
                        <div class="source-info">
                          <strong>{{ campo.dataSource.plantillaNombre}}</strong>
                          <span>→ {{ campo.dataSource.seccion }} → {{ campo.dataSource.campoMostrar }}</span>
                        </div>
                      </div>
                      <div v-else-if="campo.options && campo.options.length > 0" class="opciones-estaticas">
                        <i class="fas fa-list-ul"></i>
                        <span>Opciones:</span>
                        <div class="opciones-list">
                          <span v-for="opcion in campo.options" :key="opcion" class="opcion-badge">{{ opcion }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Subformulario -->
                    <div v-if="campo.type === 'subform' && campo.subcampos" class="subcampos-container">
                      <div class="subcampos-header">
                        <i class="fas fa-sitemap"></i>
                        <span>Subcampos ({{ campo.subcampos.length }}):</span>
                      </div>
                      <div class="subcampos-grid">
                        <div
                          v-for="(subcampo, subIndex) in campo.subcampos"
                          :key="subIndex"
                          class="subcampo-mini"
                          :class="`tipo-${subcampo.type}`"
                        >
                          <i :class="getIconoCampo(subcampo.type)"></i>
                          <span>{{ subcampo.name }}</span>
                          <small>({{ getTipoTexto(subcampo.type) }})</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<VistaGrafica
  :visible="mostrarVistaGrafica"
  :jsonData="jsonPlantilla"
  @close="mostrarVistaGrafica = false"
/>

  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import Subformulario from './Subformulario.vue' // Ajusta la ruta según tu estructura
import VistaGrafica from './VistaGrafica.vue'

export default {
  data() {
    return {
      mostrarVistaGrafica: false,
      jsonPlantilla: {},
      plantillas: [], // Lista de plantillas obtenidas del servidor
      nombrePlantilla: '', // Nombre de la plantilla seleccionada para edición
      idPlantilla: '', // ID de la plantilla seleccionada para edición
      seccionesPlantilla: [], // Secciones de la plantilla seleccionada para edición
      mostrarModalEdit: false, // Control de visibilidad del modal de edición
      // Variables para el mapa de plantilla
mostrarModalMapa: false,
nombrePlantillaMapa: '',
seccionesMapaPlantilla: [],
seccionesExpandidas: {},
vistaCompacta: false,
      
      // Variables para el modal de plantilla (select dinámicos)
      modalPlantillaVisible: false,
      plantillasDisponibles: [],
      plantillaSeleccionada: '',
      seccionesPlantillaModal: [], // Cambiado para evitar conflicto con seccionesPlantilla existente
      seccionSeleccionada: '',
      camposSeccion: [],
      campoMostrar: '',
      opcionesPreview: [],
      cargandoOpciones: false,
      campoActual: null,
      esSubcampo: false, // Para identificar si es un campo o subcampo
    }
  },
  computed: {
    configuracionValida() {
      return this.plantillaSeleccionada && this.seccionSeleccionada && this.campoMostrar
    },
    totalCampos() {
  return this.seccionesMapaPlantilla.reduce((total, seccion) => {
    return total + (seccion.fields?.length || 0)
  }, 0)
},
  },
  watch: {
    seccionSeleccionada: 'onSeccionSeleccionada',
    campoMostrar: 'cargarVistaPrevia',
  },
  components: {
    Subformulario,
    VistaGrafica,
  },
  methods: {
    async fetchPlantillas() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/plantillas', {
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
        const response = await axios.get(`http://127.0.0.1:8000/api/plantillas/${id}/secciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        this.nombrePlantilla = response.data.nombre_plantilla
        this.idPlantilla = id
        this.seccionesPlantilla = response.data.secciones || []
        
        
        // Inicializar mostrarOpcionesManuales para campos select existentes
        this.seccionesPlantilla.forEach(seccion => {
          seccion.fields.forEach(campo => {
            if (campo.type === 'select') {
              if (campo.dataSource) {
                campo.mostrarOpcionesManuales = false
              } else {
                campo.mostrarOpcionesManuales = true
                campo.options = campo.options || []
              }
            }
            
            // Inicializar para subcampos también
            if (campo.type === 'subform' && campo.subcampos) {
              campo.subcampos.forEach(subcampo => {
                if (subcampo.type === 'select') {
                  if (subcampo.dataSource) {
                    subcampo.mostrarOpcionesManuales = false
                  } else {
                    subcampo.mostrarOpcionesManuales = true
                    subcampo.options = subcampo.options || []
                  }
                }
              })
            }
          })
        })
        const respPlantillas = await axios.get('http://127.0.0.1:8000/api/plantillas', {
        headers: { Authorization: `Bearer ${token}` },
        })
        this.plantillasDisponibles = respPlantillas.data || []
        
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
        nombre_plantilla: this.nombrePlantilla,
        secciones: this.seccionesPlantilla
          .map(seccion => {
            const seccionLimpia = {
              nombre: seccion.nombre,
              fields: seccion.fields
                .filter(campo => campo.name && campo.name.trim() !== '')
                .map(campo => this.limpiarCampo(campo)) // ✅ Usa la función recursiva
            }

            // Filtra secciones vacías
            return seccionLimpia
          })
          .filter(
            seccion =>
              seccion.nombre && seccion.nombre.trim() !== '' && seccion.fields.length > 0
          ),
      }

      console.log('Datos a enviar:', updateData) // Verifica que ahora sí tenga subcampos anidados

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
    agregarSeccion() {
      this.seccionesPlantilla.push({
        nombre: '',
        fields: [{ name: '', type: 'string', required: false, filterable: false }],
      })
    },

    quitarSeccion(index) {
      if (this.seccionesPlantilla.length > 1) {
        this.seccionesPlantilla.splice(index, 1)
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Debe haber al menos una sección en la plantilla',
        })
      }
    },

    agregarCampo(seccionIndex) {
      this.seccionesPlantilla[seccionIndex].fields.push({
        name: '',
        type: 'string',
        required: false,
        filterable: false,
      })
    },

    quitarCampo(seccionIndex, campoIndex) {
      if (this.seccionesPlantilla[seccionIndex].fields.length > 1) {
        this.seccionesPlantilla[seccionIndex].fields.splice(campoIndex, 1)
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Cada sección debe tener al menos un campo',
        })
      }
    },

    handleTypeChange(campo) {
      if (campo.type === 'subform' && !campo.subcampos) {
        campo.subcampos = []
        this.agregarSubcampo(campo)
      } else if (campo.type === 'select' && !campo.options) {
        campo.options = []
        campo.newOption = ''
        campo.mostrarOpcionesManuales = true
      }

      if (campo.type !== 'date') {
        campo.filterable = false
      }
    },

    agregarSubcampo(campo) {
      if (!campo.subcampos) {
        campo.subcampos = []
      }
      campo.subcampos.push({
        name: '',
        type: 'string',
        required: false,
        filterable: false,
      })
    },

    quitarSubcampo(campo, index) {
      if (campo.subcampos && campo.subcampos.length > 1) {
        campo.subcampos.splice(index, 1)
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'Debe haber al menos un apartado en el subformulario',
        })
      }
    },

    addSelectOption(campo) {
      if (!campo.options) {
        campo.options = []
      }

      if (campo.newOption && campo.newOption.trim() !== '') {
        const opcionTrimmed = campo.newOption.trim()

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

    removeSelectOption(campo, index) {
      if (campo.options && campo.options.length > 1) {
        campo.options.splice(index, 1)
      }
    },

    addSubcampoSelectOption(subcampo) {
      if (!subcampo.options) {
        subcampo.options = []
      }

      if (subcampo.newOption && subcampo.newOption.trim() !== '') {
        const opcionTrimmed = subcampo.newOption.trim()

        const existeOpcion = subcampo.options.some(
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

        subcampo.options.push(opcionTrimmed)
        subcampo.newOption = ''
      }
    },

    removeSubcampoSelectOption(subcampo, index) {
      if (subcampo.options && subcampo.options.length > 1) {
        subcampo.options.splice(index, 1)
      }
    },

    openEditModal(id) {
      this.fetchCamposPlantilla(String(id))
    },

    closeEditModal() {
      this.mostrarModalEdit = false
      this.seccionesPlantilla = []
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
    // Métodos para el mapa de plantilla
async abrirMapaPlantilla(id) {
  try {
    const token = localStorage.getItem('apiToken')
    const response = await axios.get(`http://127.0.0.1:8000/api/plantillas/${id}/secciones`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    
    this.nombrePlantillaMapa = response.data.nombre_plantilla
    this.seccionesMapaPlantilla = response.data.secciones || []
    
    // ✅ Cambio aquí - usar asignación directa en lugar de $set
    const expandidas = {}
    this.seccionesMapaPlantilla.forEach((_, index) => {
      expandidas[index] = true
    })
    this.seccionesExpandidas = expandidas
    
    this.mostrarModalMapa = true
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al cargar el mapa de la plantilla.',
    })
    console.error('Error al cargar mapa:', error)
  }
},

cerrarModalMapa() {
  this.mostrarModalMapa = false
  this.seccionesMapaPlantilla = []
  this.seccionesExpandidas = {}
},

toggleSeccion(index) {
  // ✅ Cambio aquí también
  this.seccionesExpandidas = {
    ...this.seccionesExpandidas,
    [index]: !this.seccionesExpandidas[index]
  }
},
toggleVistaCompacta() {
  this.vistaCompacta = !this.vistaCompacta
},

getIconoCampo(tipo) {
  const iconos = {
    string: 'fas fa-font',
    number: 'fas fa-hashtag',
    file: 'fas fa-file',
    date: 'fas fa-calendar',
    select: 'fas fa-list',
    subform: 'fas fa-sitemap'
  }
  return iconos[tipo] || 'fas fa-question'
},

getTipoTexto(tipo) {
  const tipos = {
    string: 'Texto',
    number: 'Numérico',
    file: 'Archivo',
    date: 'Fecha',
    select: 'Selección',
    subform: 'Subformulario'
  }
  return tipos[tipo] || tipo
},

    // Métodos para select dinámicos
    getNombrePlantillaDataSource(plantillaId) {
      if (!plantillaId) return 'Plantilla no especificada'

      const plantilla = this.plantillasDisponibles.find((p) => p.id === plantillaId)
      return plantilla
        ? plantilla.nombre_plantilla || plantilla.title
        : `Plantilla ID: ${plantillaId}`
    },

    async abrirModalPlantilla(campo, esSubcampo = false) {
      this.campoActual = campo
      this.esSubcampo = esSubcampo
      this.modalPlantillaVisible = true

      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/plantillas', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.plantillasDisponibles = response.data || []
        
        // Si ya hay una configuración previa, cargarla
        if (campo.dataSource) {
          this.plantillaSeleccionada = campo.dataSource.plantillaId
          await this.cargarSeccionesPlantilla()
          this.seccionSeleccionada = campo.dataSource.seccion
          await this.onSeccionSeleccionada()
          this.campoMostrar = campo.dataSource.campoMostrar
        }
      } catch (error) {
        console.error('Error al cargar plantillas:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las plantillas disponibles',
        })
      }
    },

    cerrarModalPlantilla() {
      this.modalPlantillaVisible = false
      this.resetModalPlantilla()
    },

    resetModalPlantilla() {
      this.plantillaSeleccionada = ''
      this.seccionesPlantillaModal = []
      this.seccionSeleccionada = ''
      this.camposSeccion = []
      this.campoMostrar = ''
      this.opcionesPreview = []
      this.campoActual = null
      this.esSubcampo = false
    },

    async cargarSeccionesPlantilla() {
      if (!this.plantillaSeleccionada) return

      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get(
          `http://127.0.0.1:8000/api/plantillas/${this.plantillaSeleccionada}/secciones`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        this.seccionesPlantillaModal = response.data?.secciones || []
        this.seccionSeleccionada = ''
        this.camposSeccion = []
        this.campoMostrar = ''
        this.opcionesPreview = []
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      }
    },

    async onSeccionSeleccionada() {
      if (!this.seccionSeleccionada) return

      const seccion = this.seccionesPlantillaModal.find((s) => s.nombre === this.seccionSeleccionada)
      if (seccion && seccion.fields) {
        this.camposSeccion = seccion.fields
        await this.cargarVistaPrevia()
      }
    },
    limpiarCampo(campo) {
  const campoLimpio = {
    name: campo.name,
    type: campo.type,
    required: Boolean(campo.required),
    filterable: Boolean(campo.filterable),
  }

  // Para select
  if (campo.type === 'select') {
    if (campo.dataSource) {
      campoLimpio.dataSource = campo.dataSource
    } else if (campo.options && Array.isArray(campo.options)) {
      campoLimpio.options = campo.options.filter(option => option && option.trim() !== '')
    }
  }

  // Para subformularios (recursivo)
  if (campo.type === 'subform' && campo.subcampos && Array.isArray(campo.subcampos)) {
    campoLimpio.subcampos = campo.subcampos.map(subcampo => this.limpiarCampo(subcampo))
  }

  return campoLimpio
},

    async cargarVistaPrevia() {
      if (!this.plantillaSeleccionada || !this.seccionSeleccionada || !this.campoMostrar) return

      this.cargandoOpciones = true
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get(
          `http://127.0.0.1:8000/api/plantillas/${this.plantillaSeleccionada}`,
          {
            params: {
              seccion: this.seccionSeleccionada,
              campo: this.campoMostrar,
            },
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        const valores = response.data || []
        this.opcionesPreview = [...new Set(valores.map((item) => item[this.campoMostrar]))].slice(
          0,
          10,
        )
      } catch (error) {
        console.error('Error al cargar vista previa:', error)
        this.opcionesPreview = []
      } finally {
        this.cargandoOpciones = false
      }
    },
    async abrirVistaGrafica(id) {
  try {
    const token = localStorage.getItem('apiToken')
    const response = await axios.get(`http://127.0.0.1:8000/api/plantillas/${id}/secciones`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.jsonPlantilla = response.data
    this.mostrarVistaGrafica = true
  } catch (error) {
    console.error("Error al cargar JSON de la plantilla:", error)
  }
},

    aplicarConfiguracionPlantilla() {
      if (!this.configuracionValida) return

      this.campoActual.options = []
      this.campoActual.dataSource = {
        plantillaId: this.plantillaSeleccionada,
        plantillaNombre: this.getNombrePlantillaDataSource(this.plantillaSeleccionada),
        seccion: this.seccionSeleccionada,
        campoMostrar: this.campoMostrar,
      }

      // Ocultar opciones manuales cuando se configura desde plantilla
      this.campoActual.mostrarOpcionesManuales = false

      this.cerrarModalPlantilla()

      Swal.fire({
        icon: 'success',
        title: 'Configuración aplicada',
        text: 'Las opciones se cargarán desde la plantilla seleccionada',
        timer: 2000,
        showConfirmButton: false,
      })
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

.modern-input-standalone {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input-standalone:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  transform: translateY(-1px);
  outline: none;
}

.alert {
  border-radius: 12px;
  border: 1px solid #f5c6cb;
  background: linear-gradient(145deg, #f8d7da 0%, #f1b0b7 100%);
  color: #721c24;
}

/* ===== ESTILOS PARA SECCIONES (COLOR AZUL) ===== */
.seccion-container {
  margin-bottom: 2rem;
  background: linear-gradient(145deg, #e3f2fd 0%, #f3f9ff 100%);
  border-radius: 16px;
  border: 2px solid rgba(33, 150, 243, 0.2);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  overflow: hidden;
  position: relative;
}

.seccion-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3, #1976d2, #0d47a1);
  border-radius: 16px 16px 0 0;
}

.seccion-header {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(33, 150, 243, 0.15);
}

.seccion-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.seccion-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seccion-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.seccion-info {
  display: flex;
  flex-direction: column;
}

.seccion-index {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1565c0;
  margin-bottom: 0.25rem;
}

.seccion-description {
  font-size: 0.85rem;
  color: #1976d2;
  font-weight: 500;
}

.btn-delete-section {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-delete-section:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.seccion-name-input {
  margin-top: 1rem;
}

.seccion-body {
  padding: 1.5rem;
  background: linear-gradient(145deg, #f3f9ff 0%, #ffffff 100%);
}

/* ===== ESTILOS PARA CAMPOS REGULARES (COLOR VERDE) ===== */
.campo-container {
  margin-bottom: 1.5rem;
  background: linear-gradient(145deg, #e8f5e8 0%, #f1f8e9 100%);
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
  overflow: hidden;
  position: relative;
}

.campo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #388e3c, #2e7d32);
  border-radius: 12px 12px 0 0;
}

.campo-header {
  background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%);
  padding: 1rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.15);
}

.campo-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.campo-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.campo-icon {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.4);
}

.campo-info {
  display: flex;
  flex-direction: column;
}

.campo-index {
  font-size: 1rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 0.2rem;
}

.campo-description {
  font-size: 0.8rem;
  color: #388e3c;
  font-weight: 500;
}

.btn-delete-field {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3);
}

.btn-delete-field:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
}

.campo-body {
  padding: 1.25rem;
  background: linear-gradient(145deg, #f1f8e9 0%, #ffffff 100%);
}

.campo-options {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
}

/* Checkbox personalizado */
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

/* Radio button personalizado */
.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2rem;
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

/* Estilos para las opciones del select en campos regulares */
.select-options-container {
  margin-top: 1.5rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  background: linear-gradient(145deg, #f1f8e9 0%, #ffffff 100%);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
}

.select-options-header {
  background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e8 100%);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.options-header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2e7d32;
  font-size: 0.95rem;
}

.select-options-body {
  padding: 1.25rem;
}

.option-item {
  margin-bottom: 1rem;
}

.option-item:last-child {
  margin-bottom: 0;
}

.modern-input-small .input-group-text {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border: none;
  color: white;
  border-radius: 8px 0 0 8px;
  width: 45px;
  justify-content: center;
  font-size: 0.9rem;
}

.modern-input-small .form-control {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0;
  padding: 0.6rem 0.9rem;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.9rem;
}

.modern-input-small .form-control:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 0.15rem rgba(76, 175, 80, 0.25);
  transform: translateY(-1px);
}

.btn-delete-option {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  border-radius: 0 8px 8px 0;
  padding: 0.6rem 0.9rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete-option:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
}

.add-option-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.add-option-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.add-option-input {
  flex: 1;
}

.btn-add-option {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-add-option:hover:not(:disabled) {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-add-option:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ===== ESTILOS PARA SUBFORMULARIOS (COLOR NARANJA) ===== */
.subform-container {
  margin-top: 1.5rem;
  background: linear-gradient(145deg, #fff3e0 0%, #ffeaa7 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 152, 0, 0.3);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
  overflow: hidden;
  position: relative;
}

.subform-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff9800, #f57c00, #e65100);
  border-radius: 12px 12px 0 0;
}

.subform-header {
  background: linear-gradient(135deg, #ffcc02 0%, #fff3e0 100%);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 152, 0, 0.2);
}

.subform-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e65100;
  font-weight: 600;
  font-size: 1rem;
}

.subform-body {
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffeaa7 0%, #ffffff 100%);
}

.subcampo-container {
  margin-bottom: 1.25rem;
  background: linear-gradient(145deg, #fff8e1 0%, #ffffff 100%);
  border-radius: 10px;
  border: 1px solid rgba(255, 152, 0, 0.2);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.subcampo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffc107, #ff9800, #f57c00);
  border-radius: 10px 10px 0 0;
}

.subcampo-header {
  background: linear-gradient(135deg, #ffecb3 0%, #fff8e1 100%);
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 152, 0, 0.15);
}

.subcampo-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subcampo-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subcampo-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
}

.subcampo-info {
  display: flex;
  flex-direction: column;
}

.subcampo-index {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e65100;
  margin-bottom: 0.1rem;
}

.subcampo-description {
  font-size: 0.75rem;
  color: #f57c00;
  font-weight: 500;
}

.btn-delete-subcampo {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.btn-delete-subcampo:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(220, 53, 69, 0.4);
}

.subcampo-body {
  padding: 1rem;
  background: linear-gradient(145deg, #ffffff 0%, #fff8e1 100%);
}

.subcampo-options {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.75rem;
}

/* Estilos para las opciones del select en subcampos */
.select-options-container.subcampo-select {
  border-color: rgba(255, 152, 0, 0.3);
  background: linear-gradient(145deg, #fff8e1 0%, #ffffff 100%);
}

.subcampo-select .select-options-header {
  background: linear-gradient(135deg, #ffecb3 0%, #fff8e1 100%);
  border-bottom-color: rgba(255, 152, 0, 0.2);
}

.subcampo-select .options-header-content {
  color: #e65100;
}

.subcampo-select .modern-input-small .input-group-text {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.subcampo-select .modern-input-small .form-control:focus {
  border-color: #ff9800;
  box-shadow: 0 0 0 0.15rem rgba(255, 152, 0, 0.25);
}

/* Botones de agregar */
.btn-add-campo,
.btn-add-subcampo,
.btn-add-seccion {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-add-campo {
  width: 100%;
  margin-top: 1.5rem;
}

.btn-add-subcampo {
  margin-top: 1rem;
}

.btn-add-seccion {
  margin-top: 1.5rem;
}

.btn-add-campo:hover,
.btn-add-subcampo:hover,
.btn-add-seccion:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(40, 167, 69, 0.4);
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

  .seccion-container {
    margin-bottom: 1.5rem;
  }

  .seccion-header {
    padding: 1rem;
  }

  .seccion-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .seccion-body {
    padding: 1rem;
  }

  .campo-container {
    margin-bottom: 1rem;
  }

  .campo-header {
    padding: 0.875rem;
  }

  .campo-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .campo-body {
    padding: 1rem;
  }

  .campo-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .subform-container {
    margin-top: 1rem;
  }

  .subform-body {
    padding: 1rem;
  }

  .subcampo-container {
    margin-bottom: 1rem;
  }

  .subcampo-header {
    padding: 0.75rem;
  }

  .subcampo-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .subcampo-body {
    padding: 0.875rem;
  }

  .subcampo-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .add-option-wrapper {
    flex-direction: column;
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

  .seccion-container {
    margin-bottom: 1rem;
  }

  .seccion-header {
    padding: 0.75rem;
  }

  .seccion-body {
    padding: 0.75rem;
  }

  .campo-container {
    margin-bottom: 0.75rem;
  }

  .campo-header {
    padding: 0.75rem;
  }

  .campo-body {
    padding: 0.75rem;
  }

  .subform-container {
    margin-top: 0.75rem;
  }

  .subform-body {
    padding: 0.75rem;
  }

  .subcampo-container {
    margin-bottom: 0.75rem;
  }

  .subcampo-header {
    padding: 0.625rem;
  }

  .subcampo-body {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .select-options-container {
    margin-top: 1rem;
  }

  .select-options-body {
    padding: 1rem;
  }

  .add-option-section {
    margin-top: 1rem;
    padding-top: 1rem;
  }
}

/* Estilos para el botón de configurar select */
.config-select-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  color: white;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.config-select-btn:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
  color: white;
}

.config-select-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

/* Estilos para el botón de eliminar configuración */
.remove-config-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

.remove-config-btn:hover {
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  color: white;
}

.remove-config-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

/* Asegurar que el modal de configuración aparezca por encima del modal de edición */
.medico-modal-backdrop {
  z-index: 1060 !important;
}

.medico-modal-content {
  z-index: 1061 !important;
}
/* Estilos para el mapa de plantilla */
.btn-mapa {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-mapa:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
}

.mapa-modal {
  height: 100vh;
  border-radius: 0;
}

.mapa-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-vista {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-vista.active,
.btn-vista:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mapa-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
}

.mapa-container {
  max-width: 1200px;
  margin: 0 auto;
}

.plantilla-nodo.principal {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.nodo-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.secciones-container {
  display: grid;
  gap: 20px;
}

.seccion-nodo {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.seccion-nodo:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.seccion-nodo .nodo-header.clickable {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.campos-container {
  padding: 20px;
  display: grid;
  gap: 15px;
}

.vista-compacta .campos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}

.campo-nodo {
  background: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #e2e8f0;
  transition: all 0.3s ease;
}

.campo-nodo:hover {
  background: #f1f5f9;
}

.campo-nodo.tipo-string { border-left-color: #3b82f6; }
.campo-nodo.tipo-number { border-left-color: #10b981; }
.campo-nodo.tipo-file { border-left-color: #f59e0b; }
.campo-nodo.tipo-date { border-left-color: #8b5cf6; }
.campo-nodo.tipo-select { border-left-color: #ef4444; }
.campo-nodo.tipo-subform { border-left-color: #6366f1; }

.campo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.campo-icon {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.campo-info {
  flex: 1;
}

.campo-info h6 {
  margin: 0;
  font-weight: 600;
  color: #1e293b;
}

.campo-tipo {
  font-size: 12px;
  color: #64748b;
}

.campo-badges {
  display: flex;
  gap: 5px;
}

.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.badge-required {
  background: #fee2e2;
  color: #dc2626;
}

.badge-filtrable {
  background: #dbeafe;
  color: #2563eb;
}

.campo-detalles {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.opciones-dinamicas,
.opciones-estaticas {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.source-info {
  background: #f1f5f9;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.opciones-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.opcion-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.subcampos-container {
  margin-top: 10px;
}

.subcampos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.subcampo-mini {
  background: white;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  border-left: 3px solid #e2e8f0;
}

.vista-compacta .campo-detalles {
  display: none;
}
</style>
