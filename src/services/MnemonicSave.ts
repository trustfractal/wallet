import { Storage } from "@utils/StorageArray";

const CHECK_NEEDED_KEY = "mnemonic-check-needed";

interface WordChecked {
  word: string;
  isDisabled: boolean;
}
export class MnemonicSave {
  public mnemonicArr: string[];
  public sortedMnemonic: WordChecked[];
  private counter: number;
  constructor(private readonly storage: Storage) {
    this.mnemonicArr = [];
    this.sortedMnemonic = [];
    this.counter = 0;
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

  init() {
    this.counter = 0;
  }

  setMnemonic(mnemonic: string) {
    this.mnemonicArr = mnemonic.split(" ");
  }

  checkWord(word: string): boolean {
    let result = false;
    if (this.mnemonicArr[this.counter] === word) {
      let wordChecked = this.sortedMnemonic.find((wordChecked) => {
        return wordChecked.word === word;
      });
      if (wordChecked) {
        wordChecked.isDisabled = true;
      }
      this.counter++;
      result = true;
    }

    return result;
  }

  checked(): boolean {
    return this.counter >= this.mnemonicArr.length;
  }

  getSortedMnemonic(): WordChecked[] {
    if (this.sortedMnemonic.length === 0) {
      const mnemonicArr = this.mnemonicArr.slice();
      this.sortedMnemonic = mnemonicArr.sort().map((word) => {
        return { word, isDisabled: false };
      });
    }
    return this.sortedMnemonic;
  }
}
