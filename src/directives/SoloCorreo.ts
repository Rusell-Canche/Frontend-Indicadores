// SoloCorreos.ts
import type { Directive } from 'vue';

const SoloCorreos: Directive = {
  beforeMount(el: HTMLInputElement) {
    const handleInput = () => {
      const val = el.value;
      // Permite letras (incluyendo acentuadas y ñ), números, espacios y caracteres comunes en correos: @ . _ - +
      const clean = val.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ@._\-+]/g, '');
      if (val !== clean) {
        el.value = clean;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    el.addEventListener('input', handleInput);
  },
};

export default SoloCorreos;