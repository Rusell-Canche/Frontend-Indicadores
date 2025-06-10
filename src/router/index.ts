import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PanelDeControl from '../components/PanelDeControl.vue'
import indicador from '../components/indicador.vue'

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
          path: '/indicador',
          name: '/indicador',
          component: indicador,
        },
      ],
    },
  ],
})

export default router
