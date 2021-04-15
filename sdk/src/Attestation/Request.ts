import { Address, IClaimProperties, Signature } from "@src/types";

export default class Request {
  public claimer: Address;
  public contents: IClaimProperties;
  public claimerSignature: Signature | undefined;

  constructor(claimer: Address, contents: IClaimProperties) {
    this.claimer = claimer;
    this.contents = contents;
    this.claimerSignature = undefined;
  }
}
