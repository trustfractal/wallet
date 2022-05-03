import InpageProvider from "@sdk/InpageProvider";
import FractalProtocol from "@sdk/FractalProtocol";

(() => {
  window.Fractal = new InpageProvider();
  window.Fractal.init();
  window.FractalProtocol = new FractalProtocol();
})();
