import { ICredential } from "@pluginTypes/index";

import LegacyCredential from "./LegacyCredential";
import StableCredential from "./StableCredential";

import CredentialsVersions from "./versions";

export default abstract class Credential {
  public static fromString(str: string): ICredential {
    const { version } = JSON.parse(str);

    if (version === CredentialsVersions.VERSION_TWO)
      return StableCredential.parse(str);
    else return LegacyCredential.parse(str);
  }
}
