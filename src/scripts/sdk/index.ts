import InpageProvider from "@sdk/InpageProvider";
import ProtocolAPI from "@sdk/ProtocolAPI";

(() => {
  window.Fractal = new InpageProvider();
  window.Fractal.init();
  window.ProtocolAPI = new ProtocolAPI();
})();
