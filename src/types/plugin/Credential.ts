import { ISerializable } from "./Common";

import { ICredential as ICredentialSDK } from "@trustfractal/sdk";

export interface ICredential extends ISerializable, ICredentialSDK {
  id: string;
  level: string;
  verificationCaseId: string;
  createdAt: number;
}
