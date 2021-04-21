import { ICredential, ISerializable } from "@fractalwallet/types";

import { Credential as SDKCredential } from "@fractalwallet/sdk";
import {
  IClaim,
  Address,
  Hash,
  HashTree,
  HashWithNonce,
  Signature,
} from "@fractalwallet/sdk/src/types";

export default class Credential extends SDKCredential
  implements ICredential, ISerializable {
  public id: string;

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
    super({
      claim,
      rootHash,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    });
    this.id = id;
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
