import { ISerializable } from "./Common";

import { ICredential as ISDKCredential } from "@fractalwallet/sdk/src/types/Credential";
import { ITransactionDetails } from "./Transaction";

export interface ICredential extends ISDKCredential, ISerializable {
  id?: string;
  transaction?: ITransactionDetails;
  valid: boolean;
}
