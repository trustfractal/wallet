import { ICType } from "@kiltprotocol/sdk-js";

export default class UnsafeCType implements ICType {
  public static fromCType(cTypeInput: ICType): UnsafeCType {
    return new UnsafeCType(cTypeInput);
  }

  public hash: ICType["hash"];
  public owner: ICType["owner"] | null;
  public schema: ICType["schema"];

  public constructor(cTypeInput: ICType) {
    this.schema = cTypeInput.schema;
    this.owner = cTypeInput.owner;
    this.hash = cTypeInput.hash;
  }
}
