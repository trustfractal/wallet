/* global chrome */

import { v4 as uuidv4 } from "uuid";

import Response from "@models/Message/Response";
import { background } from "@models/Connection/params";

export default class ContentScriptConnection {
  constructor() {
    this.callbacks = {};
    this.ports = {};

    this._setupEvents();
  }

  _setupEvents() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== background.name) {
        return;
      }

      const id = `${port.name}-${uuidv4()}`;

      this.ports[id] = port;
      this.ports[id].onMessage.addListener((msg) =>
        this._handleMessage(id, msg),
      );

      this.ports[id].onDisconnect.addListener(() => delete this.ports[id]);
    });
  }

  _postMessage(id, message) {
    if (this.ports[id]) {
      this.ports[id].postMessage(message);
    }
  }

  _handleMessage(port, msg) {
    const { method, args, id } = msg;
    const callback = this.callbacks[method];

    if (!callback) throw new Error(`Unexpected method ${method}`);

    callback(...args)
      .then((value) => {
        const response = new Response(method, value, id);
        this._postMessage(port, response.serialize());
      })
      .catch((error) => {
        const response = new Response(method, error, id, false);
        this._postMessage(port, response.serialize());
      });
  }

  on(method, callback) {
    let promiseCallback = callback;

    if (!callback.then) {
      promiseCallback = async (...args) => callback(...args);
    }

    this.callbacks[method] = promiseCallback;
    return this;
  }
}
