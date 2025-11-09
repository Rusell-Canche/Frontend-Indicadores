import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PanelDeControl from '../components/PanelDeControl.vue'
import Indicador from '../components/Indicador.vue'
import VerIndicadores from '../components/VerIndicadores.vue'
import Cargarindicadores from '@/components/Cargarindicadores.vue'
import CrearIndicador from '@/components/CrearIndicador.vue'
import Plantillas from '../components/Plantillas.vue'
import Documentos from '../components/Documentos.vue'
import Ejes from '../components/Ejes.vue'
import VerPlantillas from '@/components/VerPlantillas.vue'
import CrearPlantillas from '@/components/CrearPlantillas.vue'
import CrearDocumentos from '@/components/CrearDocumentos.vue'
import VerDocumentos from '@/components/VerDocumentos.vue'
import Bienvenida from '@/components/Bienvenida.vue'
import EditarIndicador from '@/components/EditarIndicador.vue'
import ConfigurarIndicador from '@/components/ConfigurarIndicador.vue'
import Reportes from '@/components/Reportes.vue'
import VerReportes from '@/components/VerReportes.vue'
import CrearReportes from '@/components/CrearReportes.vue'
import VerEjes from '@/components/VerEjes.vue'
import CrearEjes from '@/components/CrearEjes.vue'
import Estadisticas from '@/components/Estadisticas.vue'
import VerEstadisticas from '@/components/VerEstadisticas.vue'
import HistorialEstadisticas from '@/components/HistorialEstadisticas.vue'
import Forbidden from '@/components/Forbidden.vue'

import AdministracionLayout from '../components/Administracion/AdministracionLayout.vue'
import VerUsuarios from '@/components/Administracion/Usuarios/VerUsuarios.vue'
import CrearUsuarios from '@/components/Administracion/Usuarios/CrearUsuarios.vue'
import RolCrear from '@/components/Administracion/Roles/RolCrear.vue'
import RolesLista from '@/components/Administracion/Roles/RolesLista.vue'
import RolEditar from '@/components/Administracion/Roles/RolEditar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: { title: 'Login' },
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
          meta: { title: 'Bienvenida' },
        },
        {
          path: '/Indicador',
          name: '/Indicador',
          component: Indicador,
          meta: {
            title: 'Indicadores',
            modulo: 'indicadores',
          },
          children: [
            {
              path: 'ver-indicadores',
              name: 'ver-indicadores',
              component: VerIndicadores,
              meta: {
                title: 'Indicadores',
              },
              children: [
                {
                  path: 'editar/:id',
                  name: 'editar-indicador',
                  component: EditarIndicador,
                  props: true,
                  meta: { title: 'Editar Indicador' },
                },
                {
                  path: 'configurar/:id',
                  name: 'configurar-indicador',
                  component: ConfigurarIndicador,
                  props: true,
                  meta: { title: 'Configurar Indicador' },
                },
              ],
            },
            {
              path: 'CargarIndicador',
              name: 'CargarIndicador',
              component: Cargarindicadores,
              meta: { title: 'Cargar Indicadores' },
            },
            {
              path: 'CrearIndicador',
              name: 'CrearIndicador',
              component: CrearIndicador,
              meta: { title: 'Crear Indicador' },
            },
          ],
        },
        {
          path: '/Plantillas',
          name: 'Plantillas',
          component: Plantillas,
          meta: {
            title: 'Plantillas',
            modulo: 'plantillas',
          },
          children: [
            {
              path: 'VerPlantillas',
              name: 'VerPlantillas',
              component: VerPlantillas,
              meta: { title: 'Ver Plantillas' },
            },
            {
              path: 'CrearPlantillas',
              name: 'CrearPlantillas',
              component: CrearPlantillas,
              meta: { title: 'Crear Plantilla' },
            },
          ],
        },
        {
          path: '/Documentos',
          name: 'Documentos',
          component: Documentos,
          meta: {
            title: 'Documentos',
            modulo: 'documentos',
          },
          children: [
            {
              path: 'VerDocumentos',
              name: 'VerDocumentos',
              component: VerDocumentos,
              meta: { title: 'Ver Documentos' },
            },
            {
              path: 'CrearDocumentos',
              name: 'CrearDocumentos',
              component: CrearDocumentos,
              meta: { title: 'Crear Documento' },
            },
          ],
        },
        {
          path: '/Ejes',
          name: 'Ejes',
          component: Ejes,
          meta: {
            title: 'Ejes',
            module: 'ejes',
          },
          children: [
            {
              path: 'VerEjes',
              name: 'VerEjes',
              component: VerEjes,
              meta: { title: 'Ver Ejes' },
            },
            {
              path: 'CrearEjes',
              name: 'CrearEjes',
              component: CrearEjes,
              meta: { title: 'Crear Eje' },
            },
          ],
        },
        {
          path: '/administracion',
          name: 'Administracion',
          component: AdministracionLayout,
          children: [
            // SUBMODULO USUARIOS//
            {
              path: 'usuarios',
              children: [
                {
                  path: '',
                  name: 'usuarios',
                  component: VerUsuarios,
                  meta: { title: 'Usuarios' },
                },
                {
                  path: 'crear',
                  name: 'CrearUsuarios',
                  component: CrearUsuarios,
                  meta: { title: 'Crear Usuario' },
                },
                {
                  path: ':id/editar',
                  name: 'EditarUsuarios',
                  component: CrearUsuarios,
                  meta: { title: 'Editar Usuario' },
                },
              ],
            },
            // SUBMODULO DE ROLES //
            {
              path: 'roles',
              children: [
                {
                  path: '',
                  name: 'VerRoles',
                  meta: { title: 'Ver Roles' },
                  component: RolesLista,
                },
                {
                  path: 'crear',
                  name: 'CrearRol',
                  meta: { title: 'Crear Roles' },
                  component: RolCrear,
                },
                {
                  path: ':id/editar',
                  name: 'EditarRol',
                  meta: { title: 'Editar Rol' },
                  component: RolEditar,
                },
              ],
            },
          ],
        },
        {
          path: '/Reportes',
          name: 'Reportes',
          meta: {
            title: 'Reportes',
            modulo: 'reportes',
          },
          component: Reportes,
          children: [
            {
              path: 'VerReportes',
              name: 'VerReportes',
              meta: { title: 'Ver Reportes' },
              component: VerReportes,
            },
            {
              path: 'CrearReportes',
              name: 'CrearReportes',
              meta: { title: 'Crear Reportes' },
              component: CrearReportes,
            },
          ],
        },
        {
          path: '/Estadisticas',
          name: 'Estadisticas',
          component: Estadisticas,
          meta: {
            title: 'Estadísticas',
            modulo: 'estadisticas',
          },
          children: [
            {
              path: 'VerEstadisticas',
              name: 'VerEstadisticas',
              meta: { title: 'Crear Estadísticas' },
              component: VerEstadisticas,
            },
            {
              path: 'HistorialEstadisticas',
              name: 'HistorialEstadisticas',
              meta: { title: 'Ver Estadísticas' },
              component: HistorialEstadisticas,
            },
          ],
        },
      ],
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: Forbidden,
      meta: { title: 'Prohibido' },
    },
  ],
})

export default router
