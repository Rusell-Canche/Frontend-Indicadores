# 📁 Módulo de Documentos

## Descripción General

Gestión documental completa con soporte para múltiples formatos y organización por categorías.

## Componentes


### VerDocumentos

**📝 Descripción:** Explorador de documentos con filtros y búsqueda avanzada.

**🔗 Ruta:** `/Documentos/VerDocumentos`

**✨ Características principales:**
- Navegación por carpetas
- Búsqueda por metadatos
- Descarga de documentos
- Control de versiones



**📤 Eventos emitidos:**
- `onDownload`
- `onDelete`
- `onShare`

**🔐 Permisos requeridos:**
- `documentos.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerDocumentos
      @onDownload="handleOnDownload"
      @onDelete="handleOnDelete"
      @onShare="handleOnShare"
    />
  </div>
</template>

<script setup>
import VerDocumentos from '@/components/VerDocumentos.vue'

const handleOnDownload = (data) => {
  console.log('onDownload:', data)
}

const handleOnDelete = (data) => {
  console.log('onDelete:', data)
}

const handleOnShare = (data) => {
  console.log('onShare:', data)
}
</script>
```

---


### CrearDocumentos

**📝 Descripción:** Carga y registro de nuevos documentos en el sistema.

**🔗 Ruta:** `/Documentos/CrearDocumentos`

**✨ Características principales:**
- Carga múltiple de archivos
- Asignación de metadatos
- Categorización automática
- OCR para documentos escaneados



**📤 Eventos emitidos:**
- `onUpload`
- `onCancel`

**🔐 Permisos requeridos:**
- `documentos.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearDocumentos
      @onUpload="handleOnUpload"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import CrearDocumentos from '@/components/CrearDocumentos.vue'

const handleOnUpload = (data) => {
  console.log('onUpload:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/documentos

**Descripción:** Lista de documentos

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/documentos', {
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


#### `POST` /api/documentos

**Descripción:** Subir documento

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/documentos', {
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


#### `GET` /api/documentos/:id/download

**Descripción:** Descargar documento

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/documentos/:id/download', {
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
  "documentos": true
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
