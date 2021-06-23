import { ISerializable } from "./Common";

import {
  IAttestedClaim as ISDKAttestedClaim,
  ISelfAttestedClaim as ISDKSelfAttestedClaim,
} from "@trustfractal/sdk";
import { ITransactionDetails } from "./Transaction";

export interface ISelfAttestedClaim
  extends ISerializable,
    ISDKSelfAttestedClaim {
  id: string;
  level: string;
  version: string;
  revoked: boolean;
}

export interface IAttestedClaim extends ISerializable, ISDKAttestedClaim {
  id: string;
  level: string;
  version: string;
  status: string;
  transaction?: ITransactionDetails;
  valid: boolean;
}

export type ICredential = ISelfAttestedClaim | IAttestedClaim;
