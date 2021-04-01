import { v4 as uuidv4 } from "uuid";

export default class Invokation {
  constructor(method, args = [], id = null) {
    this.id = id || uuidv4();
    this.method = method;
    this.args = args;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      method: this.method,
      args: this.args,
    });
  }

  static parse(str) {
    const { id, method, args } = JSON.parse(str);

    return new Invokation(method, args, id);
  }
}
