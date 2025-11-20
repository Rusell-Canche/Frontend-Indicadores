<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">Plantilla: {{ jsonData.nombre_plantilla || 'Sin nombre' }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
        </div>
        
        <!-- Body -->
        <div class="modal-body bg-light">
          <!-- 🔹 ACOTACIONES SUPERIORES -->
          <div
            class="mb-4 p-3 rounded bg-white border border-dark d-flex flex-wrap align-items-center justify-content-around acotaciones-sticky rba"
            style="background-color: #e6e6e6;"
          >
            <div class="d-flex align-items-center me-3 mb-2">
              <span class="acotacion-circulo" style="background-color: #8a7968;"></span>
              <span class="ms-2 fw-bold">Secciones</span>
            </div>
            <div class="d-flex align-items-center me-3 mb-2">
              <span class="acotacion-circulo" style="background-color: #fd8b00;"></span>
              <span class="ms-2 fw-bold">Tablas</span>
            </div>
            <div class="d-flex align-items-center me-3 mb-2">
              <span class="acotacion-circulo" style="background-color: #ffdd00;"></span>
              <span class="ms-2 fw-bold">Campos atómicos</span>
            </div>
            <div class="d-flex align-items-center me-3 mb-2">
              <span class="acotacion-circulo" style="background-color: #0070C0;"></span>
              <span class="ms-2 fw-bold">Subformularios</span>
            </div>
            <div class="d-flex align-items-center mb-2">
              <span class="acotacion-circulo" style="background-color: #52b788;"></span>
              <span class="ms-2 fw-bold">Cuadros de selección</span>
            </div>
          </div>
          <!-- Secciones -->
          <div
            v-for="(seccion, i) in jsonData.secciones || []"
            :key="i"
            class="mb-4 mt-3 p-3 rounded"
            style="background-color: #8a7968; border: 3px solid black;"

          >
            <h6 class="fw-bold text-black mb-3">Sección: {{ seccion.nombre }}</h6>

            <!-- Campos -->
            <div v-for="(campo, j) in seccion.fields || []" :key="j">
              <div v-html="renderCampo(campo, 1)"></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VistaGrafica',
  props: {
    visible: { type: Boolean, default: false },
    jsonData: { type: Object, default: () => ({}) },
  },
  methods: {
    cerrar() {
      this.$emit('close')
    },

    // 🔹 Nuevo método: devuelve color azul según nivel
    getSubformColor(nivel) {
      const base = 192 // Azul medio (#0070C0)
      const ajuste = Math.min(80, nivel * 20)
      return `rgb(${0}, ${112 + ajuste}, ${192 + ajuste})`
    },

    renderCampo(campo, nivel) {
      const tab = nivel * 40
      let clases = 'mb-3 mt-3 p-3  rounded '
      let estilos = `margin-left:${tab}px;border: 3px solid black;`

     if (campo.type === 'tabla') {
  clases += ' TablaDiv'
} else if (campo.type === 'subform') {
  estilos += `background-color:${this.getSubformColor(nivel)};`
} else if (campo.type === 'select') {
  clases += 'SelectsDivs'
} else if (
  (!campo.options || campo.options.length === 0) &&
  (!campo.subcampos || campo.subcampos.length === 0) &&
  campo.type !== 'subform'
) {
  clases += 'CamposSinElementos'
} else {
  clases += 'SelectsDivs'
}


      let html = `<div class="${clases}" style="${estilos}">`
      html += `<strong>${campo.name || 'Sin nombre'}</strong>`
      if (campo.type) {
        html += ` <small class="text-muted">(${campo.type})</small>`
        if (campo.type === 'select' && campo.dataSource) {
          html += `<small class="text-muted">→ ${campo.dataSource.seccion} → ${campo.dataSource.campoMostrar}</small>`
        }
      }

      if ((campo.type === 'select' || campo.type === 'checkBox') && campo.options) {
        html += `<div class="mt-3">`


        // Mostrar opciones (limitadas a 5)
        const maxOpciones = 5
        const totalOpciones = campo.options.length
        const opcionesAMostrar = campo.options.slice(0, maxOpciones)
        const opcionesRestantes = Math.max(0, totalOpciones - maxOpciones)

        opcionesAMostrar.forEach((opt) => {
          html += `
      <div class="mb-2 mt-2 p-2  rounded CamposSinElementos"
           style="margin-left:${(nivel + 1) * 40}px;border: 3px solid black;">
        ${typeof opt === 'object' ? opt.campoMostrar || JSON.stringify(opt) : opt}
      </div>`
        })

        // Mostrar contador de opciones restantes si hay más de 5
        if (opcionesRestantes > 0) {
          html += `
      <div class="mb-2 mt-2 p-2  rounded text-center" 
           style="margin-left:${(nivel + 1) * 40}px; background-color: #F5F5F5; font-style: italic;border: 3px solid black;">
        ... y ${opcionesRestantes} opción${opcionesRestantes === 1 ? '' : 'es'} más (${totalOpciones} total)
      </div>`
        }

        html += `</div>`
      }

      if (campo.type === 'subform' && campo.subcampos) {
  campo.subcampos.forEach((subcampo) => {
    html += this.renderCampo(subcampo, nivel + 1)
  })
}
  // Campos internos de tabla (robusto)
if (campo.type === 'tabla') {
  console.log("entre en el else if de tipo tabla")
   clases += ' TablaDiv'
  const innerCampos = campo.campos || (campo.tableConfig && campo.tableConfig.campos) || []
  innerCampos.forEach((subcampo) => {
    html += this.renderCampo(subcampo, nivel + 1)

  })
}


      html += `</div>`
      return html
    },
  },
  
}
</script>

<style>
.CamposSinElementos {
  background-color: #ffdd00 !important;
  border: 3px solid black;
}
.SelectsDivs {
  background-color: #52b788 !important;
  border: 3px solid black;
}
.TablaDiv {
  background-color: #fd8b00 !important;
  border: 3px solid black;
}
.acotacion-circulo {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 3px solid black;
  display: inline-block;
}
.acotaciones-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

</style>
