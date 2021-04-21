import { providers as ethersProviders } from "ethers";

import { IFractalInpageProvider } from "./Fractal";

declare global {
  interface Window {
    ethereum: ethersProviders.ExternalProvider;
    Fractal: IFractalInpageProvider;
  }
}
