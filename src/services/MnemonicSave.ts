import { Storage } from "@utils/StorageArray";

const CHECK_NEEDED_KEY = "mnemonic-check-needed";

export class MnemonicSave {
  public mnemonic: string;
  constructor(private readonly storage: Storage) {
    this.mnemonic = "";
  }

  async checkNeeded() {
    return await this.storage.hasItem(CHECK_NEEDED_KEY);
  }
  async setCheckNeeded() {
    await this.storage.setItem(CHECK_NEEDED_KEY, JSON.stringify(true));
  }
  async setCheckNotNeeded() {
    await this.storage.removeItem(CHECK_NEEDED_KEY);
  }

  setMnemonic(mnemonic: string) {
    this.mnemonic = mnemonic;
  }

  getMnemonic() {
    return this.mnemonic;
  }
}
