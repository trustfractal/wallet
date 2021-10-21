import { MissingLiveness, ProtocolOptIn } from "@services/ProtocolOptIn";

class MockStorage {
  private items = new Map();

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
  getItem(key: string) {
    return this.items.get(key);
  }
  hasItem(key: string) {
    return this.items.has(key);
  }
}

describe("ProtocolOptIn", () => {
  function createSpyObj(props: string[]) {
    const obj = {};
    for (const prop of props) {
      obj[prop] = jest.fn().mockName(prop);
    }
    return obj;
  }

  function graph(deps?: any) {
    deps = deps || {};

    const storage = deps.storage || new MockStorage();

    const protocol =
      deps.protocol || createSpyObj(["ensureIdentityRegistered"]);

    const maguro = deps.maguro || createSpyObj(["currentNetwork"]);
    maguro.currentNetwork.mockImplementation(() => "testnet");
    maguro.missingLiveness = () => {
      protocol.ensureIdentityRegistered.mockImplementation(() => {
        throw new MissingLiveness();
      });
    };
    maguro.hasLiveness = () => {
      protocol.ensureIdentityRegistered.mockImplementation(() => {});
    };

    const windows = deps.windows || createSpyObj(["openTab"]);

    const livenessUrl = deps.livenessUrl || "http://fractal-liveness.com";

    const optIn = new ProtocolOptIn(
      storage,
      maguro,
      protocol,
      windows,
      livenessUrl,
    );
    return { storage, optIn, maguro, windows, livenessUrl, protocol };
  }

  it("starts as not isOptedIn", async () => {
    const { optIn } = graph();

    expect(await optIn.isOptedIn()).toEqual(false);
  });

  describe("optIn", () => {
    it("registers identity in Maguro", async () => {
      const { protocol, optIn } = graph();

      await optIn.optIn("some mnemonic");

      expect(protocol.ensureIdentityRegistered).toHaveBeenCalledWith();
    });

    it("isOptedIn is true", async () => {
      const { optIn } = graph();

      await optIn.optIn("some mnemonic");

      expect(await optIn.isOptedIn()).toEqual(true);
    });

    it("calls provided callbacks", async () => {
      const { optIn } = graph();
      const cb = jest.fn();
      optIn.postOptInCallbacks.push(cb);

      await optIn.optIn("some mnemonic");

      expect(cb).toHaveBeenCalled();
    });
  });

  it("loads isOptedIn from storage", async () => {
    const { storage, optIn } = graph();

    await optIn.optIn("some mnemonic");

    const { optIn: newOptIn } = graph({ storage });

    expect(await newOptIn.isOptedIn()).toEqual(true);
  });

  describe("postOptInLiveness", () => {
    it("tries to ensureIdentityRegistered", async () => {
      const { maguro, protocol, optIn } = graph();
      maguro.missingLiveness();
      await optIn.optIn("some mnemonic");

      await optIn.postOptInLiveness();

      expect(protocol.ensureIdentityRegistered).toHaveBeenCalled();
    });

    it("sets liveness on instances", async () => {
      const { storage, maguro, protocol, optIn } = graph();
      maguro.missingLiveness();
      await optIn.optIn("some mnemonic");

      maguro.hasLiveness();
      await optIn.postOptInLiveness();

      const { optIn: newOptIn } = graph({ storage });
      expect(protocol.ensureIdentityRegistered).toHaveBeenCalled();
    });

    it("opens liveness journey if no liveness", async () => {
      const { maguro, optIn, windows, livenessUrl } = graph();
      maguro.missingLiveness();
      await optIn.optIn("some mnemonic");
      await optIn.postOptInLiveness();

      expect(windows.openTab).toHaveBeenCalledWith(livenessUrl);
    });
  });

  describe("re-opting in", () => {
    it("is not opted-in when active network changes", async () => {
      const { maguro, optIn } = graph();
      await optIn.optIn("some mnemonic");

      maguro.currentNetwork.mockImplementation(() => "mainnet");
      expect(await optIn.isOptedIn()).toEqual(false);
    });
  });

  describe("checkOptIn", () => {
    it("calls callbacks if opted in from another instance", async () => {
      const { storage, optIn } = graph();
      const { optIn: otherOptIn } = graph({ storage });
      await otherOptIn.optIn("some mnemonic");

      const cb = jest.fn();
      optIn.postOptInCallbacks.push(cb);
      await optIn.checkOptIn();

      expect(cb).toHaveBeenCalled();
    });

    it("does not call callbacks if already called", async () => {
      const { storage, optIn } = graph();
      const { optIn: otherOptIn } = graph({ storage });
      await otherOptIn.optIn("some mnemonic");

      const cb = jest.fn();
      optIn.postOptInCallbacks.push(cb);
      await optIn.checkOptIn();
      await optIn.checkOptIn();

      expect(cb.mock.calls.length).toEqual(1);
    });
  });
});
