import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Sistema de Indicadores',
  description: 'Documentación del Sistema de Indicadores',
  
  themeConfig: {
    logo: '/logo.svg', // Si tienes un logo
    
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/guide/introduccion' },
      { text: 'Módulos', link: '/modules/indicadores' },
      { text: 'Componentes', link: '/components/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [
            { text: 'Introducción', link: '/guide/introduccion' },
            { text: 'Comenzar', link: '/guide/getting-started' },
            { text: 'Arquitectura', link: '/guide/arquitectura' }
          ]
        }
      ],
      '/modules/': [
        {
          text: 'Módulos del Sistema',
          items: [
            { text: '📊 Indicadores', link: '/modules/indicadores' },
            { text: '📄 Plantillas', link: '/modules/plantillas' },
            { text: '📁 Documentos', link: '/modules/documentos' },
            { text: '🎯 Ejes', link: '/modules/ejes' },
            { text: '👥 Usuarios', link: '/modules/usuarios' },
            { text: '📈 Reportes', link: '/modules/reportes' },
            { text: '📉 Estadísticas', link: '/modules/estadisticas' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Componentes',
          items: [
            { text: 'Índice', link: '/components/' },
            { text: 'Botones', link: '/components/buttons' },
            { text: 'Formularios', link: '/components/forms' },
            { text: 'Tablas', link: '/components/tables' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tu-usuario/tu-repo' }
    ],

    footer: {
      message: 'Sistema de Indicadores',
      copyright: 'Copyright © 2024'
    },

    search: {
      provider: 'local'
    }
  }
})