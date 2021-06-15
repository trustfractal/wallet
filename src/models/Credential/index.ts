import { AttestedClaim as SDKAttestedClaim } from "@trustfractal/sdk";
import { ICredential, ISerializable } from "@pluginTypes/index";

export default class Credential
  extends SDKAttestedClaim
  implements ICredential, ISerializable
{
  public id: string;
  public level: string;
  public revoked: boolean;

  public constructor(
    credential: SDKAttestedClaim,
    id: string,
    level: string,
    revoked: boolean = false,
  ) {
    super({
      claim: credential.claim,
      rootHash: credential.rootHash,
      attestedClaimHash: credential.attestedClaimHash,
      attestedClaimSignature: credential.attestedClaimSignature,
      attesterAddress: credential.attesterAddress,
      attesterSignature: credential.attesterSignature,
      claimerAddress: credential.claimerAddress,
      claimerSignature: credential.claimerSignature,
      claimTypeHash: credential.claimTypeHash,
      claimHashTree: credential.claimHashTree,
    });
    this.id = id;
    this.level = level;
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
    });
  }

  public static parse(str: string): ICredential {
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

    return new Credential(attestedCLaim, id, level, revoked);
  }
}
