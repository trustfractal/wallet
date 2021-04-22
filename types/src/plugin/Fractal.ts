import { ICredential } from "./Credential";

export interface IFractalInpageProvider {
  init: () => Promise<void>;
  hasCredential(id: string): Promise<any>;
  setupPlugin(): Promise<any>;
  stake(amount: string, token: string, credentialId: string): Promise<any>;
  storeCredential(credential: ICredential): Promise<any>;
  verifyConnection(): Promise<any>;
  withdraw(token: string): Promise<any>;
}
