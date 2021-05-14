import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";

import {
  IConnection,
  IResponse,
  IInvokation,
  IMiddleware,
  AsyncCallback,
  Message,
} from "@pluginTypes/index";

import ConnectionNames from "@models/Connection/names";
import {
  ERROR_HANDLE_INVOKATION,
  ERROR_HANDLE_MESSAGE,
  ERROR_HANDLE_RESPONSE,
} from "@models/Connection/Errors";

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
    if (type === Response.NAME) {
      this.handleResponse(message);
    } else if (type === Invokation.NAME) {
      this.handleInvokation(message);
    } else {
      throw ERROR_HANDLE_MESSAGE(message, type);
    }
  }

  private static async applyMiddlewares(
    middlewares: IMiddleware[],
    invokation: IInvokation,
  ): Promise<void> {
    for (const middleware of middlewares) {
      await middleware.apply(invokation);
    }
  }

  private handleResponse(msg: string): void {
    const { value, id, success } = Response.parse(msg);
    const response = this.responses[id];

    if (!response) throw ERROR_HANDLE_RESPONSE(msg);

    const { resolve, reject } = response;
    success ? resolve(value) : reject(value);

    delete this.responses[id];
  }

  private async handleInvokation(msg: string): Promise<void> {
    const message = Invokation.parse(msg);
    const { method, args, id, port } = message;
    const invokation = this.invokations[method];

    if (!invokation) throw ERROR_HANDLE_INVOKATION(msg);

    try {
      // apply middlewares
      await BaseConnection.applyMiddlewares(invokation.middlewares, message);

      // call invokation
      const value = await invokation.callback(args, port);

      const response = new Response(method, value, id, true, port);
      this.postMessage(response);
    } catch (error) {
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
