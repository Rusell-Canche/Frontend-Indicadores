# 👥 Módulo de Usuarios

## Descripción General

Administración completa de usuarios, roles y permisos del sistema.

## Componentes


### VerUsuarios

**📝 Descripción:** Lista completa de usuarios del sistema con sus datos y estado.

**🔗 Ruta:** `/Usuarios/VerUsuarios`

**✨ Características principales:**
- Búsqueda por nombre, email o rol
- Filtrado por estado (activo/inactivo)
- Vista de permisos asignados
- Activación/desactivación rápida



**📤 Eventos emitidos:**
- `onEdit`
- `onToggleStatus`

**🔐 Permisos requeridos:**
- `usuarios.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerUsuarios
      @onEdit="handleOnEdit"
      @onToggleStatus="handleOnToggleStatus"
    />
  </div>
</template>

<script setup>
import VerUsuarios from '@/components/VerUsuarios.vue'

const handleOnEdit = (data) => {
  console.log('onEdit:', data)
}

const handleOnToggleStatus = (data) => {
  console.log('onToggleStatus:', data)
}
</script>
```

---


### CrearUsuarios

**📝 Descripción:** Formulario de registro de nuevos usuarios.

**🔗 Ruta:** `/Usuarios/CrearUsuarios`

**✨ Características principales:**
- Validación de email único
- Asignación de roles
- Configuración de permisos
- Envío de email de bienvenida



**📤 Eventos emitidos:**
- `onCreate`
- `onCancel`

**🔐 Permisos requeridos:**
- `usuarios.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearUsuarios
      @onCreate="handleOnCreate"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import CrearUsuarios from '@/components/CrearUsuarios.vue'

const handleOnCreate = (data) => {
  console.log('onCreate:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### CrearRoles

**📝 Descripción:** Creación de nuevos roles con permisos personalizados.

**🔗 Ruta:** `/Usuarios/CrearRoles`

**✨ Características principales:**
- Definición de nombre y descripción
- Selección múltiple de permisos
- Heredar permisos de otro rol
- Vista previa de accesos



**📤 Eventos emitidos:**
- `onCreate`
- `onCancel`

**🔐 Permisos requeridos:**
- `roles.create`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <CrearRoles
      @onCreate="handleOnCreate"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import CrearRoles from '@/components/CrearRoles.vue'

const handleOnCreate = (data) => {
  console.log('onCreate:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### AsignarPermisos

**📝 Descripción:** Interfaz para asignar permisos específicos a roles.

**🔗 Ruta:** `/Usuarios/AsignarPermisos`

**✨ Características principales:**
- Matriz de permisos por módulo
- Asignación masiva
- Vista de herencia de permisos
- Previsualización de cambios



**📤 Eventos emitidos:**
- `onSave`
- `onCancel`

**🔐 Permisos requeridos:**
- `roles.edit`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <AsignarPermisos
      @onSave="handleOnSave"
      @onCancel="handleOnCancel"
    />
  </div>
</template>

<script setup>
import AsignarPermisos from '@/components/AsignarPermisos.vue'

const handleOnSave = (data) => {
  console.log('onSave:', data)
}

const handleOnCancel = (data) => {
  console.log('onCancel:', data)
}
</script>
```

---


### VerRoles

**📝 Descripción:** Listado de todos los roles del sistema.

**🔗 Ruta:** `/Usuarios/VerRoles`

**✨ Características principales:**
- Lista de roles activos
- Usuarios por rol
- Permisos asignados
- Edición rápida de permisos



**📤 Eventos emitidos:**
- `onEdit`
- `onDelete`

**🔐 Permisos requeridos:**
- `roles.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerRoles
      @onEdit="handleOnEdit"
      @onDelete="handleOnDelete"
    />
  </div>
</template>

<script setup>
import VerRoles from '@/components/VerRoles.vue'

const handleOnEdit = (data) => {
  console.log('onEdit:', data)
}

const handleOnDelete = (data) => {
  console.log('onDelete:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/usuarios

**Descripción:** Lista de usuarios

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/usuarios', {
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


#### `POST` /api/usuarios

**Descripción:** Crear usuario

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/usuarios', {
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


#### `GET` /api/roles

**Descripción:** Lista de roles

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/roles', {
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


#### `POST` /api/roles/:id/permisos

**Descripción:** Asignar permisos a rol

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/roles/:id/permisos', {
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
  "usuarios": true
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
