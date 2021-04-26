export interface IEthereumProviderService {
  isAvailable(): boolean;
  getAccountAddress(): Promise<string | undefined>;
  credentialStore(
    address: string,
    serializedCredential: string
  ): Promise<string>;
  isCredentialValid(
    address: string,
    serializedCredential: string
  ): Promise<boolean>;
  getStakingDetails(address: string, token: string): Promise<string>;
  generateSignedCredential(
    address: string,
    credentialId: string,
    serializedProperties: string,
    serializedPseudoSchema: string
  ): Promise<string>;
  approveStake(
    address: string,
    amount: string,
    token: string
  ): Promise<string | undefined>;
  getAllowedAmount(address: string, token: string): Promise<string>;
  withdraw(address: string, token: string): Promise<string>;
}
