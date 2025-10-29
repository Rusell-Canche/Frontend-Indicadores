<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal -->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-users-cog"></i>
          </div>
          <div class="header-title-section">
            <h3>Gestión de Roles</h3>
            <p class="header-subtitle">
              jjj
            </p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <!-- Filtros y controles -->
        <div class="row g-3 mb-4 menu-roles">
          <div class="col-md-6">
            <div class="input-group modern-input">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input v-model="searchTerm" type="text" class="form-control"
                placeholder="Buscar roles por nombre o descripción..." />
            </div>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <button type="button" class="btn btn-primary me-2" @click="$router.push({ name: 'CrearRoles' })">
              <i class="fas fa-plus me-2"></i>
              Crear rol
            </button>
          </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando roles...</p>
        </div>

        <!-- Lista de roles -->
        <div class="rol-grid">
          <div v-for="rol in roles" :key="rol.id" class="rol-card">
            <!-- Header del rol -->
            <div class="rol-card-header">
              <div class="rol-icon">
                <i class="fas fa-user-tag" />
              </div>
              <div>
                <h5 class="rol-name">
                  {{ rol.nombre }}
                </h5>
              </div>
            </div>

            <!-- Cuerpo del rol -->
            <div class="rol-info">
              <p class="rol-description">{{ rol.descripcion }}</p>
            </div>

            <!-- Menu de opciones para el rol -->
            <div class="rol-actions">
              <button @click="abrirModal(rol)" class="btn btn-sm btn-view">
                <i class="fas fa-eye me-1" />
                Ver
              </button>
              <button class="btn btn-sm btn-edit">
                <i class="fas fa-edit me-1" />
                Editar
              </button>
              <button @click="eliminarRol(rol)" class="btn btn-sm btn-delete">
                <i class="fas fa-trash me-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
        <ModalVistaRol 
          :visible="modalVisible" 
          :rolID="rolSeleccionado?.id"
          @close="cerrarModal" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import axios from 'axios'
import type { Rol } from '@/models/rol'
import { RolService, rolState } from '@/services/Administracion/rol.service'

import ModalVistaRol from './ModalVistaRol.vue'
import { ref } from 'vue'

export default {
   components: {
    ModalVistaRol
  },
  data() {
    return {
      /** Controla si el modal es visible o no */
      modalVisible: false,

      /** Para comunicarse con el estado del servicio de los roles */
      rolState,

      /** Lista de roles */
      roles: [] as Rol[],

      /** El rol seleccionado actualmente */
      rolSeleccionado: null as Rol | null,

      // Filtros
      searchTerm: '',

      // Estados
      loading: false,
      expandedRoles: [],

      // Datos auxiliares
      recursos: [],
      acciones: [],

      // Edición
      editingRole: null,
      editForm: {
        nombre: '',
        descripcion: '',
        permisos: [],
        selectedResource: '',
      },
    }
  },
  computed: {

  },
  async mounted() {

    await RolService.fetchRoles(); // trae y actualiza automáticamente el state
    this.roles = rolState.roles || []
  },
  methods: {
    abrirModal(rol: Rol) {
      this.rolSeleccionado = rol
      this.modalVisible = true
      console.log('Modal abierto para rol:', rol.nombre) // Para debug
    },

    cerrarModal() {
      this.rolSeleccionado = null,
        this.modalVisible = false
    },

    // Eliminar rol
    async eliminarRol(rol: Rol) {
      const respuesta = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
      })

      if (respuesta.isConfirmed) {
        try {
          await RolService.deleteRol(rol.id);

          Swal.fire({
            title: 'Eliminado',
            text: `El rol "${rol.nombre}" ha sido eliminado correctamente.`,
            icon: 'success',
            timer: 2000
          });
        } catch (error: any) {

          if (error.response?.status === 409) {
            Swal.fire({
              title: 'Error',
              text: 'Este rol esta siendo usado por usuarios. No se pudo eliminar.',
              icon: 'error'
            })
          } else {
            // Errores genericos
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el rol. Inténtalo nuevamente.',
              icon: 'error'
            });
          }
        }
      }
    },
  },
}
</script>

<style scoped>
/* ESTILOS DE LA VISTA DE ROLES */
.rol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
  grid-auto-rows: 1fr;
}

.rol-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 0px 0px 16px 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 53, 69, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.rol-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-radius: 16px 16px 0 0;
}

.rol-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
}

.rol-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.rol-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.rol-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.rol-description {
  padding: 1rem 1.5rem;
  color: #25282b;
  font-size: 1rem;
}

.rol-actions {
  display: flex;
  padding: 1rem 1.5rem;
  background: white;
  gap: 0.75rem;
  justify-content: space-between;
}

/* Botones */
.btn-view {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-view:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
}

.btn-edit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

/* ---------------------------------------- /

/* Estilos base del diseño moderno */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
}

/* Header con el diseño moderno - ACTUALIZADO CON PALETA VERDE */
.medico-header {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.medico-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-title-section h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* Body con el diseño moderno */
.medico-body {
  padding: 2rem;
  background: white;
}

/* Estilos de inputs modernos - ACTUALIZADOS CON PALETA VERDE */
.modern-input {
  position: relative;
}

.modern-input .input-group-text {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus {
  border-color: #047857;
  box-shadow: 0 0 0 0.2rem rgba(4, 120, 87, 0.25);
  transform: translateY(-1px);
}

/* Estilos de las tarjetas de roles */
.role-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(4, 120, 87, 0.1);
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.15);
}

.permission-detail {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(4, 120, 87, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.permission-resource {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.resource-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.resource-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-badge .badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
}

/* Estilos del modal y formularios */
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #047857, #065f46);
  border-radius: 16px 16px 0 0;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #047857;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

/* Estilos de permisos */
.resource-permission-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(4, 120, 87, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.resource-permission-card:hover {
  box-shadow: 0 4px 15px rgba(4, 120, 87, 0.1);
  transform: translateY(-1px);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.permission-item {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.permission-item:hover {
  background: #f8f9fa;
  border-color: rgba(4, 120, 87, 0.1);
}

/* Checkbox personalizado mejorado - ACTUALIZADO CON PALETA VERDE */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  position: relative;
  padding-left: 2.75rem;
  width: 100%;
  line-height: 1.4;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 2px;
  height: 22px;
  width: 22px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.checkbox-container:hover .checkmark {
  border-color: #047857;
  box-shadow: 0 4px 8px rgba(4, 120, 87, 0.15);
  transform: translateY(-1px);
}

.custom-checkbox:checked~.checkmark {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-color: #047857;
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:checked~.checkmark:after {
  display: block;
}

.permission-content {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.permission-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.permission-description {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Estados vacíos */
.no-roles-state {
  background: white;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  margin-top: 1rem;
}

/* Botones personalizados - ACTUALIZADOS CON PALETA VERDE */
.btn-primary {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-save {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.btn-save::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-save:hover::before {
  left: 100%;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 120, 87, 0.4);
  color: white;
}

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

/* Badges personalizados - ACTUALIZADOS CON PALETA VERDE */
.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
}

.bg-primary {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
}

.bg-info {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%) !important;
}

.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%) !important;
}

/* Modal personalizado - ACTUALIZADO CON PALETA VERDE */
.modal-content {
  border-radius: 20px;
  border: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  border-radius: 0;
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.modal-title {
  font-weight: 600;
  margin: 0;
  z-index: 1;
  position: relative;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  margin: 0;
  z-index: 1;
  position: relative;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  background: white;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Spinner personalizado - ACTUALIZADO CON PALETA VERDE */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-primary {
  color: #047857 !important;
}

/* Animaciones */
@keyframes shimmer {

  0%,
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.role-card {
  animation: fadeIn 0.3s ease-out;
}

/* Transiciones suaves */
.btn {
  transition: all 0.2s ease;
}

.role-card,
.permission-detail,
.resource-permission-card {
  transition: all 0.3s ease;
}

/* Scrollbar personalizada */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #047857;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #065f46;
}

/* Mejoras en la accesibilidad */
.btn:focus,
.form-control:focus,
.custom-checkbox:focus~.checkmark {
  outline: 2px solid #047857;
  outline-offset: 2px;
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .medico-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .header-title-section h3 {
    font-size: 1.25rem;
  }

  .medico-body {
    padding: 1.5rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .role-header {
    flex-direction: column;
    gap: 1rem;
  }

  .role-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .actions-grid {
    justify-content: flex-start;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .medico-header {
    padding: 1rem;
  }

  .medico-body {
    padding: 1rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .modern-input .form-control {
    font-size: 0.9rem;
  }

  .checkbox-container {
    padding-left: 2.5rem;
  }

  .checkmark {
    height: 20px;
    width: 20px;
  }

  .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 9px;
  }
}
</style>
