import Collection from "@models/Base/BaseCollection";
import Credential from "@models/Credential";
import { ICredential } from "@pluginTypes/index";

export default class CredentialsCollection extends Collection<ICredential> {
  static parse(str: string) {
    const credentials = JSON.parse(str);

    const elements = credentials.map((element: string) =>
      Credential.parse(element),
    );

    return new CredentialsCollection(...elements);
  }

  static fromRpcList(userCredentials: ICredential[]) {
    return CredentialsCollection.fromArray(userCredentials);
  }

  static fromArray(array: Array<ICredential>) {
    const collection = new CredentialsCollection();
    for (const cred of array as Array<any>) {
      const credential = new Credential(
        { ...cred.data },
        `${cred.verification_case_id}:${cred.level}`,
        cred.level,
        cred.verification_case_id,
        new Date(cred.created_at).getTime(),
      );
      collection.push(credential);
    }
    return collection;
  }

  static empty() {
    return new CredentialsCollection();
  }
}
