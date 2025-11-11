# 📄 Módulo de Plantillas

## Descripción General

Administración de plantillas reutilizables para reportes y documentos del sistema.

## Componentes


### VerPlantillas

**📝 Descripción:** Visualización y gestión de todas las plantillas disponibles.

**🔗 Ruta:** `/Plantillas/VerPlantillas`

**✨ Características principales:**
- Listado de plantillas
- Búsqueda por nombre o categoría
- Vista previa de plantillas
- Duplicar plantillas existentes



**📤 Eventos emitidos:**
- `onSelect`
- `onEdit`
- `onDelete`

**🔐 Permisos requeridos:**
- `plantillas.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerPlantillas
      @onSelect="handleOnSelect"
      @onEdit="handleOnEdit"
      @onDelete="handleOnDelete"
    />
  </div>
</template>

<script setup>
import VerPlantillas from '@/components/VerPlantillas.vue'

const handleOnSelect = (data) => {
  console.log('onSelect:', data)
}

const handleOnEdit = (data) => {
  console.log('onEdit:', data)
}

const handleOnDelete = (data) => {
  console.log('onDelete:', data)
}
</script>
```

---


### CrearPlantillas

**📝 Descripción:** Creación de nuevas plantillas personalizadas.

**🔗 Ruta:** `/Plantillas/CrearPlantillas`

**✨ Características principales:**
- Editor visual de plantillas
- Campos personalizables
- Vista previa en tiempo real
- Guardado de borradores



**📤 Eventos emitidos:**
- `onCreate`
- `onSaveDraft`

**🔐 Permisos requeridos:**
- `plantillas.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearPlantillas
      @onCreate="handleOnCreate"
      @onSaveDraft="handleOnSaveDraft"
    />
  </div>
</template>

<script setup>
import CrearPlantillas from '@/components/CrearPlantillas.vue'

const handleOnCreate = (data) => {
  console.log('onCreate:', data)
}

const handleOnSaveDraft = (data) => {
  console.log('onSaveDraft:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/plantillas

**Descripción:** Lista de plantillas

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/plantillas', {
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


#### `POST` /api/plantillas

**Descripción:** Crear plantilla

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/plantillas', {
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


#### `PUT` /api/plantillas/:id

**Descripción:** Actualizar plantilla

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/plantillas/:id', {
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


## Permisos del Módulo

Para acceder a este módulo, el usuario debe tener el permiso:

```json
{
  "plantillas": true
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
