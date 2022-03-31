import { Storage } from "@utils/StorageArray";

const CHECK_NEEDED_KEY = "mnemonic-check-needed";

export class MnemonicSave {
  public mnemonic: string;
  constructor(private readonly storage: Storage) {
    this.mnemonic = "";
  }

  async isChallengeNeeded() {
    return await this.storage.hasItem(CHECK_NEEDED_KEY);
  }
  async setChallengeNeeded() {
    await this.storage.setItem(CHECK_NEEDED_KEY, JSON.stringify(true));
  }
  async setChallengeNotNeeded() {
    await this.storage.removeItem(CHECK_NEEDED_KEY);
  }
}
