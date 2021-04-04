/* global chrome */

import { v4 as uuidv4 } from "uuid";

import Invokation from "@models/Message/Invokation";
import Response from "@models/Message/Response";
import { background } from "@models/Connection/params";

export default class ContentScriptConnection {
  constructor() {
    this.responseCallbacks = {};
    this.invokationCallbacks = {};
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

  _handleMessage(port, { type, message }) {
    if (type === Response.name) {
      this._handleResponse(message);
    } else if (type === Invokation.name) {
      this._handleInvokation(port, message);
    } else {
      throw new Error(`Unexpected message ${message} of type ${type}`);
    }
  }

  _postMessage(id, type, message) {
    if (this.ports[id]) {
      this.ports[id].postMessage({ type, message });
    }
  }

  _handleResponse(msg) {
    const { value, id, success } = Response.parse(msg);
    const callback = this.responseCallbacks[id];

    if (!callback) throw new Error(`Unexpected response message ${msg}`);

    const { resolve, reject } = callback;
    success ? resolve(value) : reject(value);

    delete this.responseCallbacks[id];
  }

  _handleInvokation(port, msg) {
    const { method, args, id } = msg;
    const callback = this.invokationCallbacks[method];

    if (!callback) throw new Error(`Unexpected invokation method ${method}`);

    callback({ port, payload: args })
      .then((value) => {
        const response = new Response(method, value, id);
        this._postMessage(port, Response.name, response.serialize());
      })
      .catch((error) => {
        const response = new Response(method, error, id, false);
        this._postMessage(port, Response.name, response.serialize());
      });
  }

  on(method, callback) {
    let promiseCallback = callback;

    if (!callback.then) {
      promiseCallback = async (...args) => callback(...args);
    }

    this.invokationCallbacks[method] = promiseCallback;
    return this;
  }

  invoke(port, method, ...args) {
    return new Promise((resolve, reject) => {
      const message = new Invokation(method, args);
      const { id } = message;

      this.responseCallbacks[id] = { message, resolve, reject };

      this._postMessage(port, Invokation.name, message.serialize());
    });
  }
}
