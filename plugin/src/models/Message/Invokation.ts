import { v4 as uuidv4 } from "uuid";

import MessageTypes from "@models/Message/types";

import { IInvokation } from "@fractalwallet/types";

export default class Invokation implements IInvokation {
  public static readonly NAME = MessageTypes.INVOKATION;

  public id: IInvokation["id"];
  public method: IInvokation["method"];
  public args: IInvokation["args"];
  public port: IInvokation["port"];

  constructor(
    method: IInvokation["method"],
    args: IInvokation["args"] = [],
    port?: IInvokation["port"],
    id?: IInvokation["id"],
  ) {
    this.id = id || uuidv4();
    this.method = method;
    this.args = args;
    this.port = port;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      method: this.method,
      args: this.args,
      port: this.port,
    });
  }

  public getMessageType(): MessageTypes {
    return Invokation.NAME;
  }

  public static parse(str: string): IInvokation {
    const { id, method, args, port } = JSON.parse(str);

    return new Invokation(method, args, port, id);
  }
}
