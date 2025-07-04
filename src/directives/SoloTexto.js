export default {
  beforeMount(el) {
    el.addEventListener("input", () => {
      const val = el.value;
      // Permite letras, números, espacios y caracteres comunes en correos: @ . _ - +
      const clean = val.replace(/[^a-zA-Z0-9 @._\-+]/g, '');
      if (val !== clean) {
        el.value = clean;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }
};