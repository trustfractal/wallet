import ConnectionTypes from "@models/Connection/types";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "@sdk/InpageProvider/Errors";

import {
  IFractalInpageProvider,
  IConnectionStatus,
  IVerificationRequest,
} from "@pluginTypes/index";

import ExtensionConnection from "@sdk/InpageProvider/connection";

import Requester from "@models/Request/Requester";
import ConnectionStatus from "@models/Connection/ConnectionStatus";
import VerificationRequest from "@models/VerificationRequest";
import CredentialsVersions from "@models/Credential/versions";

export default class InpageProvider implements IFractalInpageProvider {
  private initialized: boolean = false;
  private initializedEventName: string = "fractal-wallet#initialized";

  public async init(): Promise<void> {
    // init application connection
    ExtensionConnection.init();

    this.initialized = true;
    this.triggerInitializedEvent();
  }

  private triggerInitializedEvent() {
    const event = new Event(this.initializedEventName);

    // Dispatch the event.
    window.dispatchEvent(event);
  }

  private ensureFractalIsInitialized() {
    if (!this.initialized) {
      throw ERROR_FRACTAL_NOT_INITIALIZED();
    }
  }

  public async getVerificationRequest(
    level: string,
    requester: { name: string; url: string; icon: string },
    fields: Record<string, boolean> = {},
    version?: CredentialsVersions,
  ): Promise<IVerificationRequest> {
    this.ensureFractalIsInitialized();

    const parsedRequester = new Requester(
      requester.name,
      requester.url,
      requester.icon,
    );

    const serializedRequest = await ExtensionConnection.invoke(
      ConnectionTypes.GET_VERIFICATION_REQUEST_BACKGROUND,
      [level, parsedRequester.serialize(), fields, version],
    );

    // parse request
    const request: VerificationRequest =
      VerificationRequest.parse(serializedRequest);

    return request;
  }

  public async setupPlugin(): Promise<IConnectionStatus> {
    this.ensureFractalIsInitialized();

    const connectionStatus = await ExtensionConnection.invoke(
      ConnectionTypes.SETUP_PLUGIN_BACKGROUND,
    );

    return ConnectionStatus.parse(connectionStatus);
  }

  public async verifyConnection(): Promise<IConnectionStatus> {
    this.ensureFractalIsInitialized();

    const connectionStatus = await ExtensionConnection.invoke(
      ConnectionTypes.VERIFY_CONNECTION_BACKGROUND,
    );

    return ConnectionStatus.parse(connectionStatus);
  }
}
