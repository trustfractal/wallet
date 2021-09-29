import { MaguroService } from "@services/MaguroService";
import { ProtocolService } from "@services/ProtocolService";
import { WindowsService } from "@services/WindowsService";
import { Storage } from "@utils/StorageArray";

export class MissingLiveness extends Error {}

export class ProtocolOptIn {
  public postOptInCallbacks: Array<(mnemonic: string) => Promise<void>> = [];

  constructor(
    private readonly storage: Storage,
    private readonly maguro: MaguroService,
    private readonly protocol: ProtocolService,
    private readonly windows: WindowsService,
    private readonly livenessUrl: string,
  ) {}

  async isOptedIn() {
    return await this.storage.hasItem(await this.mnemonicKey());
  }

  private async mnemonicKey() {
    const network = await this.maguro.currentNetwork();
    return `opt-in/${network}/mnemonic`;
  }

  async hasCompletedLiveness() {
    try {
      return await this.protocol.isIdentityRegistered();
    } catch {
      return false;
    }
  }

  async getMnemonic() {
    return await this.storage.getItem(await this.mnemonicKey());
  }

  async optIn(mnemonic: string) {
    await this.storage.setItem(await this.mnemonicKey(), mnemonic);
    for (const cb of this.postOptInCallbacks) {
      await cb(mnemonic);
    }
    await this.tryRegisterIdentity();
  }

  async postOptInLiveness() {
    await this.tryRegisterIdentity(async () => {
      await this.windows.openTab(this.livenessUrl);
    });
  }

  private async tryRegisterIdentity(onMissingLiveness?: () => Promise<void>) {
    const mnemonic = await this.storage.getItem(await this.mnemonicKey());
    try {
      const address = this.protocol.addressForMnemonic(mnemonic!);
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
