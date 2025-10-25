import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

//Importar las directivas
import SoloNumeros from './directives/SoloNumeros.js' 
import SoloTexto from './directives/SoloTexto.js'
import SoloTextoYNumeros from './directives/SoloTextoYNumeros.js'
import SoloCorreo from './directives/SoloCorreo.js'

const app = createApp(App)

const DEFAULT_TITLE = 'Vue';
// Cambiar el título de la página según la ruta
router.afterEach((to) => {
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    nextTick(() => {
        const title = (to.meta as Record<string, any>)?.title;
        document.title = typeof title === 'string' ? title : DEFAULT_TITLE;
    });
});

// Verifica que el usuario tenga el permiso del modulo al intentar acceder a una ruta
router.beforeEach((to) => {

  // Obtenemos los permisos del localStorage
  const permisosStr = localStorage.getItem('ui_permissions');
  
  // Si no hay permisos rederigimos al login si la pagina actual no es el login
  if (!permisosStr && to.name !== 'Login') {
    console.warn('No se encontraron permisos de usuario. Redirigiendo al login.');
    return { name: 'Login' };
  }

  // Parseamos el objeto JSON
  const uiPermissions: Record<string, boolean> = JSON.parse(permisosStr || '{}');

  // Si la ruta no tiene meta.modulo, se deja pasar (no esta protegida)
  if (!to.meta?.modulo) {
    console.log('Ruta no protegida, acceso permitido');
    return true;
  }

  // Parseamos el nombre del modulo a string
  const modulo = to.meta.modulo as string;

  // Verificamos si el usuario tiene permiso para el modulo
  const tienePermiso = uiPermissions[modulo];

  if (tienePermiso) {
    console.log(`Acceso concedido al módulo: ${modulo}`);
    return true;
  } else {
    console.warn(`Acceso denegado al módulo: ${modulo}`);
    return { name: 'Forbidden' };
  }
})

app.use(router)

// Configuración en español para PrimeVue v4
const esLocale = {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  weekHeader: 'Sem',
  dateFormat: 'dd/mm/yy'
};

app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      prefix: 'p',
      darkModeSelector: 'none',
      cssLayer: false
    }
  },
  locale: esLocale // 👈 ¡Agrega esta línea!
});
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

// Registrar las directivas globalmente
app.directive('solo-numeros', SoloNumeros) // nombre que usarás: v-numeros
app.directive('solo-texto', SoloTexto) // nombre que usarás: v-texto
app.directive('solo-texto-y-numeros', SoloTextoYNumeros) // nombre que usarás: v-texto-y-numeros
app.directive('solo-correo', SoloCorreo) // nombre que usarás: v-correos

app.mount('#app')
