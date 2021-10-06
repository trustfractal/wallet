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

  static fromRpcList(userCredentials: ICredential[]) {
    const credentials = userCredentials.reduce(
      (memo: CredentialsCollection, credential: any) => {
        memo.push(
          new Credential(
            { ...credential.data },
            `${credential.verification_case_id}:${credential.level}`,
            credential.level,
            credential.verification_case_id,
            new Date(credential.created_at).getTime(),
          ),
        );

        return memo;
      },
      new CredentialsCollection(),
    );
    return credentials;
  }

  static empty() {
    return new CredentialsCollection();
  }
}
