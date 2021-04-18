import { IResponse, IInvokation } from "@fractalwallet/types";
import BaseConnection from "@models/Base/BaseConnection";
import ConnectionNames from "@models/Connection/names";
import Invokation from "@models/Message/Invokation";

class MockedConnection extends BaseConnection {
  constructor() {
    super(ConnectionNames.BACKGROUND, ConnectionNames.CONTENT_SCRIPT);
  }

  public postMessage(_message: IResponse | IInvokation): void {
    return;
  }
}

describe("Unit Base Connection", () => {
  describe("on", () => {
    it("On 'on' on a base connection subclass, a callback is registered to the method invokation", () => {
      // Prepare
      const method = "test_method";
      const callback = jest.fn();
      const mockedConnection = new MockedConnection();

      // Execute
      mockedConnection.on(method, callback);

      // Assert
      expect(mockedConnection.invokationCallbacks).toHaveProperty(method);
    });
  });
  describe("invoke", () => {
    it("On 'invoke' on a base connection subclass, a message is sent to the background script", () => {
      // Prepare
      const method = "test_method";
      const payload = ["argument1", 2, false];
      const invoker = "test_invoker";
      const mockedConnection = new MockedConnection();
      jest.spyOn(mockedConnection, "postMessage");

      // Execute
      mockedConnection.invoke(method, payload, invoker);

      // Assert
      const responseCallbackKeys = Object.keys(
        mockedConnection.responseCallbacks,
      );
      expect(responseCallbackKeys).toHaveLength(1);
      expect(mockedConnection.postMessage).toHaveBeenCalled();
      const invokation: Invokation =
        // @ts-ignore
        mockedConnection.postMessage.mock.calls[0][0];
      expect(invokation.method).toBe(method);
      expect(invokation.args).toStrictEqual(payload);
      expect(invokation.port).toBe(invoker);
    });
  });
  describe("listen", () => {
    it("On 'listen' on a base connection subclass, a callback is registered to response id", () => {
      // Prepare
      const id = "invokation_id";
      const mockedConnection = new MockedConnection();

      // Execute
      mockedConnection.listen(id);

      // Assert
      expect(mockedConnection.responseCallbacks).toHaveProperty(id);
    });
  });
});
