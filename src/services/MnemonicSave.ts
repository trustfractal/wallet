import { Storage } from "@utils/StorageArray";

export class MnemonicSave {
  public mnemonicArr: string[];
  public shuffledMnemonic: string[];
  private counter: number;
  constructor(private readonly storage: Storage) {
    this.mnemonicArr = [];
    this.shuffledMnemonic = [];
    this.counter = 0;
  }

  async isMnemonicSaved() {
    return await this.storage.hasItem(this.setupKey());
  }

  private setupKey() {
    return `mnemonic-saved`;
  }

  checkWord(word: string): boolean {
    let result = false;
    if (this.mnemonicArr[this.counter] === word) {
      this.counter++;
      result = true;
    }

    return result;
  }

  checked(): boolean {
    return this.counter >= this.mnemonicArr.length;
  }

  getShuffledMnemonic(): string[] {
    if (this.shuffledMnemonic.length === 0) {
      const mnemonicArr = this.mnemonicArr.slice();
      this.shuffledMnemonic = mnemonicArr.sort();
    }
    return this.shuffledMnemonic;
  }

  async saveMnemonic() {
    await this.storage.setItem(this.setupKey(), JSON.stringify(true));
  }
}
