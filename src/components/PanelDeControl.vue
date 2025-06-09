<template>
  <div id="app">
    <div id="wrapper">
      <!-- Sidebar -->
      <ul
        class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a class="sidebar-brand d-flex align-items-center justify-content-center">
          <div class="sidebar-brand-logo">
            <img
              src="../assets/logo.png"
              alt="Logo"
              style="max-width: 100%; height: auto; max-height: 60px"
            />
          </div>
        </a>
        <hr class="sidebar-divider my-0" />

        <li class="nav-item">
          <a class="nav-link" href="/dashboard">
            <i class="fas fa-home"></i>
            <span>PANEL DE CONTROL</span>
          </a>
        </li>

        <!-- Menú dinámico simplificado -->
        <li class="nav-item">
          <a class="nav-link" href="/indicador">
            <i class="fas fa-tachometer-alt"></i>
            <span>Indicadores</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/ejes">
            <i class="fas fa-arrows-alt-v"></i>
            <span>Ejes</span>
          </a>
        </li>

        <!-- Menú desplegable de usuarios -->
        <li class="nav-item">
          <a
            class="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapsePages"
          >
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </a>
          <div id="collapsePages" class="collapse">
            <div class="bg-white py-2 collapse-inner rounded">
              <a class="collapse-item" href="/Createuser">Crear usuario</a>
              <a class="collapse-item" href="/list-user">Listar usuarios</a>
            </div>
          </div>
        </li>

        <hr class="sidebar-divider d-none d-md-block" />
        <div class="text-center d-none d-md-inline">
          <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <!-- Topbar -->
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <h1 class="navbar-brand mx-auto">{{ pageTitle }}</h1>
            <ul class="navbar-nav ml-auto">
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ userName }}</span>
                  <i class="fas fa-caret-down"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" @click="logout">
                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Cerrar sesión
                  </a>
                </div>
              </li>
            </ul>
          </nav>

          <!-- Contenido principal -->
          <div class="container-fluid">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de logout -->
    <div v-if="showLogoutModal" class="modal-backdrop fade show"></div>
    <div v-if="showLogoutModal" class="modal fade show" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">¿Estás listo para irte?</h5>
            <button type="button" class="close" @click="showLogoutModal = false">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            Seleccione "Cerrar sesión" a continuación si está listo para finalizar su sesión actual.
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showLogoutModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="confirmLogout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
/* Estilos de la barra lateral */
.navbar-nav .nav-item:hover {
  background-color: #e7e7ff;
  transition: background-color 0.3s ease;
}

.navbar-nav .nav-item:hover .nav-link span,
.navbar-nav .nav-item:hover .nav-link i {
  color: white;
  transition: color 0.3s ease;
}

.nav-item.active > a.nav-link {
  background-color: #e7e7ff;
  color: #6969f4 !important;
}

.nav-item.active > a.nav-link span,
.nav-item.active > a.nav-link i {
  color: #6969f4 !important;
}

/* Ajustes para el modal */
.modal-backdrop {
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
</style>
