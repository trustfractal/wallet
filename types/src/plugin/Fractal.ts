import { ICredential } from "./Credential";

export interface IFractalInpageProvider {
  init: () => Promise<void>;
  hasCredential(id: string): Promise<any>;
  setupPlugin(): Promise<any>;
  stake(amount: number): Promise<any>;
  storeCredential(credential: ICredential): Promise<any>;
  verifyConnection(): Promise<any>;
  withdraw(): Promise<any>;
}
