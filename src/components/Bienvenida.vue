<template>
  <div class="bienvenida-container">
    <!-- Contenido principal de bienvenida -->
    <div class="contenido-principal">
      <!-- Header de bienvenida -->
      <div class="header-bienvenida">
        <div class="saludo-principal">
          <h1 class="titulo-bienvenida">¡Bienvenido de vuelta!</h1>
          <p class="subtitulo-bienvenida">
            Gestiona tu sistema de manera eficiente desde este panel de control
          </p>
        </div>
        <div class="fecha-hora">
          <div class="fecha">{{ fechaActual }}</div>
          <div class="hora">{{ horaActual }}</div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="estadisticas-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalIndicadores }}</div>
            <div class="stat-label">Indicadores Activos</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalDocumentos }}</div>
            <div class="stat-label">Documentos</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalUsuarios }}</div>
            <div class="stat-label">Usuarios Activos</div>
          </div>
        </div>
      </div>

      <!-- Accesos rápidos -->
      <div class="accesos-rapidos">
        <h2 class="seccion-titulo">Accesos Rápidos</h2>
        <div class="accesos-grid">
          <div class="acceso-card" @click="$router.push('/Indicador')">
            <div class="acceso-icon">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="acceso-content">
              <h3>Crear Indicador</h3>
              <p>Añade nuevos indicadores al sistema</p>
            </div>
            <div class="acceso-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="acceso-card" @click="$router.push('/Documentos')">
            <div class="acceso-icon">
              <i class="fas fa-upload"></i>
            </div>
            <div class="acceso-content">
              <h3>Subir Documento</h3>
              <p>Carga nuevos archivos al repositorio</p>
            </div>
            <div class="acceso-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
          <div class="acceso-card" @click="$router.push('/Usuarios')">
            <div class="acceso-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <div class="acceso-content">
              <h3>Gestionar Usuarios</h3>
              <p>Administra permisos y accesos</p>
            </div>
            <div class="acceso-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel lateral de opciones -->
    <div class="panel-opciones">
      <div class="opciones-header">
        <h3>Informacion del Sistema</h3>
        <p>configuraciones</p>
      </div>

      <!-- Información del sistema -->
      <div class="sistema-info">
        <div class="info-item">
          <div class="info-label">Versión del Sistema</div>
          <div class="info-value">v2.1.4</div>
        </div>
        <div class="info-item">
          <div class="info-label">Última Actualización</div>
          <div class="info-value">Hace 2 días</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estado del Servidor</div>
          <div class="info-value status-online">
            <span class="status-dot"></span>
            En línea
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      fechaActual: '',
      horaActual: '',
      intervalId: null,
      totalIndicadores: 0,
      totalUsuarios: 0,
      totalDocumentos: 0,
    }
  },
  mounted() {
    this.actualizarFechaHora()
    this.intervalId = setInterval(this.actualizarFechaHora, 1000)
    this.obtenerTotalIndicadores()
    this.obtenerTotalUsuarios()
    this.obtenerTotalDocumentos()
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    actualizarFechaHora() {
      const ahora = new Date()

      this.fechaActual = ahora.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      this.horaActual = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
    async obtenerTotalIndicadores() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get('/indicadores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.totalIndicadores = Array.isArray(response.data.indicadores) 
          ? response.data.indicadores.length 
          : 0
      } catch (e) {
        console.error('Error al obtener indicadores:', e)
        this.totalIndicadores = 0
      }
    },
    async obtenerTotalUsuarios() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await api.get('/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.totalUsuarios = Array.isArray(response.data.users) 
          ? response.data.users.length 
          : 0
      } catch (e) {
        console.error('Error al obtener usuarios:', e)
        this.totalUsuarios = 0
      }
    },
    async obtenerTotalDocumentos() {
      try {
        const token = localStorage.getItem('apiToken')
        
        // Primero obtener todas las plantillas/colecciones
        const responsePlantillas = await api.get('/documentos/plantillas-redable', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const plantillas = responsePlantillas.data
        
        if (!Array.isArray(plantillas) || plantillas.length === 0) {
          this.totalDocumentos = 0
          return
        }
        
        // Obtener documentos de cada plantilla y sumar los totales
        let totalDocs = 0
        
        for (const plantilla of plantillas) {
          try {
            const responseDocumentos = await api.get(`/documentos/${plantilla.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            
            if (Array.isArray(responseDocumentos.data)) {
              totalDocs += responseDocumentos.data.length
            }
          } catch (error) {
            console.error(`Error al obtener documentos de la plantilla ${plantilla.id}:`, error)
          }
        }
        
        this.totalDocumentos = totalDocs
      } catch (e) {
        console.error('Error al obtener total de documentos:', e)
        this.totalDocumentos = 0
      }
    },
  },
}
</script>

<style scoped>
.bienvenida-container {
  display: flex;
  height: 100%;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family:
    'Inter',
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
}

/* Contenido principal */
.contenido-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header de bienvenida */
.header-bienvenida {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.header-bienvenida::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%);
  pointer-events: none;
}

.saludo-principal {
  position: relative;
  z-index: 1;
}

.titulo-bienvenida {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitulo-bienvenida {
  font-size: 1.2rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
}

.fecha-hora {
  text-align: right;
  position: relative;
  z-index: 1;
}

.fecha {
  font-size: 1.1rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
}

.hora {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  font-family: 'Monaco', 'Menlo', monospace;
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

/* Estadísticas */
.estadisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.02) 100%);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.stat-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  position: relative;
  z-index: 1;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
}

/* Accesos rápidos */
.accesos-rapidos {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.seccion-titulo {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.025em;
}

.accesos-grid {
  display: grid;
  gap: 1rem;
}

.acceso-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  overflow: hidden;
}

.acceso-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.6s ease;
}

.acceso-card:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(8px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.acceso-card:hover::before {
  left: 100%;
}

.acceso-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.acceso-content {
  flex: 1;
}

.acceso-content h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.acceso-content p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.acceso-arrow {
  color: #94a3b8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.acceso-card:hover .acceso-arrow {
  color: #3b82f6;
  transform: translateX(4px);
}

/* Panel lateral de opciones */
.panel-opciones {
  width: 350px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  color: white;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.panel-opciones::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.05) 50%,
    rgba(15, 23, 42, 0.1) 100%
  );
  pointer-events: none;
}

.opciones-header {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.opciones-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.opciones-header p {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

.opciones-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.opcion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.opcion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.opcion-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.opcion-item:hover::before {
  left: 100%;
}

.opcion-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.opcion-info {
  flex: 1;
}

.opcion-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.opcion-descripcion {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Información del sistema */
.sistema-info {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;
}

.info-value {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
}

.status-online {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .bienvenida-container {
    flex-direction: column;
  }

  .panel-opciones {
    width: 100%;
  }

  .opciones-lista {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .bienvenida-container {
    padding: 1rem;
    gap: 1rem;
  }

  .header-bienvenida {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem;
  }

  .titulo-bienvenida {
    font-size: 2rem;
  }

  .estadisticas-grid {
    grid-template-columns: 1fr;
  }

  .accesos-rapidos {
    padding: 2rem;
  }

  .panel-opciones {
    padding: 1.5rem;
  }

  .opciones-lista {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-bienvenida {
    padding: 1.5rem;
  }

  .titulo-bienvenida {
    font-size: 1.75rem;
  }

  .subtitulo-bienvenida {
    font-size: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .accesos-rapidos {
    padding: 1.5rem;
  }

  .panel-opciones {
    padding: 1rem;
  }
}
</style>
