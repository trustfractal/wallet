import { utils as ethersUtils } from "ethers";

import Crypto from "@src/Crypto";
import { deepSortObject } from "@src/utils";

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
    if (!this.claimerSignature || !this.rootHash) return false;

    const expectedSigner = ethersUtils.verifyMessage(
      this.rootHash,
      this.claimerSignature
    );

    return expectedSigner === this.claim.owner;
  }

  public validateClaimHashTree(): boolean {
    if (
      !this.claim ||
      !this.claim.properties ||
      !this.claim.claimTypeHash ||
      !this.claimHashTree
    )
      return false;

    const { properties, claimTypeHash } = this.claim;

    const hashTree = Object.entries(properties).reduce(
      (memo: HashTree, [key, value]: [string, any]) => {
        const hashableKey = `${claimTypeHash}#${key}`;
        const hashable = JSON.stringify({ [hashableKey]: value });

        const { nonce } = this.claimHashTree[key];

        memo[key] = Crypto.hashWithNonce(hashable, nonce);

        return memo;
      },
      {}
    );

    const expectedHashTree = deepSortObject(hashTree);
    const claimHashTree = deepSortObject(this.claimHashTree);

    return JSON.stringify(expectedHashTree) === JSON.stringify(claimHashTree);
  }

  public validateClaimTypeHash(): boolean {
    if (!this.claimTypeHash) return false;

    const { nonce } = this.claimTypeHash;
    const { hash: expectedHash } = Crypto.hashWithNonce(
      this.claim.claimTypeHash,
      nonce
    );

    const { hash } = this.claimTypeHash;

    return hash === expectedHash;
  }

  public validateRootHash(): boolean {
    const { owner } = this.claim;
    const { hash: claimTypeHash } = this.claimTypeHash;

    if (!owner || !claimTypeHash || !this.claimHashTree) return false;

    const expectedHash = Crypto.calculateRootHash(
      this.claimHashTree,
      claimTypeHash,
      owner
    );

    return this.rootHash === expectedHash;
  }
}
