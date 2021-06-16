import { ISerializable } from "./Common";

import { IAttestedClaim as ISDKAttestedClaim } from "@trustfractal/sdk";
import { ITransactionDetails } from "./Transaction";

export interface IAbstractCredential extends ISDKAttestedClaim {
  id: string;
  level: string;
  version: string;
}

export interface IStableCredential extends IAbstractCredential, ISerializable {
  revoked: boolean;
}

export interface ILegacyCredential extends IAbstractCredential, ISerializable {
  status: string;
  transaction?: ITransactionDetails;
  valid: boolean;
}

export type ICredential = IStableCredential | ILegacyCredential;
