import { IResponse, IInvokation, Message } from "@fractalwallet/types";
import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";
import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";
import ProxyConnection from "@models/Connection/ProxyConnection";

class MockedConnection extends BaseConnection {
  constructor() {
    super(ConnectionNames.BACKGROUND, ConnectionNames.CONTENT_SCRIPT);
  }

  public testHandleMessage(message: Message) {
    this.handleMessage(message);
  }

  public postMessage(_message: IResponse | IInvokation): void {
    return;
  }
}

describe("Integration Proxy Connection", () => {
  it("Receives an invokation message on a proxied connection, forwards the call to the destination connection and listen the response reply", async () => {
    // Prepare
    const method = "test_method";
    const invoker = "test_invoker";
    const invokationPayload = ["argument1", 2, false];
    const invokation = new Invokation(method, invokationPayload, invoker);
    const sourceConnection = new MockedConnection();
    const destinationConnection = new MockedConnection();
    const proxyConnection = new ProxyConnection(
      sourceConnection,
      ConnectionNames.BACKGROUND,
      destinationConnection,
      ConnectionNames.CONTENT_SCRIPT,
    );
    jest.spyOn(sourceConnection, "postMessage");
    jest.spyOn(destinationConnection, "postMessage");

    // register proxy method
    proxyConnection.proxy(method);

    // Execute
    sourceConnection.testHandleMessage({
      type: invokation.getMessageType(),
      message: invokation.serialize(),
    });

    // Assert
    expect(destinationConnection.postMessage).toHaveBeenCalled();
    expect(sourceConnection.postMessage).not.toHaveBeenCalled();
    const responseCallbackKeys = Object.keys(
      destinationConnection.responseCallbacks,
    );
    expect(responseCallbackKeys).toHaveLength(1);
  });
  it("Receives an invokation message on a reversed proxied connection, forwards the call to the source connection and listen the response reply", async () => {
    // Prepare
    const method = "test_method";
    const invoker = "test_invoker";
    const invokationPayload = ["argument1", 2, false];
    const invokation = new Invokation(method, invokationPayload, invoker);
    const sourceConnection = new MockedConnection();
    const destinationConnection = new MockedConnection();
    const proxyConnection = new ProxyConnection(
      sourceConnection,
      ConnectionNames.BACKGROUND,
      destinationConnection,
      ConnectionNames.CONTENT_SCRIPT,
    );
    jest.spyOn(sourceConnection, "postMessage");
    jest.spyOn(destinationConnection, "postMessage");

    // register proxy method
    proxyConnection.reversedProxy(method);

    // Execute
    destinationConnection.testHandleMessage({
      type: invokation.getMessageType(),
      message: invokation.serialize(),
    });

    // Assert
    expect(sourceConnection.postMessage).toHaveBeenCalled();
    expect(destinationConnection.postMessage).not.toHaveBeenCalled();
    const responseCallbackKeys = Object.keys(
      sourceConnection.responseCallbacks,
    );
    expect(responseCallbackKeys).toHaveLength(1);
  });
});
