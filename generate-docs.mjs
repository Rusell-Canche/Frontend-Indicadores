import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules = [
  {
    name: 'Indicadores',
    icon: '📊',
    description: 'Gestión completa de indicadores del sistema, incluyendo creación, edición, configuración y carga masiva.',
    components: [
      {
        name: 'VerIndicadores',
        description: 'Componente principal para visualizar la lista de todos los indicadores del sistema.',
        route: '/Indicador/ver-indicadores',
        features: [
          'Listado paginado de indicadores',
          'Búsqueda y filtrado avanzado',
          'Acciones rápidas (editar, configurar, eliminar)',
          'Exportación de datos'
        ],
        props: [],
        events: ['onEdit', 'onDelete', 'onConfigure'],
        permissions: ['indicadores.view']
      },
      {
        name: 'CrearIndicador',
        description: 'Formulario completo para la creación de nuevos indicadores.',
        route: '/Indicador/CrearIndicador',
        features: [
          'Validación de campos en tiempo real',
          'Selección de tipo de indicador',
          'Configuración de unidades de medida',
          'Definición de metas y objetivos'
        ],
        props: [],
        events: ['onCreate', 'onCancel'],
        permissions: ['indicadores.create']
      },
      {
        name: 'EditarIndicador',
        description: 'Permite modificar los datos de un indicador existente.',
        route: '/Indicador/ver-indicadores/editar/:id',
        features: [
          'Carga de datos del indicador',
          'Edición de todos los campos',
          'Vista previa de cambios',
          'Historial de modificaciones'
        ],
        props: [
          { name: 'id', type: 'String', required: true, description: 'ID del indicador a editar' }
        ],
        events: ['onUpdate', 'onCancel'],
        permissions: ['indicadores.edit']
      },
      {
        name: 'ConfigurarIndicador',
        description: 'Configuración avanzada del indicador (fórmulas, periodicidad, responsables).',
        route: '/Indicador/ver-indicadores/configurar/:id',
        features: [
          'Configuración de fórmulas de cálculo',
          'Definición de periodicidad',
          'Asignación de responsables',
          'Configuración de alertas y umbrales'
        ],
        props: [
          { name: 'id', type: 'String', required: true, description: 'ID del indicador a configurar' }
        ],
        events: ['onSave', 'onCancel'],
        permissions: ['indicadores.configure']
      },
      {
        name: 'Cargarindicadores',
        description: 'Carga masiva de indicadores desde archivos Excel o CSV.',
        route: '/Indicador/CargarIndicador',
        features: [
          'Carga de archivos Excel/CSV',
          'Validación de formato',
          'Vista previa de datos a importar',
          'Reporte de errores'
        ],
        props: [],
        events: ['onUpload', 'onValidate'],
        permissions: ['indicadores.import']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/indicadores', description: 'Obtener lista de indicadores' },
      { method: 'GET', path: '/api/indicadores/:id', description: 'Obtener un indicador específico' },
      { method: 'POST', path: '/api/indicadores', description: 'Crear nuevo indicador' },
      { method: 'PUT', path: '/api/indicadores/:id', description: 'Actualizar indicador' },
      { method: 'DELETE', path: '/api/indicadores/:id', description: 'Eliminar indicador' },
      { method: 'POST', path: '/api/indicadores/import', description: 'Importación masiva' }
    ]
  },
  {
    name: 'Plantillas',
    icon: '📄',
    description: 'Administración de plantillas reutilizables para reportes y documentos del sistema.',
    components: [
      {
        name: 'VerPlantillas',
        description: 'Visualización y gestión de todas las plantillas disponibles.',
        route: '/Plantillas/VerPlantillas',
        features: [
          'Listado de plantillas',
          'Búsqueda por nombre o categoría',
          'Vista previa de plantillas',
          'Duplicar plantillas existentes'
        ],
        props: [],
        events: ['onSelect', 'onEdit', 'onDelete'],
        permissions: ['plantillas.view']
      },
      {
        name: 'CrearPlantillas',
        description: 'Creación de nuevas plantillas personalizadas.',
        route: '/Plantillas/CrearPlantillas',
        features: [
          'Editor visual de plantillas',
          'Campos personalizables',
          'Vista previa en tiempo real',
          'Guardado de borradores'
        ],
        props: [],
        events: ['onCreate', 'onSaveDraft'],
        permissions: ['plantillas.create']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/plantillas', description: 'Lista de plantillas' },
      { method: 'POST', path: '/api/plantillas', description: 'Crear plantilla' },
      { method: 'PUT', path: '/api/plantillas/:id', description: 'Actualizar plantilla' }
    ]
  },
  {
    name: 'Documentos',
    icon: '📁',
    description: 'Gestión documental completa con soporte para múltiples formatos y organización por categorías.',
    components: [
      {
        name: 'VerDocumentos',
        description: 'Explorador de documentos con filtros y búsqueda avanzada.',
        route: '/Documentos/VerDocumentos',
        features: [
          'Navegación por carpetas',
          'Búsqueda por metadatos',
          'Descarga de documentos',
          'Control de versiones'
        ],
        props: [],
        events: ['onDownload', 'onDelete', 'onShare'],
        permissions: ['documentos.view']
      },
      {
        name: 'CrearDocumentos',
        description: 'Carga y registro de nuevos documentos en el sistema.',
        route: '/Documentos/CrearDocumentos',
        features: [
          'Carga múltiple de archivos',
          'Asignación de metadatos',
          'Categorización automática',
          'OCR para documentos escaneados'
        ],
        props: [],
        events: ['onUpload', 'onCancel'],
        permissions: ['documentos.create']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/documentos', description: 'Lista de documentos' },
      { method: 'POST', path: '/api/documentos', description: 'Subir documento' },
      { method: 'GET', path: '/api/documentos/:id/download', description: 'Descargar documento' }
    ]
  },
  {
    name: 'Ejes',
    icon: '🎯',
    description: 'Definición y gestión de ejes estratégicos para organizar los indicadores del sistema.',
    components: [
      {
        name: 'VerEjes',
        description: 'Visualización jerárquica de todos los ejes estratégicos.',
        route: '/Ejes/VerEjes',
        features: [
          'Vista de árbol jerárquico',
          'Indicadores por eje',
          'Estadísticas de cumplimiento',
          'Reordenamiento drag & drop'
        ],
        props: [],
        events: ['onSelect', 'onReorder'],
        permissions: ['ejes.view']
      },
      {
        name: 'CrearEjes',
        description: 'Creación de nuevos ejes estratégicos con jerarquía.',
        route: '/Ejes/CrearEjes',
        features: [
          'Definición de nombre y código',
          'Selección de eje padre',
          'Asignación de responsables',
          'Definición de objetivos'
        ],
        props: [],
        events: ['onCreate', 'onCancel'],
        permissions: ['ejes.create']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/ejes', description: 'Lista de ejes' },
      { method: 'GET', path: '/api/ejes/:id/indicadores', description: 'Indicadores de un eje' },
      { method: 'POST', path: '/api/ejes', description: 'Crear eje' }
    ]
  },
  {
    name: 'Usuarios',
    icon: '👥',
    description: 'Administración completa de usuarios, roles y permisos del sistema.',
    components: [
      {
        name: 'VerUsuarios',
        description: 'Lista completa de usuarios del sistema con sus datos y estado.',
        route: '/Usuarios/VerUsuarios',
        features: [
          'Búsqueda por nombre, email o rol',
          'Filtrado por estado (activo/inactivo)',
          'Vista de permisos asignados',
          'Activación/desactivación rápida'
        ],
        props: [],
        events: ['onEdit', 'onToggleStatus'],
        permissions: ['usuarios.view']
      },
      {
        name: 'CrearUsuarios',
        description: 'Formulario de registro de nuevos usuarios.',
        route: '/Usuarios/CrearUsuarios',
        features: [
          'Validación de email único',
          'Asignación de roles',
          'Configuración de permisos',
          'Envío de email de bienvenida'
        ],
        props: [],
        events: ['onCreate', 'onCancel'],
        permissions: ['usuarios.create']
      },
      {
        name: 'CrearRoles',
        description: 'Creación de nuevos roles con permisos personalizados.',
        route: '/Usuarios/CrearRoles',
        features: [
          'Definición de nombre y descripción',
          'Selección múltiple de permisos',
          'Heredar permisos de otro rol',
          'Vista previa de accesos'
        ],
        props: [],
        events: ['onCreate', 'onCancel'],
        permissions: ['roles.create']
      },
      {
        name: 'AsignarPermisos',
        description: 'Interfaz para asignar permisos específicos a roles.',
        route: '/Usuarios/AsignarPermisos',
        features: [
          'Matriz de permisos por módulo',
          'Asignación masiva',
          'Vista de herencia de permisos',
          'Previsualización de cambios'
        ],
        props: [],
        events: ['onSave', 'onCancel'],
        permissions: ['roles.edit']
      },
      {
        name: 'VerRoles',
        description: 'Listado de todos los roles del sistema.',
        route: '/Usuarios/VerRoles',
        features: [
          'Lista de roles activos',
          'Usuarios por rol',
          'Permisos asignados',
          'Edición rápida de permisos'
        ],
        props: [],
        events: ['onEdit', 'onDelete'],
        permissions: ['roles.view']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/usuarios', description: 'Lista de usuarios' },
      { method: 'POST', path: '/api/usuarios', description: 'Crear usuario' },
      { method: 'GET', path: '/api/roles', description: 'Lista de roles' },
      { method: 'POST', path: '/api/roles/:id/permisos', description: 'Asignar permisos a rol' }
    ]
  },
  {
    name: 'Reportes',
    icon: '📈',
    description: 'Generación y gestión de reportes personalizados con visualizaciones y exportación.',
    components: [
      {
        name: 'VerReportes',
        description: 'Galería de reportes generados y plantillas disponibles.',
        route: '/Reportes/VerReportes',
        features: [
          'Historial de reportes generados',
          'Filtrado por fecha y tipo',
          'Descarga en múltiples formatos',
          'Programación de reportes automáticos'
        ],
        props: [],
        events: ['onDownload', 'onSchedule'],
        permissions: ['reportes.view']
      },
      {
        name: 'CrearReportes',
        description: 'Constructor de reportes personalizados con diseñador visual.',
        route: '/Reportes/CrearReportes',
        features: [
          'Selección de indicadores',
          'Diseñador de gráficas',
          'Configuración de filtros',
          'Vista previa en tiempo real'
        ],
        props: [],
        events: ['onGenerate', 'onSaveTemplate'],
        permissions: ['reportes.create']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/reportes', description: 'Lista de reportes' },
      { method: 'POST', path: '/api/reportes/generate', description: 'Generar reporte' },
      { method: 'GET', path: '/api/reportes/:id/download', description: 'Descargar reporte' }
    ]
  },
  {
    name: 'Estadísticas',
    icon: '📉',
    description: 'Visualización de estadísticas, métricas y tendencias del sistema con dashboards interactivos.',
    components: [
      {
        name: 'VerEstadisticas',
        description: 'Dashboard principal con métricas y KPIs en tiempo real.',
        route: '/Estadisticas/VerEstadisticas',
        features: [
          'Gráficas interactivas',
          'Filtrado por período',
          'Comparativas entre períodos',
          'Exportación de datos'
        ],
        props: [],
        events: ['onRefresh', 'onFilterChange'],
        permissions: ['estadisticas.view']
      },
      {
        name: 'HistorialEstadisticas',
        description: 'Historial completo de estadísticas con análisis de tendencias.',
        route: '/Estadisticas/HistorialEstadisticas',
        features: [
          'Línea de tiempo de datos',
          'Análisis de tendencias',
          'Detección de anomalías',
          'Proyecciones futuras'
        ],
        props: [],
        events: ['onExport', 'onCompare'],
        permissions: ['estadisticas.history']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/estadisticas/dashboard', description: 'Datos del dashboard' },
      { method: 'GET', path: '/api/estadisticas/historico', description: 'Datos históricos' },
      { method: 'GET', path: '/api/estadisticas/tendencias', description: 'Análisis de tendencias' }
    ]
  }
];

const moduleTemplate = (module) => `# ${module.icon} Módulo de ${module.name}

## Descripción General

${module.description}

## Componentes

${module.components.map(comp => `
### ${comp.name}

**📝 Descripción:** ${comp.description}

**🔗 Ruta:** \`${comp.route}\`

**✨ Características principales:**
${comp.features.map(feature => `- ${feature}`).join('\n')}

${comp.props && comp.props.length > 0 ? `
**📥 Props:**

| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
${comp.props.map(prop => `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? '✅ Sí' : '❌ No'} | ${prop.description} |`).join('\n')}
` : ''}

**📤 Eventos emitidos:**
${comp.events.map(event => `- \`${event}\``).join('\n')}

**🔐 Permisos requeridos:**
${comp.permissions.map(perm => `- \`${perm}\``).join('\n')}

#### Ejemplo de uso:

\`\`\`vue
<template>
  <div>
    <${comp.name}${comp.props && comp.props.length > 0 ? `
      ${comp.props.map(prop => `:${prop.name}="${prop.name}"`).join('\n      ')}` : ''}
      ${comp.events.map(event => `@${event}="handle${event.charAt(0).toUpperCase() + event.slice(1)}"`).join('\n      ')}
    />
  </div>
</template>

<script setup>
import ${comp.name} from '@/components/${comp.name}.vue'${comp.props && comp.props.length > 0 ? `
import { ref } from 'vue'

${comp.props.map(prop => `const ${prop.name} = ref(${prop.type === 'String' ? "''" : prop.type === 'Number' ? '0' : 'null'})`).join('\n')}` : ''}

${comp.events.map(event => `const handle${event.charAt(0).toUpperCase() + event.slice(1)} = (data) => {
  console.log('${event}:', data)
}`).join('\n\n')}
</script>
\`\`\`

---
`).join('\n')}

## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:

${module.apiEndpoints.map(endpoint => `
#### \`${endpoint.method}\` ${endpoint.path}

**Descripción:** ${endpoint.description}

**Ejemplo de petición:**

\`\`\`javascript
// Con fetch
const response = await fetch('${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }${endpoint.method !== 'GET' ? `,
  body: JSON.stringify({
    // tus datos aquí
  })` : ''}
})

const data = await response.json()
\`\`\`

**Ejemplo de respuesta:**

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
\`\`\`
`).join('\n')}

## Permisos del Módulo

Para acceder a este módulo, el usuario debe tener el permiso:

\`\`\`json
{
  "${module.name.toLowerCase()}": true
}
\`\`\`

Este permiso se configura en el \`localStorage\` bajo la clave \`ui_permissions\`.

## Flujo de Trabajo Típico

1. **Ver listado** - El usuario accede al componente principal de visualización
2. **Crear/Editar** - Usa los formularios correspondientes para gestionar datos
3. **Configurar** - Ajusta configuraciones avanzadas si están disponibles
4. **Exportar/Reportar** - Genera reportes o exporta información

## Notas Adicionales

- Todos los componentes usan PrimeVue para la UI
- Las validaciones se realizan en tiempo real
- Los cambios se sincronizan automáticamente con el backend
- Se implementa manejo de errores con Toast notifications

## Recursos Relacionados

- [Guía de Usuario](/guide/introduccion)
- [Arquitectura del Sistema](/guide/arquitectura)
- [Otros Módulos](/modules/)
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

// Generar índice de módulos
const indexContent = `# Módulos del Sistema

Esta sección documenta todos los módulos disponibles en el Sistema de Indicadores.

## Módulos Disponibles

${modules.map(module => `### ${module.icon} [${module.name}](./${module.name.toLowerCase()}.md)

${module.description}

**Componentes:** ${module.components.length} | **Endpoints API:** ${module.apiEndpoints.length}
`).join('\n')}

## Estructura de la Documentación

Cada módulo incluye:

- **Descripción General**: Propósito y funcionalidad del módulo
- **Componentes**: Documentación detallada de cada componente Vue
- **API Endpoints**: Endpoints del backend relacionados
- **Permisos**: Configuración de permisos necesarios
- **Ejemplos de Uso**: Código de ejemplo para cada componente
- **Flujo de Trabajo**: Proceso típico de uso del módulo

## Convenciones

- 📝 Descripción
- 🔗 Rutas
- ✨ Características
- 📥 Props
- 📤 Eventos
- 🔐 Permisos
`;

fs.writeFileSync(path.join(modulesDir, 'index.md'), indexContent);
console.log('✅ Creado: docs/modules/index.md');

console.log('\n✨ ¡Documentación generada exitosamente!');
console.log(`📚 Se generaron ${modules.length} archivos de módulos`);
console.log('🚀 Ejecuta "npm run docs:dev" para ver la documentación');