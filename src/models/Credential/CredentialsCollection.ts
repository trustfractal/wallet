import { ICredential } from "@pluginTypes/index";

import Collection from "@models/Base/BaseCollection";
import Credential from "@models/Credential";

export default class CredentialsCollection extends Collection<ICredential> {
  static parse(str: string) {
    const credentials = JSON.parse(str);

    const elements = credentials.map((element: string) =>
      Credential.parse(element),
    );

    return new CredentialsCollection(...elements);
  }
}
