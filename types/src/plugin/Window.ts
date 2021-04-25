import { providers as ethersProviders } from "ethers";

import { IFractalInpageProvider } from "./InpageProvider";

declare global {
  interface Window {
    ethereum: ethersProviders.ExternalProvider;
    Fractal: IFractalInpageProvider;
  }
}
