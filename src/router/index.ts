import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PanelDeControl from '../components/PanelDeControl.vue'
import Indicador from '../components/Indicador.vue'
import VerIndicadores from '../components/VerIndicadores.vue'
import Cargarindicadores from '@/components/Cargarindicadores.vue'
import CrearIndicador from '@/components/CrearIndicador.vue'
import Plantillas from '../components/Plantillas.vue'
import Documentos from '../components/Documentos.vue'
import Usuarios from '../components/Usuarios.vue'
import Ejes from '../components/Ejes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/PanelDeControl',
      name: 'PanelDeControl',
      component: PanelDeControl,
      children: [
        {
          path: '/Indicador',
          name: '/Indicador',
          component: Indicador,
          children: [
            {
              path: 'ver-indicadores',
              name: 'ver-indicadores',
              component: VerIndicadores,
            },
            {
              path: 'CargarIndicador',
              name: 'CargarIndicador',
              component: Cargarindicadores,
            },
            {
              path: 'CrearIndicador',
              name: 'CrearIndicador',
              component: CrearIndicador,
            },
          ],
        },
        {
          path: '/Plantillas',
          name: 'Plantillas',
          component: Plantillas,
        },
        {
          path: '/Documentos',
          name: 'Documentos',
          component: Documentos,
        },
        {
          path: '/Ejes',
          name: 'Ejes',
          component: Ejes,
        },
        {
          path: '/Usuarios',
          name: 'Usuarios',
          component: Usuarios,
        },
      ],
    },
  ],
})

export default router
