import detectEthereumProvider from "@metamask/detect-provider";

import { IEthereum } from "@fractalwallet/types";
import {
  ERROR_PROVIDER_NOT_DETECTED,
  ERROR_PROVIDER_NOT_METAMASK,
  ERROR_PROVIDER_OVERRIDE,
  ERROR_PROVIDER_NOT_INITIALIZED,
} from "@services/EthereumProviderService/Errors";

class EthereumProviderService {
  private static instance: EthereumProviderService;
  private provider?: IEthereum;

  public static getInstance(): EthereumProviderService {
    if (!EthereumProviderService.instance) {
      EthereumProviderService.instance = new EthereumProviderService();
    }

    return EthereumProviderService.instance;
  }

  public async init(): Promise<IEthereum> {
    const provider = await detectEthereumProvider();

    if (!provider) {
      throw ERROR_PROVIDER_NOT_DETECTED();
    }

    if (provider !== window.ethereum) {
      throw ERROR_PROVIDER_OVERRIDE();
    }

    if (!window.ethereum?.isMetaMask) {
      throw ERROR_PROVIDER_NOT_METAMASK();
    }

    this.provider = window.ethereum;

    return this.provider;
  }

  public isAvailable() {
    return this.provider !== undefined;
  }

  private ensureProviderIsInitialized() {
    if (!this.isAvailable()) {
      throw ERROR_PROVIDER_NOT_INITIALIZED();
    }
  }

  public async commitCredential(credential: string) {
    this.ensureProviderIsInitialized();

    console.log("credential", credential);

    // Credential transaction commit
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));

    const transactionHash =
      "0x9ed9d53fddb685493ef99f4ce622f15573966dbb6031ff55a828b76445cdb7ba";

    return transactionHash;
  }

  public async getAccountAddress() {
    this.ensureProviderIsInitialized();

    const accounts = await this.provider!.request!({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      return;
    }

    return accounts[0];
  }
}

const ethereumProvider: EthereumProviderService = EthereumProviderService.getInstance();

export default ethereumProvider;
