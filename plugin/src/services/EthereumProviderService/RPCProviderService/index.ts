import { providers as ethersProviders } from "ethers";

import { IRPCProviderService, Callback } from "@fractalwallet/types";

import { ERROR_PROVIDER_NOT_INITIALIZED } from "@services/EthereumProviderService/Errors";

class RPCProviderService implements IRPCProviderService {
  private static instance: RPCProviderService;
  private rpcProvider?: ethersProviders.JsonRpcProvider;

  public static getInstance(): RPCProviderService {
    if (!RPCProviderService.instance) {
      RPCProviderService.instance = new RPCProviderService();
    }

    return RPCProviderService.instance;
  }

  public async init(
    providerUrl: string,
    network: string,
  ): Promise<ethersProviders.JsonRpcProvider> {
    this.rpcProvider = new ethersProviders.JsonRpcProvider(
      providerUrl,
      network,
    );

    return this.rpcProvider;
  }

  public isAvailable(): boolean {
    return this.rpcProvider !== undefined;
  }

  private ensureProviderIsInitialized(): void {
    if (!this.isAvailable()) {
      throw ERROR_PROVIDER_NOT_INITIALIZED();
    }
  }

  public async waitForTransaction(
    transactionHash: string,
    callback: Callback,
  ): Promise<void> {
    try {
      this.ensureProviderIsInitialized();

      const receipt = await this.rpcProvider!.waitForTransaction(
        transactionHash,
      );

      // resolve with transaction status
      callback(receipt.status === undefined || receipt.status === 1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const rpcProviderService: RPCProviderService = RPCProviderService.getInstance();

export default rpcProviderService;
