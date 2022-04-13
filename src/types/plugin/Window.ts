import { IFractalProtocolAPI } from "./ProtocolAPI";
import { IFractalInpageProvider } from "./InpageProvider";

declare global {
  interface Window {
    Fractal: IFractalInpageProvider;
    ProtocolAPI: IFractalProtocolAPI;
  }
}
