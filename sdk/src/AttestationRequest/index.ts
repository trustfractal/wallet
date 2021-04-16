import Crypto from "@src/Crypto";

import {
  Hash,
  IAttestationRequest,
  IClaim,
  HashWithNonce,
  HashTree,
  Signature,
} from "@src/types";

export default class Request implements IAttestationRequest {
  public static fromClaim(claim: IClaim) {
    const claimHashTree = Crypto.buildHashTree(claim);
    const claimTypeHash = Crypto.hashWithNonce(claim.claimTypeHash);

    const rootHash = Crypto.calculateRootHash(
      claimHashTree,
      claimTypeHash.hash,
      claim.owner || ""
    );

    return new Request({
      claim,
      claimHashTree,
      rootHash,
      claimTypeHash,
    });
  }

  public claim: IClaim;
  public claimerSignature?: Signature;
  public claimHashTree: HashTree;
  public claimTypeHash: HashWithNonce;
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

  public validate(): boolean {
    // ensure that all the validations always run
    const validClaimerSignature = this.validateClaimerSignature();
    const validClaimHashTree = this.validateClaimHashTree();
    const validClaimTypeHash = this.validateClaimTypeHash();
    const validRootHash = this.validateRootHash();

    return (
      validClaimerSignature &&
      validClaimHashTree &&
      validClaimTypeHash &&
      validRootHash
    );
  }

  public validateClaimerSignature(): boolean {
    if (!this.claimerSignature || !this.claim.owner) return false;

    return Crypto.verifySignature(
      this.claimerSignature,
      this.rootHash,
      this.claim.owner
    );
  }

  public validateClaimHashTree(): boolean {
    const { properties, claimTypeHash } = this.claim;

    return Crypto.verifyClaimHashTree(
      this.claimHashTree,
      properties,
      claimTypeHash
    );
  }

  public validateClaimTypeHash(): boolean {
    return Crypto.verifyHashWithNonce(
      this.claimTypeHash,
      this.claim.claimTypeHash
    );
  }

  public validateRootHash(): boolean {
    const { owner } = this.claim;
    const { hash: claimTypeHash } = this.claimTypeHash;

    if (!owner) return false;

    return Crypto.verifyRootHash(
      this.claimHashTree,
      claimTypeHash,
      owner,
      this.rootHash
    );
  }
}
