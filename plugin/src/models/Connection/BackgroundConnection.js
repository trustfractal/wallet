/* global chrome */

import Response from "@models/Message/Response";
import { background } from "@models/Connection/params";

export default class BackgroundConnection {
  constructor() {
    this.port = chrome.runtime.connect(background);
    this.listeners = {};

    this._setupEvents();
  }

  _setupEvents() {
    this.port.onMessage.addListener(this._handleMessage.bind(this));
  }

  _handleMessage(msg) {
    const response = Response.parse(msg);
    const { id } = response;
    const callback = this.listeners[id];

    if (!callback) throw new Error(`Unexpected message ${msg}`);

    callback(response);

    delete this.listeners[id];
  }

  invoke(invokation) {
    this.port.postMessage(invokation);
  }

  listen(id, callback) {
    this.listeners[id] = callback;
  }
}
