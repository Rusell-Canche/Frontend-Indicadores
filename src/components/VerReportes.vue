<template>
  <div class="ver-reportes-container">
    <!-- Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">
        <i class="fas fa-history me-2"></i>
        Historial de Reportes
      </h2>
      <p class="page-description">
        Gestiona y regenera los reportes que has creado anteriormente
      </p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filtros-section mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-5">
          <label class="form-label">Buscar reportes</label>
          <div class="input-group modern-input">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              v-model="filtroBusqueda"
              placeholder="Buscar por título, colección..."
            />
          </div>
        </div>
        
        <div class="col-md-3">
          <label class="form-label">Ordenar por</label>
          <select class="form-select" v-model="ordenSeleccionado">
            <option value="fecha_desc">Más recientes</option>
            <option value="fecha_asc">Más antiguos</option>
            <option value="titulo_asc">Título (A-Z)</option>
            <option value="titulo_desc">Título (Z-A)</option>
            <option value="documentos_desc">Más documentos</option>
            <option value="documentos_asc">Menos documentos</option>
          </select>
        </div>
        
        <div class="col-md-2">
          <label class="form-label">Items por página</label>
          <select class="form-select" v-model="itemsPorPagina">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <div class="col-md-2">
          <button class="btn btn-outline-danger w-100" @click="limpiarHistorial" title="Eliminar todo el historial">
            <i class="fas fa-trash me-1"></i> Limpiar Todo
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-file-pdf text-primary"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportesFiltrados.length }}</h4>
            <p>Reportes en historial</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-database text-success"></i>
          </div>
          <div class="stat-info">
            <h4>{{ coleccionesUnicas.length }}</h4>
            <p>Colecciones diferentes</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar text-info"></i>
          </div>
          <div class="stat-info">
            <h4>{{ reportesDelMes }}</h4>
            <p>Este mes</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-bar text-warning"></i>
          </div>
          <div class="stat-info">
            <h4>{{ totalDocumentosReporteados }}</h4>
            <p>Documentos totales</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay reportes -->
    <div v-if="reportes.length === 0" class="text-center py-5 empty-state">
      <i class="fas fa-file-pdf fa-4x text-muted mb-3"></i>
      <h4 class="text-muted">No hay reportes en el historial</h4>
      <p class="text-muted mb-4">Los reportes que generes aparecerán aquí para que puedas regenerarlos fácilmente.</p>
      <router-link to="CrearReportes" class="btn btn-primary btn-lg">
        <i class="fas fa-plus me-2"></i>Crear mi primer reporte
      </router-link>
    </div>

    <!-- Lista de reportes -->
    <div v-else-if="reportesFiltrados.length === 0" class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No se encontraron reportes</h4>
      <p class="text-muted">Intenta con otros términos de búsqueda.</p>
      <button class="btn btn-outline-secondary" @click="limpiarFiltros">
        <i class="fas fa-undo me-2"></i>Limpiar filtros
      </button>
    </div>

    <div v-else class="reportes-grid">
      <div v-for="reporte in reportesPaginados" :key="reporte.id" class="reporte-card">
        <div class="reporte-header">
          <div class="reporte-icon">
            <i class="fas fa-file-pdf text-danger"></i>
          </div>
          <div class="reporte-actions">
            <button 
              class="btn btn-sm btn-outline-danger" 
              @click="eliminarReporte(reporte.id)"
              title="Eliminar del historial"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="reporte-body">
          <h5 class="reporte-titulo">{{ reporte.titulo }}</h5>
          <p class="reporte-descripcion text-muted">
            Generado el {{ formatoFecha(reporte.fechaGeneracion) }}
          </p>
          
          <div class="reporte-info">
            <div class="info-item">
              <i class="fas fa-database me-2"></i>
              <span><strong>Colección:</strong> {{ reporte.coleccionNombre }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-file-alt me-2"></i>
              <span><strong>Documentos incluidos:</strong> {{ reporte.cantidadDocumentos }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-columns me-2"></i>
              <span><strong>Campos:</strong> {{ reporte.camposSeleccionados.length }}</span>
            </div>
            <div class="info-item" v-if="reporte.incluirFecha">
              <i class="fas fa-calendar-day me-2"></i>
              <span><strong>Incluye fecha:</strong> Sí</span>
            </div>
          </div>
          
          <!-- Campos incluidos -->
          <div class="campos-incluidos mt-3">
            <span class="badge bg-light text-dark me-1 mb-1" 
                  v-for="campo in reporte.camposSeleccionados.slice(0, 5)" 
                  :key="campo">
              {{ formatoNombreCampo(campo) }}
            </span>
            <span v-if="reporte.camposSeleccionados.length > 5" class="badge bg-secondary">
              +{{ reporte.camposSeleccionados.length - 5 }} más
            </span>
          </div>
          
          <!-- Filtros aplicados -->
          <div v-if="reporte.filtrosAplicados && reporte.filtrosAplicados.length > 0" class="filtros-section mt-3">
            <div class="filtros-badge">
              <span class="badge bg-info me-1">
                <i class="fas fa-filter me-1"></i>
                {{ reporte.filtrosAplicados.length }} filtro(s)
              </span>
            </div>
            <div class="filtros-list mt-2">
              <small class="text-muted" v-for="(filtro, index) in reporte.filtrosAplicados" :key="index">
                • {{ formatoNombreCampo(filtro.campo) }} {{ obtenerTextoOperador(filtro.operador) }} "{{ filtro.valor }}"
                <br>
              </small>
            </div>
          </div>
        </div>
        
        <div class="reporte-footer">
          <small class="text-muted">Creado: {{ formatoFechaHora(reporte.fechaGeneracion) }}</small>
          <span class="badge bg-success">Guardado localmente</span>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="reportesFiltrados.length > 0" class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted">
        Mostrando {{ inicioItem }}-{{ finItem }} de {{ reportesFiltrados.length }} reportes
      </div>
      
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: paginaActual === 1 }">
            <button class="page-link" @click="paginaActual--">
              <i class="fas fa-chevron-left"></i>
            </button>
          </li>
          <li class="page-item" v-for="pagina in paginasVisibles" :key="pagina" 
              :class="{ active: pagina === paginaActual }">
            <button class="page-link" @click="paginaActual = pagina">{{ pagina }}</button>
          </li>
          <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
            <button class="page-link" @click="paginaActual++">
              <i class="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal de confirmación para limpiar historial -->
    <div v-if="mostrarModalLimpiar" class="modal-backdrop show"></div>
    <div v-if="mostrarModalLimpiar" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Confirmar eliminación
            </h5>
            <button type="button" class="btn-close" @click="mostrarModalLimpiar = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar todo el historial de reportes?</p>
            <p class="text-muted">Esta acción no se puede deshacer y perderás todos los reportes guardados.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="mostrarModalLimpiar = false">
              <i class="fas fa-times me-1"></i> Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="confirmarLimpiarHistorial">
              <i class="fas fa-trash me-1"></i> Eliminar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerReportes',
  
  data() {
    return {
      reportes: [],
      filtroBusqueda: '',
      ordenSeleccionado: 'fecha_desc',
      itemsPorPagina: 10,
      paginaActual: 1,
      mostrarModalLimpiar: false
    }
  },

  computed: {
    // Filtra reportes por búsqueda
    reportesFiltrados() {
      let filtered = this.reportes;
      
      if (this.filtroBusqueda) {
        const searchTerm = this.filtroBusqueda.toLowerCase();
        filtered = filtered.filter(reporte => 
          reporte.titulo.toLowerCase().includes(searchTerm) ||
          reporte.coleccionNombre.toLowerCase().includes(searchTerm) ||
          reporte.camposSeleccionados.some(campo => 
            this.formatoNombreCampo(campo).toLowerCase().includes(searchTerm)
          )
        );
      }
      
      // Ordenar
      return this.ordenarReportes(filtered);
    },

    // Colecciones únicas para estadísticas
    coleccionesUnicas() {
      const colecciones = this.reportes.map(r => r.coleccionNombre);
      return [...new Set(colecciones)];
    },

    // Reportes del mes actual
    reportesDelMes() {
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const añoActual = ahora.getFullYear();
      
      return this.reportes.filter(reporte => {
        const fechaReporte = new Date(reporte.fechaGeneracion);
        return fechaReporte.getMonth() === mesActual && 
               fechaReporte.getFullYear() === añoActual;
      }).length;
    },

    // Total de documentos en todos los reportes
    totalDocumentosReporteados() {
      return this.reportes.reduce((total, reporte) => total + reporte.cantidadDocumentos, 0);
    },

    // Paginación
    totalPaginas() {
      return Math.ceil(this.reportesFiltrados.length / this.itemsPorPagina);
    },

    reportesPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + parseInt(this.itemsPorPagina);
      return this.reportesFiltrados.slice(inicio, fin);
    },

    inicioItem() {
      return (this.paginaActual - 1) * this.itemsPorPagina + 1;
    },

    finItem() {
      const fin = this.paginaActual * this.itemsPorPagina;
      return fin > this.reportesFiltrados.length ? this.reportesFiltrados.length : fin;
    },

    paginasVisibles() {
      const paginas = [];
      const total = this.totalPaginas;
      const actual = this.paginaActual;
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) paginas.push(i);
      } else {
        if (actual <= 4) {
          for (let i = 1; i <= 5; i++) paginas.push(i);
          paginas.push('...');
          paginas.push(total);
        } else if (actual >= total - 3) {
          paginas.push(1);
          paginas.push('...');
          for (let i = total - 4; i <= total; i++) paginas.push(i);
        } else {
          paginas.push(1);
          paginas.push('...');
          for (let i = actual - 1; i <= actual + 1; i++) paginas.push(i);
          paginas.push('...');
          paginas.push(total);
        }
      }
      
      return paginas;
    }
  },

  methods: {
    // Cargar reportes desde localStorage
    cargarReportes() {
      const reportesGuardados = localStorage.getItem('historialReportes');
      this.reportes = reportesGuardados ? JSON.parse(reportesGuardados) : [];
    },

    // Formatear fechas
    formatoFecha(fechaISO) {
      return new Date(fechaISO).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatoFechaHora(fechaISO) {
      return new Date(fechaISO).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Formatear nombres de campos
    formatoNombreCampo(campo) {
      return campo
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
    },

    // Ordenar reportes
    ordenarReportes(reportes) {
      return reportes.sort((a, b) => {
        switch (this.ordenSeleccionado) {
          case 'fecha_desc':
            return new Date(b.fechaGeneracion) - new Date(a.fechaGeneracion);
          case 'fecha_asc':
            return new Date(a.fechaGeneracion) - new Date(b.fechaGeneracion);
          case 'titulo_asc':
            return a.titulo.localeCompare(b.titulo);
          case 'titulo_desc':
            return b.titulo.localeCompare(a.titulo);
          case 'documentos_desc':
            return b.cantidadDocumentos - a.cantidadDocumentos;
          case 'documentos_asc':
            return a.cantidadDocumentos - b.cantidadDocumentos;
          default:
            return 0;
        }
      });
    },

    // Obtener texto del operador para mostrar
    obtenerTextoOperador(operador) {
      const operadores = {
        'equals': '=',
        'contains': 'contiene',
        'startsWith': 'inicia con',
        'endsWith': 'termina con',
        'notEquals': '≠',
        'gt': '>',
        'lt': '<'
      };
      return operadores[operador] || operador;
    },

    // Regenerar reporte (navegar a CrearReportes con la configuración)
    regenerarReporte(reporte) {
      // Guardar la configuración para que CrearReportes.vue la cargue
      localStorage.setItem('configuracionReporteARegenerar', JSON.stringify(reporte));
      
      // Navegar a la página de crear reportes
      this.$router.push('CrearReportes');
    },

    // Eliminar reporte individual
    eliminarReporte(id) {
      if (confirm('¿Estás seguro de que deseas eliminar este reporte del historial?')) {
        this.reportes = this.reportes.filter(reporte => reporte.id !== id);
        this.guardarReportes();
      }
    },

    // Limpiar filtros
    limpiarFiltros() {
      this.filtroBusqueda = '';
      this.ordenSeleccionado = 'fecha_desc';
      this.paginaActual = 1;
    },

    // Limpiar todo el historial
    limpiarHistorial() {
      this.mostrarModalLimpiar = true;
    },

    confirmarLimpiarHistorial() {
      this.reportes = [];
      this.guardarReportes();
      this.mostrarModalLimpiar = false;
      this.limpiarFiltros();
    },

    // Guardar reportes en localStorage
    guardarReportes() {
      localStorage.setItem('historialReportes', JSON.stringify(this.reportes));
    }
  },

  watch: {
    itemsPorPagina() {
      this.paginaActual = 1;
    },
    
    ordenSeleccionado() {
      this.paginaActual = 1;
    },
    
    filtroBusqueda() {
      this.paginaActual = 1;
    }
  },

  mounted() {
    this.cargarReportes();
  }
}
</script>

<style scoped>
.ver-reportes-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 1.1rem;
}

.filtros-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.modern-input {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-info h4 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.reportes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.reporte-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reporte-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.reporte-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
}

.reporte-icon {
  font-size: 2rem;
}

.reporte-actions {
  display: flex;
  gap: 0.5rem;
}

.reporte-body {
  padding: 0 1.5rem;
}

.reporte-titulo {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.reporte-descripcion {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.reporte-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-item i {
  width: 16px;
  color: #6c757d;
}

.campos-incluidos {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.filtros-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.filtros-list {
  max-height: 80px;
  overflow-y: auto;
}

.reporte-footer {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.pagination {
  margin-bottom: 0;
}

.modal-backdrop {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .reportes-grid {
    grid-template-columns: 1fr;
  }
  
  .filtros-section .row {
    flex-direction: column;
  }
  
  .filtros-section .col-md-2,
  .filtros-section .col-md-3,
  .filtros-section .col-md-5 {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>