import { v4 as uuidv4 } from "uuid";

export default class DataEntry {
  constructor(id = null, key, value) {
    this.id = id || uuidv4();
    this.key = key;
    this.value = value;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      key: this.key,
      value: this.value,
    });
  }

  static parse(str) {
    const { id, key, value } = JSON.parse(str);

    return new DataEntry(id, key, value);
  }
}
