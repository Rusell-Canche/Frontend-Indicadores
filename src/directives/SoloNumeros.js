export default {
  beforeMount(el) {
    el.addEventListener("input", () => {
      const val = el.value;
      const clean = val.replace(/[^0-9]/g, '');
      if (val !== clean) {
        el.value = clean;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }
};