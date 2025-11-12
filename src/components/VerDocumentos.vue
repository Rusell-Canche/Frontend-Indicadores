<!-- COMPONENTE PRINCIPAL - Reemplaza el modal inline con el componente -->
<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-text"></i>
          </div>
          <div class="header-title-section">
            <h3>Ver Documentos</h3>
            <p class="header-subtitle">Gestiona y visualiza tus documentos</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <!-- Selector de Colecciones -->
        <div class="form-section">
          <h6 class="section-title">
            <i class="fas fa-tag me-2"></i>
            Selecciona una colección
          </h6>
          <div class="row g-3">
            <div class="col-md-12">
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list-alt"></i>
                </span>
                <select
                  class="form-select"
                  v-model="selectedColeccion"
                  @change="onColeccionSelected"
                >
                  <option value="" disabled>Selecciona una colección</option>
                  <option
                    v-for="coleccion in colecciones"
                    :key="coleccion.id"
                    :value="coleccion"
                  >
                    {{ coleccion.title || coleccion.nombre_plantilla }}
                  </option>
                </select>
              </div>
              <div class="form-text">Selecciona la colección para ver sus documentos</div>
            </div>
          </div>
        </div>

        <div v-if="selectedColeccion">
          <!-- Sección de búsqueda -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-search me-2"></i>
              Buscar documentos
            </h6>
            <div class="row g-3">
              <div class="col-md-12">
                <div class="input-group modern-input">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar en documentos..."
                    v-model="palabraClave"
                  />
                </div>
                <div class="form-text">Busca por cualquier campo del documento</div>
              </div>
            </div>
          </div>
          <div v-if="selectedColeccion" class="form-section">
            <h6 class="section-title">
              <i class="fas fa-filter me-2"></i>
              Filtros avanzados
            </h6>

            <!-- Contenedor de filtros -->
            <div class="filters-container">
              <div class="row g-3">
                <!-- Filtro por campo específico -->
                <div class="col-md-4">
                  <label class="form-label">Campo a filtrar</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-list"></i>
                    </span>
                    <select
                      class="form-select"
                      v-model="filtroActivo.campo"
                      @change="onCampoFiltroChange"
                    >
                      <option value="">Seleccionar campo...</option>
                      <option
                        v-for="campo in camposFiltrables"
                        :key="campo.name"
                        :value="campo.fullPath"
                      >
                        {{ campo.displayName || campo.alias || formatFieldName(campo.name) }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Operador de filtro -->
                <div class="col-md-3" v-if="filtroActivo.campo">
                  <label class="form-label">Operador</label>
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-equals"></i>
                    </span>
                    <select class="form-select" v-model="filtroActivo.operador">
                      <option value="equals">Igual a</option>
                      <option value="contains">Contiene</option>
                      <option value="startsWith">Inicia con</option>
                      <option value="endsWith">Termina con</option>
                      <option value="notEquals">Diferente a</option>
                      <option value="gt" v-if="esCampoNumerico(filtroActivo.campo)">
                        Mayor que
                      </option>
                      <option value="lt" v-if="esCampoNumerico(filtroActivo.campo)">
                        Menor que
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Valor del filtro -->
                <div class="col-md-4" v-if="filtroActivo.campo">
                  <label class="form-label">Valor</label>

                  <!-- Si es un campo con opciones (select) -->
                  <div v-if="tieneOpciones(filtroActivo.campo)" class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-list-ul"></i>
                    </span>
                    <select class="form-select" v-model="filtroActivo.valor">
                      <option value="">Todos los valores...</option>
                      <option
                        v-for="opcion in getOpcionesDelCampo(filtroActivo.campo)"
                        :key="opcion.value"
                        :value="opcion.value"
                      >
                        {{ opcion.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Si es un campo de fecha -->
                  <div
                    v-else-if="esCampoFecha(filtroActivo.campo)"
                    class="input-group modern-input"
                  >
                    <span class="input-group-text">
                      <i class="fas fa-calendar"></i>
                    </span>
                    <input type="date" class="form-control" v-model="filtroActivo.valor" />
                  </div>

                  <!-- Campo de texto normal -->
                  <div v-else class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Valor a buscar..."
                      v-model="filtroActivo.valor"
                    />
                  </div>
                </div>

                <!-- Botón para aplicar filtro -->
                <div class="col-md-1" v-if="filtroActivo.campo">
                  <label class="form-label">&nbsp;</label>
                  <div class="d-flex gap-2">
                    <Button
                      icon="fas fa-plus"
                      @click="agregarFiltro"
                      severity="success"
                      size="small"
                      v-tooltip="'Agregar filtro'"
                      :disabled="!filtroActivo.valor"
                    />
                  </div>
                </div>
              </div>

              <!-- Filtros activos -->
              <div v-if="filtrosActivos.length > 0" class="mt-3">
                <div class="d-flex flex-wrap gap-2 align-items-center">
                  <span class="badge bg-secondary">Filtros activos:</span>
                  <Tag
                    v-for="(filtro, index) in filtrosActivos"
                    :key="index"
                    :value="`${formatFieldName(filtro.campo)}: ${filtro.valor}`"
                    severity="info"
                    class="cursor-pointer"
                  >
                    <template #default>
                      <span
                        >{{ formatFieldName(filtro.campo) }}:
                        {{ getDisplayValueForFilter(filtro) }}</span
                      >
                      <i
                        class="fas fa-times ms-2 cursor-pointer"
                        @click="eliminarFiltro(index)"
                        style="cursor: pointer"
                      ></i>
                    </template>
                  </Tag>
                  <Button
                    icon="fas fa-trash"
                    @click="limpiarTodosFiltros"
                    severity="danger"
                    size="small"
                    text
                    v-tooltip="'Limpiar todos los filtros'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla PrimeVue -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-file-text me-2"></i>
              Documentos ({{ filteredDocuments.length }})
            </h6>

            <DataTable
              :value="filteredDocuments"
              :paginator="true"
              :rows="itemsPerPage"
              :globalFilterFields="camposDocumento"
              :globalFilter="palabraClave"
              tableStyle="min-width: 50rem"
              :sortMode="'multiple'"
              removableSort
              scrollable
              scrollDirection="both"
              scrollHeight="500px"
            >
              <!-- Columnas dinámicas -->
              <Column
                v-for="campo in camposDocumento"
                :key="campo"
                :field="campo"
                :header="formatFieldName(campo)"
                :sortable="true"
              >
                <template #body="slotProps">
                  <!-- Recurso Digital -->
                  <div v-if="getCampoDefinition(campo)?.type === 'file'" class="file-badges">
                    <Button
                      icon="fa-solid  fa-eye"
                      @click=" this.mostrarModalImagen = true; this.archivo=getPrettyFieldValue(slotProps.data, campo);"
                      text
                      severity="info"
                      size="small"
                      v-tooltip="'Ver Archivo'"
                    />
                  </div>
                   
                  <!-- Estado -->
                  <Tag
                    v-else-if="campo === 'Estado'"
                    :severity="getStatusSeverity(getFieldValueFromDocument(slotProps.data, campo))"
                    :value="getFieldValueFromDocument(slotProps.data, campo)"
                  />

                                    <!-- Tabla dinamica -->
                  <div v-else-if="getCampoDefinition(campo)?.type === 'tabla'" class="file-badges">
                    <Button
                      icon="fa-solid  fa-magnifying-glass"
                      @click=" this.mostrarModalTabla = true;campoTablaActual = campo; this.tablaDinamica=getPrettyFieldValue(slotProps.data, campo); console.log('Tabla dinámica:', this.tablaDinamica);"
                      text
                      severity="info"
                      size="small"
                      v-tooltip="'Ver Tabla'"
                    />
                  </div>

                  <!-- Subformularios -->
                  <span v-else-if="getCampoDefinition(campo)?.type === 'subform'">
                    <Button
                      icon="fa-solid fa-magnifying-glass"
                      @click="
                        abrirModalSubform(getFieldValueFromDocument(slotProps.data, campo), campo)
                      "
                      text
                      severity="info"
                      size="small"
                      v-tooltip="'Ver subformulario'"
                    />
                  </span>

                  <!-- Otros campos -->
                  <span v-else >
                    {{ getPrettyFieldValue(slotProps.data, campo) || '-' }}
                  </span>
                </template>
              </Column>

              <!-- Columna de acciones -->
              <Column
                header="Acciones"
                :exportable="false"
                frozen
                alignFrozen="right"
                style="min-width: 8rem; border-left: 2px solid; background-color: azure"
              >
                <template #body="slotProps">
                  <Button
                    icon="fas fa-edit"
                    @click="editarDocumento(slotProps.data)"
                    text
                    severity="info"
                    size="small"
                    v-tooltip="'Editar documento'"
                    class="me-2"
                  />
                  <Button
                    icon="fas fa-trash-alt"
                    @click="
                      eliminarDocumento(
                        slotProps.data._id?.$oid || slotProps.data._id || slotProps.data.id,
                      )
                    "
                    text
                    severity="danger"
                    size="small"
                    v-tooltip="'Eliminar documento'"
                  />
                </template>
              </Column>

              <!-- Template para cuando no hay datos -->
              <template #empty>
                <div class="empty-state text-center py-4">
                  <div class="empty-icon">
                    <i class="fas fa-file-text" style="font-size: 3rem; color: #6c757d"></i>
                  </div>
                  <h5 class="empty-title mt-3">No se encontraron documentos</h5>
                  <p class="empty-text text-muted">
                    No hay documentos que coincidan con tu búsqueda
                  </p>
                </div>
              </template>
            </DataTable>
          </div>
          
        </div>
      </div>
    </div>


    
    <!-- REEMPLAZAR TODO EL MODAL INLINE CON EL COMPONENTE -->
    <EditDocumentModal
    :archivosarray="this.archivo"
      :is-open="isModalOpen"
      :documento="documentoParaEditar"
      :campos-plantilla="camposPlantilla"
      :selected-coleccion="selectedColeccion"
      @close="closeModal"
      @save="handleSaveDocument"
      @success="handleEditSuccess"
      @error="handleEditError"
    />
    <!-- Modal para ver subformularios - REEMPLAZAR el modal existente -->
<div v-if="showSubformModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);" aria-modal="true" role="dialog"  >
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-table me-2"></i>
          Subformulario: {{ currentSubformDefinition?.alias || currentSubformDefinition?.name }}
        </h5>
        
          <button
            v-if="currentModalLevel > 0"
            type="button"
            class="btn ms-auto"
            @click="cerrarSubformModal"
            title="Volver al nivel anterior"
            
          >
            <i class="fas fa-arrow-left"></i>
          </button>

          <button
            type="button"
            class="btn-close"
            @click="cerrarTodosLosModales"
            aria-label="Close"
          ></button>
        
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="currentSubformData.length > 0 && currentSubformDefinition?.subcampos" class="table-responsive">
          
          <!-- Tabla PrimeVue compacta -->
          <DataTable :value="currentSubformData" showGridlines responsiveLayout="scroll">
            <Column
              v-for="subcampo in currentSubformDefinition.subcampos"
              :key="subcampo.name"
              :field="subcampo.name"
              :header="subcampo.alias || subcampo.name"
            >
              <template #body="slotProps">
                <span v-if="subcampo.type === 'subform'">
                  <Button
                    icon="fa-solid fa-magnifying-glass"
                    @click="abrirModalSubform(slotProps.data[subcampo.name], subcampo.name)"
                    text
                    severity="info"
                    size="small"
                    title="Ver subformulario anidado"
                    v-tooltip="'Ver Subformulario'"
                  />
                
                </span>
                <span v-else-if="subcampo.type === 'tabla'">
                  <Button
                    icon="fa-solid fa-magnifying-glass"
                    @click="mostrarModalTabla = true; tablaDinamica = getPrettySubcampoValue(slotProps.data, subcampo.name);"
                    text
                    severity="info"
                    size="small"
                    v-tooltip="'Ver Tabla'"
                  />
                </span>
                <span v-else-if="subcampo.type === 'file'">
                  <Button
                    icon="fa-solid fa-eye"
                    @click="mostrarModalImagen = true; archivo = getPrettySubcampoValue(slotProps.data, subcampo.name);"
                    text
                    severity="info"
                    size="small"
                    v-tooltip="'Ver Archivo'"
                  />
                </span>
                <span v-else>
                  {{ getPrettySubcampoValue(slotProps.data, subcampo.name) }}
                </span>
              </template>
            </Column>
          </DataTable>

        </div>
        <div v-else class="text-muted text-center py-3">
          No hay entradas en este subformulario.
        </div>
      </div>

      <!-- Footer -->
<div class="modal-footer">
  <small v-if="currentModalLevel > 0" class="text-muted me-auto">
    <i class="fas fa-info-circle me-1"></i>
    Navegando en subformulario anidado (Nivel {{ currentModalLevel + 1 }})
  </small>
  <button type="button" class="btn btn-secondary" @click="cerrarTodosLosModales">
    Cerrar
  </button>
</div>


    </div>
  </div>
</div>




<!--Modal para mostrar Archivos Multimedia-->
<div v-if="mostrarModalImagen" class="modal fade show d-block" tabindex="-1" style="z-index:1060;background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px);" aria-modal="true" role="dialog" @click.self="cerrarModal">
  <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width: 1100px;">
    <div class="modal-content">
      
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-file me-2"></i> Archivos Multimedia
        </h5>
        <button type="button" class="btn-close" @click="cerrarModalImagen" aria-label="Close"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-0">
      
        <!-- Carrusel de Bootstrap con ref y evento -->
        <div 
          id="multimediaCarousel" 
          ref="multimediaCarousel"
          class="carousel slide" 
          data-bs-ride="false"
        >
          
          <!-- Contenido del carrusel -->
          <div class="carousel-inner">
            <div 
              v-for="(item, index) in archivosArray" 
              :key="index"
              :class="['carousel-item', { active: index === currentSlide }]"
            >
              <div class="d-flex align-items-center justify-content-center" style="min-height: 500px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 20px;">
                
                <!-- Imagen -->
                <img 
                  v-if="esImagen(item)"
                  :src="`http://127.0.0.1:8000/storage/${item}`"
                  class="d-block"
                  style="max-width: 100%; max-height: 500px; width: auto; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);"
                  alt="Imagen"
                />

                <!-- PDF -->
                <div v-else-if="esPDF(item)" class="w-100" style="height: 500px;">
                  <iframe 
                    :src="`http://127.0.0.1:8000/storage/${item}`"
                    style="width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);"
                    type="application/pdf"
                  ></iframe>
                </div>

                <!-- Video -->
                <video 
                  v-else-if="esVideo(item)"
                  controls
                  class="d-block"
                  style="max-width: 100%; max-height: 500px; width: auto; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);"
                >
                  <source :src="`http://127.0.0.1:8000/storage/${item}`" :type="obtenerTipoVideo(item)">
                  Tu navegador no soporta el elemento de video.
                </video>

                <!-- Audio -->
                <div v-else-if="esAudio(item)" class="w-100 text-center">
                  <div class="mb-4">
                    <i class="fas fa-music" style="font-size: 80px; color: #6c757d;"></i>
                  </div>
                  <audio 
                    controls
                    class="w-100"
                    style="max-width: 600px; border-radius: 8px;"
                  >
                    <source :src="`http://127.0.0.1:8000/storage/${item}`" :type="obtenerTipoAudio(item)">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                  <div class="mt-3 text-muted">
                    <small>{{ obtenerNombreArchivo(item) }}</small>
                  </div>
                </div>

                <!-- Archivo no reconocido -->
                <div v-else class="text-center">
                  <i class="fas fa-file" style="font-size: 80px; color: #6c757d;"></i>
                  <p class="mt-3 text-muted">Sin archivos</p>
                
                </div>

              </div>
            </div>
          </div>

          <!-- Controles Previous/Next -->
          <button v-if="archivosArray.length > 1" class="carousel-control-prev" type="button" @click="irASlide(currentSlide - 1)">
            <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1);"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button v-if="archivosArray.length > 1" class="carousel-control-next" type="button"  @click="irASlide(currentSlide + 1)">
            <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1);"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>

        <!-- Miniaturas -->
        <div v-if="archivosArray.length > 1" class="p-3 bg-light border-top" style="overflow-x: auto; white-space: nowrap;">
          <div class="d-inline-flex gap-2">
            <div 
              v-for="(item, index) in archivosArray" 
              :key="index"
              class="thumbnail-item"
              :class="{ 'active': index === currentSlide }"
              @click="irASlide(index)"
              style="cursor: pointer; display: inline-block;"
            >
              <div 
                style="width: 100px; height: 75px; border-radius: 8px; overflow: hidden; border: 3px solid; transition: all 0.3s ease;"
                :style="{ borderColor: index === currentSlide ? '#0d6efd' : 'transparent' }"
              >
                <!-- Miniatura imagen -->
                <img 
                  v-if="esImagen(item)"
                  :src="`http://127.0.0.1:8000/storage/${item}`"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  alt="miniatura"
                />
                <!-- Icono PDF -->
                <div v-else-if="esPDF(item)" class="d-flex align-items-center justify-content-center h-100 bg-danger bg-opacity-10">
                  <i class="fas fa-file-pdf" style="font-size: 32px; color: #dc3545;"></i>
                </div>
                <!-- Icono Video -->
                <div v-else-if="esVideo(item)" class="d-flex align-items-center justify-content-center h-100 bg-primary bg-opacity-10">
                  <i class="fas fa-video" style="font-size: 32px; color: #0d6efd;"></i>
                </div>
                <!-- Icono Audio -->
                <div v-else-if="esAudio(item)" class="d-flex align-items-center justify-content-center h-100 bg-success bg-opacity-10">
                  <i class="fas fa-music" style="font-size: 32px; color: #198754;"></i>
                </div>
                <!-- Icono genérico -->
                <div v-else class="d-flex align-items-center justify-content-center h-100 bg-secondary bg-opacity-10">
                  <i class="fas fa-file" style="font-size: 32px; color: #6c757d;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="cerrarModalImagen">
          <i class="fas fa-times me-2"></i>Cerrar
        </button>
      </div>
    </div>
  </div>
</div>





<!-- Modal: Vista Tabla dinámica -->
<div v-if="mostrarModalTabla" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);" aria-modal="true" role="dialog" @click.self="cerrarModal">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-table me-2"></i> Tabla dinámica
        </h5>
        <button type="button" class="btn-close" @click="cerrarModalTabla" aria-label="Close"></button>
      </div>
<!-- Body -->
<div class="modal-body text-center">

  <!-- Tabla Dinámica Unificada -->
  <DataTable
    v-if="tablaDinamica && tablaDinamica.length"
    :value="tablaDinamica"
    showGridlines
    responsiveLayout="scroll"
  >
    <Column
      v-for="key in Object.keys(tablaDinamica[0]).filter(k => k !== '_documentId')"
      :key="key"
      :field="key"
      :header="key"
    >
    
      <template #body="slotProps">
        <!-- Buscar el campo correspondiente dentro de la definición -->
        <template
          v-if="getCampoDefinition(campoTablaActual)?.tableConfig?.campos?.find(c => c.name === key)?.type === 'file'"
        >
          <div class="file-badges">
            <Button
              icon="fa-solid fa-eye"
              @click="mostrarModalImagen = true; archivo = slotProps.data[key]"
              text
              severity="info"
              size="small"
              v-tooltip="'Ver Archivo'"
            />
          </div>
        </template>
        <template v-else>
          {{ slotProps.data[key] }}
        </template>
      </template>
    </Column>
  </DataTable>

</div>


      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="cerrarModalTabla">
          Cerrar
        </button>
      </div>

    </div>
  </div>
</div>

  </div>
</template>

<script>
import Galleria from 'primevue/galleria'
import api, { storage } from '@/services/api'
import axios from 'axios'
import Swal from 'sweetalert2'
import EditDocumentModal from './EditDocumentModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'GaleriaImagenes',
  name: 'VerDocumentos',

  components: {
    Galleria,
    EditDocumentModal,
    DataTable,
    Column,
    InputText,
    IconField,
    InputIcon,
    Button,
    Tag,
  },

  data() {
    return {
      //para mostrar la tabla dinamica
      tablaDinamica:null,
      mostrarModalTabla: false,
      campoTablaActual:"",

      //para mostrar la imagen de archivo
       currentSlide: 0,
      mostrarModalImagen: false,
      archivo:null,
       carouselInstance: null,
      // Por estas que manejan múltiples niveles:
      modalStack: [], // Array que contiene información de cada modal abierto
      currentModalLevel: -1, // Índice del modal actual

      //para componente de galleria 
       responsiveOptions: [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
      ],

      // Estado principal
      colecciones: [],
      selectedColeccion: null,
      documentos: [],
      palabraClave: '',

      // Campos y plantillas (memoizados)
      camposDocumento: [],
      camposPlantilla: [],

      // Paginación
      currentPage: 1,
      itemsPerPage: 10,

      // Modal de edición
      isModalOpen: false,
      documentoParaEditar: {},

      // Estados de carga
      loading: {
        colecciones: false,
        documentos: false,
      },
      // Filtros dinámicos
      filtroActivo: {
        campo: '',
        operador: 'equals',
        valor: '',
      },
      filtrosActivos: [],
    }
  },

  computed: {
    // Computed property para obtener campos filtrables
     archivosArray() {
    return Array.isArray(this.archivo) ? this.archivo : [this.archivo];
  },
      imagenesParaGaleria() {
    return this.archivo.map(ruta => ({
      itemImageSrc: `http://127.0.0.1:8000/storage/${ruta}`,
      thumbnailImageSrc: `http://127.0.0.1:8000/storage/${ruta}`, // misma imagen
      alt: 'Imagen'
    }));
  },
    camposFiltrables() {
      if (!this.camposPlantilla?.secciones) return []

      const campos = []

      this.camposPlantilla.secciones.forEach((seccion) => {
        if (seccion.fields) {
          seccion.fields.forEach((campo) => {
            // Campos normales (no subforms y no archivos)
            if (campo.type !== 'subform' && campo.type !== 'file') {
              campos.push({
                ...campo,
                displayName: campo.alias || campo.name,
                fullPath: campo.name,
              })
            }

            // Campos dentro de subformularios (primer nivel)
            if (campo.type === 'subform' && campo.subcampos) {
              campo.subcampos.forEach((subcampo) => {
                if (subcampo.type !== 'subform' && subcampo.type !== 'file') {
                  campos.push({
                    ...subcampo,
                    displayName: `${campo.alias || campo.name} → ${subcampo.alias || subcampo.name}`,
                    fullPath: `${campo.name}.${subcampo.name}`,
                    parentSubform: campo.name,
                  })
                }

                // Campos dentro de subformularios anidados (segundo nivel)
                if (subcampo.type === 'subform' && subcampo.subcampos) {
                  subcampo.subcampos.forEach((subsubcampo) => {
                    if (subsubcampo.type !== 'subform' && subsubcampo.type !== 'file') {
                      campos.push({
                        ...subsubcampo,
                        displayName: `${campo.alias || campo.name} → ${subcampo.alias || subcampo.name} → ${subsubcampo.alias || subsubcampo.name}`,
                        fullPath: `${campo.name}.${subcampo.name}.${subsubcampo.name}`,
                        parentSubform: campo.name,
                        parentSubSubform: subcampo.name,
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })

      return campos
    },
    // Computed properties para acceder al modal actual
    showSubformModal() {
      return this.currentModalLevel >= 0
    },

    currentSubformData() {
      return this.currentModalLevel >= 0 ? this.modalStack[this.currentModalLevel].data : []
    },

    currentSubformDefinition() {
      return this.currentModalLevel >= 0 ? this.modalStack[this.currentModalLevel].definition : null
    },

    filteredDocuments() {
      let documentos = [...this.documentos]

      // Aplicar filtros dinámicos primero
      if (this.filtrosActivos.length > 0) {
        documentos = documentos.filter((doc) => {
          return this.filtrosActivos.every((filtro) => {
            // Obtener el valor del documento para el campo del filtro
            const valor = this.getFieldValueFromDocument(doc, filtro.campo)
            return this.aplicarFiltro(valor, filtro)
          })
        })
      }

      // Luego aplicar búsqueda por palabra clave
      if (this.palabraClave.trim()) {
        const searchTerm = this.palabraClave.toLowerCase()
        documentos = documentos.filter((doc) => {
          const matchInVisibleFields = this.camposDocumento.some((campo) => {
            const valor = this.getFieldValueFromDocument(doc, campo)
            return valor && String(valor).toLowerCase().includes(searchTerm)
          })
          const matchInId = doc._id && String(doc._id).toLowerCase().includes(searchTerm)
          return matchInVisibleFields || matchInId
        })
      }

      return documentos
    },

    paginatedDocumentos() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredDocuments.slice(start, start + this.itemsPerPage)
    },

    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage)
    },

    nombreColeccion() {
      return this.selectedColeccion?.nombre_coleccion || null
    },
  },

  watch: {
    // Resetear página cuando cambie la búsqueda
    palabraClave() {
      this.currentPage = 1
    },
  },

  // En tu archivo VerDocumentos.vue, reemplaza la sección de methods con esto:

  methods: {
    
     esImagen(ruta) {
      console.log("Archivos array", this.archivosArray)
    const ext = ruta.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
  },
  
  esPDF(ruta) {
    return ruta.toLowerCase().endsWith('.pdf');
  },
  
  esVideo(ruta) {
    const ext = ruta.toLowerCase().split('.').pop();
    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext);
  },
  
  esAudio(ruta) {
    const ext = ruta.toLowerCase().split('.').pop();
    return ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(ext);
  },
  
  obtenerTipoVideo(ruta) {
    const ext = ruta.toLowerCase().split('.').pop();
    const tipos = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska'
    };
    return tipos[ext] || 'video/mp4';
  },
  
  obtenerTipoAudio(ruta) {
    const ext = ruta.toLowerCase().split('.').pop();
    const tipos = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'm4a': 'audio/mp4',
      'flac': 'audio/flac'
    };
    return tipos[ext] || 'audio/mpeg';
  },
  
  obtenerNombreArchivo(ruta) {
    return ruta.split('/').pop();
  },
  
 irASlide(index) {
    if (index < 0) {
      this.currentSlide = this.archivosArray.length - 1;
    } else if (index >= this.archivosArray.length) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = index;
    }
  },
  
  cerrarModalImagen() {
    this.mostrarModalImagen = false;
    this.currentSlide = 0;
    this.archivo = null
  },
    // ========== MÉTODOS EXISTENTES ==========
    getStatusSeverity(estado) {
      switch (estado) {
        case 'Activo':
          return 'success'
        case 'Pendiente':
          return 'warning'
        default:
          return 'info'
      }
    },

    // ========== SUBFORMULARIOS - MÉTODOS CORREGIDOS ==========
    abrirModalSubform(contenido, fieldName) {
      console.log('=== ABRIENDO MODAL SUBFORM ===')
      console.log('Contenido recibido:', contenido)
      console.log('Field name:', fieldName)
      console.log('Nivel actual antes de abrir:', this.currentModalLevel)

      // Buscar la definición del subcampo
      let subformDefinition = null
      if (this.currentModalLevel >= 0) {
        const currentDef = this.currentSubformDefinition
        if (currentDef?.subcampos) {
          subformDefinition = currentDef.subcampos.find((f) => f.name === fieldName)
        }
      }
      if (!subformDefinition) {
        subformDefinition = this.getCampoDefinition(fieldName)
      }
      if (!subformDefinition) {
        console.error('No se encontró definición para el campo:', fieldName)
        return
      }

      // Inicializar datos correctamente
      let modalData = []
      if (Array.isArray(contenido) && contenido.length > 0) {
        // Solo tomar filas válidas que tengan al menos un valor
        modalData = contenido.filter((row) =>
          Object.values(row).some((val) => val !== null && val !== ''),
        )
      } else if (subformDefinition?.subcampos) {
        // Crear un objeto base con los campos del subform
        const baseObj = {}
        subformDefinition.subcampos.forEach((sc) => (baseObj[sc.name] = sc.default || null))
        modalData = [baseObj]
      }

      const newModalData = {
        data: modalData,
        definition: subformDefinition,
        fieldName: fieldName,
      }

      this.modalStack.push(newModalData)
      this.currentModalLevel = this.modalStack.length - 1

      console.log('Modal agregado al stack')
      console.log('Nuevo nivel:', this.currentModalLevel)
      console.log('Stack actual:', this.modalStack)
      console.log('Datos del nuevo modal:', newModalData)
    },

    cerrarSubformModal() {
      console.log('=== CERRANDO MODAL ===')
      console.log('Nivel actual antes de cerrar:', this.currentModalLevel)

      if (this.currentModalLevel >= 0) {
        // Remover el modal actual del stack
        this.modalStack.pop()
        this.currentModalLevel = this.modalStack.length - 1

        console.log('Modal cerrado, nuevo nivel:', this.currentModalLevel)
        console.log('Stack después de cerrar:', this.modalStack)
      }
    },

    cerrarModalTabla() {
      this.mostrarModalTabla = false
      this.tablaDinamica = null
    },

  
    cerrarTodosLosModales() {
      console.log('=== CERRANDO TODOS LOS MODALES ===')
      this.modalStack = []
      this.currentModalLevel = -1
      console.log('Todos los modales cerrados')
    },

    // Método actualizado para obtener subcampo del modal actual
    getCurrentSubcampoWithOptions(subcampoName) {
      const currentDef = this.currentSubformDefinition
      if (!currentDef?.subcampos) return null
      return currentDef.subcampos.find((s) => s.name === subcampoName) || null
    },

    // Método actualizado para mostrar valores bonitos
    getPrettySubcampoValue(row, subcampoName) {
      const subcampoDef = this.getCurrentSubcampoWithOptions(subcampoName)
      const valor = row[subcampoName]

      if (!valor || valor === 'null') return '-'

       // Si es campo de fecha
      if (subcampoDef?.type === 'date' && valor) {
        return this.formatoFecha(valor)
      }

      if (subcampoDef?.options && Array.isArray(subcampoDef.options)) {
        const option = subcampoDef.options.find((o) => o.campoGuardar === valor)
        return option ? option.campoMostrar : valor
      }

      return valor
    },

    // ========== API CALLS ==========

    async apiCall(endpoint, options = {}) {
      const token = localStorage.getItem('apiToken')
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        ...options,
      }

      try {
        const response = await axios(endpoint, config)
        return response.data
      } catch (error) {
        console.error(`API Error on ${endpoint}:`, error)
        throw error
      }
    },

    async getColecciones() {
      if (this.loading.colecciones) return

      this.loading.colecciones = true
      try {
        this.colecciones = await this.apiCall('http://127.0.0.1:8000/api/documentos/plantillas-redable')
      } catch (error) {
        this.showError('No se pudieron cargar las colecciones')
      } finally {
        this.loading.colecciones = false
      }
    },

    async getCamposPlantilla(plantillaId) {
      try {
        const response = await this.apiCall(
          `http://127.0.0.1:8000/api/plantillas/${plantillaId}/secciones`,
        )

        // Verificar si la respuesta tiene la estructura esperada con secciones
        if (response?.secciones && Array.isArray(response.secciones)) {
          return response
        } else if (response?.campos && Array.isArray(response.campos)) {
          // Mantener compatibilidad con estructura anterior
          return response.campos
        } else if (Array.isArray(response)) {
          // Mantener compatibilidad con estructura anterior
          return response
        }

        console.warn('Estructura de respuesta inesperada:', response)
        return { secciones: [] }
      } catch (error) {
        console.error('Error obteniendo campos de plantilla:', error)
        return { secciones: [] }
      }
    },

    async obtenerDocumentos() {
      if (!this.selectedColeccion || this.loading.documentos) return

      this.loading.documentos = true
      try {
        // Obtener campos de plantilla y documentos en paralelo
        const [camposPlantilla, documentos] = await Promise.all([
          this.getCamposPlantilla(this.selectedColeccion.id),
          this.apiCall(`http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.id}`),
        ])

        this.camposPlantilla = camposPlantilla
        this.documentos = documentos
        this.currentPage = 1

        // DEBUGGING: Verificar qué datos tenemos
        console.log('=== DEBUGGING DATOS ===')
        console.log('Campos plantilla recibidos:', camposPlantilla)
        console.log('Documentos recibidos:', documentos)
        console.log('Primer documento:', documentos[0])
        console.log(
          'Propiedades del primer documento:',
          documentos[0] ? Object.keys(documentos[0]) : 'Sin documentos',
        )

        this.procesarCamposDocumento()

        // DEBUGGING: Verificar campos procesados
        console.log('Campos documento procesados:', this.camposDocumento)

        // DEBUGGING: Verificar si los campos existen en los documentos
        if (documentos[0] && this.camposDocumento.length > 0) {
          console.log('=== VERIFICACIÓN DE CAMPOS ===')
          this.camposDocumento.forEach((campo) => {
            console.log(`Campo "${campo}":`, documentos[0][campo])
          })
        }
      } catch (error) {
        this.documentos = []
        this.camposDocumento = []
        this.showError('Error al cargar los documentos')
      } finally {
        this.loading.documentos = false
      }
    },

    handleEditSuccess() {
      Swal.fire('Éxito', 'El documento fue editado correctamente', 'success')
      this.obtenerDocumentos() // Refresca los documentos si hace falta
      this.closeModal()
    },

    handleEditError(error) {
      console.error('Error al editar:', error)
      Swal.fire('Error', 'Hubo un problema al guardar el documento', 'error')
    },

    // ========== PROCESAMIENTO DE DATOS ==========
    procesarCamposDocumento() {
      // Verificar si tenemos la nueva estructura con secciones
      if (this.camposPlantilla?.secciones && Array.isArray(this.camposPlantilla.secciones)) {
        this.procesarCamposConSecciones()
      } else {
        this.camposDocumento = []
      }
    },

    procesarCamposConSecciones() {
      // Extraer todos los campos de todas las secciones
      const todosLosCampos = []

      console.log('=== PROCESANDO SECCIONES ===')
      console.log('Secciones disponibles:', this.camposPlantilla.secciones)

      this.camposPlantilla.secciones.forEach((seccion, index) => {
        console.log(`Sección ${index + 1} (${seccion.nombre}):`, seccion.fields)

        if (seccion.fields && Array.isArray(seccion.fields)) {
          seccion.fields.forEach((campo) => {
            // Agregamos todos los campos, incluso subforms
            todosLosCampos.push(campo)
            console.log(
              `  - Campo agregado: ${campo.name} (type: ${campo.type}, required: ${campo.required})`,
            )
          })
        }
      })

      // Devolver todos los names
      this.camposDocumento = todosLosCampos.map((campo) => campo.name)
      console.log('=== RESULTADO PROCESAMIENTO ===')
      console.log('Total campos encontrados:', todosLosCampos.length)
      console.log('Campos seleccionados para mostrar:', this.camposDocumento)
    },

    getFieldValueFromDocument(documento, fieldPath) {
      console.log('Obteniendo valor para:', fieldPath)

      // Si no es un path con puntos, buscar directamente
      if (!fieldPath.includes('.')) {
        // Buscar en secciones primero
        if (documento.secciones) {
          for (const seccion of documento.secciones) {
            if (seccion.fields && seccion.fields.hasOwnProperty(fieldPath)) {
              return seccion.fields[fieldPath]
            }
          }
        }
        // Buscar directamente en el documento
        return documento[fieldPath]
      }

      // Para paths con puntos (subformularios anidados)
      const pathParts = fieldPath.split('.')
      let currentValue = documento

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]

        if (currentValue === null || currentValue === undefined) {
          return null
        }

        // Buscar en secciones si existe
        if (currentValue.secciones) {
          let foundInSecciones = false
          for (const seccion of currentValue.secciones) {
            if (seccion.fields && seccion.fields.hasOwnProperty(part)) {
              currentValue = seccion.fields[part]
              foundInSecciones = true
              break
            }
          }
          if (!foundInSecciones) {
            currentValue = currentValue[part]
          }
        } else {
          currentValue = currentValue[part]
        }

        // Si es un array y no es el último elemento del path, tomar el primer elemento
        if (Array.isArray(currentValue) && i < pathParts.length - 1) {
          if (currentValue.length > 0) {
            // Para filtros, necesitamos verificar todos los elementos
            // Pero para obtener un valor específico, tomamos el primero
            currentValue = currentValue[0]
          } else {
            return null
          }
        }
      }

      return currentValue
    },

    // ========== CAMPO HELPERS - MÉTODO MEJORADO ==========
    getDisplayValue(value) {
      if (value === null || value === undefined || value === '' || value === 'null') {
        return '-'
      }
      return value
    },

    /**
     * Busca la definición de un campo (MÉTODO MEJORADO)
     */
    getCampoDefinition(fieldPath) {
      console.log('=== BUSCANDO DEFINICIÓN DE CAMPO ===')
      console.log('Campo/Path buscado:', fieldPath)

      if (!this.camposPlantilla?.secciones) {
        console.log('No hay secciones en camposPlantilla')
        return null
      }

      // Si es un path simple (sin puntos), buscar en campos principales
      if (!fieldPath.includes('.')) {
        for (const seccion of this.camposPlantilla.secciones) {
          if (seccion.fields && Array.isArray(seccion.fields)) {
            const campo = seccion.fields.find((f) => f.name === fieldPath)
            if (campo) {
              console.log('Campo encontrado en plantilla principal:', campo)
              return campo
            }
          }
        }
      } else {
        // Si es un path con puntos, dividir y buscar en subformularios
        const pathParts = fieldPath.split('.')

        for (const seccion of this.camposPlantilla.secciones) {
          if (seccion.fields && Array.isArray(seccion.fields)) {
            // Buscar el campo principal (subformulario)
            const campoSubform = seccion.fields.find((f) => f.name === pathParts[0])
            if (campoSubform && campoSubform.type === 'subform' && campoSubform.subcampos) {
              if (pathParts.length === 2) {
                // Primer nivel de subformulario
                const subcampo = campoSubform.subcampos.find((sc) => sc.name === pathParts[1])
                if (subcampo) {
                  console.log('Subcampo encontrado (nivel 1):', subcampo)
                  return subcampo
                }
              } else if (pathParts.length === 3) {
                // Segundo nivel de subformulario
                const subcampo = campoSubform.subcampos.find((sc) => sc.name === pathParts[1])
                if (subcampo && subcampo.type === 'subform' && subcampo.subcampos) {
                  const subsubcampo = subcampo.subcampos.find((ssc) => ssc.name === pathParts[2])
                  if (subsubcampo) {
                    console.log('Sub-subcampo encontrado (nivel 2):', subsubcampo)
                    return subsubcampo
                  }
                }
              }
            }
          }
        }
      }

      console.log('Campo no encontrado')
      return null
    },

    /**
     * Obtiene un valor "bonito" para mostrar en la tabla
     */
    getPrettyFieldValue(documento, fieldName) {
      // Consigue el valor puro del campo
      const valor = this.getFieldValueFromDocument(documento, fieldName)
      
      // Si el valor es nullo retorna null
      if (valor == null) return '-'

      // Busca la definición del campo
      const campo = this.getCampoDefinition(fieldName)
      if (!campo) return valor

      // Si es subform, solo mostrar el nombre del campo (no su contenido)
      if (campo.type === 'subform') {
        return campo.name
      }

      // Si es campo de fecha
      if (campo.type === 'date' && valor) {
        return this.formatoFecha(valor)
      }

      // Si el campo es dinámico (select con campoGuardar/campoMostrar)
      if (campo.options && Array.isArray(campo.options)) {
        const option = campo.options.find((o) => o.campoGuardar === valor)
        return option ? option.campoMostrar : valor
      }

      // Si es manual o normal, lo mostramos directo
      return valor
    },

    formatoFecha(dateString) {
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString // Si es inválida, devolver original

        // Formato usando toLocaleString
        return date
          .toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')
      } catch (e) {
        return dateString
      }
    },

    formatFieldName(fieldName) {
      const fieldMap = {
        created_at: 'Fecha de creación',
        updated_at: 'Última actualización',
      }

      return (
        fieldMap[fieldName] ||
        fieldName
          .replace(/_/g, ' ')
          .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      )
    },

    // ========== MODAL DE EDICIÓN ==========
editarDocumento(documento) {
  // 1. Asignar el documento
  this.documentoParaEditar = { ...documento };

  // 2. Asignar los archivos a `this.archivo` (que es la fuente de `archivosArray`)
  this.archivo = documento.archivo; // o documento.archivos, según tu campo real

  // 3. Abrir el modal
  this.isModalOpen = true;
  console.log("Arregloe de rutas con archivosArray",this.archivosArray)
  console.log("Arreglo de rutas con this archivo",this.archivo)
  console.log("Arreglo de rutas con this documento",this.documento.secciones[0].fields.Imagen)
    console.log("Arreglo de rutas con this documento a editar",this.documentoParaEditar)
},
    closeModal() {
      this.isModalOpen = false
      this.documentoParaEditar = {}
    },

    // ========== MANEJADORES DEL MODAL ==========
    async handleSaveDocument(formData) {
      const token = localStorage.getItem('apiToken')
      if (!token) {
        this.showError('No estás autenticado')
        return
      }

      const docId =
        this.documentoParaEditar._id?.$oid ||
        this.documentoParaEditar._id ||
        this.documentoParaEditar.id
      if (!docId) {
        this.showError('ID de documento inválido')
        return
      }

      try {
        console.log('Informacion que se manda a la api')
        for (let pair of formData.entries()) {
          console.log(pair[0], ':', pair[1])
        }
        const response = await axios.post(
          `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${docId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        this.showSuccess('Documento actualizado correctamente')
        this.closeModal()
        await this.obtenerDocumentos()
      } catch (error) {
        console.error('Error completo:', error.response)
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Hubo un problema al actualizar el documento'
        this.showError(errorMsg)
      }
    },

    // ========== ELIMINACIÓN ==========
    async eliminarDocumento(documentoId) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await this.apiCall(
          `http://127.0.0.1:8000/api/documentos/${this.selectedColeccion.nombre_coleccion}/${documentoId}`,
          { method: 'DELETE' },
        )

        this.documentos = this.documentos.filter(
          (doc) => doc._id?.$oid || doc._id || doc.id !== documentoId,
        )
        this.showSuccess('El documento se ha eliminado exitosamente.')
      } catch (error) {
        this.showError('Hubo un problema al eliminar el documento.')
      }
    },

    // ========== UI HELPERS ==========
    changePage(page) {
      this.currentPage = page
    },

    async onColeccionSelected() {
      if (this.selectedColeccion) {
        await this.obtenerDocumentos()
      } else {
        this.resetDocumentData()
      }
    },

    resetDocumentData() {
      this.documentos = []
      this.camposDocumento = []
      this.camposPlantilla = []
      this.filtrosActivos = []
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },

    showSuccess(message) {
      Swal.fire({
        title: 'Éxito',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d',
      })
    },

    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d',
      })
    },

    // ========== MÉTODOS PARA FILTROS DINÁMICOS ==========

    onCampoFiltroChange() {
      // Resetear operador y valor cuando cambia el campo
      this.filtroActivo.operador = 'equals'
      this.filtroActivo.valor = ''
    },

    esCampoNumerico(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      return campo && ['number', 'integer'].includes(campo.type)
    },

    esCampoFecha(nombreCampo) {
      const campo = this.getCampoDefinition(nombreCampo)
      return campo && campo.type === 'date'
    },

    tieneOpciones(nombreCampo) {
  const campo = this.getCampoDefinition(nombreCampo)
  return campo && campo.options && Array.isArray(campo.options) && campo.options.length > 0
},

    getOpcionesDelCampo(nombreCampo) {
  const campo = this.getCampoDefinition(nombreCampo)
  if (!campo || !campo.options || !Array.isArray(campo.options)) return []

  if (campo.options.length === 0) return []

  const primerElemento = campo.options[0]

  // Select dinámico: [{"campoGuardar": "id", "campoMostrar": "texto"}]
  if (typeof primerElemento === 'object' && primerElemento !== null) {
    return campo.options.map((opcion) => ({
      value: opcion.campoGuardar || opcion.value || opcion,
      label: opcion.campoMostrar || opcion.label || opcion.campoGuardar || opcion.value || opcion,
    }))
  }

  // Select manual
  if (typeof primerElemento === 'string') {
    return campo.options.map((opcion) => ({
      value: opcion,
      label: opcion,
    }))
  }

  return []
},

    agregarFiltro() {
      if (!this.filtroActivo.campo || !this.filtroActivo.valor) return

      // Verificar si ya existe un filtro para este campo
      const existeIndex = this.filtrosActivos.findIndex((f) => f.campo === this.filtroActivo.campo)

      if (existeIndex >= 0) {
        // Reemplazar filtro existente
        this.filtrosActivos.splice(existeIndex, 1, { ...this.filtroActivo })
      } else {
        // Agregar nuevo filtro
        this.filtrosActivos.push({ ...this.filtroActivo })
      }

      // Resetear filtro activo
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },

    eliminarFiltro(index) {
      this.filtrosActivos.splice(index, 1)
    },

    limpiarTodosFiltros() {
      this.filtrosActivos = []
      this.filtroActivo = {
        campo: '',
        operador: 'equals',
        valor: '',
      }
    },

    aplicarFiltro(valor, filtro) {
      // Si es un array (subformulario), verificar si algún elemento cumple el filtro
      if (Array.isArray(valor)) {
        return valor.some((item) => {
          // Si el campo es anidado (tiene puntos), necesitamos obtener el valor correcto
          if (filtro.campo.includes('.')) {
            const pathParts = filtro.campo.split('.')
            // Obtener el campo específico del item
            const campoEspecifico = pathParts[pathParts.length - 1]
            const valorItem = item[campoEspecifico]
            return this.aplicarFiltroSimple(valorItem, filtro)
          } else {
            return this.aplicarFiltroSimple(item, filtro)
          }
        })
      }

      return this.aplicarFiltroSimple(valor, filtro)
    },

    // Nuevo método para aplicar filtro a valores simples
    aplicarFiltroSimple(valor, filtro) {
  if (valor === null || valor === undefined) {
    return false
  }

  // Obtener la definición del campo para ver si es un select dinámico
  const campo = this.getCampoDefinition(filtro.campo)
  
  let valorADocumento = valor
  let valorBFiltro = filtro.valor

  // Si es un select dinámico, convertir campoGuardar a campoMostrar para la comparación
  if (campo && campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
    const primerElemento = campo.options[0]
    
    // Si es select dinámico (objetos con campoGuardar/campoMostrar)
    if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
      // Convertir el valor del documento (campoGuardar) a campoMostrar
      const opcionDoc = campo.options.find(o => o.campoGuardar === valor)
      if (opcionDoc) {
        valorADocumento = opcionDoc.campoMostrar || valor
      }
      
      // Convertir el valor del filtro (campoGuardar) a campoMostrar
      const opcionFiltro = campo.options.find(o => o.campoGuardar === filtro.valor)
      if (opcionFiltro) {
        valorBFiltro = opcionFiltro.campoMostrar || filtro.valor
      }
    }
    // Si es select manual (array de strings), no hacemos conversión
  }

  const valorString = String(valorADocumento).toLowerCase()
  const filtroValor = String(valorBFiltro).toLowerCase()

  switch (filtro.operador) {
    case 'equals':
      return valorString === filtroValor
    case 'contains':
      return valorString.includes(filtroValor)
    case 'startsWith':
      return valorString.startsWith(filtroValor)
    case 'endsWith':
      return valorString.endsWith(filtroValor)
    case 'notEquals':
      return valorString !== filtroValro
    case 'gt':
      return parseFloat(valor) > parseFloat(filtro.valor)
    case 'lt':
      return parseFloat(valor) < parseFloat(filtro.valor)
    default:
      return true
  }
},

    getDisplayValueForFilter(filtro) {
  // Buscar la definición del campo
  const campo = this.getCampoDefinition(filtro.campo)

  if (!campo) {
    return filtro.valor
  }

  // Si tiene opciones y es select dinámico
  if (campo.options && Array.isArray(campo.options) && campo.options.length > 0) {
    const primerElemento = campo.options[0]
    
    // Select dinámico (objetos con campoGuardar/campoMostrar)
    if (typeof primerElemento === 'object' && primerElemento.campoGuardar) {
      const opcion = campo.options.find(o => o.campoGuardar === filtro.valor)
      return opcion ? opcion.campoMostrar : filtro.valor
    }
    
    // Select manual (array de strings)
    if (typeof primerElemento === 'string') {
      return filtro.valor // Ya es el texto que queremos mostrar
    }
  }

  return filtro.valor
},
  },

  mounted() {
    this.getColecciones()
    
    
  },
}
</script>

<style scoped>
.medico-header{
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}
.modern-input .input-group-text{
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}
.form-section::before{
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}
</style>