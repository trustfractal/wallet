export interface IFractalSDK {
  init: () => Promise<void>;
  confirmCredential(...args: any[]): Promise<any>;
  verifyConnection(): Promise<any>;
}
