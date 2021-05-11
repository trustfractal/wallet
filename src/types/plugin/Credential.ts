import { ISerializable } from "./Common";

import { IAttestedClaim as ISDKAttestedClaim } from "@trustfractal/sdk";
import { ITransactionDetails } from "./Transaction";

export interface ICredential extends ISDKAttestedClaim, ISerializable {
  id: string;
  level: string;
  status: string;
  transaction?: ITransactionDetails;
  valid: boolean;
}
