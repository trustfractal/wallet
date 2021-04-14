/* global chrome */

import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";

export default class BackgroundConnection {
  constructor(backgroundParams) {
    this.port = chrome.runtime.connect(backgroundParams);
    this.responseCallbacks = {};
    this.invokationCallbacks = {};

    this._setupEvents();
  }

  _setupEvents() {
    this.port.onMessage.addListener(this._handleMessage.bind(this));
  }

  _handleMessage({ type, message }) {
    // TODO: Remove debug console.log
    console.log("background -> content-script", { type, message });

    if (type === Response.NAME) {
      this._handleResponse(message);
    } else if (type === Invokation.NAME) {
      this._handleInvokation(message);
    } else {
      throw new Error(`Unexpected message ${message} of type ${type}`);
    }
  }

  postMessage(type, message) {
    this.port.postMessage({ type, message });
  }

  _handleResponse(msg) {
    const { value, id, success } = Response.parse(msg);
    const callback = this.responseCallbacks[id];

    if (!callback) throw new Error(`Unexpected response message ${msg}`);

    const { resolve, reject } = callback;
    success ? resolve(value) : reject(value);

    delete this.responseCallbacks[id];
  }

  _handleInvokation(msg) {
    const { method, args, id } = Invokation.parse(msg);
    const callback = this.invokationCallbacks[method];

    if (!callback) throw new Error(`Unexpected invokation method ${method}`);

    callback(...args)
      .then((value) => {
        const response = new Response(method, value, id);
        this.postMessage(Response.NAME, response.serialize());
      })
      .catch((error) => {
        const response = new Response(method, error, id, false);
        this.postMessage(Response.NAME, response.serialize());
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

  invoke(method, ...args) {
    return new Promise((resolve, reject) => {
      const message = new Invokation(method, args);
      const { id } = message;

      this.responseCallbacks[id] = { resolve, reject };

      this.postMessage(Invokation.NAME, message.serialize());
    });
  }

  listen(id) {
    return new Promise((resolve, reject) => {
      this.responseCallbacks[id] = { resolve, reject };
    });
  }
}
