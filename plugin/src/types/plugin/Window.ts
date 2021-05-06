import { IFractalInpageProvider } from "./InpageProvider";

declare global {
  interface Window {
    Fractal: IFractalInpageProvider;
  }
}
