import { IFractalProtocol } from "./FractalProtocol";
import { IFractalInpageProvider } from "./InpageProvider";

declare global {
  interface Window {
    Fractal: IFractalInpageProvider;
    FractalProtocol: IFractalProtocol;
  }
}
