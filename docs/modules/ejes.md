# 🎯 Módulo de Ejes

## Descripción General

Definición y gestión de ejes estratégicos para organizar los indicadores del sistema.

## Componentes


### VerEjes

**📝 Descripción:** Visualización jerárquica de todos los ejes estratégicos.

**🔗 Ruta:** `/Ejes/VerEjes`

**✨ Características principales:**
- Vista de árbol jerárquico
- Indicadores por eje
- Estadísticas de cumplimiento
- Reordenamiento drag & drop



**📤 Eventos emitidos:**
- `onSelect`
- `onReorder`

**🔐 Permisos requeridos:**
- `ejes.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerEjes
      @onSelect="handleOnSelect"
      @onReorder="handleOnReorder"
    />
  </div>
</template>

<script setup>
import VerEjes from '@/components/VerEjes.vue'

const handleOnSelect = (data) => {
  console.log('onSelect:', data)
}

const handleOnReorder = (data) => {
  console.log('onReorder:', data)
}
</script>
```

---


### CrearEjes

**📝 Descripción:** Creación de nuevos ejes estratégicos con jerarquía.

**🔗 Ruta:** `/Ejes/CrearEjes`

**✨ Características principales:**
- Definición de nombre y código
- Selección de eje padre
- Asignación de responsables
- Definición de objetivos



**📤 Eventos emitidos:**
- `onCreate`
- `onCancel`

**🔐 Permisos requeridos:**
- `ejes.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearEjes
      @onCreate="handleOnCreate"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import CrearEjes from '@/components/CrearEjes.vue'

const handleOnCreate = (data) => {
  console.log('onCreate:', data)
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


#### `GET` /api/ejes

**Descripción:** Lista de ejes

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/ejes', {
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


#### `GET` /api/ejes/:id/indicadores

**Descripción:** Indicadores de un eje

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/ejes/:id/indicadores', {
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


#### `POST` /api/ejes

**Descripción:** Crear eje

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/ejes', {
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


## Permisos del Módulo

Para acceder a este módulo, el usuario debe tener el permiso:

```json
{
  "ejes": true
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
