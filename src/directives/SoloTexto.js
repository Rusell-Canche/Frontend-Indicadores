export default {
  beforeMount(el) {
    el.addEventListener("input", () => {
      const originalValue = el.value;
      const cleanedValue = originalValue.replace(/[^a-zA-ZÁÉÍÓÚáéíóúüÜñÑ\s]/g, '');

      if (originalValue !== cleanedValue) {
        el.value = cleanedValue;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }
};