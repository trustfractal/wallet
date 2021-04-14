import { IEthereum } from "./Ethereum";
import { IFractalSDK } from "./Fractal";

declare global {
  interface Window {
    ethereum: IEthereum;
    Fractal: IFractalSDK;
  }
}
