<template>
  <div class="container-fluid py-4">
    <!-- Contenedor principal-->
    <div class="card shadow border-0 rounded-3">
      <!-- Header con el diseño moderno -->
      <div class="medico-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="header-title-section">
            <h3>Crear Documento</h3>
            <p class="header-subtitle">Configura los campos para tu nuevo documento</p>
          </div>
        </div>
      </div>

      <!-- Body con el diseño moderno -->
      <div class="medico-body">
        <!-- Selector de Plantillas -->
        <div class="form-section">
          <h6 class="section-title">
            <i class="fas fa-tag me-2"></i>
            Selecciona una plantilla
          </h6>
          <div class="row g-3">
            <div class="col-md-12">
              <div class="input-group modern-input">
                <span class="input-group-text">
                  <i class="fas fa-list-alt"></i>
                </span>
                <select
                  id="plantillaSelector"
                  class="form-select"
                  v-model="selectedPlantilla"
                  @change="onPlantillaSelected"
                >
                  <option value="" disabled selected>Selecciona una plantilla</option>
                  <option
                    v-for="plantilla in plantillas"
                    :key="plantilla.nombre_plantilla"
                    :value="plantilla.id"
                  >
                    {{ plantilla.title || plantilla.nombre_plantilla }}
                  </option>
                </select>
              </div>
              <div class="form-text">Selecciona la plantilla para tu documento</div>
            </div>
          </div>
        </div>

        <div v-if="camposPlantilla.length > 0">
          <!-- Nota de campos requeridos -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>Los campos marcados con
            <span class="text-danger">*</span> son obligatorios
          </div>

          <form ref="form" @submit.prevent="onSubmit" enctype="multipart/form-data">
            <div v-for="(campo, campoIndex) in camposPlantilla" :key="campo.name">
              <div v-if="campo.name !== '_id'" class="form-section">
                <h6 class="section-title">
                  <i class="fas fa-edit me-2"></i>
                  {{ campo.alias || campo.name }}
                  <span v-if="campo.required || campo.filterable" class="text-danger">*</span>
                </h6>

                <!-- Campo de tipo subform -->
                <div v-if="campo.type === 'subform'" class="subform-container">
                  <div class="subform-header">
                    <i class="fas fa-indent me-2"></i>
                    <span>Subformulario para {{ campo.name || 'este campo' }}</span>
                  </div>
                  <button type="button" @click="openModal(campo)" class="add-campo-button">
                    <i class="fas fa-plus me-2"></i> Agregar entrada
                  </button>

                  <!-- Tabla para mostrar entradas existentes -->
                  <div class="table-responsive mt-3" v-if="getSubformRows(campo.name).length > 0">
                    <table class="table table-bordered table-hover">
                      <thead class="table-light">
                        <tr>
                          <th v-for="subcampo in campo.subcampos" :key="subcampo.name">
                            {{ subcampo.alias || subcampo.name }}
                          </th>
                          <th class="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, rowIndex) in getSubformRows(campo.name)" :key="rowIndex">
                          <td v-for="subcampo in campo.subcampos" :key="subcampo.name">
                            <template v-if="subcampo.type === 'file'">
                              {{ row[subcampo.name]?.name || 'Sin archivo' }}
                            </template>
                            <template v-else>
                              {{ row[subcampo.name] }}
                            </template>
                          </td>
                          <td class="text-center">
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-secondary me-2"
                              @click="openModal(campo, rowIndex)"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-danger"
                              @click="removeSubformRow(campo.name, rowIndex)"
                            >
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Campo de tipo select -->
                <div v-else-if="campo.type === 'select'" class="mt-2">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-list-ul"></i>
                    </span>
                    <select
                      class="form-select"
                      :id="campo.name"
                      v-model="documentData[campo.name]"
                      :required="campo.required"
                    >
                      <option value="" disabled selected>Seleccione una opción</option>
                      <option v-for="(option, index) in campo.options" :key="index" :value="option">
                        {{ option }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Campo de archivos -->
                <div v-else-if="campo.type === 'file'" class="mt-2">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-paperclip"></i>
                    </span>
                    <input
                      type="file"
                      class="form-control"
                      :id="campo.name"
                      :name="campo.name"
                      @change="onFileChange($event, campo.name)"
                      multiple
                    />
                  </div>
                  <!-- Vista previa de archivos -->
                  <div v-if="files[campo.name]" class="file-preview mt-3">
                    <h6 class="preview-title">Archivos seleccionados:</h6>
                    <div class="d-flex flex-wrap gap-3">
                      <div
                        class="file-item"
                        v-for="(file, index) in files[campo.name]"
                        :key="index"
                      >
                        <div class="file-content">
                          <div v-if="isImageFile(file)" class="file-thumbnail">
                            <img :src="getThumbnailUrl(file)" alt="Miniatura" class="img-fluid" />
                          </div>
                          <div v-else class="file-icon">
                            <i class="fas fa-file-alt"></i>
                          </div>
                          <span class="file-name">{{ file.name }}</span>
                        </div>
                        <button
                          type="button"
                          class="delete-button"
                          @click="removeFile(campo.name, index)"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Campo numérico -->
                <div v-else-if="campo.type === 'number'" class="mt-2">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-hashtag"></i>
                    </span>
                    <input
                      type="number"
                      class="form-control"
                      :id="campo.name"
                      v-model="documentData[campo.name]"
                      :required="campo.required"
                      placeholder="Ingrese un valor numérico"
                    />
                  </div>
                </div>

                <!-- Campo de fecha -->
                <div v-else-if="campo.type === 'date'" class="mt-2">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-calendar-alt"></i>
                    </span>
                    <input
                      type="date"
                      class="form-control"
                      :id="campo.name"
                      v-model="documentData[campo.name]"
                      :required="campo.require || campo.filterable"
                    />
                  </div>
                </div>

                <!-- Campo de texto -->
                <div v-else class="mt-2">
                  <div class="input-group modern-input">
                    <span class="input-group-text">
                      <i class="fas fa-font"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      :id="campo.name"
                      v-model="documentData[campo.name]"
                      :required="campo.required"
                      placeholder="Ingrese texto"
                    />
                  </div>
                </div>
                <div class="d-flex">
                <div class="form-text mt-1 me-4">
                  <small v-if="campo.required" class="text-danger">Campo obligatorio</small>
                  <small v-else class="text-muted">Campo opcional</small>
                </div>
                <div class="form-text mt-1">
                  <small v-if="campo.filterable" class="text-danger">Campo para filtro de fecha</small>
                </div>
              </div>
              </div>
            </div>

            <!-- Footer con botones -->
            <div class="medico-footer">
              <button @click="resetForm" class="btn btn-cancel" type="button">
                <i class="fas fa-eraser me-2"></i>
                Limpiar Formulario
              </button>
              <button type="submit" class="btn btn-save">
                <i class="fas fa-save me-2"></i>
                Crear Documento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para subformulario con diseño moderno -->
    <div v-if="showSubformModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-xl">
        <div class="modal-content modern-modal">
          <!-- Header del modal con el diseño moderno -->
          <div class="medico-header modal-header-custom">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-plus-circle" v-if="editingIndex === -1"></i>
                <i class="fas fa-edit" v-else></i>
              </div>
              <div class="header-title-section">
                <h3>{{ editingIndex === -1 ? 'Agregar' : 'Editar' }} entrada</h3>
                <p class="header-subtitle">{{ currentSubformField?.name || 'Subformulario' }}</p>
              </div>
            </div>
            <button type="button" @click="closeModal" class="close-button" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body del modal con el diseño moderno -->
          <div class="medico-body modal-body-custom">
            <!-- Nota informativa -->
            <div class="alert alert-info mb-4">
              <i class="fas fa-info-circle me-2"></i>
              Complete los campos del subformulario según sus necesidades
            </div>

            <!-- Sección para los campos del subformulario -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="fas fa-list me-2"></i>
                Campos del Subformulario
              </h6>

              <div
                v-for="subcampo in currentSubformField?.subcampos"
                :key="subcampo.name"
                class="campo-container"
              >
                <div class="campo-header">
                  <div class="campo-title">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span class="campo-index">{{ subcampo.alias || subcampo.name }}</span>
                    <span v-if="subcampo.required" class="required-badge">*</span>
                  </div>
                </div>

                <div class="campo-body">
                  <!-- Campo de archivo en modal -->
                  <div v-if="subcampo.type === 'file'" class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-paperclip"></i>
                      </span>
                      <input
                        type="file"
                        class="form-control"
                        @change="onModalFileChange($event, subcampo.name)"
                      />
                    </div>
                    <div
                      v-if="currentSubformData[subcampo.name]?.name"
                      class="file-info mt-2"
                    >
                      <div class="current-file">
                        <i class="fas fa-file me-2"></i>
                        <span>{{ currentSubformData[subcampo.name].name }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Campo numérico en modal -->
                  <div v-else-if="subcampo.type === 'number'" class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-hashtag"></i>
                      </span>
                      <input
                        type="number"
                        class="form-control"
                        v-model="currentSubformData[subcampo.name]"
                        :required="subcampo.required"
                        placeholder="Ingrese un valor numérico"
                      />
                    </div>
                  </div>

                  <!-- Campo select en modal -->
                  <div v-else-if="subcampo.type === 'select'" class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-list-ul"></i>
                      </span>
                      <select
                        class="form-select"
                        v-model="currentSubformData[subcampo.name]"
                        :required="subcampo.required"
                      >
                        <option value="" disabled selected>Seleccione una opción</option>
                        <option v-for="(option, index) in subcampo.options" :key="index" :value="option">
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Campo fecha en modal -->
                  <div v-else-if="subcampo.type === 'date'" class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-calendar-alt"></i>
                      </span>
                      <input
                        type="date"
                        class="form-control"
                        v-model="currentSubformData[subcampo.name]"
                        :required="subcampo.required || subcampo.filterable"
                      />
                    </div>
                  </div>

                  <!-- Campo texto en modal -->
                  <div v-else class="form-field">
                    <label class="form-label">
                      {{ subcampo.alias || subcampo.name }}
                      <span v-if="subcampo.required" class="text-danger">*</span>
                    </label>
                    <div class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-font"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        v-model="currentSubformData[subcampo.name]"
                        :required="subcampo.required"

                        placeholder="Ingrese texto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer con botones -->
              <div class="medico-footer">
                <button type="button" class="btn btn-cancel" @click="closeModal">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="button" class="btn btn-save" @click="saveSubformEntry">
                  <i class="fas fa-check me-2"></i>
                  {{ editingIndex === -1 ? 'Agregar' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos base del diseño moderno */
.card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
}

/* Header con el diseño moderno */
.medico-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
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
  background: linear-gradient(90deg, #6c757d, #495057);
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
  color: #6c757d;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.modern-input {
  position: relative;
}

.modern-input .input-group-text {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border: none;
  color: white;
  border-radius: 12px 0 0 12px;
  width: 50px;
  justify-content: center;
}

.modern-input .form-control,
.modern-input .form-select {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input .form-control:focus,
.modern-input .form-select:focus {
  border-color: #6c757d;
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
  transform: translateY(-1px);
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.alert {
  border-radius: 12px;
  border: 1px solid #b8daff;
  background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

/* Subformulario */
.subform-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  border: 1px solid rgba(108, 117, 125, 0.15);
}

.subform-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
}

.subform-header i {
  color: #6c757d;
}

/* Botón de agregar - CAMBIADO A VERDE */
.add-campo-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.add-campo-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.add-campo-button:hover::before {
  left: 100%;
}

.add-campo-button:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

/* Modal con diseño moderno */
.modal.fade.show {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

.modern-modal {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  background: white;
  border: none;
}

.modal-header-custom {
  padding: 2rem;
  border-bottom: none;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body-custom {
  padding: 2rem;
  background: white;
}

/* Estilos específicos para campos del modal */
.campo-container {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 1px solid rgba(108, 117, 125, 0.1);
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.campo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.campo-title {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
  gap: 0.5rem;
}

.campo-index {
  font-size: 0.95rem;
}

.required-badge {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.campo-body {
  margin-top: 1rem;
}

.form-field {
  margin-bottom: 1rem;
}

/* Información de archivo */
.file-info {
  margin-top: 0.75rem;
}

.current-file {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(145deg, #e9ecef 0%, #f8f9fa 100%);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  color: #495057;
}

.current-file i {
  color: #6c757d;
}

/* Footer con botones */
.medico-footer {
  padding: 1.5rem 0 0.5rem 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

.btn-save:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
  color: white;
}

/* Vista previa de archivos */
.file-preview {
  margin-top: 1rem;
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #495057;
}

.file-item {
  position: relative;
  width: 120px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.file-thumbnail {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.file-thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.file-icon {
  font-size: 2rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.file-name {
  font-size: 0.75rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.delete-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  position: absolute;
  top: -8px;
  right: -8px;
}

.delete-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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

/* Responsive */
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

  .campo-container {
    padding: 1rem;
  }

  .campo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .medico-footer {
    padding: 1rem 0;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .modal-dialog {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-header-custom {
    padding: 1.5rem;
  }

  .modal-body-custom {
    padding: 1.5rem;
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

  .campo-container {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .modal-header-custom {
    padding: 1rem;
  }

  .modal-body-custom {
    padding: 1rem;
  }
}
</style>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      plantillas: [],
      selectedPlantilla: null,
      camposPlantilla: [],
      documentData: {},
      files: {},
      subformData: {}, // Guarda los datos de texto/número/fecha
      subformFiles: {}, // Guarda referencias a archivos
      showSubformModal: false,
      currentSubformField: null,
      currentSubformData: {},
      editingIndex: -1,
    }
  },
  methods: {
    async fetchPlantillas() {
      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.get('http://127.0.0.1:8000/api/plantillas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.plantillas = response.data
      } catch (error) {
        console.error('Error obteniendo plantillas', error)
        this.showError('No se pudieron cargar las plantillas')
      }
    },

    async onPlantillaSelected() {
      if (this.selectedPlantilla) {
        try {
          const token = localStorage.getItem('apiToken')
          const response = await axios.get(
            `http://127.0.0.1:8000/api/plantillas/${this.selectedPlantilla}/campos`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (response.data) {
            this.camposPlantilla = response.data.campos
            // Inicializar arrays para cada subformulario
            this.camposPlantilla.forEach((campo) => {
              if (campo.type === 'subform') {
                // En Vue 3 podemos asignar directamente gracias a la reactividad mejorada
                this.subformData[campo.name] = []
                this.subformFiles[campo.name] = []
              }
            })
            this.resetForm() // Limpiar formulario al cambiar de plantilla
          }
        } catch (error) {
          console.error('Error al obtener los campos:', error)
          this.showError('Error al cargar los campos de la plantilla')
        }
      }
    },

    onFileChange(event, fieldName) {
      const fileList = event.target.files
      if (fileList.length > 0) {
        // En Vue 3 podemos asignar directamente
        this.files[fieldName] = Array.from(fileList)
      }
    },

    isImageFile(file) {
      return file && file.type && file.type.startsWith('image/')
    },

    getThumbnailUrl(file) {
      return this.isImageFile(file) ? URL.createObjectURL(file) : null
    },

    removeFile(fieldName, index) {
      if (this.files[fieldName]) {
        this.files[fieldName].splice(index, 1)
        if (this.files[fieldName].length === 0) {
          // En Vue 3 podemos eliminar propiedades directamente
          delete this.files[fieldName]
        }
      }
    },

    // Métodos para subforms
    getSubformRows(fieldName) {
      return this.subformData[fieldName] || []
    },

    openModal(campo, rowIndex = -1) {
      this.currentSubformField = campo
      this.editingIndex = rowIndex

      // Inicializar datos del subformulario
      const emptyData = campo.subcampos.reduce((acc, sub) => {
        acc[sub.name] = sub.type === 'file' ? null : ''
        return acc
      }, {})

      if (rowIndex === -1) {
        // Nuevo registro
        this.currentSubformData = { ...emptyData }
      } else {
        // Editar registro existente
        const baseData = this.subformData[campo.name][rowIndex] || {}

        // Combinar datos básicos con archivos
        this.currentSubformData = { ...emptyData, ...baseData }

        // Agregar archivos si existen
        if (this.subformFiles[campo.name] && this.subformFiles[campo.name][rowIndex]) {
          const fileData = this.subformFiles[campo.name][rowIndex]
          // Iterar sobre cada nombre de campo
          Object.keys(fileData).forEach((fieldName) => {
            if (fileData[fieldName]) {
              this.currentSubformData[fieldName] = fileData[fieldName]
            }
          })
        }
      }

      this.showSubformModal = true
    },

    closeModal() {
      this.showSubformModal = false
      this.currentSubformField = null
      this.currentSubformData = {}
      this.editingIndex = -1
    },

    saveSubformEntry() {
      const fieldName = this.currentSubformField.name

      // Validar campos requeridos
      const isValid = this.currentSubformField.subcampos.every((sub) => {
        if (!sub.required) return true
        // Validación para selects
        if (sub.type === 'select') {
          return (
            this.currentSubformData[sub.name] !== '' &&
            this.currentSubformData[sub.name] !== null &&
            this.currentSubformData[sub.name] !== undefined
          )
        }

        // Para archivos, validar si hay archivo nuevo o existente
        if (sub.type === 'file') {
          return !!this.currentSubformData[sub.name]
        }

        return (
          this.currentSubformData[sub.name] !== null &&
          this.currentSubformData[sub.name] !== undefined &&
          this.currentSubformData[sub.name] !== ''
        )
      })

      if (!isValid) {
        this.showError('Complete los campos requeridos')
        return
      }

      // Asegurar que los arrays existen
      if (!this.subformData[fieldName]) {
        this.subformData[fieldName] = []
      }

      if (!this.subformFiles[fieldName]) {
        this.subformFiles[fieldName] = []
      }

      // Separar datos normales de archivos
      const dataSinArchivos = {}
      const soloArchivos = {}

      // Clasificar datos
      Object.keys(this.currentSubformData).forEach((key) => {
        const valor = this.currentSubformData[key]

        if (valor instanceof File) {
          // Es un archivo
          soloArchivos[key] = valor
        } else {
          // Es un dato normal
          dataSinArchivos[key] = valor
        }
      })

      // Guardar o actualizar según corresponda
      if (this.editingIndex === -1) {
        // Nuevo registro
        this.subformData[fieldName].push(dataSinArchivos)
        this.subformFiles[fieldName].push(soloArchivos)
      } else {
        // Actualizar registro existente
        this.subformData[fieldName][this.editingIndex] = dataSinArchivos

        // Asegurar que existe el objeto para los archivos
        if (!this.subformFiles[fieldName][this.editingIndex]) {
          this.subformFiles[fieldName][this.editingIndex] = {}
        }

        // Solo actualizar los campos de archivo que se hayan modificado
        Object.keys(soloArchivos).forEach((key) => {
          if (soloArchivos[key]) {
            this.subformFiles[fieldName][this.editingIndex][key] = soloArchivos[key]
          }
        })
      }

      this.closeModal()
    },

    onModalFileChange(event, subcampoName) {
      const file = event.target.files[0]
      if (file) {
        // Asignación directa en Vue 3
        this.currentSubformData[subcampoName] = file
      }
    },

    removeSubformRow(fieldName, rowIndex) {
      if (this.subformData[fieldName] && this.subformData[fieldName].length > rowIndex) {
        // Eliminar la fila de datos
        this.subformData[fieldName].splice(rowIndex, 1)

        // Eliminar los archivos correspondientes
        if (this.subformFiles[fieldName] && this.subformFiles[fieldName].length > rowIndex) {
          this.subformFiles[fieldName].splice(rowIndex, 1)
        }
      }
    },

    async onSubmit() {
      // Validar campos select requeridos
      const selectFieldsEmpty = this.camposPlantilla.some((campo) => {
        if (campo.type === 'select' && campo.required) {
          return !this.documentData[campo.name] || this.documentData[campo.name] === ''
        }
        return false
      })

      if (selectFieldsEmpty) {
        this.showError('Por favor seleccione una opción en los campos obligatorios')
        return
      }

      // Validar campos requeridos en el formulario principal
      const requiredFieldsEmpty = this.camposPlantilla.some((campo) => {
        if (campo.required || campo.filterable && campo.type !== 'subform') {
          if (campo.type === 'file') {
            return !this.files[campo.name] || this.files[campo.name].length === 0
          }
          return !this.documentData[campo.name]
        }
        return false
      })

      // Validar subformularios requeridos
      const subformsEmpty = this.camposPlantilla.some((campo) => {
        if (campo.type === 'subform' && (campo.required||campo.filterable)) {
          return !this.subformData[campo.name] || this.subformData[campo.name].length === 0
        }
        return false
      })

      if (requiredFieldsEmpty || subformsEmpty) {
        this.showError('Complete todos los campos obligatorios')
        return
      }

      const formData = new FormData()

      // Datos principales del documento
      this.camposPlantilla.forEach((campo) => {
        if (campo.type !== 'file' && campo.type !== 'subform') {
          // Convertir a string para evitar problemas con valores nulos o undefined
          const valor =
            this.documentData[campo.name] !== undefined && this.documentData[campo.name] !== null
              ? this.documentData[campo.name]
              : ''
          formData.append(`document_data[${campo.name}]`, valor)
        }
      })

      // Datos de subformularios
      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'subform') {
          // Agregar datos del subformulario como JSON
          formData.append(
            `document_data[${campo.name}]`,
            JSON.stringify(this.subformData[campo.name] || []),
          )

          // Agregar archivos del subformulario
          if (this.subformFiles[campo.name]) {
            this.subformFiles[campo.name].forEach((rowFiles, rowIndex) => {
              Object.entries(rowFiles).forEach(([subName, file]) => {
                if (file instanceof File) {
                  formData.append(`subform_files[${campo.name}][${rowIndex}][${subName}]`, file)
                }
              })
            })
          }
        }
      })

      // Archivos principales del documento
      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'file' && this.files[campo.name]) {
          this.files[campo.name].forEach((file) => {
            formData.append(`files[${campo.name}][]`, file)
          })
        }
      })

      try {
        const token = localStorage.getItem('apiToken')
        const response = await axios.post(
          `http://127.0.0.1:8000/api/documentos/${this.selectedPlantilla}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
          },
        )

        Swal.fire({
          title: 'Éxito',
          text: 'Documento creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })

        this.resetForm()
      } catch (error) {
        console.error('Error al crear documento:', error)
        this.showError(
          'Error al crear el documento: ' +
            (error.response?.data?.message || error.message || 'Error desconocido'),
        )
      }
    },

    resetForm() {
      this.documentData = {}
      this.files = {}

      this.camposPlantilla.forEach((campo) => {
        if (campo.type === 'select') {
          this.documentData[campo.name] = ''
        }
        if (campo.type === 'subform') {
          this.subformData[campo.name] = []
          this.subformFiles[campo.name] = []
        }
      })

      if (this.$refs.form) this.$refs.form.reset()
    },
    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    },
  },
  mounted() {
    this.fetchPlantillas()
  },
}
</script>

