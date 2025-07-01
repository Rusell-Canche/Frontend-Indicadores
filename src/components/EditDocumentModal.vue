<template>
  <!-- Modal de edición -->
  <div v-if="isOpen" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-xl">
      <div class="modal-content modern-modal">
        <!-- Header del modal con el diseño moderno -->
        <div class="medico-header modal-header-custom">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-edit"></i>
            </div>
            <div class="header-title-section">
              <h3>Editar Documento</h3>
              <p class="header-subtitle">Modifica la información del documento</p>
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
            Modifica los campos del documento según tus necesidades
          </div>

          <!-- Sección para los campos del documento -->
          <div class="form-section">
            <h6 class="section-title">
              <i class="fas fa-file-alt me-2"></i>
              Campos del Documento
            </h6>

            <form @submit.prevent="submitEdit">
              <!-- Iterar sobre TODOS los campos del documento -->
              <div v-for="campo in camposDocumentoEdit" :key="campo" class="campo-container">
                <div class="campo-header">
                  <div class="campo-title">
                    <i class="fas fa-grip-vertical me-2"></i>
                    <span class="campo-index">{{ getCampoPlantilla(campo)?.alias || formatFieldName(campo) }}</span>
                  </div>
                </div>

                <div class="campo-body">
                  <!-- Obtener información del campo desde la plantilla -->
                  <template v-if="getCampoPlantilla(campo)">
                    <!-- CAMPO DE TIPO SUBFORM -->
                    <div v-if="getCampoPlantilla(campo).type === 'subform'" class="subform-section">
                      <label class="form-label">
                        <i class="fas fa-table me-2"></i>
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      
                      <div class="subform-container">
                        <div class="subform-header">
                          <i class="fas fa-indent me-2"></i>
                          <span>Subformulario para {{ getCampoPlantilla(campo).alias || campo }}</span>
                        </div>
                        <button 
                          type="button" 
                          @click="openEditSubformModal(getCampoPlantilla(campo))" 
                          class="add-campo-button mb-3"
                        >
                          <i class="fas fa-plus me-2"></i> Agregar entrada
                        </button>
                        <!-- Tabla para mostrar entradas del subformulario -->
                        <div class="table-responsive" v-if="getSubformDataForEdit(campo).length > 0">
                          <table class="table table-bordered table-hover">
                            <thead class="table-light">
                              <tr>
                                <th v-for="subcampo in getCampoPlantilla(campo).subcampos" :key="subcampo.name">
                                  {{ subcampo.alias || subcampo.name }}
                                </th>
                                <th class="text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, rowIndex) in getSubformDataForEdit(campo)" :key="rowIndex">
                                <td v-for="subcampo in getCampoPlantilla(campo).subcampos" :key="subcampo.name">
                                  <template v-if="subcampo.type === 'file'">
                                    {{ row[subcampo.name] || 'Sin archivo' }}
                                  </template>
                                  <template v-else>
                                    {{ row[subcampo.name] || '-' }}
                                  </template>
                                </td>
                                <td class="text-center">
                                  <button
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary me-2"
                                    @click="openEditSubformModal(getCampoPlantilla(campo), rowIndex)"
                                  >
                                    <i class="fas fa-edit"></i>
                                  </button>
                                  <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger"
                                    @click="removeSubformRowFromEdit(campo, rowIndex)"
                                  >
                                    <i class="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div v-else class="text-muted text-center py-3">
                          No hay entradas en este subformulario
                        </div>
                      </div>
                    </div>

                    <!-- CAMPO DE TIPO SELECT -->
                    <div v-else-if="getCampoPlantilla(campo).type === 'select'" class="form-field">
                      <label class="form-label">
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-list-ul"></i>
                        </span>
                        <select class="form-select" v-model="documentoEdit[campo]">
                          <option value="">Seleccione una opción</option>
                          <option 
                            v-for="(option, index) in getCampoPlantilla(campo).options" 
                            :key="index" 
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- CAMPO DE TIPO FILE -->
                    <div v-else-if="getCampoPlantilla(campo).type === 'file'" class="form-field">
                      <label class="form-label">
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-paperclip"></i>
                        </span>
                        <input
                          type="file"
                          class="form-control"
                          multiple
                          @change="handleFileUpload"
                          accept="image/*,video/*,audio/*,.pdf"
                        />
                      </div>
                      <!-- Vista previa de archivos -->
                      <div
                        v-if="documentoEdit[campo] && documentoEdit[campo].length"
                        class="file-preview mt-3"
                      >
                        <h6 class="preview-title">Archivos actuales:</h6>
                        <div class="file-preview-grid">
                          <div
                            v-for="(file, index) in documentoEdit[campo]"
                            :key="index"
                            class="file-preview-item"
                          >
                            <div class="file-preview-content">
                              <div class="file-preview-icon">
                                <i v-if="isImage(file)" class="fas fa-image"></i>
                                <i v-else-if="isVideo(file)" class="fas fa-video"></i>
                                <i v-else-if="isAudio(file)" class="fas fa-volume-up"></i>
                                <i v-else-if="isPDF(file)" class="fas fa-file-pdf"></i>
                                <i v-else class="fas fa-file"></i>
                              </div>
                              <span class="file-preview-name">{{ file }}</span>
                            </div>
                            <button type="button" @click="removeFile(index)" class="remove-file-button">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- CAMPO DE TIPO NUMBER -->
                    <div v-else-if="getCampoPlantilla(campo).type === 'number'" class="form-field">
                      <label class="form-label">
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-edit"></i>
                        </span>
                        <input
                          type="number"
                          class="form-control"
                          v-model="documentoEdit[campo]"
                          :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                        />
                      </div>
                    </div>

                    <!-- CAMPO DE TIPO DATE -->
                    <div v-else-if="getCampoPlantilla(campo).type === 'date'" class="form-field">
                      <label class="form-label">
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date" class="form-control" v-model="documentoEdit[campo]" />
                      </div>
                    </div>

                    <!-- CAMPO DE TIPO TEXT (por defecto) -->
                    <div v-else class="form-field">
                      <label class="form-label">
                        {{ getCampoPlantilla(campo).alias || formatFieldName(campo) }}
                        <span v-if="getCampoPlantilla(campo).required" class="text-danger">*</span>
                      </label>
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-edit"></i>
                        </span>
                        <input
                          type="text"
                          class="form-control"
                          v-model="documentoEdit[campo]"
                          :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                        />
                      </div>
                    </div>
                  </template>

                  <!-- Si no se encuentra en la plantilla, mostrar campo básico -->
                  <template v-else>
                    <label class="form-label">
                      {{ formatFieldName(campo) }}
                    </label>
                    
                    <!-- Recurso Digital (campo especial heredado) -->
                    <div v-if="campo === 'Recurso Digital'" class="file-upload-section">
                      <div class="input-group modern-input">
                        <span class="input-group-text">
                          <i class="fas fa-paperclip"></i>
                        </span>
                        <input
                          type="file"
                          class="form-control"
                          multiple
                          @change="handleFileUpload"
                          accept="image/*,video/*,audio/*,.pdf"
                        />
                      </div>
                      <!-- Vista previa de archivos -->
                      <div
                        v-if="documentoEdit[campo] && documentoEdit[campo].length"
                        class="file-preview mt-3"
                      >
                        <h6 class="preview-title">Archivos actuales:</h6>
                        <div class="file-preview-grid">
                          <div
                            v-for="(file, index) in documentoEdit[campo]"
                            :key="index"
                            class="file-preview-item"
                          >
                            <div class="file-preview-content">
                              <div class="file-preview-icon">
                                <i v-if="isImage(file)" class="fas fa-image"></i>
                                <i v-else-if="isVideo(file)" class="fas fa-video"></i>
                                <i v-else-if="isAudio(file)" class="fas fa-volume-up"></i>
                                <i v-else-if="isPDF(file)" class="fas fa-file-pdf"></i>
                                <i v-else class="fas fa-file"></i>
                              </div>
                              <span class="file-preview-name">{{ file }}</span>
                            </div>
                            <button type="button" @click="removeFile(index)" class="remove-file-button">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Campo de fecha (detección automática) -->
                    <div v-else-if="campo === 'Fecha' || campo.toLowerCase().includes('fecha')" class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-calendar-alt"></i>
                      </span>
                      <input type="date" class="form-control" v-model="documentoEdit[campo]" />
                    </div>

                    <!-- Campo de texto largo (detección automática) -->
                    <div v-else-if="campo.toLowerCase().includes('descripcion') || campo.toLowerCase().includes('comentario') || campo.toLowerCase().includes('observacion')" class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-align-left"></i>
                      </span>
                      <textarea
                        class="form-control"
                        v-model="documentoEdit[campo]"
                        :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                        rows="3"
                      ></textarea>
                    </div>

                    <!-- Otros campos de texto -->
                    <div v-else class="input-group modern-input">
                      <span class="input-group-text">
                        <i class="fas fa-font"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        v-model="documentoEdit[campo]"
                        :placeholder="`Ingrese ${formatFieldName(campo).toLowerCase()}`"
                      />
                    </div>
                  </template>
                </div>
              </div>

              <!-- Footer con botones -->
              <div class="medico-footer">
                <button type="button" @click="closeModal" class="btn btn-cancel">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="submit" class="btn btn-save" :disabled="loading">
                  <i class="fas fa-check me-2"></i>
                  {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para editar subformulario -->
  <SubformEditModal
    :show="showEditSubformModal"
    :subform-field="currentEditSubformField"
    :subform-data="currentEditSubformData"
    :editing-index="editingSubformIndex"
    @close="closeEditSubformModal"
    @save="saveEditSubformEntry"
    @file-change="onEditModalFileChange"
  />
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

/* Header con el diseño moderno - CAMBIADO A GRIS */
.medico-header {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
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
  background: linear-gradient(90deg, #6c757d, #5a6268);
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
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
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

.alert {
  border-radius: 12px;
  border: 1px solid #b8daff;
  background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

/* Estilos específicos para campos */
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
}

.campo-index {
  font-size: 0.95rem;
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
}

.delete-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.campo-body {
  margin-top: 1rem;
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

/* Botones de agregar */
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
}

.add-campo-button:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
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
  color: #495057;
  margin-bottom: 0.75rem;
}

.file-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.file-preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.file-preview-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.file-preview-name {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.remove-file-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
}

.remove-file-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(220, 53, 69, 0.3);
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
}

@media (max-width: 576px) {
  .modal-header-custom {
    padding: 1rem;
  }

  .modal-body-custom {
    padding: 1rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .campo-container {
    padding: 0.75rem;
  }

  .subform-container {
    padding: 0.75rem;
  }

  .modern-input .form-control,
  .modern-input .form-select {
    font-size: 0.9rem;
  }

  .file-preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>


<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import SubformEditModal from './SubformEditModal.vue'

export default {
  name: 'EditDocumentModal',
  
  components: {
    SubformEditModal
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    documento: {
      type: Object,
      default: () => ({})
    },
    camposPlantilla: {
      type: Array,
      default: () => []
    },
    selectedColeccion: {
      type: Object,
      default: null
    }
  },

  emits: ['close', 'save', 'success', 'error'],

  data() {
    return {
      // Datos del documento
      documentoEdit: {},
      camposDocumentoEdit: [],
      uploadedFiles: [],
      
      // Estados de carga
      loading: false,
      
      // Subformularios
      showEditSubformModal: false,
      currentEditSubformField: null,
      currentEditSubformData: {},
      editingSubformIndex: -1,
      editSubformData: {},
      editSubformFiles: {}
    }
  },

  watch: {
    documento: {
      handler(newDoc) {
        if (newDoc && Object.keys(newDoc).length > 0) {
          this.initializeEditData(newDoc)
        }
      },
      immediate: true,
      deep: true
    },

    isOpen(newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },

  methods: {
    // ========== INICIALIZACIÓN ==========
initializeEditData(documento) {
  this.documentoEdit = {}
  if (documento._id) this.documentoEdit._id = documento._id

  // Inicializar campos normales
  this.camposPlantilla
    .filter(campo => campo.type !== 'subform')
    .forEach(campo => {
      const nombreCampo = campo.name
      this.documentoEdit[nombreCampo] = documento[nombreCampo] ?? ''
    })

  // Inicializar campos subformulario en documentoEdit
  this.camposPlantilla
    .filter(campo => campo.type === 'subform')
    .forEach(campo => {
      const nombreCampo = campo.name
      let valorInicial = []

      // Si viene del documento, usarlo
      if (documento[nombreCampo]) {
        try {
          valorInicial = JSON.parse(documento[nombreCampo])
        } catch (e) {
          valorInicial = Array.isArray(documento[nombreCampo]) 
            ? [...documento[nombreCampo]] 
            : []
        }
      }

      this.documentoEdit[nombreCampo] = [...valorInicial]
    })

  this.camposDocumentoEdit = this.camposPlantilla.map(campo => campo.name)

  // Preparar datos internos para edición
  this.prepareSubformDataForEdit()
},


    resetData() {
      this.documentoEdit = {}
      this.camposDocumentoEdit = []
      this.editSubformData = {}
      this.editSubformFiles = {}
      this.uploadedFiles = []
      this.closeEditSubformModal()
    },

    // ========== CAMPO HELPERS ==========
    getCampoPlantilla(nombreCampo) {
      return this.camposPlantilla.find(campo => campo.name === nombreCampo) || null
    },

    formatFieldName(fieldName) {
      const fieldMap = {
        created_at: 'Fecha de creación',
        updated_at: 'Última actualización'
      }
      
      return fieldMap[fieldName] || 
        fieldName.replace(/_/g, ' ')
                 .replace(/\w\S*/g, word => 
                   word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
                 )
    },

    // ========== MODAL CONTROL ==========
    closeModal() {
      this.$emit('close')
    },

    // ========== SUBFORMULARIOS ==========
    prepareSubformDataForEdit() {
      this.editSubformData = {}
      this.editSubformFiles = {}
      
      this.camposPlantilla
        .filter(campo => campo.type === 'subform')
        .forEach(campo => {
          const fieldName = campo.name
          this.editSubformData[fieldName] = []
          this.editSubformFiles[fieldName] = []
          
          let subformData = this.documentoEdit[fieldName]
          
          if (typeof subformData === 'string') {
            try {
              subformData = JSON.parse(subformData)
            } catch (e) {
              subformData = []
            }
          }
          
          if (Array.isArray(subformData)) {
            subformData.forEach((row, index) => {
              const { datos, archivos } = this.separarDatosYArchivos(row, campo)
              this.editSubformData[fieldName].push(datos)
              this.editSubformFiles[fieldName].push(archivos)
            })
          }
        })
    },

    separarDatosYArchivos(row, campo) {
      const datos = {}
      const archivos = {}
      
      Object.keys(row).forEach(key => {
        const subcampo = campo.subcampos.find(sub => sub.name === key)
        if (subcampo?.type === 'file') {
          archivos[key] = row[key]
        } else {
          datos[key] = row[key]
        }
      })
      
      return { datos, archivos }
    },

    getSubformDataForEdit(fieldName) {
      if (!this.editSubformData[fieldName]) return []
      
      return this.editSubformData[fieldName].map((row, index) => {
        const combinedRow = { ...row }
        
        const fileData = this.editSubformFiles[fieldName]?.[index]
        if (fileData) {
          Object.keys(fileData).forEach(key => {
            if (fileData[key]) {
              combinedRow[key] = typeof fileData[key] === 'object' 
                ? fileData[key].name 
                : fileData[key]
            }
          })
        }
        
        return combinedRow
      })
    },

    openEditSubformModal(campo, rowIndex = -1) {
      this.currentEditSubformField = campo
      this.editingSubformIndex = rowIndex
      
      const emptyData = campo.subcampos.reduce((acc, sub) => {
        acc[sub.name] = sub.type === 'file' ? null : ''
        return acc
      }, {})
      
      if (rowIndex === -1) {
        this.currentEditSubformData = { ...emptyData }
      } else {
        const baseData = this.editSubformData[campo.name][rowIndex] || {}
        this.currentEditSubformData = { ...emptyData, ...baseData }
        
        const fileData = this.editSubformFiles[campo.name]?.[rowIndex]
        if (fileData) {
          Object.assign(this.currentEditSubformData, fileData)
        }
      }
      
      this.showEditSubformModal = true
    },

    closeEditSubformModal() {
      this.showEditSubformModal = false
      this.currentEditSubformField = null
      this.currentEditSubformData = {}
      this.editingSubformIndex = -1
    },
// ========== SUBFORMULARIOS - MÉTODO CORREGIDO ==========
saveEditSubformEntry(nuevosDatos) {
  console.log('🔵 saveEditSubformEntry llamado con:', nuevosDatos)
  
  const fieldName = this.currentEditSubformField?.name
  if (!fieldName) {
    console.error('❌ No hay campo de subformulario actual')
    return
  }

  console.log('🔵 Campo actual:', fieldName)
  console.log('🔵 Índice de edición:', this.editingSubformIndex)

  this.inicializarArraysSubform(fieldName)

  // Separar archivos y datos simples
  const { datos, archivos } = this.separarDatosYArchivos(nuevosDatos, this.currentEditSubformField)
  console.log('🔵 Datos separados:', { datos, archivos })

  if (this.editingSubformIndex === -1) {
    // Agregar nueva entrada
    this.editSubformData[fieldName].push(datos)
    this.editSubformFiles[fieldName].push(archivos)
    console.log('➕ Nueva entrada agregada')
  } else {
    // Actualizar entrada existente
    this.editSubformData[fieldName][this.editingSubformIndex] = datos
    this.editSubformFiles[fieldName][this.editingSubformIndex] = {
      ...this.editSubformFiles[fieldName][this.editingSubformIndex],
      ...archivos
    }
    console.log('✏️ Entrada existente actualizada')
  }

  // 🔁 ACTUALIZAR documentoEdit - ESTO ES CRÍTICO
  this.documentoEdit[fieldName] = this.combinarSubformData(fieldName)
  console.log('🔵 documentoEdit actualizado para', fieldName, ':', this.documentoEdit[fieldName])

  // ✅ Forzar reactividad de Vue
  this.$forceUpdate()

  this.closeEditSubformModal()
},

// ========== MÉTODO AUXILIAR MEJORADO ==========
combinarSubformData(fieldName) {
  console.log('🔵 Combinando datos para:', fieldName)
  console.log('🔵 editSubformData:', this.editSubformData[fieldName])
  console.log('🔵 editSubformFiles:', this.editSubformFiles[fieldName])
  
  if (!this.editSubformData[fieldName]) return []
  
  const resultado = this.editSubformData[fieldName].map((row, index) => {
    const rowCompleta = { ...row }
    const fileData = this.editSubformFiles[fieldName]?.[index]
    if (fileData) {
      Object.assign(rowCompleta, fileData)
    }
    return rowCompleta
  })
  
  console.log('🔵 Resultado combinado:', resultado)
  return resultado
},

    validarSubformulario() {
      const isValid = this.currentEditSubformField.subcampos.every(sub => {
        if (!sub.required) return true
        
        const value = this.currentEditSubformData[sub.name]
        
        if (sub.type === 'select') {
          return value !== '' && value !== null && value !== undefined
        }
        
        if (sub.type === 'file') {
          return !!value
        }
        
        return value !== null && value !== undefined && value !== ''
      })
      
      if (!isValid) {
        this.showError('Complete los campos requeridos')
      }
      
      return isValid
    },

    inicializarArraysSubform(fieldName) {
      if (!this.editSubformData[fieldName]) {
        this.editSubformData[fieldName] = []
      }
      if (!this.editSubformFiles[fieldName]) {
        this.editSubformFiles[fieldName] = []
      }
    },

    removeSubformRowFromEdit(fieldName, rowIndex) {
      this.editSubformData[fieldName]?.splice(rowIndex, 1)
      this.editSubformFiles[fieldName]?.splice(rowIndex, 1)
    },

    onEditModalFileChange(event, subcampoName) {
      const file = event.target.files[0]
      if (file) {
        this.currentEditSubformData[subcampoName] = file
      }
    },

    // ========== ARCHIVOS ==========
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files)
      
      // Agregar archivos nuevos al documento
      if (!this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'] = []
      }
      
      this.uploadedFiles.forEach(file => {
        this.documentoEdit['Recurso Digital'].push(file)
      })
      
      // Limpiar el input
      event.target.value = ''
    },

    removeFile(index) {
      if (this.documentoEdit['Recurso Digital']) {
        this.documentoEdit['Recurso Digital'].splice(index, 1)
      }
    },

    // File type checkers
    isImage: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(jpeg|jpg|png|gif)$/i.test(fileName)
    },
    
    isVideo: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(mp4|mov|avi)$/i.test(fileName)
    },
    
    isAudio: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.(mp3|wav|ogg)$/i.test(fileName)
    },
    
    isPDF: (file) => {
      const fileName = typeof file === 'string' ? file : file?.name || ''
      return /\.pdf$/i.test(fileName)
    },

    getFileName(file) {
      if (typeof file === 'string') return file
      if (file?.name) return file.name
      return 'Archivo'
    },

    // ========== SUBMIT ==========
    async submitEdit() {
      if (this.loading) return
      
      this.loading = true
      try {
        const formData = this.prepararFormData()

        // 👇 Agrega esto para ver qué contiene el formData
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ':', pair[1])
    }

        this.$emit('save', formData)
      } catch (error) {
        console.error('Error preparando datos:', error)
        this.showError('Error al preparar los datos del documento')
      } finally {
        this.loading = false
      }
    },

    prepararFormData() {
      const documentoParaActualizar = { ...this.documentoEdit }
      
      // Procesar subformularios
      this.camposPlantilla
        .filter(campo => campo.type === 'subform')
        .forEach(campo => {
          if (this.editSubformData[campo.name]) {
            documentoParaActualizar[campo.name] = this.combinarSubformData(campo.name)
          }
        })
      
      const formData = new FormData()
      
      Object.keys(documentoParaActualizar).forEach(campo => {
        this.agregarCampoAFormData(formData, campo, documentoParaActualizar[campo])
      })
      
      return formData
    },



    agregarCampoAFormData(formData, campo, valor) {
      if (campo === '_id') return
      
      if (campo === 'Recurso Digital') {
        this.procesarArchivosRecurso(formData, valor)
      } else {
        const campoInfo = this.getCampoPlantilla(campo)
        
        if (campoInfo?.type === 'subform') {
          this.procesarSubformularioDentroDeDocumentData(formData, campo, valor)

        } else if (campoInfo?.type === 'file' && valor instanceof File) {
          formData.append(campo, valor)
        } else if (valor !== null && valor !== undefined) {
          const valorFinal = typeof valor === 'object' ? JSON.stringify(valor) : valor
          formData.append(`document_data[${campo}]`, valorFinal)
        }
      }
    },

    procesarArchivosRecurso(formData, archivos) {
      if (Array.isArray(archivos)) {
        archivos.forEach((archivo, index) => {
          if (archivo instanceof File) {
            formData.append(`Recurso Digital[${index}]`, archivo)
          } else {
            formData.append('existing_files[]', archivo)
          }
        })
      }
    },

procesarSubformularioDentroDeDocumentData(formData, campo, valor) {
  if (Array.isArray(valor)) {
    valor.forEach((row, rowIndex) => {
      Object.keys(row).forEach(subcampo => {
        const subvalor = row[subcampo]
        
        const clave = `document_data[${campo}][${rowIndex}][${subcampo}]`

        if (subvalor instanceof File) {
          formData.append(clave, subvalor)
        } else if (subvalor !== null && subvalor !== undefined) {
          formData.append(clave, subvalor)
        }
      })
    })
  }
}
,

    // ========== UI HELPERS ==========
    showSuccess(message) {
      Swal.fire({
        title: 'Éxito',
        text: message,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d'
      })
    },
    
    showError(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#6c757d'
      })
    }
  }
}
</script>
