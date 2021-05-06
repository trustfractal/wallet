import LocalMessageDuplexStream from "post-message-stream";

import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";

import {
  IResponse,
  IInvokation,
  IExtensionConnection,
  DuplexConnectionParams,
} from "@pluginTypes/index";

export default class ExtensionConnection
  extends BaseConnection
  implements IExtensionConnection {
  public extension: IExtensionConnection["extension"];

  constructor(extensionParams: DuplexConnectionParams) {
    super(ConnectionNames.CONTENT_SCRIPT, ConnectionNames.INPAGE);
    this.extension = new LocalMessageDuplexStream(extensionParams);
    this.setupEvents();
  }

  private setupEvents(): void {
    this.extension.on("data", this.handleMessage.bind(this));
  }

  public postMessage(message: IResponse | IInvokation): void {
    this.extension.write({
      type: message.getMessageType(),
      message: message.serialize(),
    });
  }
}
