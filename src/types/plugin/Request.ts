import { IAttestationRequest as SDKAttestationRequest } from "@trustfractal/sdk";

import { ISerializable } from "./Common";
import { ICredential } from "./Credential";

export interface IRequester extends ISerializable {
  name: string;
  url: string;
  icon: string;
}

export interface IRequest extends ISerializable {
  id: string;
  requester: IRequester;
  request: IVerificationRequest;
  type: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

export interface IVerificationRequest extends ISerializable {
  level: string;
  credential?: ICredential;
}

export interface IAttestationRequest
  extends SDKAttestationRequest,
    ISerializable {}
