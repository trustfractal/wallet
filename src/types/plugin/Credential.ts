import { ISerializable } from "./Common";

import { IAttestedClaim as ISDKAttestedClaim } from "@trustfractal/sdk";

export interface ICredential extends ISDKAttestedClaim, ISerializable {
  id: string;
  level: string;
  revoked: boolean;
}
