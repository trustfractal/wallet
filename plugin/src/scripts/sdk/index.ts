import FractalSDK from "src/scripts/sdk/FractalSDK";

(() => {
  window.Fractal = new FractalSDK();
  window.Fractal.init();
})();
