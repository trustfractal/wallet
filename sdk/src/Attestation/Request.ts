import {
  IAttestationRequest,
  IClaim,
  IClaimHashNode,
  IClaimHashTree,
  Signature,
} from "@src/types";

import Crypto from "@src/Crypto";

export default class Request implements IAttestationRequest {
  public claim: IClaim;
  public claimerSignature?: Signature;
  public claimHashTree: IClaimHashTree;
  public claimTypeHash: IClaimHashNode;
  public rootHash: IClaimHashNode;

  public constructor({
    claim,
    claimerSignature,
    claimHashTree,
    claimTypeHash,
    rootHash,
  }: IAttestationRequest) {
    this.claim = claim;
    this.claimerSignature = claimerSignature;
    this.claimHashTree = claimHashTree;
    this.claimTypeHash = claimTypeHash;
    this.rootHash = rootHash;
  }

  public static fromClaim(claim: IClaim) {
    const claimHashTree = Crypto.buildHashTree(claim);
    const claimTypeHash = Crypto.hashWithNonce(claim.claimTypeHash);
    // TODO: correctly calculate the rootHash
    const rootHash = { hash: "0x0", nonce: "0" };

    return new Request({
      claim,
      claimHashTree,
      rootHash,
      claimTypeHash,
    });
  }
}
