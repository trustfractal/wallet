/* global chrome */

import { v4 as uuidv4 } from "uuid";

import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";

import {
  IResponse,
  IInvokation,
  IContentScriptConnection,
} from "@fractalwallet/types";

import { background } from "@models/Connection/params";

export default class ContentScriptConnection
  extends BaseConnection
  implements IContentScriptConnection {
  public ports: IContentScriptConnection["ports"];

  constructor() {
    super(ConnectionNames.CONTENT_SCRIPT, ConnectionNames.BACKGROUND);

    this.ports = {};

    this.setupEvents();
  }

  private setupEvents(): void {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== background.name) {
        return;
      }

      const id = `${port.name}-${uuidv4()}`;

      this.ports[id] = { id, port };
      this.ports[id].port.onMessage.addListener(({ type, message }) => {
        // inject port in the message
        const messageObject = JSON.parse(message);
        messageObject.port = id;

        // convert back to string
        const messageString = JSON.stringify(messageObject);
        this.handleMessage({ type, message: messageString });
      });

      this.ports[id].port.onDisconnect.addListener(() => delete this.ports[id]);
    });
  }

  public postMessage(message: IResponse | IInvokation): void {
    if (message.port && this.ports[message.port]) {
      this.ports[message.port].port.postMessage({
        type: message.getMessageType(),
        message: message.serialize(),
      });
    }
  }
}
