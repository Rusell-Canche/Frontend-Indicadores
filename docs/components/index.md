# Componentes

Documentación de los componentes Vue del sistema.

## Componentes principales

### PanelDeControl
Componente principal del dashboard.
```vue
<script setup>
import PanelDeControl from '@/components/PanelDeControl.vue'
</script>

<template>
  <PanelDeControl />
</template>
```

### Bienvenida
Pantalla de bienvenida al usuario.
```vue
<script setup>
import Bienvenida from '@/components/Bienvenida.vue'
</script>

<template>
  <Bienvenida />
</template>
```

## Directivas personalizadas

### v-solo-numeros
Permite solo números en un input.
```vue
<template>
  <input v-solo-numeros type="text" />
</template>
```

### v-solo-texto
Permite solo texto en un input.
```vue
<template>
  <input v-solo-texto type="text" />
</template>
```

### v-solo-correo
Valida formato de correo electrónico.
```vue
<template>
  <input v-solo-correo type="text" />
</template>
```