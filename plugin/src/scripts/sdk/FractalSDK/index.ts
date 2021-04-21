import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "src/scripts/sdk/FractalSDK/Errors";

import { IFractalSDK } from "@fractalwallet/types";

import ExtensionConnection from "@sdk/FractalSDK/connection";

export default class FractalSDK implements IFractalSDK {
  private initialized: boolean = false;

  public async init(): Promise<void> {
    // init application connection
    ExtensionConnection.init();

    // init ethereum provider service
    try {
      await EthereumProviderService.init();
    } catch (error) {
      console.error(error);
    }

    this.initialized = true;
  }

  private ensureFractalIsInitialized() {
    if (!this.initialized) {
      throw ERROR_FRACTAL_NOT_INITIALIZED();
    }
  }

  public hasCredential(id: string): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.HAS_CREDENTIAL, [id]);
  }

  public setupPlugin(): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.SETUP_PLUGIN);
  }

  public verifyConnection(): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.VERIFY_CONNECTION);
  }
}
