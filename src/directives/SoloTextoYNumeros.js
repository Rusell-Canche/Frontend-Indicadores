export default {
  beforeMount(el) {
    el.addEventListener("input", () => {
      const val = el.value;
      // Solo permite letras (a-z, A-Z), números (0-9) y espacios
      const clean = val.replace(/[^a-zA-Z0-9 ]/g, '');
      if (val !== clean) {
        el.value = clean;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }
};