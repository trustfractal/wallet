import LocalMessageDuplexStream from "post-message-stream";

import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";

import {
  IResponse,
  IInvokation,
  IInpageConnection,
  DuplexConnectionParams,
} from "@fractalwallet/types";

export default class InpageConnection
  extends BaseConnection
  implements IInpageConnection {
  public inpage: IInpageConnection["inpage"];

  constructor(inpageParams: DuplexConnectionParams) {
    super(ConnectionNames.INPAGE, ConnectionNames.CONTENT_SCRIPT);
    this.inpage = new LocalMessageDuplexStream(inpageParams);
    this.setupEvents();
  }

  private setupEvents(): void {
    this.inpage.on("data", this.handleMessage.bind(this));
  }

  public postMessage(message: IResponse | IInvokation): void {
    this.inpage.write({
      type: message.getMessageType(),
      message: message.serialize(),
    });
  }
}
