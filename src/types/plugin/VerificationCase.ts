import { ISerializable } from "./Common";

export interface IVerificationCase extends ISerializable {
  id: string;
  clientId: string;
  level: string;
  status: string;
}
