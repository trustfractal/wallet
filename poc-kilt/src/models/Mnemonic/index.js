import KiltService from "@services/kilt";

export default class Mnemonic {
  constructor(mnemonic, identity) {
    this.mnemonic = mnemonic;
    this.identity = identity;
    this.address = identity?.address;
  }

  serialize() {
    return this.mnemonic.toString();
  }

  static async parse(str) {
    let identity = null;

    if (str) identity = await KiltService.buildIdentityFromMnemonic(str);

    return new Mnemonic(str, identity);
  }
}
