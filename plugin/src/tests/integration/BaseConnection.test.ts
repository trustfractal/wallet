import { IResponse, IInvokation, Message } from "@fractalwallet/types";
import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";
import Response from "@models/Message/Response";
import Invokation from "@models/Message/Invokation";

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

describe("Integration Base Connection", () => {
  it("Receives a 'Response' success message, resolves the registered callback and deletes it", async () => {
    // Prepare
    const method = "test_method";
    const invokationPayload = ["argument1", 2, false];
    const returnedValue = ["argument2", 3, true];
    const invoker = "test_invoker";
    const mockedConnection = new MockedConnection();

    // register response callback for the method
    jest.spyOn(mockedConnection, "postMessage");
    const invokationResult = mockedConnection.invoke(
      method,
      invokationPayload,
      invoker,
    );

    // get the registered invokation id
    const invokationId = Object.keys(mockedConnection.responses)[0];
    const response = new Response(
      method,
      returnedValue,
      invokationId,
      true,
      invoker,
    );

    // Execute
    mockedConnection.testHandleMessage({
      type: response.getMessageType(),
      message: response.serialize(),
    });

    // Assert
    // eslint-disable-next-line jest/valid-expect
    expect(invokationResult).resolves.toStrictEqual(returnedValue);
    const responseCallbackKeys = Object.keys(mockedConnection.responses);
    expect(responseCallbackKeys).toHaveLength(0);
  });

  it("Receives a 'Response' failed message, rejects the registered callback and deletes it", () => {
    // Prepare
    const method = "test_method";
    const invokationPayload = ["argument1", 2, false];
    const returnedValue = "test the promise has rejected";
    const invoker = "test_invoker";
    const mockedConnection = new MockedConnection();

    // register response callback for the method
    jest.spyOn(mockedConnection, "postMessage");
    const invokationResult = mockedConnection.invoke(
      method,
      invokationPayload,
      invoker,
    );

    // get the registered invokation id
    const invokationId = Object.keys(mockedConnection.responses)[0];
    const response = new Response(
      method,
      returnedValue,
      invokationId,
      false,
      invoker,
    );

    // Execute
    mockedConnection.testHandleMessage({
      type: response.getMessageType(),
      message: response.serialize(),
    });

    // Assert
    // expect.assertions(1);
    // eslint-disable-next-line jest/valid-expect
    expect(invokationResult).rejects.toStrictEqual(returnedValue);
    const responseCallbackKeys = Object.keys(mockedConnection.responses);
    expect(responseCallbackKeys).toHaveLength(0);
  });
  it("Receives a 'Invokation' message, calls the registered the callback with success and posts a message to the source with the result", async () => {
    // Prepare
    const method = "test_method";
    const callbackResult = "result from the callback call";
    const callback = jest.fn(() => callbackResult);
    const invokationPayload = ["argument1", 2, false];
    const invoker = "test_invoker";
    const invokation = new Invokation(method, invokationPayload, invoker);
    const mockedConnection = new MockedConnection();
    jest.spyOn(mockedConnection, "postMessage");

    // register invokation callback for the method
    mockedConnection.on(method, callback);

    // Execute
    mockedConnection.testHandleMessage({
      type: invokation.getMessageType(),
      message: invokation.serialize(),
    });

    // wait for the callback to called
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

    // Assert
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(invokationPayload, invoker);
    expect(mockedConnection.postMessage).toHaveBeenCalled();
    // @ts-ignore
    const response: Response = mockedConnection.postMessage.mock.calls[0][0];
    expect(response.id).toBe(invokation.id);
    expect(response.method).toBe(method);
    expect(response.value).toStrictEqual(callbackResult);
    expect(response.success).toStrictEqual(true);
    expect(response.port).toBe(invoker);
  });
  it("Receives a 'Invokation' message, calls the registered the callback with error and posts a message to the source with the result", async () => {
    // Prepare
    const method = "test_method";
    const callbackResult = new Error("result from the callback call");
    const callback = jest.fn(() => {
      throw callbackResult;
    });
    const invokationPayload = ["argument1", 2, false];
    const invoker = "test_invoker";
    const invokation = new Invokation(method, invokationPayload, invoker);
    const mockedConnection = new MockedConnection();
    jest.spyOn(mockedConnection, "postMessage");

    // register invokation callback for the method
    mockedConnection.on(method, callback);

    // Execute
    mockedConnection.testHandleMessage({
      type: invokation.getMessageType(),
      message: invokation.serialize(),
    });

    // wait for the callback to called
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

    // Assert
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(invokationPayload, invoker);
    expect(mockedConnection.postMessage).toHaveBeenCalled();
    // @ts-ignore
    const response: Response = mockedConnection.postMessage.mock.calls[0][0];
    expect(response.id).toBe(invokation.id);
    expect(response.method).toBe(method);
    expect(response.value).toStrictEqual(callbackResult);
    expect(response.success).toStrictEqual(false);
    expect(response.port).toBe(invoker);
  });
});
