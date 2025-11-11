# 📉 Módulo de Estadísticas

## Descripción General

Visualización de estadísticas, métricas y tendencias del sistema con dashboards interactivos.

## Componentes


### VerEstadisticas

**📝 Descripción:** Dashboard principal con métricas y KPIs en tiempo real.

**🔗 Ruta:** `/Estadisticas/VerEstadisticas`

**✨ Características principales:**
- Gráficas interactivas
- Filtrado por período
- Comparativas entre períodos
- Exportación de datos



**📤 Eventos emitidos:**
- `onRefresh`
- `onFilterChange`

**🔐 Permisos requeridos:**
- `estadisticas.view`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <VerEstadisticas
      @onRefresh="handleOnRefresh"
      @onFilterChange="handleOnFilterChange"
    />
  </div>
</template>

<script setup>
import VerEstadisticas from '@/components/VerEstadisticas.vue'

const handleOnRefresh = (data) => {
  console.log('onRefresh:', data)
}

const handleOnFilterChange = (data) => {
  console.log('onFilterChange:', data)
}
</script>
```

---


### HistorialEstadisticas

**📝 Descripción:** Historial completo de estadísticas con análisis de tendencias.

**🔗 Ruta:** `/Estadisticas/HistorialEstadisticas`

**✨ Características principales:**
- Línea de tiempo de datos
- Análisis de tendencias
- Detección de anomalías
- Proyecciones futuras



**📤 Eventos emitidos:**
- `onExport`
- `onCompare`

**🔐 Permisos requeridos:**
- `estadisticas.history`

#### Ejemplo de uso:

```vue
<template>
  <div>
    <HistorialEstadisticas
      @onExport="handleOnExport"
      @onCompare="handleOnCompare"
    />
  </div>
</template>

<script setup>
import HistorialEstadisticas from '@/components/HistorialEstadisticas.vue'

const handleOnExport = (data) => {
  console.log('onExport:', data)
}

const handleOnCompare = (data) => {
  console.log('onCompare:', data)
}
</script>
```

---


## API Endpoints

Esta sección documenta los endpoints del backend relacionados con este módulo.

### Endpoints disponibles:


#### `GET` /api/estadisticas/dashboard

**Descripción:** Datos del dashboard

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/estadisticas/dashboard', {
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


#### `GET` /api/estadisticas/historico

**Descripción:** Datos históricos

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/estadisticas/historico', {
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


#### `GET` /api/estadisticas/tendencias

**Descripción:** Análisis de tendencias

**Ejemplo de petición:**

```javascript
// Con fetch
const response = await fetch('/api/estadisticas/tendencias', {
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
  "estadísticas": true
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
