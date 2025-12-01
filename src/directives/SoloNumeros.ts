import type { Directive } from 'vue';

const SoloNumeros: Directive = {
  mounted(el) {
    el.addEventListener('keypress', (event: KeyboardEvent) => {
      const char = String.fromCharCode(event.which);
      if (!/^\d$/.test(char)) {
        event.preventDefault();
      }
    });
  }
};

export default SoloNumeros;