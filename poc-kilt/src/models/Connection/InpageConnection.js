import LocalMessageDuplexStream from "post-message-stream";

import Invokation from "@models/Message/Invokation";
import Response from "@models/Message/Response";

export default class InpageConnection {
  constructor(params, background) {
    this.stream = new LocalMessageDuplexStream(params);
    this.proxiedMethods = new Set();
    this.callbacks = {};
    this.background = background;

    this._setupEvents();
  }

  _setupEvents() {
    this.background.listen(this._handleMessage.bind(this));
    this.stream.on("data", this._handleData.bind(this));
  }

  // calls a saved callback and sends a response
  _call(invokation) {
    const { method, args, id } = invokation;
    const callback = this.callbacks[method];

    if (!callback) throw new Error(`Undefined method ${method}`);

    const value = callback(...args);

    const response = new Response(method, value, id);
    this.stream.write(response.serialize());
  }

  // forwards messages to the background script
  _forward(invokation) {
    const { id } = invokation;

    this.background.listen(id, this._handleMessage.bind(this));
    this.background.invoke(invokation);
  }

  // handles data from the inpage script
  _handleData(data) {
    const invokation = Invokation.parse(data);
    const { method } = invokation;

    this.proxiedMethods.has(method)
      ? this._forward(invokation)
      : this._call(invokation);
  }

  // handles messages from the background script
  _handleMessage(msg) {
    this.stream.write(msg.serialize());
  }

  proxy(method) {
    this.proxiedMethods.add(method);
    return this;
  }

  on(method, callback) {
    this.callbacks[method] = callback;
    return this;
  }
}
