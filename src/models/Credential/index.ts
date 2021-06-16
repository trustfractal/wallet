import { AttestedClaim as SDKAttestedClaim } from "@trustfractal/sdk";
import { IAbstractCredential, ICredential } from "@pluginTypes/index";
import CredentialsVersions from "./versions";

export default abstract class Credential
  extends SDKAttestedClaim
  implements IAbstractCredential
{
  public id: string;
  public level: string;
  public version: string;

  public constructor(
    credential: SDKAttestedClaim,
    id: string,
    level: string,
    version: string = CredentialsVersions.VERSION_TWO,
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
    this.version = version;
  }

  public static fromString(str: string): ICredential {
    const { version } = JSON.parse(str);

    const { default: LegacyCredential } = require("./LegacyCredential");
    const { default: StableCredential } = require("./StableCredential");

    if (version === CredentialsVersions.VERSION_TWO)
      return StableCredential.parse(str);
    else return LegacyCredential.parse(str);
  }
}
