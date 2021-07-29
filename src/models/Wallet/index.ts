import {
  encodeAddress,
  mnemonicGenerate,
  mnemonicToMiniSecret,
  naclKeypairFromSeed,
} from "@polkadot/util-crypto";

export default class Wallet {
  public static generate() {
    const mnemonic = mnemonicGenerate();

    return new Wallet(mnemonic);
  }

  public static fromMnemonic(mnemonic: string) {
    return new Wallet(mnemonic);
  }

  public mnemonic: string;
  public seed: Uint8Array;
  public publicKey: Uint8Array;
  public address: string;

  public constructor(mnemonic: string) {
    this.mnemonic = mnemonic;

    this.seed = mnemonicToMiniSecret(mnemonic);
    const { publicKey } = naclKeypairFromSeed(this.seed);
    this.publicKey = publicKey;
    this.address = encodeAddress(publicKey);
  }

  public serialize(): string {
    return this.mnemonic;
  }
}
