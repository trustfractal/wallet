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

    new Credential({
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

  // check if all fields are valid
  // public verifyIntegrity(): boolean {}

  // check if it is present on the blockchain
  // public verifyStorage(): boolean {}
}
