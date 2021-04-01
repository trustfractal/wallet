export default class Response {
  constructor(method, value, id, success = true) {
    this.id = id || Date.now();
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
