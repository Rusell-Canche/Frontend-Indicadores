<template>
  <!-- Page Wrapper -->
  <div id="wrapper">
    <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center">
        <div class="sidebar-brand-icon rotate-n-15"></div>
        <div class="sidebar-brand-logo">
          <img
            src="@/assets/logo.png"
            alt="Logo"
            style="max-width: 100%; height: auto; max-height: 60px"
          />
        </div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0" />

      <!-- Nav Item - Dashboard -->
      <li class="nav-item" :class="{ active: $route.name === 'Dashboard' }">
        <router-link class="nav-link" :to="{ name: 'Dashboard' }">
          <i class="fas fa-home" style="color: #6b7990"></i>
          <span style="color: #848b96">PANEL DE CONTROL</span>
        </router-link>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider" />

      <!-- Nav Item - Pages Collapse Menu -->
      <li
        class="nav-item"
        :class="{
          active: isRouteInGroup([
            'consultarplantillas',
            'crearplantillas',
            'predeterminadasplantillas',
          ]),
        }"
      >
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i class="fas fa-folder-open" style="color: #6b7990"></i>
          <span style="color: #848b96">Plantillas</span>
        </a>
        <div
          id="collapseTwo"
          class="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Acciones:</h6>
            <router-link class="collapse-item" :to="{ name: 'Consultarplantillas' }"
              >Consultar plantillas</router-link
            >
            <router-link class="collapse-item" :to="{ name: 'Crearplantillas' }"
              >Crear nueva plantilla</router-link
            >
            <router-link class="collapse-item" :to="{ name: 'Predeterminadasplantillas' }"
              >Crear con una existente</router-link
            >
          </div>
        </div>
      </li>

      <li
        class="nav-item"
        :class="{
          active: isRouteInGroup([
            'consultardocumentos',
            'consultardocumentosglobal',
            'creardocumentos',
          ]),
        }"
      >
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseUtilities"
          aria-expanded="true"
          aria-controls="collapseUtilities"
        >
          <i class="fas fa-file-alt" style="color: #6b7990"></i>
          <span style="color: #848b96">Documentos</span>
        </a>
        <div
          id="collapseUtilities"
          class="collapse"
          aria-labelledby="headingUtilities"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Acciones:</h6>
            <router-link class="collapse-item" :to="{ name: 'Consultardocumentos' }"
              >Consultar documentos</router-link
            >
            <a class="collapse-item" href="#">Busqueda global</a>
            <router-link class="collapse-item" :to="{ name: 'Creardocumentos' }"
              >Crear documentos</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item" :class="{ active: isRoute('comentarios') }">
        <a class="nav-link" href="/comentarios">
          <i class="fas fa-comments" style="color: #6b7990"></i>
          <span style="color: #848b96">Comentarios</span>
        </a>
      </li>

      <li class="nav-item" :class="{ active: isRoute('carrusel') }">
        <a class="nav-link" href="/carrusel">
          <i class="far fa-images" style="color: #6b7990"></i>
          <span style="color: #848b96">Carrusel</span>
        </a>
      </li>

      <li class="nav-item" :class="{ active: isRoute('respaldo') }">
        <a class="nav-link" href="/respaldo">
          <i class="fas fa-download" style="color: #6b7990"></i>
          <span style="color: #848b96">Respaldo</span>
        </a>
      </li>

      <li class="nav-item" :class="{ active: isRoute('estadisticas') }">
        <a class="nav-link" href="/estadisticas">
          <i class="fas fa-chart-bar" style="color: #6b7990"></i>
          <span style="color: #848b96">Estadisticas</span>
        </a>
      </li>

      <!-- Conditional rendering for admin users -->
      <li v-if="hasAdminRole" class="nav-item">
        <a class="nav-link" href="/noticiasadmin">
          <i class="fas fa-newspaper"></i>
          <span>Noticias</span>
        </a>
      </li>

      <li class="nav-item" :class="{ active: isRoute('adminpublic') }">
        <a class="nav-link" href="/adminpublic">
          <i class="fas fa-magic" style="color: #6b7990"></i>
          <span style="color: #848b96">Vista publica</span>
        </a>
      </li>

      <!-- Conditional rendering for admin users -->
      <li v-if="hasAdminRole" class="nav-item">
        <a class="nav-link" href="/investigadores">
          <i class="fas fa-user-plus"></i>
          <span>Investigadores</span>
        </a>
      </li>

      <li class="nav-item" :class="{ active: isRouteInGroup(['Createuser', 'list-user']) }">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapsePages"
          aria-expanded="true"
          aria-controls="collapsePages"
        >
          <i class="fas fa-users" style="color: #6b7990"></i>
          <span style="color: #848b96">Usuarios</span>
        </a>
        <div
          id="collapsePages"
          class="collapse"
          aria-labelledby="headingPages"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Acciones:</h6>
            <a class="collapse-item" href="/Createuser">Crear usuario</a>
            <a class="collapse-item" href="/list-user">Listar usuarios</a>
          </div>
        </div>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block" />

      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle" @click="toggleSidebar"></button>
      </div>
    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <!-- Topbar Navbar -->
          <h1 class="navbar-brand"></h1>

          <ul class="navbar-nav ml-auto">
            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ userName }}</span>
                <i class="fas fa-caret-down"></i>
              </a>
              <!-- Dropdown - User Information -->
              <div
                class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Cerrar sesión
                </a>
              </div>
            </li>
          </ul>
        </nav>
        <!-- End of Topbar -->

        <div id="swup">
          <!-- Begin Page Content -->
          <div class="container-fluid">
            <router-view :userName="userName"></router-view>
          </div>
          <!-- End of Main Content -->
        </div>
      </div>
    </div>
    <!-- End of Content Wrapper -->

    <!-- Access Restricted Message -->
    <div v-if="isAccessRestricted" class="lock"></div>
    <div v-if="isAccessRestricted" class="message">
      <h1>El acceso a esta pagina esta restingido</h1>
      <p>Por favor comunicate con el administrador si consideras que hay un error</p>
      <a href="http://localhost:8000/home" type="button" class="btn btn-danger">Salir</a>
    </div>

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div
      class="modal fade"
      id="logoutModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">¿Estás listo para irte?</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            Seleccione "Cerrar sesión" a continuación si está listo para finalizar su sesión actual.
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
            <form id="logout-form" :action="logoutUrl" method="POST" style="display: none">
              <input type="hidden" name="_token" :value="csrfToken" />
            </form>
            <button class="btn btn-primary" type="button" @click="logout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'AdminDashboard',
  data() {
    return {
      userName: '',
      currentRoute: '',
      hasAdminRole: false,
      isAccessRestricted: false,
      logoutUrl: '/logout',
      csrfToken: '',
    }
  },
  mounted() {
    // Load external scripts
    this.loadExternalScripts()

    // Get current route
    this.currentRoute = window.location.pathname.split('/').pop()

    // Check user role - this would come from your authentication system
    this.checkUserRole()

    // Get CSRF token from meta tag
    this.csrfToken =
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''

    // Get user name from auth
    this.getUserInfo()
  },
  methods: {
    isRoute(route) {
      return this.currentRoute === route
    },
    isRouteInGroup(routes) {
      return routes.includes(this.currentRoute)
    },
    loadExternalScripts() {
      const scripts = [
        'src/assets/vendor/jquery/jquery.min.js',
        'src/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
        'src/assets/vendor/jquery-easing/jquery.easing.min.js',
        'src/assets/js/sb-admin-2.min.js',
        'src/assets/vendor/chart.js/Chart.min.js',
        'src/assets/css/sb-admin-2.min.css',
      ]

      scripts.forEach((src) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        document.head.appendChild(script)
      })
    },
    toggleSidebar() {
      document.body.classList.toggle('sidebar-toggled')
      document.querySelector('.sidebar').classList.toggle('toggled')
    },
    checkUserRole() {
      // This would be replaced with actual authentication logic
      // Fetch user info from your auth system
      // Example: this.hasAdminRole = this.$auth.user.hasRole('administrador');

      // For now, just a placeholder
      this.hasAdminRole = false // Set to true to test admin features
      this.isAccessRestricted = false // Set to true to test restricted access message
    },
    getUserInfo() {
      // This would fetch the user info from your auth system
      // Example: this.userName = this.$auth.user.name;

      // For now, just a placeholder
      this.userName = 'Usuario'
    },
    logout() {
      // Submit the logout form
      document.getElementById('logout-form').submit()
    },
  },
}
</script>

<style scoped>
/* En tu archivo CSS personalizado */
.collapse {
  visibility: visible !important;
}
/* Estilo hover para los elementos del menú */
.navbar-nav .nav-item:hover {
  background-color: #e7e7ff;
  transition: background-color 0.3s ease;
}

.navbar-nav .nav-item:hover .nav-link span {
  color: white;
  transition: color 0.3s ease;
}

.navbar-nav .nav-item:hover .nav-link i {
  color: white;
  transition: color 0.3s ease;
}

/* Bloquear el hover en el ítem activo */
.navbar-nav .nav-item.active:hover {
  background-color: #e7e7ff !important;
  cursor: default;
}

.nav-item.active > a.nav-link {
  background-color: #e7e7ff;
  /* Color de fondo para el elemento activo */
  color: #6969f4 !important;
  /* Color del texto */
}

.nav-item.active i {
  color: #6969f4 !important;
  /* Color del ícono */
}

.nav-item.active > a.nav-link {
  background-color: #e7e7ff;
  color: #6969f4 !important;
}

.nav-item.active > a.nav-link span {
  color: #6969f4 !important;
}

.nav-item.active > a.nav-link i {
  color: #6969f4 !important;
}

.navbar-brand {
  margin-left: 700px;
  /* Mover hacia la derecha */
  display: block;
}

/* Lock animation styles */
.lock {
  border-radius: 5px;
  width: 65px;
  height: 45px;
  background-color: #333;
  animation: dip 1s;
  animation-delay: 1.5s;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lock::before,
.lock::after {
  content: '';
  position: absolute;
  border-left: 5px solid #333;
  height: 20px;
  width: 15px;
  left: calc(50% - 12.5px);
}

.lock::before {
  top: -30px;
  border: 5px solid #333;
  border-bottom-color: transparent;
  border-radius: 15px 15px 0 0;
  height: 30px;
  animation:
    lock 2s,
    spin 2s;
}

.lock::after {
  top: -10px;
  border-right: 5px solid transparent;
  animation: spin 2s;
}

.message {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 80px;
}

@keyframes lock {
  0% {
    top: -45px;
  }
  65% {
    top: -45px;
  }
  100% {
    top: -30px;
  }
}

@keyframes spin {
  0% {
    transform: scaleX(-1);
    left: calc(50% - 30px);
  }
  65% {
    transform: scaleX(1);
    left: calc(50% - 12.5px);
  }
}

@keyframes dip {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
