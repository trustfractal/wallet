import Invokation from "@models/Message/Invokation";

import {
  IConnection,
  IInvokation,
  IResponse,
  IProxyConnection,
} from "@fractalwallet/types";

import ConnectionNames from "@models/Connection/names";

export default class ProxyConnection implements IProxyConnection {
  public sourceConnection: IProxyConnection["sourceConnection"];
  public sourceName: IProxyConnection["sourceName"];
  public destinationConnection: IProxyConnection["destinationConnection"];
  public destinationName: IProxyConnection["destinationName"];

  constructor(
    sourceConnection: IConnection,
    sourceName: ConnectionNames,
    destinationConnection: IConnection,
    destinationName: ConnectionNames,
  ) {
    this.sourceConnection = sourceConnection;
    this.sourceName = sourceName;
    this.destinationConnection = destinationConnection;
    this.destinationName = destinationName;
  }

  // forwards messages to the source script
  private forwardSource(invokation: IInvokation): void {
    this.postSourceMessage(invokation);
  }

  // post a message to the source script via stream
  private postSourceMessage(message: IResponse | IInvokation): void {
    this.sourceConnection.postMessage(message);
  }

  // forwards messages to the destination script
  private forwardDestination(invokation: IInvokation): void {
    this.postDestinationMessage(invokation);
  }

  // post a message to the destination script via chrome ports
  private postDestinationMessage(message: IResponse | IInvokation): void {
    this.destinationConnection.postMessage(message);
  }

  // proxy messages froms source to destination
  public proxy(method: string): ProxyConnection {
    this.sourceConnection.on(method, (args: any[], invoker: string) => {
      return new Promise((resolve, reject) => {
        const invokation = new Invokation(method, args, invoker);

        // TODO: Remove debug console.log
        console.log(
          `proxy: ${this.sourceName} -> ${this.destinationName}`,
          invokation,
        );

        // forward message to destination
        this.forwardDestination(invokation);

        // listen for destination reply
        this.destinationConnection
          .listen(invokation.id)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      });
    });

    return this;
  }

  // proxy messages froms destination to source
  public reversedProxy(method: string): ProxyConnection {
    this.destinationConnection.on(method, (args: any[], invoker: string) => {
      return new Promise((resolve, reject) => {
        const invokation = new Invokation(method, args, invoker);

        // TODO: Remove debug console.log
        console.log(
          `proxy: ${this.destinationName} -> ${this.sourceName}`,
          invokation,
        );

        // forward message to source
        this.forwardSource(invokation);

        // listen for source reply
        this.sourceConnection
          .listen(invokation.id)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      });
    });

    return this;
  }
}
