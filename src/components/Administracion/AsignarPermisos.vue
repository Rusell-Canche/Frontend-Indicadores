<template>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Modulos</Tab>
                <Tab value="1">Acciones</Tab>
                <Tab value="2">Registros</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="m-0">
                        <ol>
                            <li>Indicadores</li>
                            <li>Plantillas</li>
                            <li>Documentos</li>
                            <li>Indicadores</li>
                        </ol>
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <div class="m-0">
                        Aqui formulario de rutas
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <p class="m-0">
                        Aqui formulario de registros
                    </p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import type { Rol } from '@/models/rol'
import { RolService } from '@/services/Administracion/rol.service'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

export default defineComponent({
    name: 'AsignarPermisos',
    components: {
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    },
    data() {
        return {
            /** El rol seleccionado actual */
        }
    },

    props: {
    },

    emits: [],

    watch: {

    },
    methods: {

    },

    mounted() {

    }
})

</script>
<style scoped>
/* Estilos base del diseño moderno */
.card {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    background: white;
    position: relative;
}

/* Header con el diseño moderno usando #4e73df */
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

/* Estilos mejorados para las tarjetas de ejes */
.eje-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    padding: 0;
}

.eje-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid rgba(78, 115, 223, 0.1);
    position: relative;
}

.eje-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4e73df, #224abe);
    border-radius: 16px 16px 0 0;
}

.eje-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(78, 115, 223, 0.2);
}

.eje-card-header {
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.eje-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    box-shadow: 0 4px 15px rgba(78, 115, 223, 0.3);
    flex-shrink: 0;
}

.eje-info {
    flex: 1;
    min-width: 0;
}

.eje-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.3;
}

.eje-subtitle {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #495057;
    font-weight: 400;
    line-height: 1.4;
    word-wrap: break-word;
}

.eje-date {
    margin: 0;
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 400;
}

.eje-actions {
    display: flex;
    padding: 1rem 1.5rem;
    background: white;
    gap: 0.75rem;
    justify-content: flex-end;
}

.btn {
    border: none;
    border-radius: 10px;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.btn:hover::before {
    left: 100%;
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
    border-radius: 0px 0px 16px 16px;
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
    background: linear-gradient(135deg, #047857 0%, #065f46 100%);
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
    color: #4e73df;
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
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
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
    border-color: #4e73df;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
    transform: translateY(-1px);
}

.modern-input textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

.alert {
    border-radius: 12px;
    border: 1px solid rgba(78, 115, 223, 0.2);
    background: linear-gradient(145deg, rgba(78, 115, 223, 0.1) 0%, rgba(78, 115, 223, 0.05) 100%);
    color: #224abe;
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
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
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
    background: linear-gradient(135deg, #224abe 0%, #1e3a8a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 115, 223, 0.4);
    color: white;
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

/* Estados de carga y vacío */
.spinner-border {
    width: 3rem;
    height: 3rem;
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

    .eje-list {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .eje-card-header {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .eje-actions {
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
    }

    .btn {
        justify-content: center;
        width: 100%;
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
    .eje-list {
        grid-template-columns: 1fr;
    }

    .modal-header-custom {
        padding: 1rem;
    }

    .modal-body-custom {
        padding: 1rem;
    }

    .form-section {
        padding: 0.75rem;
    }

    .modern-input .form-control,
    .modern-input .form-select {
        font-size: 0.9rem;
    }

    .eje-card-header {
        flex-direction: row;
        align-items: flex-start;
    }

    .eje-info {
        min-width: 0;
    }

    .eje-title {
        font-size: 1rem;
    }

    .eje-subtitle {
        font-size: 0.85rem;
    }

    .eje-date {
        font-size: 0.75rem;
    }
}
</style>