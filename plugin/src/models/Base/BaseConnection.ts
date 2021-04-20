import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";

import {
  IConnection,
  IResponse,
  IInvokation,
  IMiddleware,
  AsyncCallback,
  Message,
} from "@fractalwallet/types";

import ConnectionNames from "@models/Connection/names";

export default abstract class BaseConnection implements IConnection {
  public from: IConnection["from"];
  public to: IConnection["to"];
  public responses: IConnection["responses"];
  public invokations: IConnection["invokations"];

  constructor(from: ConnectionNames, to: ConnectionNames) {
    this.from = from;
    this.to = to;

    this.responses = {};
    this.invokations = {};
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

  private static applyMiddlewares(
    middlewares: IMiddleware[],
    invokation: IInvokation,
  ): Promise<void[]> {
    return Promise.all(
      middlewares.map((middleware: IMiddleware) =>
        middleware.apply(invokation),
      ),
    );
  }

  private handleResponse(msg: string): void {
    const { value, id, success } = Response.parse(msg);
    const response = this.responses[id];

    if (!response) throw new Error(`Unexpected response message ${msg}`);

    const { resolve, reject } = response;
    success ? resolve(value) : reject(value);

    delete this.responses[id];
  }

  private async handleInvokation(msg: string): Promise<void> {
    const message = Invokation.parse(msg);
    const { method, args, id, port } = message;
    const invokation = this.invokations[method];

    try {
      if (!invokation)
        throw new Error(`Unexpected invokation method ${method}`);

      // apply middlewares
      await BaseConnection.applyMiddlewares(invokation.middlewares, message);

      // call invokation
      const value = await invokation.callback(args, port);

      const response = new Response(method, value, id, true, port);
      this.postMessage(response);
    } catch (error: any) {
      console.error(error);

      const response = new Response(method, error, id, false, port);
      this.postMessage(response);
    }
  }

  public on(
    method: string,
    callback: any,
    middlewares: IMiddleware[] = [],
  ): BaseConnection {
    let promiseCallback: AsyncCallback = callback;

    if (!callback.then) {
      promiseCallback = async (...args: any[]) => callback(...args);
    }

    this.invokations[method] = {
      callback: promiseCallback,
      middlewares,
    };
    return this;
  }

  public invoke(
    method: string,
    payload: any[] = [],
    invoker?: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const invokation = new Invokation(method, payload, invoker);
      const { id } = invokation;

      this.responses[id] = { resolve, reject };

      this.postMessage(invokation);
    });
  }

  public listen(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.responses[id] = { resolve, reject };
    });
  }
}
