import { ISerializable } from "./Common";

import { ICredential as ISDKCredential } from "@fractalwallet/sdk/src/types/Credential";

export interface ICredential extends ISDKCredential, ISerializable {
  id: String;
}
