import { ICredential } from "@pluginTypes/index";

import AttestedClaim from "./AttestedClaim";
import SelfAttestedClaim from "./SelfAttestedClaim";

import CredentialsVersions from "./versions";

export default abstract class Credential {
  public static fromString(str: string): ICredential {
    const { version } = JSON.parse(str);

    if (version === CredentialsVersions.VERSION_TWO)
      return SelfAttestedClaim.parse(str);
    else return AttestedClaim.parse(str);
  }
}
