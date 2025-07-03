import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap'

//Importar las directivas
import SoloNumeros from './directives/SoloNumeros.js' 
import SoloTexto from './directives/SoloTexto.js'
import SoloTextoYNumeros from './directives/SoloTextoYNumeros.js'
import SoloCorreo from './directives/SoloCorreo.js'

const app = createApp(App)

app.use(router)

// Registrar las directivas globalmente
app.directive('solo-numeros', SoloNumeros) // nombre que usarás: v-numeros
app.directive('solo-texto', SoloTexto) // nombre que usarás: v-texto
app.directive('solo-texto-y-numeros', SoloTextoYNumeros) // nombre que usarás: v-texto-y-numeros
app.directive('solo-correo', SoloCorreo) // nombre que usarás: v-correos

app.mount('#app')
