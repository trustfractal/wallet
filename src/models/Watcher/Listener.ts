import { v4 as uuidv4 } from "uuid";

import { IListener } from "@pluginTypes/index";

export default class Listener implements IListener {
  public id: IListener["id"];
  public action: IListener["action"];
  public callback: IListener["callback"];

  constructor(
    action: IListener["action"],
    callback: IListener["callback"],
    id?: IListener["id"],
  ) {
    this.id = id || uuidv4();
    this.action = action;
    this.callback = callback;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      action: this.action,
    });
  }
}
