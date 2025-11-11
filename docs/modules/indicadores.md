# 📊 Módulo de Indicadores

## Descripción General

Gestión completa de indicadores del sistema, incluyendo creación, edición, configuración y carga masiva.

## Componentes


### VerIndicadores

**📝 Descripción:** Componente principal para visualizar la lista de todos los indicadores del sistema.

**🔗 Ruta:** `/Indicador/ver-indicadores`

**✨ Características principales:**
- Listado paginado de indicadores
- Búsqueda y filtrado avanzado
- Acciones rápidas (editar, configurar, eliminar)
- Exportación de datos



**📤 Eventos emitidos:**
- `onEdit`
- `onDelete`
- `onConfigure`

**🔐 Permisos requeridos:**
- `indicadores.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerIndicadores
      @onEdit="handleOnEdit"
      @onDelete="handleOnDelete"
      @onConfigure="handleOnConfigure"
    />
  </div>
</template>

<script setup>
import VerIndicadores from '@/components/VerIndicadores.vue'

const handleOnEdit = (data) => {
  console.log('onEdit:', data)
}

const handleOnDelete = (data) => {
  console.log('onDelete:', data)
}

const handleOnConfigure = (data) => {
  console.log('onConfigure:', data)
}
</script>
```

---


### CrearIndicador

**📝 Descripción:** Formulario completo para la creación de nuevos indicadores.

**🔗 Ruta:** `/Indicador/CrearIndicador`

**✨ Características principales:**
- Validación de campos en tiempo real
- Selección de tipo de indicador
- Configuración de unidades de medida
- Definición de metas y objetivos



**📤 Eventos emitidos:**
- `onCreate`
- `onCancel`

**🔐 Permisos requeridos:**
- `indicadores.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearIndicador
      @onCreate="handleOnCreate"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import CrearIndicador from '@/components/CrearIndicador.vue'

const handleOnCreate = (data) => {
  console.log('onCreate:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### EditarIndicador

**📝 Descripción:** Permite modificar los datos de un indicador existente.

**🔗 Ruta:** `/Indicador/ver-indicadores/editar/:id`

**✨ Características principales:**
- Carga de datos del indicador
- Edición de todos los campos
- Vista previa de cambios
- Historial de modificaciones


**📥 Props:**

| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `id` | `String` | ✅ Sí | ID del indicador a editar |


**📤 Eventos emitidos:**
- `onUpdate`
- `onCancel`

**🔐 Permisos requeridos:**
- `indicadores.edit`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <EditarIndicador
      :id="id"
      @onUpdate="handleOnUpdate"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import EditarIndicador from '@/components/EditarIndicador.vue'
import { ref } from 'vue'

const id = ref('')

const handleOnUpdate = (data) => {
  console.log('onUpdate:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### ConfigurarIndicador

**📝 Descripción:** Configuración avanzada del indicador (fórmulas, periodicidad, responsables).

**🔗 Ruta:** `/Indicador/ver-indicadores/configurar/:id`

**✨ Características principales:**
- Configuración de fórmulas de cálculo
- Definición de periodicidad
- Asignación de responsables
- Configuración de alertas y umbrales


**📥 Props:**

| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `id` | `String` | ✅ Sí | ID del indicador a configurar |


**📤 Eventos emitidos:**
- `onSave`
- `onCancel`

**🔐 Permisos requeridos:**
- `indicadores.configure`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <ConfigurarIndicador
      :id="id"
      @onSave="handleOnSave"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import ConfigurarIndicador from '@/components/ConfigurarIndicador.vue'
import { ref } from 'vue'

const id = ref('')

const handleOnSave = (data) => {
  console.log('onSave:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### Cargarindicadores

**📝 Descripción:** Carga masiva de indicadores desde archivos Excel o CSV.

**🔗 Ruta:** `/Indicador/CargarIndicador`

**✨ Características principales:**
- Carga de archivos Excel/CSV
- Validación de formato
- Vista previa de datos a importar
- Reporte de errores



**📤 Eventos emitidos:**
- `onUpload`
- `onValidate`

**🔐 Permisos requeridos:**
- `indicadores.import`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <Cargarindicadores
      @onUpload="handleOnUpload"
      @onValidate="handleOnValidate"
    />
  </div>
</template>

<script setup>
import Cargarindicadores from '@/components/Cargarindicadores.vue'

const handleOnUpload = (data) => {
  console.log('onUpload:', data)
}

const handleOnValidate = (data) => {
  console.log('onValidate:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/indicadores

**Descripción:** Obtener lista de indicadores

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores', {
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


#### `GET` /api/indicadores/:id

**Descripción:** Obtener un indicador específico

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores/:id', {
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


#### `POST` /api/indicadores

**Descripción:** Crear nuevo indicador

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores', {
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


#### `PUT` /api/indicadores/:id

**Descripción:** Actualizar indicador

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores/:id', {
  method: 'PUT',
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


#### `DELETE` /api/indicadores/:id

**Descripción:** Eliminar indicador

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores/:id', {
  method: 'DELETE',
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


#### `POST` /api/indicadores/import

**Descripción:** Importación masiva

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/indicadores/import', {
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
  "indicadores": true
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
