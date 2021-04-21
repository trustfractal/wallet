import { ICredential, ISerializable } from "@fractalwallet/types";

import { Credential as SDKCredential } from "@fractalwallet/sdk";
export default class Credential
  extends SDKCredential
  implements ICredential, ISerializable {
  public id?: string;
  public transactionHash?: string;

  public constructor(
    credential: SDKCredential,
    id?: string,
    transactionHash?: string,
  ) {
    super({
      claim: credential.claim,
      rootHash: credential.rootHash,
      attesterAddress: credential.attesterAddress,
      attesterSignature: credential.attesterSignature,
      claimerAddress: credential.claimerAddress,
      claimerSignature: credential.claimerSignature,
      claimTypeHash: credential.claimTypeHash,
      claimHashTree: credential.claimHashTree,
    });
    this.id = id;
    this.transactionHash = transactionHash;
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      rootHash: this.rootHash,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      claimerAddress: this.claimerAddress,
      claimerSignature: this.claimerSignature,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
      id: this.id,
      transactionHash: this.transactionHash,
    });
  }

  public static parse(str: string): ICredential {
    const {
      claim,
      rootHash,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
      id,
      transactionHash,
    } = JSON.parse(str);

    const sdkCredential = new SDKCredential({
      claim,
      rootHash,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    });

    return new Credential(sdkCredential, id, transactionHash);
  }
}
