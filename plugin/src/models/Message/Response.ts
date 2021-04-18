import { v4 as uuidv4 } from "uuid";

import MessageTypes from "@models/Message/types";

import { IResponse } from "@fractalwallet/types";

export default class Response implements IResponse {
  public static readonly NAME = MessageTypes.RESPONSE;

  public id: IResponse["id"];
  public method: IResponse["method"];
  public value: IResponse["value"];
  public success: IResponse["success"];
  public port: IResponse["port"];

  constructor(
    method: IResponse["method"],
    value: IResponse["value"],
    id?: IResponse["id"],
    success?: IResponse["success"],
    port?: IResponse["port"],
  ) {
    this.id = id || uuidv4();
    this.method = method;
    this.value = value;
    this.success = success !== undefined ? success : true;
    this.port = port;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      method: this.method,
      value: this.value,
      success: this.success,
      port: this.port,
    });
  }

  public getMessageType(): MessageTypes {
    return Response.NAME;
  }

  public static parse(str: string): IResponse {
    const { id, method, value, success, port } = JSON.parse(str);

    return new Response(method, value, id, success, port);
  }
}
