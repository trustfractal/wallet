/* global chrome */

import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";
import { background } from "@models/Connection/params";

export default class BackgroundConnection {
  constructor() {
    this.port = chrome.runtime.connect(background);
    this.responseCallbacks = {};
    this.invokationCallbacks = {};

    this._setupEvents();
  }

  _setupEvents() {
    this.port.onMessage.addListener(this._handleMessage.bind(this));
  }

  _handleMessage({ type, message }) {
    if (type === Response.name) {
      this._handleResponse(message);
    } else if (type === Invokation.name) {
      this._handleInvokation(message);
    } else {
      throw new Error(`Unexpected message ${message} of type ${type}`);
    }
  }

  _handleResponse(msg) {
    const response = Response.parse(msg);
    const { id } = response;
    const callback = this.responseCallbacks[id];

    if (!callback) throw new Error(`Unexpected response message ${msg}`);

    callback(response);

    delete this.responseCallbacks[id];
  }

  _handleInvokation(msg) {
    const { method, args, id } = Invokation.parse(msg);

    const callback = this.invokationCallbacks[method];

    if (!callback) throw new Error(`Unexpected invokation method ${method}`);

    callback(...args)
      .then((value) => {
        const response = new Response(method, value, id);
        this.port.postMessage({
          type: Response.name,
          message: response.serialize(),
        });
      })
      .catch((error) => {
        const response = new Response(method, error, id, false);
        this._postMessage({
          type: Response.name,
          message: response.serialize(),
        });
      });
  }

  _postMessage(type, message) {
    this.port.postMessage({ type, message });
  }

  invoke(invokation) {
    this._postMessage(Invokation.name, invokation);
  }

  listen(id, callback) {
    this.responseCallbacks[id] = callback;
  }

  on(method, callback) {
    let promiseCallback = callback;

    if (!callback.then) {
      promiseCallback = async (...args) => callback(...args);
    }

    this.invokationCallbacks[method] = promiseCallback;
    return this;
  }
}
