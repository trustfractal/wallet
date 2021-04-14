import { v4 as uuidv4 } from "uuid";

import ResponseTypes from "@models/Message/types";

export default class Response {
  static NAME = ResponseTypes.RESPONSE;

  constructor(method, value, id = null, success = true) {
    this.id = id || uuidv4();
    this.method = method;
    this.value = value;
    this.success = success;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      method: this.method,
      value: this.value,
      success: this.success,
    });
  }

  static parse(str) {
    const { id, method, value, success } = JSON.parse(str);

    return new Response(method, value, id, success);
  }
}
