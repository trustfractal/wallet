import ExtensionConnection from "@models/Connection/ExtensionConnection";
import { extension } from "@models/Connection/params";
import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "src/scripts/sdk/FractalSDK/Errors";

import { IFractalSDK } from "@fractalwallet/types";

import callbacks from "@sdk/FractalSDK/callbacks";

export default class FractalSDK implements IFractalSDK {
  private connection?: ExtensionConnection;

  public async init(): Promise<void> {
    // init application connection
    this.connection = new ExtensionConnection(extension);

    // init ethereum provider service
    try {
      await EthereumProviderService.init();
      this.connection.invoke(ConnectionTypes.REPORT_WALLET_AVAILABLE);
    } catch (error) {
      console.error(error);
      this.connection.invoke(ConnectionTypes.REPORT_WALLET_UNAVAILABLE);
    }

    // register connection callbacks
    for (let index = 0; index < Object.keys(callbacks).length; index++) {
      const connectionType = Object.keys(callbacks)[index];
      const callback = callbacks[connectionType];

      this.connection.on(connectionType, callback);
    }
  }

  private ensureFractalIsInitialized() {
    if (this.connection === undefined) {
      throw ERROR_FRACTAL_NOT_INITIALIZED();
    }
  }

  public confirmCredential(...args: any[]): Promise<any> {
    this.ensureFractalIsInitialized();

    return this.connection!.invoke(ConnectionTypes.CONFIRM_CREDENTIAL, ...args);
  }

  public verifyConnection(): Promise<any> {
    this.ensureFractalIsInitialized();

    return this.connection!.invoke(ConnectionTypes.VERIFY_EXTENSION_CONNECTION);
  }
}
