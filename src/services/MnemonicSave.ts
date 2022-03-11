import { Storage } from "@utils/StorageArray";

const CHECK_NEEDED_KEY = "mnemonic-check-needed";

export class MnemonicSave {
  public mnemonicArr: string[];
  public sortedMnemonic: string[];
  constructor(private readonly storage: Storage) {
    this.mnemonicArr = [];
    this.sortedMnemonic = [];
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
    this.mnemonicArr = mnemonic.split(" ");
  }

  checkWord(counter: number, word: string): boolean {
    return this.mnemonicArr[counter] === word;
  }

  getSortedMnemonic(): string[] {
    if (this.sortedMnemonic.length === 0) {
      const mnemonicArr = this.mnemonicArr.slice();
      this.sortedMnemonic = mnemonicArr.sort();
    }
    return this.sortedMnemonic;
  }
}
