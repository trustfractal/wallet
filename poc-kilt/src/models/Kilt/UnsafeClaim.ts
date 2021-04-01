import { IClaim, ICType, IPublicIdentity } from "@kiltprotocol/sdk-js";

export default class UnsafeClaim implements IClaim {
  public static fromCTypeAndClaimContents(
    ctypeInput: ICType,
    claimContents: IClaim["contents"],
    claimOwner: IPublicIdentity["address"],
  ): UnsafeClaim {
    return new UnsafeClaim({
      cTypeHash: ctypeInput.hash,
      contents: claimContents,
      owner: claimOwner,
    });
  }

  public cTypeHash: IClaim["cTypeHash"];
  public contents: IClaim["contents"];
  public owner: IClaim["owner"];

  constructor(claimInput: IClaim) {
    this.cTypeHash = claimInput.cTypeHash;
    this.contents = claimInput.contents;
    this.owner = claimInput.owner;
  }
}
