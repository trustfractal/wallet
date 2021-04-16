import {
  Hash,
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
  public rootHash: Hash;

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
    const rootHash = Crypto.calculateRootHash(claimHashTree);

    return new Request({
      claim,
      claimHashTree,
      rootHash,
      claimTypeHash,
    });
  }
}
