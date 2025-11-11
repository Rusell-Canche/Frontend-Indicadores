import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  {
    name: 'Indicadores',
    icon: '📊',
    components: ['VerIndicadores', 'CrearIndicador', 'EditarIndicador', 'ConfigurarIndicador', 'Cargarindicadores'],
    routes: ['/Indicador']
  },
  {
    name: 'Plantillas',
    icon: '📄',
    components: ['VerPlantillas', 'CrearPlantillas'],
    routes: ['/Plantillas']
  },
  {
    name: 'Documentos',
    icon: '📁',
    components: ['VerDocumentos', 'CrearDocumentos'],
    routes: ['/Documentos']
  },
  {
    name: 'Ejes',
    icon: '🎯',
    components: ['VerEjes', 'CrearEjes'],
    routes: ['/Ejes']
  },
  {
    name: 'Usuarios',
    icon: '👥',
    components: ['VerUsuarios', 'CrearUsuarios', 'CrearRoles', 'AsignarPermisos', 'VerRoles'],
    routes: ['/Usuarios']
  },
  {
    name: 'Reportes',
    icon: '📈',
    components: ['VerReportes', 'CrearReportes'],
    routes: ['/Reportes']
  },
  {
    name: 'Estadísticas',
    icon: '📉',
    components: ['VerEstadisticas', 'HistorialEstadisticas'],
    routes: ['/Estadisticas']
  }
];

const moduleTemplate = (module) => `# ${module.icon} Módulo de ${module.name}

## Descripción

Módulo para la gestión de ${module.name.toLowerCase()} del sistema.

## Componentes

${module.components.map(comp => `### ${comp}
**Ubicación:** \`resources/js/components/${comp}.vue\`

**Descripción:** Componente para [describir funcionalidad]

\`\`\`vue
<template>
  <${comp} />
</template>

<script setup>
import ${comp} from '@/components/${comp}.vue'
</script>
\`\`\`
`).join('\n')}

## Rutas

${module.routes.map(route => `- \`${route}\``).join('\n')}

## Permisos requeridos

- Módulo: \`${module.name.toLowerCase()}\`
`;

// Crear carpeta docs/modules si no existe
const modulesDir = path.join(__dirname, 'docs/modules');
if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

// Generar documentación para cada módulo
modules.forEach(module => {
  const fileName = module.name.toLowerCase() + '.md';
  const filePath = path.join(modulesDir, fileName);
  
  fs.writeFileSync(filePath, moduleTemplate(module));
  console.log(`✅ Creado: docs/modules/${fileName}`);
});

console.log('\n✨ ¡Documentación generada exitosamente!');