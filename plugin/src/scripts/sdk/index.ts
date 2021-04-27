import InpageProvider from "src/scripts/sdk/InpageProvider";

(() => {
  window.Fractal = new InpageProvider();
  window.Fractal.init();
})();
