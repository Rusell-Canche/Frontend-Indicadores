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
import VerPlantillas from '@/components/VerPlantillas.vue'
import CrearPlantillas from '@/components/CrearPlantillas.vue'
import CrearDocumentos from '@/components/CrearDocumentos.vue'
import VerDocumentos from '@/components/VerDocumentos.vue'
import VerUsuarios from '@/components/VerUsuarios.vue'
import CrearUsuarios from '@/components/CrearUsuarios.vue'
import Bienvenida from '@/components/Bienvenida.vue'
import EditarIndicador from '@/components/EditarIndicador.vue'
import ConfigurarIndicador from '@/components/ConfigurarIndicador.vue'

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
          path: 'Bienvenida',
          name: 'Bienvenida',
          component: Bienvenida,
        },
        {
          path: '/Indicador',
          name: '/Indicador',
          component: Indicador,
          children: [
            {
              path: 'ver-indicadores',
              name: 'ver-indicadores',
              component: VerIndicadores,
              children: [
                {
                  path: 'editar/:id',
                  name: 'editar-indicador',
                  component: EditarIndicador,
                  props: true,
                },
                {
                  path: 'configurar/:id',
                  name: 'configurar-indicador',
                  component: ConfigurarIndicador,
                  props: true,
                },
              ],
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
          children: [
            {
              path: 'VerPlantillas',
              name: 'VerPlantillas',
              component: VerPlantillas,
            },
            {
              path: 'CrearPlantillas',
              name: 'CrearPlantillas',
              component: CrearPlantillas,
            },
          ],
        },
        {
          path: '/Documentos',
          name: 'Documentos',
          component: Documentos,
          children: [
            {
              path: 'VerDocumentos',
              name: 'VerDocumentos',
              component: VerDocumentos,
            },
            {
              path: 'CrearDocumentos',
              name: 'CrearDocumentos',
              component: CrearDocumentos,
            },
          ],
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
          children: [
            {
              path: 'VerUsuarios',
              name: 'VerUsuarios',
              component: VerUsuarios,
            },
            {
              path: 'CrearUsuarios',
              name: 'CrearUsuarios',
              component: CrearUsuarios,
            },
          ],
        },
      ],
    },
  ],
})

export default router
