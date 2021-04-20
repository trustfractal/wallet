import Crypto from "@src/Crypto";
import AttestationRequest from "@src/AttestationRequest";
import FractalError from "@src/FractalError";

import {
  IClaim,
  ICredential,
  Hash,
  Address,
  Signature,
  HashWithNonce,
  HashTree,
} from "@src/types";

export default class Credential implements ICredential {
  public static fromRequest(request: AttestationRequest) {
    if (!request.claimerSignature || !request.claim.owner)
      throw FractalError.credentialFromUnsignedRequest(request);

    if (!request.validate())
      throw FractalError.credentialFromInvalidRequest(request);

    return new Credential({
      claim: request.claim,
      rootHash: request.rootHash,
      attesterAddress: null,
      attesterSignature: null,
      claimerAddress: request.claim.owner,
      claimerSignature: request.claimerSignature,
      claimTypeHash: request.claimTypeHash,
      claimHashTree: request.claimHashTree,
    });
  }

  public claim: IClaim;
  public rootHash: Hash;
  public attesterAddress: Address | null;
  public attesterSignature: Signature | null;
  public claimerAddress: Address;
  public claimerSignature: Signature;
  public claimTypeHash: HashWithNonce;
  public claimHashTree: HashTree;

  public constructor({
    claim,
    rootHash,
    attesterAddress,
    attesterSignature,
    claimerAddress,
    claimerSignature,
    claimTypeHash,
    claimHashTree,
  }: ICredential) {
    this.claim = claim;
    this.rootHash = rootHash;
    this.attesterAddress = attesterAddress;
    this.attesterSignature = attesterSignature;
    this.claimerAddress = claimerAddress;
    this.claimerSignature = claimerSignature;
    this.claimTypeHash = claimTypeHash;
    this.claimHashTree = claimHashTree;
  }

  public removeProperty(property: string): void {
    delete this.claim.properties[property];
    delete this.claimHashTree[property]["nonce"];
  }

  public getProperty(property: string): any {
    return this.claim.properties[property];
  }

  // check if all fields are valid
  public verifyIntegrity(): boolean {
    return (
      this.verifyClaimHashTree() &&
      this.verifyClaimTypeHash() &&
      this.verifyClaimerAddress() &&
      this.verifyClaimerSignature() &&
      this.verifyAttesterSignature() &&
      this.verifyRootHash()
    );
  }

  // check if it is present on the blockchain
  // and the attested hash matches the one from the contract
  public verifyNetwork(): boolean {
    return this.verifyStorage() && this.verifyAttestedHash();
  }

  private verifyClaimHashTree() {
    return Crypto.verifyPartialClaimHashTree(
      this.claimHashTree,
      this.claim.properties,
      this.claim.claimTypeHash
    );
  }

  private verifyClaimTypeHash() {
    return Crypto.verifyHashWithNonce(
      this.claimTypeHash,
      this.claim.claimTypeHash
    );
  }

  private verifyClaimerAddress() {
    return this.claim.owner === this.claimerAddress;
  }

  private verifyClaimerSignature() {
    return Crypto.verifySignature(
      this.claimerSignature,
      this.rootHash,
      this.claimerAddress
    );
  }

  private verifyAttesterSignature() {
    if (!this.attesterSignature || !this.attesterAddress) return false;

    return Crypto.verifySignature(
      this.attesterSignature,
      this.rootHash,
      this.attesterAddress
    );
  }

  private verifyRootHash() {
    return Crypto.verifyRootHash(
      this.claimHashTree,
      this.claimTypeHash.hash,
      this.claimerAddress,
      this.rootHash
    );
  }

  // TODO: Fix this when we have the attestedHash field
  // and a working smart contract
  private verifyAttestedHash() {
    return true;
  }

  // TODO: Fix this when we have a working smart contract
  private verifyStorage() {
    return true;
  }
}
