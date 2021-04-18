import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";

import {
  IConnection,
  IResponse,
  IInvokation,
  AsyncCallback,
  Message,
} from "@fractalwallet/types";

import ConnectionNames from "@models/Connection/names";

export default abstract class BaseConnection implements IConnection {
  public from: IConnection["from"];
  public to: IConnection["to"];
  public responseCallbacks: IConnection["responseCallbacks"];
  public invokationCallbacks: IConnection["invokationCallbacks"];

  constructor(from: ConnectionNames, to: ConnectionNames) {
    this.from = from;
    this.to = to;

    this.responseCallbacks = {};
    this.invokationCallbacks = {};
  }

  public abstract postMessage(message: IResponse | IInvokation): void;

  protected handleMessage({ type, message }: Message): void {
    // TODO: Remove debug console.log
    console.log(`${this.from} -> ${this.to}`, { type, message });

    if (type === Response.NAME) {
      this.handleResponse(message);
    } else if (type === Invokation.NAME) {
      this.handleInvokation(message);
    } else {
      throw new Error(`Unexpected message ${message} of type ${type}`);
    }
  }

  private handleResponse(msg: string): void {
    const { value, id, success } = Response.parse(msg);
    const callback = this.responseCallbacks[id];

    if (!callback) throw new Error(`Unexpected response message ${msg}`);

    const { resolve, reject } = callback;
    success ? resolve(value) : reject(value);

    delete this.responseCallbacks[id];
  }

  private handleInvokation(msg: string): void {
    const { method, args, id, port } = Invokation.parse(msg);
    const callback = this.invokationCallbacks[method];

    if (!callback) throw new Error(`Unexpected invokation method ${method}`);

    callback(args, port)
      .then((value) => {
        const response = new Response(method, value, id, true, port);
        this.postMessage(response);
      })
      .catch((error) => {
        const response = new Response(method, error, id, false, port);
        this.postMessage(response);
      });
  }

  public on(method: string, callback: any): BaseConnection {
    let promiseCallback: AsyncCallback = callback;

    if (!callback.then) {
      promiseCallback = async (...args: any[]) => callback(...args);
    }

    this.invokationCallbacks[method] = promiseCallback;
    return this;
  }

  public invoke(
    method: string,
    payload: any[],
    invoker?: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const invokation = new Invokation(method, payload, invoker);
      const { id } = invokation;

      this.responseCallbacks[id] = { resolve, reject };

      this.postMessage(invokation);
    });
  }

  public listen(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.responseCallbacks[id] = { resolve, reject };
    });
  }
}
