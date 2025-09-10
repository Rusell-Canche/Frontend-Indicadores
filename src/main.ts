import { createApp } from 'vue'
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

app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Material,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
            cssLayer: false
        }
    }
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
