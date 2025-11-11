# Módulo de Indicadores

El módulo de indicadores permite gestionar los indicadores del sistema de forma completa.

## Funcionalidades

### Ver Indicadores
Lista todos los indicadores del sistema con opciones de búsqueda y filtrado.

**Ruta:** `/Indicador/ver-indicadores`

**Componente:** `VerIndicadores.vue`

**Permisos requeridos:** `indicadores`

### Crear Indicador
Formulario para crear nuevos indicadores.

**Ruta:** `/Indicador/CrearIndicador`

**Componente:** `CrearIndicador.vue`

### Editar Indicador
Permite modificar un indicador existente.

**Ruta:** `/Indicador/ver-indicadores/editar/:id`

**Componente:** `EditarIndicador.vue`

**Props:**
- `id` (string) - ID del indicador a editar

### Configurar Indicador
Configuración avanzada del indicador.

**Ruta:** `/Indicador/ver-indicadores/configurar/:id`

**Componente:** `ConfigurarIndicador.vue`

### Cargar Indicadores
Carga masiva de indicadores desde archivo.

**Ruta:** `/Indicador/CargarIndicador`

**Componente:** `Cargarindicadores.vue`

## Ejemplo de uso
```vue
<template>
  <div>
    <h1>Mis Indicadores</h1>
    <VerIndicadores />
  </div>
</template>

<script setup>
import VerIndicadores from '@/components/VerIndicadores.vue'
</script>
```

## API

### Endpoints principales

- `GET /api/indicadores` - Lista de indicadores
- `POST /api/indicadores` - Crear indicador
- `PUT /api/indicadores/:id` - Actualizar indicador
- `DELETE /api/indicadores/:id` - Eliminar indicador