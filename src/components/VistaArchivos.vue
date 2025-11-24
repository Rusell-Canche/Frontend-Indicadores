<template>
<!--Modal para mostrar Archivos Multimedia-->
<div v-if="mostrar" class="modal fade show d-block" tabindex="-1" style="z-index:1060;background-color: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px);" aria-modal="true" role="dialog" @click.self="cerrarModal">
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
                  :src="obtenerSrc(item)"
                  class="d-block"
                  style="max-width: 100%; max-height: 500px; width: auto; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);"
                  :alt="obtenerNombreArchivo(item)"
                />

                <!-- PDF -->
                <div v-else-if="esPDF(item)" class="w-100" style="height: 500px;">
                  <iframe 
                    :src="obtenerSrc(item)"
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
                  <source :src="obtenerSrc(item)" :type="obtenerTipoVideo(item)">
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
                    <source :src="obtenerSrc(item)" :type="obtenerTipoAudio(item)">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                  <div class="mt-3 text-muted">
                    <small>{{ obtenerNombreArchivo(item) }}</small>
                  </div>
                </div>

                <!-- Archivo no reconocido -->
                <div v-else class="text-center">
                  <i class="fas fa-file" style="font-size: 80px; color: #6c757d;"></i>
                  <p class="mt-3 text-muted">Tipo de archivo no soportado</p>
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
                  :src="obtenerSrc(item)"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  :alt="obtenerNombreArchivo(item)"
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
</template>

<script>
export default {
  name: "VistaArchivos",
  props: {
    mostrar: {
      type: Boolean,
      default: false
    },
    archivos: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      currentSlide: 0
    };
  },
  computed: {
    archivosArray() {
      if (!this.archivos) return [];
      
      // Si es un Proxy (array de Files), extraemos el target
      let archivos = this.archivos;
      if (this.archivos && typeof this.archivos === 'object' && this.archivos.__v_isProxy) {
        archivos = this.archivos;
      }
      
      // Si es un array, lo retornamos
      if (Array.isArray(archivos)) {
        return archivos;
      }
      
      // Si es un solo objeto File
      if (archivos instanceof File) {
        return [archivos];
      }
      
      // Si es un string (ruta)
      if (typeof archivos === 'string') {
        return [archivos];
      }
      
      return [];
    }
  },
  methods: {
    cerrarModalImagen() {
      this.$emit("cerrar");
      this.currentSlide = 0;
    },
    
    // Método para obtener la fuente según el tipo de archivo
    obtenerSrc(item) {
      if (item instanceof File) {
        // Si es un objeto File, crear URL local
        return URL.createObjectURL(item);
      } else if (typeof item === 'string') {
        // Si es una ruta, usar la URL del servidor
        return `http://127.0.0.1:8000/storage/${item}`;
      }
      return '';
    },
    
    // Método para obtener el nombre del archivo
    obtenerNombreArchivo(item) {
      if (item instanceof File) {
        return item.name;
      } else if (typeof item === 'string') {
        return item.split("/").pop();
      }
      return 'Archivo desconocido';
    },
    
    // Métodos para determinar el tipo de archivo
    esImagen(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      const ext = nombre.split(".").pop();
      return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext);
    },
    
    esPDF(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      return nombre.endsWith(".pdf");
    },
    
    esVideo(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      const ext = nombre.split(".").pop();
      return ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext);
    },
    
    esAudio(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      const ext = nombre.split(".").pop();
      return ["mp3", "wav", "ogg", "aac", "m4a", "flac"].includes(ext);
    },
    
    obtenerTipoVideo(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      const ext = nombre.split(".").pop();
      const tipos = {
        mp4: "video/mp4",
        webm: "video/webm",
        ogg: "video/ogg",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska"
      };
      return tipos[ext] || "video/mp4";
    },
    
    obtenerTipoAudio(item) {
      const nombre = this.obtenerNombreArchivo(item).toLowerCase();
      const ext = nombre.split(".").pop();
      const tipos = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
        aac: "audio/aac",
        m4a: "audio/mp4",
        flac: "audio/flac"
      };
      return tipos[ext] || "audio/mpeg";
    },
    
    irASlide(index) {
      if (index < 0) {
        this.currentSlide = this.archivosArray.length - 1;
      } else if (index >= this.archivosArray.length) {
        this.currentSlide = 0;
      } else {
        this.currentSlide = index;
      }
    }
  },
  
  // Limpiar URLs creadas cuando el componente se destruye
  beforeUnmount() {
    this.archivosArray.forEach(item => {
      if (item instanceof File) {
        URL.revokeObjectURL(this.obtenerSrc(item));
      }
    });
  }
};
</script>