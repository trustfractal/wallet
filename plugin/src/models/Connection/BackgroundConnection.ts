/* global chrome */

import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";

import {
  IResponse,
  IInvokation,
  IBackgroundConnection,
} from "@fractalwallet/types";

export default class BackgroundConnection
  extends BaseConnection
  implements IBackgroundConnection {
  public port: IBackgroundConnection["port"];

  constructor(backgroundParams: chrome.runtime.ConnectInfo) {
    super(ConnectionNames.BACKGROUND, ConnectionNames.CONTENT_SCRIPT);

    this.port = chrome.runtime.connect(backgroundParams);
    this.setupEvents();
  }

  private setupEvents(): void {
    this.port.onMessage.addListener(this.handleMessage.bind(this));
  }

  public postMessage(message: IResponse | IInvokation): void {
    this.port.postMessage({
      type: message.getMessageType(),
      message: message.serialize(),
    });
  }
}
