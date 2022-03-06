import { Storage } from '@utils/StorageArray';

export class MnemonicSave {
  public mnemonicArr: string[]
  private counter: number
  constructor(
    private readonly storage: Storage,
    mnemonic?: string,
  ) {
      if (mnemonic) {
        this.mnemonicArr = mnemonic.split(' ');
      } else {
        this.mnemonicArr = [];
      }
      this.counter = 0;
  }

  async isMnemonicSaved() {
    return await this.storage.hasItem(this.setupKey());
  }

  private setupKey() {
    return `mnemonic-saved`;
  }

  checkPhrase(phrase: string): boolean {
      console.log('checkPhrase with - ', phrase);
      let result = false;
      if (this.mnemonicArr[this.counter] === phrase) {
        console.log('correct phrase');
        this.counter++;
        result = true;
      }

      if (this.checked()) {
          console.log('mnemonic checked');
          this.checkMnemonic();
          return true;
      }

    return result;
  }

  checked(): boolean {
    return this.counter >= this.mnemonicArr.length;
  }

  getMnemonicArr(): string[] {
    return this.mnemonicArr;
  }

  async checkMnemonic() {
        await this.storage.setItem(this.setupKey(), JSON.stringify(true));
  }
}
