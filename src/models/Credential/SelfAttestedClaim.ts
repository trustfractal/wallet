import {
  SelfAttestedClaim as SDKSelfAttestedClaim,
  Byte,
} from "@trustfractal/sdk";
import { ISelfAttestedClaim, ISerializable } from "@pluginTypes/index";

import CredentialsVersions from "./versions";

export default class SelfAttestedClaim
  extends SDKSelfAttestedClaim
  implements ISelfAttestedClaim, ISerializable
{
  public id: string;
  public level: string;
  public version: string;
  public revoked: boolean;

  public constructor(
    credential: SDKSelfAttestedClaim,
    id: string,
    level: string,
    revoked: boolean = false,
    version: string = CredentialsVersions.VERSION_TWO,
  ) {
    super({
      claim: credential.claim,
      claimTypeHash: credential.claimTypeHash,
      claimHashTree: credential.claimHashTree,
      rootHash: credential.rootHash,
      claimerAddress: credential.claimerAddress,
      attesterAddress: credential.attesterAddress,
      attesterSignature: credential.attesterSignature,
      countryOfIDIssuance: credential.countryOfIDIssuance,
      countryOfResidence: credential.countryOfResidence,
      kycType: credential.kycType,
    });
    this.id = id;
    this.level = level;
    this.version = version;
    this.revoked = revoked;
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
      rootHash: this.rootHash,
      claimerAddress: this.claimerAddress,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      countryOfIDIssuance: this.countryOfIDIssuance.toJSON(),
      countryOfResidence: this.countryOfResidence.toJSON(),
      kycType: this.kycType.toJSON(),
      id: this.id,
      level: this.level,
      revoked: this.revoked,
      version: this.version,
    });
  }

  public static parse(str: string): ISelfAttestedClaim {
    const {
      claim,
      claimTypeHash,
      claimHashTree,
      rootHash,
      claimerAddress,
      attesterAddress,
      attesterSignature,
      countryOfIDIssuance,
      countryOfResidence,
      kycType,
      id,
      level,
      revoked,
      version,
    } = JSON.parse(str);

    const selfAttestedCLaim = new SDKSelfAttestedClaim({
      claim,
      claimTypeHash,
      claimHashTree,
      rootHash,
      claimerAddress,
      attesterAddress,
      attesterSignature,
      countryOfIDIssuance: new Byte(countryOfIDIssuance),
      countryOfResidence: new Byte(countryOfResidence),
      kycType: new Byte(kycType),
    });

    return new SelfAttestedClaim(
      selfAttestedCLaim,
      id,
      level,
      revoked,
      version,
    );
  }
}
