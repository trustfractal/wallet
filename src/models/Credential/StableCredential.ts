import { AttestedClaim as SDKAttestedClaim } from "@trustfractal/sdk";
import { IStableCredential, ISerializable } from "@pluginTypes/index";

import Credential from "@models/Credential";
import CredentialsVersions from "./versions";

export default class StableCredential
  extends Credential
  implements IStableCredential, ISerializable {
  public revoked: boolean;

  public constructor(
    credential: SDKAttestedClaim,
    id: string,
    level: string,
    revoked: boolean = false,
    version: string = CredentialsVersions.VERSION_TWO,
  ) {
    super(credential, id, level, version);
    this.revoked = revoked;
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      rootHash: this.rootHash,
      attestedClaimHash: this.attestedClaimHash,
      attestedClaimSignature: this.attestedClaimSignature,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      claimerAddress: this.claimerAddress,
      claimerSignature: this.claimerSignature,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
      id: this.id,
      level: this.level,
      revoked: this.revoked,
      version: this.version,
    });
  }

  public static parse(str: string): IStableCredential {
    const {
      claim,
      rootHash,
      attestedClaimHash,
      attestedClaimSignature,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
      id,
      level,
      revoked,
      version,
    } = JSON.parse(str);

    const attestedCLaim = new SDKAttestedClaim({
      claim,
      rootHash,
      attestedClaimHash,
      attestedClaimSignature,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    });

    return new StableCredential(attestedCLaim, id, level, revoked, version);
  }
}
