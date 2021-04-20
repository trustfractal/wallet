export interface IFractalSDK {
    init: () => Promise<void>;
    hasCredential(id: string): Promise<any>;
    verifyConnection(): Promise<any>;
}
