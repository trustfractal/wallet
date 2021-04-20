import {
  IClaim,
  ICredential,
  ISerializable,
  Hash,
  Address,
  Signature,
  HashWithNonce,
  HashTree,
} from "@fractalwallet/types";

export default class Credential implements ICredential, ISerializable {
  public id: string;
  public claim: IClaim;
  public rootHash: Hash;
  public attesterAddress: Address | null;
  public attesterSignature: Signature | null;
  public claimerAddress: Address;
  public claimerSignature: Signature;
  public claimTypeHash: HashWithNonce;
  public claimHashTree: HashTree;

  public constructor(
    id: string,
    claim: IClaim,
    rootHash: Hash,
    attesterAddress: Address | null,
    attesterSignature: Signature | null,
    claimerAddress: Address,
    claimerSignature: Signature,
    claimTypeHash: HashWithNonce,
    claimHashTree: HashTree,
  ) {
    this.id = id;
    this.claim = claim;
    this.rootHash = rootHash;
    this.attesterAddress = attesterAddress;
    this.attesterSignature = attesterSignature;
    this.claimerAddress = claimerAddress;
    this.claimerSignature = claimerSignature;
    this.claimTypeHash = claimTypeHash;
    this.claimHashTree = claimHashTree;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      claim: this.claim,
      rootHash: this.rootHash,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      claimerAddress: this.claimerAddress,
      claimerSignature: this.claimerSignature,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
    });
  }

  public static parse(str: string): ICredential {
    const {
      id,
      claim,
      rootHash,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    } = JSON.parse(str);

    return new Credential(
      id,
      claim,
      rootHash,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    );
  }
}
