<template>
    <!-- Modal de edición -->
    <div v-if="isOpen" class="modal fade show" style="display: block">
        <div class="modal-dialog modal-xl">
            <div class="modal-content modern-modal">
                <!-- Header del modal -->
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
                    <button
                        type="button"
                        @click="closeModal"
                        class="close-button"
                        aria-label="Close"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Body del modal -->
                <div class="medico-body modal-body-custom">
                    <!-- Nota informativa -->
                    <div class="alert alert-info mb-4">
                        <i class="fas fa-info-circle me-2"></i>
                        Modifica los campos del documento según tus necesidades
                    </div>

                    <!-- Sección para los campos del documento -->
                    <form @submit.prevent="submitEdit">
                        <!-- Renderizar por secciones si existen -->
                        <div v-if="seccionesPlantilla.length > 0">
                            <div
                                v-for="(seccion, seccionIndex) in seccionesPlantilla"
                                :key="seccionIndex"
                                class="seccion-container mb-4"
                            >
                                <div class="seccion-header">
                                    <div class="seccion-header-content">
                                        <div class="seccion-title-wrapper">
                                            <div class="seccion-icon">
                                                <i class="fas fa-folder-open"></i>
                                            </div>
                                            <div class="seccion-info">
                                                <h5 class="seccion-title">
                                                    {{
                                                        seccion.nombre ||
                                                        'Sección ' + (seccionIndex + 1)
                                                    }}
                                                </h5>
                                                <span class="seccion-description"
                                                    >Complete los campos de esta sección</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="seccion-body">
                                    <div
                                        v-for="(campo, campoIndex) in seccion.fields"
                                        :key="campo.name"
                                    >
                                        <div v-if="campo.name !== '_id'" class="form-section">
                                            <h6 class="section-title">
                                                <i class="fas fa-edit me-2"></i>
                                                {{ campo.alias || campo.name }}
                                                <span v-if="campo.required" class="text-danger"
                                                    >*</span
                                                >
                                            </h6>

                                            <!-- CAMPO DE TIPO SUBFORM -->
                                            <!-- CAMPO DE TIPO SUBFORM -->
                                            <SubFormularioDocumento
                                                v-if="campo.type === 'subform'"
                                                :campo="campo"
                                                :valor="getSubformDataForEdit(campo.name)"
                                                @actualizar="
                                                    actualizarSubformulario($event, campo.name)
                                                "
                                                @actualizar-archivos-subform="
                                                    actualizarArchivosSubform
                                                "
                                            />

                                            <!-- Campo de tipo checkbox (CORREGIDO) -->
                                            <div
                                                v-else-if="campo.type === 'checkBox'"
                                                class="form-field"
                                            >
                                                <label class="form-label d-block mb-3">
                                                    <i class="fas fa-check-square me-2"></i>
                                                    {{ campo.alias || campo.name }}
                                                    <span v-if="campo.required" class="text-danger"
                                                        >*</span
                                                    >
                                                </label>
                                                <div class="checkbox-container d-block">
                                                    <div
                                                        class="form-check mb-2"
                                                        v-for="(option, index) in campo.options"
                                                        :key="index"
                                                    >
                                                        <input
                                                            class="form-check-input"
                                                            type="checkbox"
                                                            :id="campo.name + '_' + index"
                                                            :value="getSaveValue(option, campo)"
                                                            v-model="documentoEdit[campo.name]"
                                                        />
                                                        <label
                                                            class="form-check-label"
                                                            :for="campo.name + '_' + index"
                                                        >
                                                            {{ getDisplayValue(option, campo) }}
                                                        </label>
                                                    </div>
                                                </div>
                                                <small class="form-text text-muted mt-2">
                                                    Seleccione una o más opciones
                                                </small>
                                            </div>

                                            <!-- CAMPO DE TIPO SELECT -->
                                            <div v-else-if="campo.type === 'select'" class="mt-2">
                                                <div class="input-group modern-input">
                                                    <span class="input-group-text">
                                                        <i class="fas fa-list-ul"></i>
                                                    </span>
                                                    <select
                                                        class="form-select"
                                                        v-model="documentoEdit[campo.name]"
                                                        :required="campo.required"
                                                    >
                                                        <option
                                                            v-for="(option, index) in campo.options"
                                                            :key="index"
                                                            :value="
                                                                isManualSelect(campo)
                                                                    ? option
                                                                    : option.campoGuardar
                                                            "
                                                        >
                                                            {{
                                                                isManualSelect(campo)
                                                                    ? option
                                                                    : option.campoMostrar
                                                            }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <!-- Campo de archivos -->
                                            <div v-else-if="campo.type === 'file'" class="mt-2">
                                                <label class="form-label d-block mb-3">
                                                    <i class="fas fa-paperclip me-2"></i>
                                                    {{ campo.alias || campo.name }}
                                                    <span v-if="campo.required" class="text-danger"
                                                        >*</span
                                                    >
                                                </label>

                                                <!-- Input de archivo (solo nuevos) -->
                                                <div class="file-input-group mb-3">
                                                    <div class="input-group modern-input">
                                                        <span class="input-group-text">
                                                            <i class="fas fa-file"></i>
                                                        </span>
                                                        <input
                                                            type="file"
                                                            class="form-control"
                                                            :id="campo.name"
                                                            :name="campo.name"
                                                            @change="
                                                                onFileChange($event, campo.name)
                                                            "
                                                            multiple
                                                            :key="fileInputKey"
                                                        />
                                                    </div>
                                                </div>

                                                <!-- Vista previa solo de archivos nuevos -->
                                                <div
                                                    v-if="
                                                        files[campo.name] &&
                                                        files[campo.name].length > 0
                                                    "
                                                    class="file-preview mt-3"
                                                >
                                                    <h6 class="preview-title">
                                                        Archivos seleccionados ({{
                                                            files[campo.name].length
                                                        }}):
                                                    </h6>

                                                    <div class="d-flex flex-wrap gap-3">
                                                        <div
                                                            class="file-item"
                                                            v-for="(file, index) in files[
                                                                campo.name
                                                            ]"
                                                            :key="'nuevo-' + index"
                                                        >
                                                            <div class="file-content">
                                                                <div
                                                                    v-if="isImageFile(file)"
                                                                    class="file-thumbnail"
                                                                >
                                                                    <img
                                                                        :src="getThumbnailUrl(file)"
                                                                        alt="Miniatura"
                                                                        class="img-fluid"
                                                                    />
                                                                </div>
                                                                <div v-else class="file-icon">
                                                                    <i class="fas fa-file-alt"></i>
                                                                </div>
                                                                <span class="file-name">{{
                                                                    file.name
                                                                }}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="delete-button"
                                                                @click="
                                                                    removeFile(campo.name, index)
                                                                "
                                                            >
                                                                <i class="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="mt-3">
                                                        <button
                                                            type="button"
                                                            class="btn btn-outline-danger btn-sm"
                                                            @click="clearAllFiles(campo.name)"
                                                        >
                                                            <i class="fas fa-trash me-1"></i>
                                                            Limpiar todos los archivos
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- CAMPO DE TIPO NUMBER -->
                                            <div v-else-if="campo.type === 'number'" class="mt-2">
                                                <div class="input-group modern-input">
                                                    <span class="input-group-text">
                                                        <i class="fas fa-hashtag"></i>
                                                    </span>
                                                    <input
                                                        v-solo-numeros
                                                        type="number"
                                                        class="form-control"
                                                        v-model="documentoEdit[campo.name]"
                                                        :required="campo.required"
                                                        placeholder="Ingrese un valor numérico"
                                                    />
                                                </div>
                                            </div>

                                            <!-- Campo de tipo tabla -->
                                            <div v-else-if="campo.type === 'tabla'" class="mt-2">
                                                <div class="tabla-dinamica-container">
                                                    <label class="form-label d-block mb-3">
                                                        <i class="fas fa-table me-2"></i>
                                                        {{ campo.alias || campo.name }}
                                                        <span
                                                            v-if="campo.required"
                                                            class="text-danger"
                                                            >*</span
                                                        >
                                                    </label>

                                                    <!-- Botón para abrir modal de selección de datos -->
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline-primary mb-3"
                                                        @click="abrirModalTabla(campo)"
                                                    >
                                                        <i class="fas fa-plus me-2"></i>
                                                        Seleccionar datos para la tabla
                                                    </button>

                                                    <!-- Vista previa de la tabla seleccionada -->
                                                    <div
                                                        v-if="
                                                            tablaData[campo.name] &&
                                                            tablaData[campo.name].length > 0
                                                        "
                                                        class="table-responsive"
                                                    >
                                                        <table
                                                            class="table table-bordered table-sm"
                                                        >
                                                            <thead class="table-light">
                                                                <tr>
                                                                    <th
                                                                        v-for="columna in campo
                                                                            .tableConfig.campos"
                                                                        :key="columna.name"
                                                                    >
                                                                        {{ columna.name }}
                                                                    </th>
                                                                    <th class="text-center">
                                                                        Acciones
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr
                                                                    v-for="(
                                                                        fila, index
                                                                    ) in tablaData[campo.name]"
                                                                    :key="index"
                                                                >
                                                                    <td v-for="columna in campo.tableConfig.campos" :key="columna.name">
  <!-- Verificamos directamente si el campo es de tipo 'file' -->
  <div
    v-if="columna.type === 'file'"
    class="file-badges"
  >
      <button
      type="button"
                              class="p-button p-component p-button-icon-only p-button-text p-button-info p-button-sm"
                              @click="mostrarModalImagen = true; archivo = obtenerValorCampo(fila, columna.name)"
                              v-tooltip="'Ver Archivo'"
      style="width: 2rem; height: 2rem; padding: 0; display: flex; align-items: center; justify-content: center;"
    >
                              <i class="fa-solid fa-eye" style="color: #3b82f6; font-size: 0.875rem;"></i>
                            </button>
                          </div>

                          <!-- Si no es file, mostramos el valor normal -->
                          <span v-else>
                            {{ obtenerValorCampo(fila, columna.name) || '-' }}
                          </span>
</td>
                                                                    <td class="text-center">
                                                                        <button
                                                                            type="button"
                                                                            class="btn btn-sm btn-outline-danger"
                                                                            @click="
                                                                                eliminarFilaTabla(
                                                                                    campo.name,
                                                                                    index,
                                                                                )
                                                                            "
                                                                        >
                                                                            <i
                                                                                class="fas fa-trash"
                                                                            ></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <small class="text-muted">
                                                            {{
                                                                tablaData[campo.name].length
                                                            }}
                                                            fila(s) seleccionada(s)
                                                        </small>
                                                    </div>

                                                    <div v-else class="alert alert-info">
                                                        <i class="fas fa-info-circle me-2"></i>
                                                        No se han seleccionado datos para esta tabla
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- CAMPO DE TIPO DATE -->
                                            <div v-else-if="campo.type === 'date'" class="mt-2">
                                                <div class="input-group modern-input">
                                                    <span class="input-group-text">
                                                        <i class="fas fa-calendar-alt"></i>
                                                    </span>
                                                    <input
                                                        type="date"
                                                        class="form-control"
                                                        v-model="documentoEdit[campo.name]"
                                                        :required="campo.required"
                                                    />
                                                </div>
                                            </div>

                                            <!-- CAMPO DE TIPO TEXT -->
                                            <div v-else class="mt-2">
                                                <div class="input-group modern-input">
                                                    <span class="input-group-text">
                                                        <i class="fas fa-font"></i>
                                                    </span>
                                                    <input
                                                        v-solo-texto
                                                        type="text"
                                                        class="form-control"
                                                        v-model="documentoEdit[campo.name]"
                                                        :required="campo.required"
                                                        placeholder="Ingrese texto"
                                                    />
                                                </div>
                                            </div>

                                            <!-- Mensaje de requerido u opcional -->
                                            <div class="d-flex">
                                                <div class="form-text mt-1 me-4">
                                                    <small v-if="campo.required" class="text-danger"
                                                        >Campo obligatorio</small
                                                    >
                                                    <small v-else class="text-muted"
                                                        >Campo opcional</small
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Si no hay secciones, iterar directamente sobre camposDocumentoEdit -->
                        <div v-else>
                            <div
                                v-for="(campoName, idx) in camposDocumentoEdit"
                                :key="idx"
                                class="form-section"
                            >
                                <h6 class="section-title">
                                    <i class="fas fa-edit me-2"></i>
                                    {{
                                        getCampoPlantilla(campoName)?.alias ||
                                        formatFieldName(campoName)
                                    }}
                                    <span
                                        v-if="getCampoPlantilla(campoName)?.required"
                                        class="text-danger"
                                        >*</span
                                    >
                                </h6>

                                <!-- Lógica similar a arriba, usando `getCampoPlantilla(campoName)` -->
                                <!-- Aquí puedes reutilizar bloques similares a los anteriores -->
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
            <!-- Modal para seleccionar datos de tabla -->
            <div v-if="modalTablaVisible" class="modal fade show" style="display: block">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content modern-modal">
                        <div class="medico-header modal-header-custom">
                            <div class="header-content">
                                <div class="header-icon">
                                    <i class="fas fa-table"></i>
                                </div>
                                <div class="header-title-section">
                                    <h3>
                                        Seleccionar datos para
                                        {{ tablaActual?.alias || tablaActual?.name }}
                                    </h3>
                                    <p class="header-subtitle">
                                        Plantilla: {{ tablaActual?.tableConfig?.plantillaNombre }} -
                                        Sección:
                                        {{ tablaActual?.tableConfig?.seccion }}
                                    </p>
                                </div>
                            </div>
                            <button type="button" @click="cerrarModalTabla" class="close-button">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="medico-body modal-body-custom">
                            <!-- Barra de búsqueda y controles -->
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="input-group modern-input">
                                        <span class="input-group-text">
                                            <i class="fas fa-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="busquedaTabla"
                                            placeholder="Buscar en los datos disponibles..."
                                            @keyup.enter="paginaActual = 1"
                                        />
                                    </div>
                                </div>
                                <div
                                    class="col-md-6 d-flex justify-content-between align-items-center"
                                >
                                    <div class="form-text">
                                        Mostrando {{ datosPaginados.length }} de
                                        {{ datosFiltrados.length }} registros (Total:
                                        {{ datosTablaDisponibles.length }})
                                    </div>
                                    <div class="d-flex gap-2 align-items-center">
                                        <label class="form-label mb-0 me-2">Mostrar:</label>
                                        <select
                                            v-model="elementosPorPagina"
                                            class="form-select form-select-sm"
                                            style="width: auto"
                                        >
                                            <option value="5">5</option>
                                        </select>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="paginaActual = 1"
                                            :disabled="paginaActual === 1"
                                        >
                                            <i class="fas fa-angle-double-left"></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="paginaActual--"
                                            :disabled="paginaActual === 1"
                                        >
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <span class="mx-2 align-self-center">
                                            Página {{ paginaActual }} de {{ totalPaginas }}
                                        </span>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="paginaActual++"
                                            :disabled="paginaActual >= totalPaginas"
                                        >
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="paginaActual = totalPaginas"
                                            :disabled="paginaActual >= totalPaginas"
                                        >
                                            <i class="fas fa-angle-double-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <!-- Datos disponibles -->
                                <div class="col-md-6">
                                    <h6>Datos disponibles ({{ datosFiltrados.length }}):</h6>
                                    <div class="table-responsive" style="max-height: 400px">
                                        <table class="table table-bordered table-sm table-hover">
                                            <thead class="table-light sticky-top">
                                                <tr>
                                                    <th>Seleccionar</th>
                                                    <th
                                                        v-for="columna in tablaActual.tableConfig
                                                            .campos"
                                                        :key="columna.name"
                                                    >
                                                        {{ columna.name }}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="(fila, index) in datosPaginados"
                                                    :key="index"
                                                >
                                                    <td>
                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-success"
                                                            @click="seleccionarFilaTabla(fila)"
                                                            :disabled="
                                                                tablaSeleccionada.some(
                                                                    (f) =>
                                                                        f._documentId ===
                                                                        fila._documentId,
                                                                )
                                                            "
                                                            :title="
                                                                tablaSeleccionada.some(
                                                                    (f) =>
                                                                        f._documentId ===
                                                                        fila._documentId,
                                                                )
                                                                    ? 'Ya seleccionado'
                                                                    : 'Seleccionar'
                                                            "
                                                        >
                                                            <i class="fas fa-plus"></i>
                                                        </button>
                                                    </td>
                                                    <td
                                                        v-for="columna in tablaActual.tableConfig
                                                            .campos"
                                                        :key="columna.name"
                                                    >
                          <div v-if="columna.type === 'file'" class="file-badges">
                            <button type="button"
                              class="p-button p-component p-button-icon-only p-button-text p-button-info p-button-sm"
                              @click="mostrarModalImagen = true; archivo = obtenerValorCampo(fila, columna.name)"
                              v-tooltip="'Ver Archivo'"
                              style="width: 2rem; height: 2rem; padding: 0; display: flex; align-items: center; justify-content: center;">
                              <i class="fa-solid fa-eye" style="color: #3b82f6; font-size: 0.875rem;"></i>
                            </button>
                          </div>

                          <!-- Si no es file, mostramos el valor normal -->
                          <span v-else>
                            {{ obtenerValorCampo(fila, columna.name) || '-' }}
                          </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div
                                        v-if="datosPaginados.length === 0"
                                        class="text-center py-3 text-muted"
                                    >
                                        <i class="fas fa-inbox fa-2x mb-2"></i>
                                        <p>No se encontraron registros</p>
                                    </div>
                                </div>

                                <!-- Datos seleccionados -->
                                <div class="col-md-6">
                                    <div
                                        class="d-flex justify-content-between align-items-center mb-3"
                                    >
                                        <h6 class="mb-0">
                                            Datos seleccionados ({{ tablaSeleccionada.length }}):
                                        </h6>
                                        <button
                                            v-if="tablaSeleccionada.length > 0"
                                            type="button"
                                            class="btn btn-sm btn-outline-danger"
                                            @click="tablaSeleccionada = []"
                                        >
                                            <i class="fas fa-trash me-1"></i> Limpiar todo
                                        </button>
                                    </div>
                                    <div class="table-responsive" style="max-height: 400px">
                                        <table class="table table-bordered table-sm table-hover">
                                            <thead class="table-light sticky-top">
                                                <tr>
                                                    <th>Acción</th>
                                                    <th
                                                        v-for="columna in tablaActual.tableConfig
                                                            .campos"
                                                        :key="columna.name"
                                                    >
                                                        {{ columna.name }}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="(fila, index) in tablaSeleccionada"
                                                    :key="index"
                                                >
                                                    <td>
                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-danger"
                                                            @click="deseleccionarFilaTabla(index)"
                                                            title="Quitar selección"
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </td>
                                                    <td
                                                        v-for="columna in tablaActual.tableConfig
                                                            .campos"
                                                        :key="columna.name"
                                                    >
                          <div v-if="columna.type === 'file'" class="file-badges">
                            <button type="button"
                              class="p-button p-component p-button-icon-only p-button-text p-button-info p-button-sm"
                              @click="mostrarModalImagen = true; archivo = obtenerValorCampo(fila, columna.name)"
                              v-tooltip="'Ver Archivo'"
                              style="width: 2rem; height: 2rem; padding: 0; display: flex; align-items: center; justify-content: center;">
                              <i class="fa-solid fa-eye" style="color: #3b82f6; font-size: 0.875rem;"></i>
                            </button>
                          </div>

                          <!-- Si no es file, mostramos el valor normal -->
                          <span v-else>
                            {{ obtenerValorCampo(fila, columna.name) || '-' }}
                          </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div
                                        v-if="tablaSeleccionada.length === 0"
                                        class="text-center py-3 text-muted"
                                    >
                                        <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                                        <p>No hay registros seleccionados</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="medico-footer">
                            <button type="button" class="btn btn-cancel" @click="cerrarModalTabla">
                                <i class="fas fa-times me-2"></i>
                                Cancelar
                            </button>
                            <button
                                type="button"
                                class="btn btn-save"
                                @click="guardarSeleccionTabla"
                            >
                                <i class="fas fa-check me-2"></i>
                                Guardar selección ({{ tablaSeleccionada.length }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!-- Aquí insertas tu modal -->
    <VistaArchivos
      :mostrar="mostrarModalImagen"
      :archivos="archivo"
      @cerrar="mostrarModalImagen = false"
    />
  
</template>

<script>

    import VistaArchivos from "./VistaArchivos.vue"; 
    import api, { downloadStorageFile } from '@/services/api'
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import SubFormularioDocumento from './SubFormularioDocumento.vue'

    export default {
        name: 'EditDocumentModal',

        components: {
            SubFormularioDocumento,
            VistaArchivos,
        },

        props: {
            archivosarray: {
                type: Array,
                default: () => [],
            },
            tablaInicial: {
                type: Object,
                default: () => ({}),
            },
            isOpen: {
                type: Boolean,
                default: false,
            },
            documento: {
                type: Object,
                default: () => ({}),
            },
            camposPlantilla: {
                type: Object,
                default: () => [],
            },
            selectedColeccion: {
                type: Object,
                default: null,
            },
        },

        emits: ['close', 'save', 'success', 'error'],

        data() {
            return {
                //VARIABLES PARA EL MODAL DE IMAGEN
                mostrarModalImagen: false, // Para controlar si se muestra el modal
                archivo: null,            // Para pasar el archivo al modal
                // Datos de subformularios
                archivosSubformularios: {},
                // Mapeo de archivos: {nombreCampo: {seccion, campo, tipo, ...}}
                fileMapping: {},
                files: {}, // ← Aquí va
                fileInputKey: 0,
                tablaData: {}, // donde se guardan los datos seleccionados de cada tabla
                modalTablaVisible: false, // para abrir/cerrar modal
                tablaActual: null, // almacena el campo actual (la tabla en uso)
                datosTablaDisponibles: [], // lista de registros posibles a seleccionar
                tablaSeleccionada: [], // lo que el usuario selecciona dentro del modal
                busquedaTabla: '', // texto de búsqueda
                paginaActual: 1, // número de página actual
                elementosPorPagina: 5, // registros por página
                // Datos del documento
                documentoEdit: {},
                camposDocumentoEdit: [],
                uploadedFiles: [],

                // Estados de carga
                loading: false,

                // Subformularios
                editSubformData: {},
                editSubformFiles: {},
            }
        },
        mounted() {
            console.log('✅ Prop archivosArray recibida:', this.archivosarray)
            // Cargar datos iniciales si existen
            if (Object.keys(this.tablaInicial).length > 0) {
                this.tablaData = { ...this.tablaInicial }
            }
        },

        watch: {
            archivosArray: {
                handler(newVal) {
                    // Convertir las rutas (strings) en objetos útiles si es necesario
                    // Por ejemplo, para que el carrusel del hijo los entienda
                    this.uploadedFiles = Array.isArray(newVal) ? newVal.filter((item) => item) : []
                },
                immediate: true, // se ejecuta al montar
            },
            tablaInicial: {
                handler(newVal) {
                    if (newVal && Object.keys(newVal).length > 0) {
                        this.tablaData = { ...newVal }
                    }
                },
                deep: true,
            },
            documento: {
                handler(newDoc) {
                    if (newDoc && Object.keys(newDoc).length > 0) {
                        this.initializeEditData(newDoc)
                    }
                },
                immediate: true,
                deep: true,
            },

            isOpen(newVal) {
                if (!newVal) {
                    this.resetData()
                }
            },
        },

        computed: {
            seccionesPlantilla() {
                return this.camposPlantilla?.secciones ?? []
            },
            // Filtra los datos según la búsqueda
            datosFiltrados() {
                if (!this.busquedaTabla) {
                    return this.datosTablaDisponibles
                }

                const busqueda = this.busquedaTabla.toLowerCase()
                return this.datosTablaDisponibles.filter((fila) => {
                    return this.tablaActual.tableConfig.campos.some((columna) => {
                        const valor =
                            this.obtenerValorCampo(fila, columna)?.toString().toLowerCase() || ''
                        return valor.includes(busqueda)
                    })
                })
            },

            // Pagina los datos filtrados
            datosPaginados() {
                const start = (this.paginaActual - 1) * this.elementosPorPagina
                const end = start + this.elementosPorPagina
                return this.datosFiltrados.slice(start, end)
            },

            // Calcula el total de páginas
            totalPaginas() {
                return Math.ceil(this.datosFiltrados.length / this.elementosPorPagina)
            },
        },

        methods: {
            actualizarArchivosSubform(clave, archivos) {
                this.archivosSubformularios[clave] = archivos
                console.log('📎 Archivos de subform actualizados:', clave, archivos)
            },
            isImageUrl(url) {
                if (typeof url !== 'string') return false
                return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
            },

            getFileName(file) {
                if (!file) return 'Sin nombre'
                if (typeof file === 'string') {
                    return file.split('/').pop() || 'archivo'
                }
                return file.name || 'archivo'
            },

            onFileChange(event, fieldName) {
                const fileList = event.target.files
                if (fileList.length > 0) {
                    // Convertir FileList a Array
                    const newFiles = Array.from(fileList)

                    // Inicializar el array si no existe
                    if (!this.files[fieldName]) {
                        this.files[fieldName] = []
                    }

                    // Agregar los nuevos archivos al array existente (ACUMULAR)
                    this.files[fieldName] = [...this.files[fieldName], ...newFiles]
                    console.log('🔍 archivosArray recibido en el componente:', this.archivosarray)
                    // Forzar reset del input file para permitir seleccionar más archivos
                    this.resetFileInput(fieldName)

                    console.log(
                        '📁 files después de agregar:',
                        JSON.parse(JSON.stringify(this.files)),
                    )
                }
            },
            async onFileChangeUrl(url, fieldName) {
                try {
                    // Descargar el archivo desde la URL
                    const file = await downloadStorageFile(url)

                    // Inicializar el array si no existe
                    if (!this.files[fieldName]) {
                        this.files[fieldName] = []
                    }

                    // Agregar el archivo descargado al array
                    this.files[fieldName] = [...this.files[fieldName], file]

                    console.log(
                        '📁 files después de agregar desde URL:',
                        JSON.parse(JSON.stringify(this.files)),
                    )
                } catch (error) {
                    console.error('❌ Error al cargar archivo desde URL:', error)
                    if (error.response) {
                        console.error('Status:', error.response.status)
                        console.error('Data:', error.response.data)
                    }
                }
            },
            resetFileInput(fieldName) {
                // Incrementar la key para forzar el re-render del input
                this.fileInputKey += 1

                // También resetear el valor del input directamente
                const inputElement = document.getElementById(fieldName)
                if (inputElement) {
                    inputElement.value = ''
                }
            },
            triggerFileInput(fieldName) {
                const inputElement = document.getElementById(fieldName)
                if (inputElement) {
                    inputElement.click()
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

                    // Si no quedan archivos, limpiar el array
                    if (this.files[fieldName].length === 0) {
                        delete this.files[fieldName]
                    }
                }
            },
            clearAllFiles(fieldName) {
                if (this.files[fieldName]) {
                    delete this.files[fieldName]
                }
                // Resetear el input file también
                this.resetFileInput(fieldName)
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

            // 2. MÉTODO PARA CARGAR DATOS DE TABLA EXISTENTES
            async cargarDatosTablaExistentes(nombreCampo, ids, tableConfig) {
                try {
                    // Hacer petición al backend para obtener los documentos completos
                    const plantilla = tableConfig.plantillaNombre
                    const seccion = tableConfig.seccion

                    // Petición para obtener documentos por IDs
                    const response = await axios.post('/api/documentos/obtener-por-ids', {
                        ids: ids,
                        plantilla: plantilla,
                        seccion: seccion,
                    })

                    if (response.data && Array.isArray(response.data)) {
                        // Inicializar tablaData si no existe
                        if (!this.tablaData[nombreCampo]) {
                            this.$set(this.tablaData, nombreCampo, [])
                        }

                        // Cargar los datos completos en tablaData
                        this.tablaData[nombreCampo] = response.data.map((doc) => ({
                            ...doc,
                            _documentId: doc._id || doc._documentId,
                        }))

                        console.log(
                            `✅ Cargados ${this.tablaData[nombreCampo].length} registros para ${nombreCampo}`,
                        )
                    }
                } catch (error) {
                    console.error(`Error al cargar datos de tabla ${nombreCampo}:`, error)
                    // Si hay error, al menos inicializar con IDs vacíos para que no se pierdan
                    if (!this.tablaData[nombreCampo]) {
                        this.$set(this.tablaData, nombreCampo, [])
                    }
                }
            },

            getSaveValue(option, campo) {
                if (typeof option === 'string') {
                    return option
                }
                return option.campoGuardar || option.value || option
            },

            getDisplayValue(option, campo) {
                if (typeof option === 'string') {
                    return option
                }
                return option.campoMostrar || option.label || option.text || option
            },

            formatFieldName(fieldName) {
                const fieldMap = {
                    created_at: 'Fecha de creación',
                    updated_at: 'Última actualización',
                }

                return (
                    fieldMap[fieldName] ||
                    fieldName
                        .replace(/_/g, ' ')
                        .replace(
                            /\w\S*/g,
                            (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(),
                        )
                )
            },

            // ========== INICIALIZACIÓN ==========
            // 4. Corregir el método initializeEditData para manejar mejor los subformularios
            initializeEditData(documento) {
                console.log('🔄 Inicializando datos de edición:', documento)
                console.log('📋 Plantilla:', this.camposPlantilla)

                this.documentoEdit = {}
                if (documento._id) this.documentoEdit._id = documento._id

                // Obtener campos planos
                let campos = []
                if (this.camposPlantilla && Array.isArray(this.camposPlantilla.secciones)) {
                    this.camposPlantilla.secciones.forEach((seccion) => {
                        if (Array.isArray(seccion.fields)) {
                            campos.push(...seccion.fields)
                        }
                    })
                }

                // Inicializar campos normales
                campos
                    .filter((campo) => campo.type !== 'subform')
                    .forEach((campo) => {
                        const nombreCampo = campo.name
                        let valorCampo = this.extraerValorCampoDelDocumento(documento, nombreCampo)

                        //console.log('campo: ', nombreCampo)
                        //console.log('valor: ', valorCampo)

                        if (campo.type === 'file') {
                            if (Array.isArray(valorCampo)) {
                                valorCampo.forEach((campo) => {
                                    this.onFileChangeUrl(campo, nombreCampo)
                                })
                            } else {
                                this.onFileChangeUrl(valorCampo, nombreCampo)
                            }
                        }

                        this.documentoEdit[nombreCampo] = valorCampo ?? ''

                        // ✅ Manejo especial para checkBox
                        if (campo.type === 'checkBox') {
                            if (typeof valorCampo === 'string') {
                                try {
                                    valorCampo = JSON.parse(valorCampo)
                                } catch {
                                    valorCampo = []
                                }
                            }
                            if (!Array.isArray(valorCampo)) {
                                valorCampo = []
                            }
                            this.documentoEdit[nombreCampo] = [...valorCampo]
                            return
                        }

                        // Manejar selects especiales
                        if (campo.type === 'select' && !this.isManualSelect(campo)) {
                            const option = campo.options?.find((o) => o.campoGuardar === valorCampo)
                            if (option) {
                                this.documentoEdit[nombreCampo] = option.campoGuardar
                            }
                        }
                    })

                // === Inicializar campos de tipo tabla ===
                campos
                    .filter((campo) => campo.type === 'tabla')
                    .forEach((campo) => {
                        const nombreCampo = campo.name
                        let valorTabla = this.extraerValorCampoDelDocumento(documento, nombreCampo)
                        console.log('valor tabla: ', valorTabla)

                        // Intentar parsear si viene en string JSON
                        if (typeof valorTabla === 'string') {
                            try {
                                valorTabla = JSON.parse(valorTabla)
                            } catch {
                                valorTabla = []
                            }
                        }

                        if (!Array.isArray(valorTabla)) {
                            valorTabla = []
                        }

                        // ✅ Guardar tanto en documentoEdit como en tablaData
                        this.documentoEdit[nombreCampo] = valorTabla
                        this.tablaData[nombreCampo] = [...valorTabla]
                    })

                // Inicializar subformularios
                campos
                    .filter((campo) => campo.type === 'subform')
                    .forEach((campo) => {
                        const nombreCampo = campo.name
                        let valorSubform = this.extraerValorCampoDelDocumento(
                            documento,
                            nombreCampo,
                        )

                        console.log('valorSubform: ', valorSubform)

                        // Parsear si es string JSON
                        if (typeof valorSubform === 'string') {
                            try {
                                valorSubform = JSON.parse(valorSubform)
                            } catch (e) {
                                console.warn('⚠️ Error parseando subformulario:', valorSubform)
                                valorSubform = []
                            }
                        }

                        // Asegurar que sea array
                        if (!Array.isArray(valorSubform)) {
                            valorSubform = []
                        }

                        this.documentoEdit[nombreCampo] = [...valorSubform]
                    })

                this.camposDocumentoEdit = campos.map((campo) => campo.name)
                this.prepareSubformDataForEdit()
            },
            isManualSelect(campo) {
                if (!campo.options || !Array.isArray(campo.options) || campo.options.length === 0) {
                    return true
                }

                const firstOption = campo.options[0]

                if (typeof firstOption === 'string') {
                    return true
                }

                if (
                    typeof firstOption === 'object' &&
                    firstOption.hasOwnProperty('campoMostrar') &&
                    firstOption.hasOwnProperty('campoGuardar')
                ) {
                    return false
                }

                return true
            },

            resetData() {
                this.documentoEdit = {}
                this.camposDocumentoEdit = []
                this.editSubformData = {}
                this.editSubformFiles = {}
                this.uploadedFiles = []
                this.archivosSubformularios = {}

                // Archivos / mapping / inputs
                this.files = {} // limpia archivos seleccionados en inputs
                this.fileMapping = {} // limpia el mapping que puedas usar
                this.fileInputKey += 1 // fuerza re-render de inputs file para evitar valores residuales
            },

            getCampoPlantilla(nombreCampo) {
                if (!this.camposPlantilla || !Array.isArray(this.camposPlantilla.secciones))
                    return null

                for (const seccion of this.camposPlantilla.secciones) {
                    if (Array.isArray(seccion.fields)) {
                        const campo = seccion.fields.find((campo) => campo.name === nombreCampo)
                        if (campo) return campo
                    } else if (typeof seccion.fields === 'object') {
                        for (const key in seccion.fields) {
                            if (key === nombreCampo) {
                                return { name: key, ...seccion.fields[key] }
                            }
                        }
                    }
                }

                return null
            },

            // ========== MODAL CONTROL ==========
            closeModal() {
                this.$emit('close')
            },

            // ========== SUBFORMULARIOS ==========
            prepareSubformDataForEdit() {
                this.editSubformData = {}
                this.editSubformFiles = {}

                let campos = []

                if (this.camposPlantilla && Array.isArray(this.camposPlantilla.secciones)) {
                    this.camposPlantilla.secciones.forEach((seccion) => {
                        if (Array.isArray(seccion.fields)) {
                            seccion.fields.forEach((campo) => {
                                campos.push(campo)
                            })
                        } else if (typeof seccion.fields === 'object') {
                            Object.entries(seccion.fields).forEach(([key, value]) => {
                                campos.push({ name: key, ...value })
                            })
                        }
                    })
                } else {
                    console.warn('⚠️ camposPlantilla.secciones no es un arreglo válido')
                }

                const camposSubform = campos.filter((campo) => campo.type === 'subform')

                camposSubform.forEach((campo) => {
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
            // 5. Método helper para extraer valores de campos del documento
            extraerValorCampoDelDocumento(documento, nombreCampo) {
                // Buscar en las secciones del documento
                if (Array.isArray(documento.secciones)) {
                    for (const seccion of documento.secciones) {
                        if (seccion.fields && typeof seccion.fields === 'object') {
                            if (nombreCampo in seccion.fields) {
                                return seccion.fields[nombreCampo]
                            }
                        }
                    }
                }

                // Buscar en el nivel raíz del documento
                if (documento[nombreCampo] !== undefined) {
                    return documento[nombreCampo]
                }

                return null
            },
            separarDatosYArchivos(row, campo) {
                const datos = {}
                const archivos = {}

                Object.keys(row).forEach((key) => {
                    const subcampo = campo.subcampos.find((sub) => sub.name === key)
                    if (subcampo?.type === 'file') {
                        archivos[key] = row[key]
                    } else {
                        datos[key] = row[key]
                    }
                })

                return { datos, archivos }
            },

            // ========== MÉTODOS FALTANTES PARA EditDocumentModal.vue ==========

            // 1. Agregar el método actualizarSubformulario que falta
            actualizarSubformulario(nuevosValores, nombreCampo) {
                console.log('📝 Actualizando subformulario:', nombreCampo, nuevosValores)

                // Asegurar que nuevosValores sea un array
                const valoresArray = Array.isArray(nuevosValores) ? nuevosValores : []

                // Actualizar el valor en documentoEdit
                this.documentoEdit[nombreCampo] = [...valoresArray]

                // También actualizar en editSubformData para mantener consistencia
                if (this.editSubformData[nombreCampo] !== undefined) {
                    this.editSubformData[nombreCampo] = valoresArray.map((row) => {
                        const campo = this.getCampoPlantilla(nombreCampo)
                        if (campo && campo.subcampos) {
                            const { datos } = this.separarDatosYArchivos(row, campo)
                            return datos
                        }
                        return row
                    })
                }

                console.log(
                    '✅ Subformulario actualizado en documentoEdit:',
                    this.documentoEdit[nombreCampo],
                )
            },

            // 2. Mejorar el método getSubformDataForEdit para evitar problemas de tipo
            getSubformDataForEdit(fieldName) {
                console.log(`🔍 Obteniendo datos de subformulario para: ${fieldName}`)

                let valor = this.documentoEdit[fieldName]
                console.log(`📋 Valor actual:`, valor, typeof valor)

                // Si es string, intentar parsearlo
                if (typeof valor === 'string') {
                    try {
                        valor = JSON.parse(valor)
                    } catch (e) {
                        console.warn('⚠️ Error parseando subformulario como JSON:', valor)
                        valor = []
                    }
                }

                // Asegurar que sea array
                if (Array.isArray(valor)) {
                    console.log(`✅ Retornando array con ${valor.length} elementos`)
                    return valor
                }

                // Fallback: intentar usar editSubformData
                if (
                    this.editSubformData[fieldName] &&
                    Array.isArray(this.editSubformData[fieldName])
                ) {
                    console.log(`🔄 Usando datos de editSubformData`)
                    return this.editSubformData[fieldName]
                }

                console.log(`📭 Retornando array vacío para ${fieldName}`)
                return []
            },

            // ========== SUBMIT ==========
            async submitEdit() {
                if (this.loading) return

                // Validar que los subformularios tengan datos válidos
                const camposSubform = this.seccionesPlantilla
                    .flatMap((s) => s.fields || [])
                    .filter((c) => c.type === 'subform')

                for (const campo of camposSubform) {
                    const valor = this.documentoEdit[campo.name]
                    if (valor && Array.isArray(valor)) {
                        // Filtrar filas vacías
                        this.documentoEdit[campo.name] = valor.filter((fila) => {
                            return Object.values(fila).some((val) => val && val !== '')
                        })
                    }
                }

                this.loading = true
                try {
                    const formData = this.prepararFormData()

                    // 👇👇👇 AGREGA ESTO PARA VER LO QUE SE ENVÍA 👇👇👇
                    const logObj = {}
                    for (const [key, value] of formData.entries()) {
                        logObj[key] = value instanceof File ? `[File: ${value.name}]` : value
                    }
                    console.log('🚀 Datos que se enviarán al backend:', logObj)
                    // 👆👆👆 FIN DEL BLOQUE DE LOG 👆👆👆

                    this.$emit('save', formData)
                } catch (error) {
                    console.error('Error preparando datos:', error)
                    this.showError('Error al preparar los datos del documento')
                } finally {
                    this.loading = false
                }
            },

            // Métodos para tablas dinámicas - CORREGIDOS
            async abrirModalTabla(campo) {
                this.tablaActual = campo
                this.modalTablaVisible = true
                this.busquedaTabla = '' // Resetear búsqueda
                this.paginaActual = 1 // Resetear a primera página
                this.tablaSeleccionada = [...(this.tablaData[campo.name] || [])]

                try {
                    const token = localStorage.getItem('apiToken')
                    // Usar la misma lógica que el select dinámico
                    const response = await api.get(
                        `/plantillas/${campo.tableConfig.plantillaId}/secciones`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    )

                    // Buscar la sección específica
                    const seccion = response.data?.secciones?.find(
                        (s) => s.nombre === campo.tableConfig.seccion,
                    )
                    if (seccion && seccion.fields) {
                        // Obtener datos de documentos existentes para esta plantilla y sección
                        const documentosResponse = await api.get(
                            `/documentos/${campo.tableConfig.plantillaId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            },
                        )

                        // Procesar los datos para mostrar solo las columnas configuradas
                        this.datosTablaDisponibles = this.procesarDatosParaTabla(
                            documentosResponse.data,
                            seccion,
                            campo.tableConfig.campos,
                        )
                    }
                } catch (error) {
                    console.error('Error al cargar datos de tabla:', error)
                    this.showError('No se pudieron cargar los datos para la tabla')
                }
            },

            procesarDatosParaTabla(documentos, seccion, camposConfigurados) {
                const datosProcesados = []

                documentos.forEach((documento) => {
                    const seccionDoc = documento.secciones?.find((s) => s.nombre === seccion.nombre)
                    if (seccionDoc) {
                        const fila = {
                            _documentId: documento._id || documento.id,
                        }
                        camposConfigurados.forEach((campoConfig) => {
                            const campoNombre = campoConfig.name
                            const campo = seccionDoc.fields?.[campoNombre]
                            fila[campoNombre] = campo || '-'
                        })
                        datosProcesados.push(fila)
                    }
                })

                return datosProcesados
            },

            obtenerValorCampo(fila, nombreCampo) {
                return fila[nombreCampo] || '-'
            },

            cerrarModalTabla() {
                this.modalTablaVisible = false
                this.tablaActual = null
                this.datosTablaDisponibles = []
                this.tablaSeleccionada = []
                this.busquedaTabla = ''
                this.paginaActual = 1
            },

            seleccionarFilaTabla(fila) {
                const existe = this.tablaSeleccionada.some(
                    (f) => f._documentId === fila._documentId,
                )
                if (!existe) {
                    this.tablaSeleccionada.push({ ...fila })
                }
            },

            deseleccionarFilaTabla(index) {
                this.tablaSeleccionada.splice(index, 1)
            },

            guardarSeleccionTabla() {
                if (this.tablaActual) {
                    this.tablaData[this.tablaActual.name] = [...this.tablaSeleccionada]
                    this.cerrarModalTabla()
                }
            },

            eliminarFilaTabla(nombreCampo, index) {
                if (this.tablaData[nombreCampo]) {
                    this.tablaData[nombreCampo].splice(index, 1)
                }
            },

            // ========== PREPARAR FORM DATA ==========

            // 2. Corregir el método prepararFormData() para manejar subformularios correctamente
            prepararFormData() {
                // Mapeo de archivos: {nombreCampo: {seccion, campo, tipo, ...}}
                const fileMapping = {}
                const formData = new FormData()

                if (!Array.isArray(this.camposPlantilla.secciones)) {
                    console.warn('❌ Plantilla sin secciones')
                    return formData
                }

                // Agregar el ID del documento si existe
                if (this.documentoEdit._id) {
                    formData.append('_id', this.documentoEdit._id)
                }

                this.camposPlantilla.secciones.forEach((seccion, indexSeccion) => {
                    const nombreSeccion = seccion.nombre
                    const fields = seccion.fields

                    if (Array.isArray(fields)) {
                        fields.forEach((campo) => {
                            const nombreCampo = campo.name
                            const valor = this.documentoEdit[nombreCampo]

                            // Skip _id field ya que lo manejamos arriba
                            if (nombreCampo === '_id') return

                            const clave = `document_data[secciones][${indexSeccion}][fields][${nombreCampo}]`

                            if (campo.type === 'subform' && valor) {
                                // Manejar subformularios
                                this.procesarSubformularioEnFormData(formData, clave, valor, campo)
                            } else if (campo.type === 'file') {
                                const archivos = this.files[campo.name]
                                const clave = `document_data[secciones][${indexSeccion}][fields][${nombreCampo}]`

                                if (archivos && Array.isArray(archivos) && archivos.length > 0) {
                                    // Enviar los archivos reales
                                    if (archivos.length === 1) {
                                        const archivo = archivos[0]
                                        if (archivo instanceof File) {
                                            const uniqueFieldName = `file_${campo.name}`
                                            formData.append(`files[${uniqueFieldName}]`, archivo)
                                            // El campo en document_data se envía como null (el backend lo reemplazará)
                                            formData.append(clave, 'null') // o simplemente no enviarlo, pero mejor enviar null
                                        } else {
                                            // Es una ruta existente (string), mantenerla
                                            formData.append(clave, archivo)
                                        }
                                    } else {
                                        // Múltiples archivos → enviar como array vacío o null según backend
                                        archivos.forEach((archivo, idx) => {
                                            if (archivo instanceof File) {
                                                const uniqueFieldName = `file_${campo.name}_${idx}`
                                                formData.append(
                                                    `files[${uniqueFieldName}]`,
                                                    archivo,
                                                )
                                            }
                                        })
                                        // Indicar que el campo debe ser un array vacío (o según lógica del backend)
                                        formData.append(clave, JSON.stringify([]))
                                    }
                                } else {
                                    // No hay nuevos archivos → enviar null para mantener o limpiar
                                    formData.append(clave, 'null')
                                }
                            } else if (campo.type === 'tabla') {
                                // CORRECCIÓN CRÍTICA: Obtener TODAS las filas (existentes + nuevas)
                                const tablaFilas = this.tablaData[nombreCampo] || []
                                console.log(`🔄 Procesando campo tabla: ${nombreCampo}`, tablaFilas)

                                // Extraer todos los IDs (tanto los que ya existían como los nuevos)
                                /**/
                                const tablaIds = tablaFilas
                                    .map((fila) => fila._documentId || fila._id || fila.id)
                                    .filter((id) => id)

                                console.log(
                                    `📋 Campo ${nombreCampo}: enviando ${tablaIds.length} IDs`,
                                    tablaIds,
                                )

                                // Enviar cada ID como elemento del array
                                if (tablaIds.length > 0) {
                                    tablaIds.forEach((id) => {
                                        formData.append(`${clave}[]`, id)
                                    })
                                } else {
                                    // Si no hay IDs, enviar array vacío explícito para limpiar
                                    formData.append(`${clave}`, JSON.stringify([]))
                                }
                            } else if (valor !== null && valor !== undefined && valor !== '') {
                                const valorFinal =
                                    typeof valor === 'object' ? JSON.stringify(valor) : valor
                                formData.append(clave, valorFinal)
                            }
                        })
                    }

                    formData.append(
                        `document_data[secciones][${indexSeccion}][nombre]`,
                        nombreSeccion,
                    )
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
            // Método recursivo para procesar subformularios en FormData
            procesarSubformularioEnFormData(formData, claveBase, valor, campo) {
                if (Array.isArray(valor)) {
                    // Si es un array, iteramos sus elementos
                    valor.forEach((fila, filaIndex) => {
                        if (!fila || typeof fila !== 'object') return

                        Object.entries(fila).forEach(([subcampoNombre, subcampoValor]) => {
                            const claveCompleta = `${claveBase}[${filaIndex}][${subcampoNombre}]`
                            const subcampoConfig = campo.subcampos?.find(
                                (sc) => sc.name === subcampoNombre,
                            )

                            // Llamada recursiva si es subform
                            if (
                                subcampoConfig?.type === 'subform' &&
                                Array.isArray(subcampoValor)
                            ) {
                                this.procesarSubformularioEnFormData(
                                    formData,
                                    claveCompleta,
                                    subcampoValor,
                                    subcampoConfig,
                                )
                            }

                            // ✅ MANEJO DE TABLA DENTRO DE SUBFORMULARIO (SOLO IDS)
                            else if (subcampoConfig?.type === 'tabla') {
                                let ids = []

                                // Caso 1: subcampoValor es un arreglo
                                if (Array.isArray(subcampoValor)) {
                                    // ¿Son objetos con _documentId?
                                    if (
                                        subcampoValor.length > 0 &&
                                        typeof subcampoValor[0] === 'object' &&
                                        subcampoValor[0] !== null
                                    ) {
                                        // Extraer _documentId de cada objeto, y filtrar valores inválidos
                                        ids = subcampoValor
                                            .map((item) => item?._documentId)
                                            .filter((id) => id && typeof id === 'string')
                                    } else {
                                        // Asumimos que ya es un arreglo de strings/IDs
                                        ids = subcampoValor.filter(
                                            (id) => id && typeof id === 'string',
                                        )
                                    }
                                }
                                // Caso 2: viene como JSON string
                                else if (typeof subcampoValor === 'string') {
                                    try {
                                        const parsed = JSON.parse(subcampoValor)
                                        if (Array.isArray(parsed)) {
                                            if (
                                                parsed.length > 0 &&
                                                typeof parsed[0] === 'object' &&
                                                parsed[0] !== null
                                            ) {
                                                ids = parsed
                                                    .map((item) => item?._documentId)
                                                    .filter((id) => id && typeof id === 'string')
                                            } else {
                                                ids = parsed.filter(
                                                    (id) => id && typeof id === 'string',
                                                )
                                            }
                                        }
                                    } catch (e) {
                                        ids = []
                                    }
                                }

                                if (ids.length > 0) {
                                    ids.forEach((id) => {
                                        formData.append(`${claveCompleta}[]`, id)
                                    })
                                } else {
                                    formData.append(`${claveCompleta}`, JSON.stringify([]))
                                }
                            } else if (subcampoConfig?.type === 'file') {
                                // 🔥 BUSCAR ARCHIVOS EN archivosSubformularios PRIMERO
                                const claveArchivo = `${campo.name}_${filaIndex}_${subcampoNombre}`
                                const archivosReales = this.archivosSubformularios[claveArchivo]

                                if (archivosReales && archivosReales.length > 0) {
                                    archivosReales.forEach((archivo, idx) => {
                                        if (archivo instanceof File) {
                                            const uniqueKey = `subform_${campo.name}_${filaIndex}_${subcampoNombre}_${idx}`
                                            formData.append(`files[${uniqueKey}]`, archivo)
                                        }
                                    })
                                    formData.append(claveCompleta, 'null')
                                } else if (
                                    Array.isArray(subcampoValor) &&
                                    subcampoValor.length > 0
                                ) {
                                    // ✅ CAMBIO: Enviar cada ruta individualmente, NO como JSON string
                                    subcampoValor.forEach((ruta, idx) => {
                                        formData.append(`${claveCompleta}[${idx}]`, ruta)
                                    })
                                } else if (
                                    typeof subcampoValor === 'string' &&
                                    subcampoValor !== 'null'
                                ) {
                                    // ✅ NUEVO: Si viene como string JSON, parsearlo y enviar correctamente
                                    try {
                                        const rutas = JSON.parse(subcampoValor)
                                        if (Array.isArray(rutas)) {
                                            rutas.forEach((ruta, idx) => {
                                                formData.append(`${claveCompleta}[${idx}]`, ruta)
                                            })
                                        } else {
                                            formData.append(claveCompleta, subcampoValor)
                                        }
                                    } catch {
                                        formData.append(claveCompleta, subcampoValor)
                                    }
                                } else {
                                    formData.append(claveCompleta, JSON.stringify([]))
                                }
                            } else if (
                                subcampoValor !== null &&
                                subcampoValor !== undefined &&
                                subcampoValor !== ''
                            ) {
                                const valorFinal =
                                    typeof subcampoValor === 'object'
                                        ? JSON.stringify(subcampoValor)
                                        : subcampoValor
                                formData.append(claveCompleta, valorFinal)
                            }
                        })
                    })
                } else {
                    console.warn('⚠️ Valor de subformulario no es array:', valor)
                }
            },

            procesarSubformularioDentroDeDocumentData(formData, campo, valor) {
                if (Array.isArray(valor)) {
                    valor.forEach((row, rowIndex) => {
                        Object.keys(row).forEach((subcampo) => {
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
            },

            // ========== UI HELPERS ==========
            showSuccess(message) {
                Swal.fire({
                    title: 'Éxito',
                    text: message,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#6c757d',
                })
            },

            showError(message) {
                Swal.fire({
                    title: 'Error',
                    text: message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#6c757d',
                })
            },
        },
    }
</script>

<style>
    /* Header con el diseño moderno - CAMBIADO A GRIS */
    .medico-header {
        background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
    }
    .section-title i {
        color: #6c757d;
    }
    .form-section::before {
        background: linear-gradient(90deg, #6c757d, #495057);
    }

    /* Modal con diseño moderno */
    .modal.fade.show {
        background: rgba(0, 0, 0, 0.6);
    }

    .modern-modal {
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        background: white;
        border: none;
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

    .alert {
        border-radius: 12px;
        border: 1px solid #b8daff;
        background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
        color: #0c5460;
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
</style>
