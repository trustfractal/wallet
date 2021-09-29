import { MaguroService } from "@services/MaguroService";
import { ProtocolService } from "@services/ProtocolService";
import { WindowsService } from "@services/WindowsService";
import { Storage } from "@utils/StorageArray";

export class MissingLiveness extends Error {}

export class ProtocolOptIn {
  public postOptInCallbacks: Array<() => Promise<void>> = [];

  constructor(
    private readonly storage: Storage,
    private readonly maguro: MaguroService,
    private readonly protocol: Promise<ProtocolService>,
    private readonly windows: WindowsService,
    private readonly livenessUrl: string,
  ) {}

  async isOptedIn() {
    return await this.storage.hasItem("opt-in/mnemonic");
  }

  async hasCompletedLiveness() {
    return (await this.protocol).isIdentityRegistered();
  }

  async getMnemonic() {
    return await this.storage.getItem("opt-in/mnemonic");
  }

  async optIn(mnemonic: string) {
    await this.storage.setItem("opt-in/mnemonic", mnemonic);
    for (const cb of this.postOptInCallbacks) {
      await cb();
    }
    await this.tryRegisterIdentity();
  }

  async postOptInLiveness() {
    await this.tryRegisterIdentity(async () => {
      await this.windows.openTab(this.livenessUrl);
    });
  }

  private async tryRegisterIdentity(onMissingLiveness?: () => Promise<void>) {
    const mnemonic = await this.storage.getItem("opt-in/mnemonic");
    try {
      const address = (await this.protocol).addressForMnemonic(mnemonic!);
      await this.maguro.registerIdentity(address);
    } catch (e) {
      if (!(e instanceof MissingLiveness)) {
        throw e;
      }
      if (onMissingLiveness != null) {
        await onMissingLiveness();
      }
    }
  }
}
