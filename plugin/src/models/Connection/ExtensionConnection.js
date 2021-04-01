import LocalMessageDuplexStream from "post-message-stream";

import Invokation from "@models/Message/Invokation";
import Response from "@models/Message/Response";

export default class ExtensionConnection {
  constructor(params) {
    this.stream = new LocalMessageDuplexStream(params);
    this.callbacks = {};

    this._setupEvents();
  }

  _setupEvents() {
    this.stream.on("data", this._handleData.bind(this));
  }

  _handleData(data) {
    const { value, id, success } = Response.parse(data);
    const callback = this.callbacks[id];

    if (!callback) return;

    const { resolve, reject } = callback;
    success ? resolve(value) : reject(value);
  }

  invoke(method, ...args) {
    return new Promise((resolve, reject) => {
      const message = new Invokation(method, args);
      const { id } = message;

      this.callbacks[id] = { message, resolve, reject };

      this.stream.write(message.serialize());
    });
  }
}
