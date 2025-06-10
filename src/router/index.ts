import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PanelDeControl from '../components/PanelDeControl.vue'
import Indicador from '../components/Indicador.vue'
import VerIndicadores from '../components/VerIndicadores.vue'

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
              path: '/VerIndicadores',
              name: '/VerIndicadores',
              component: VerIndicadores,
                }
          ],
        },
      ],
    },
  ],
})

export default router
