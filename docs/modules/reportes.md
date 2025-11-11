# 📈 Módulo de Reportes

## Descripción General

Generación y gestión de reportes personalizados con visualizaciones y exportación.

## Componentes


### VerReportes

**📝 Descripción:** Galería de reportes generados y plantillas disponibles.

**🔗 Ruta:** `/Reportes/VerReportes`

**✨ Características principales:**
- Historial de reportes generados
- Filtrado por fecha y tipo
- Descarga en múltiples formatos
- Programación de reportes automáticos



**📤 Eventos emitidos:**
- `onDownload`
- `onSchedule`

**🔐 Permisos requeridos:**
- `reportes.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerReportes
      @onDownload="handleOnDownload"
      @onSchedule="handleOnSchedule"
    />
  </div>
</template>

<script setup>
import VerReportes from '@/components/VerReportes.vue'

const handleOnDownload = (data) => {
  console.log('onDownload:', data)
}

const handleOnSchedule = (data) => {
  console.log('onSchedule:', data)
}
</script>
```

---


### CrearReportes

**📝 Descripción:** Constructor de reportes personalizados con diseñador visual.

**🔗 Ruta:** `/Reportes/CrearReportes`

**✨ Características principales:**
- Selección de indicadores
- Diseñador de gráficas
- Configuración de filtros
- Vista previa en tiempo real



**📤 Eventos emitidos:**
- `onGenerate`
- `onSaveTemplate`

**🔐 Permisos requeridos:**
- `reportes.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearReportes
      @onGenerate="handleOnGenerate"
      @onSaveTemplate="handleOnSaveTemplate"
    />
  </div>
</template>

<script setup>
import CrearReportes from '@/components/CrearReportes.vue'

const handleOnGenerate = (data) => {
  console.log('onGenerate:', data)
}

const handleOnSaveTemplate = (data) => {
  console.log('onSaveTemplate:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/reportes

**Descripción:** Lista de reportes

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/reportes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
})

const data = await response.json()
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```


#### `POST` /api/reportes/generate

**Descripción:** Generar reporte

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/reportes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    // tus datos aquí
  })
})

const data = await response.json()
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```


#### `GET` /api/reportes/:id/download

**Descripción:** Descargar reporte

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/reportes/:id/download', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
})

const data = await response.json()
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {},
  "message": "Operación exitosa"
}
```


## Permisos del Módulo

Para acceder a este módulo, el usuario debe tener el permiso:

```json
{
  "reportes": true
}
```

Este permiso se configura en el `localStorage` bajo la clave `ui_permissions`.

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
