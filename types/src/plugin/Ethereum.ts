export interface IEthereumProviderService {
  isAvailable(): boolean;
  getAccountAddress(): Promise<string | undefined>;
  credentialStore(
    address: string,
    serializedCredential: string,
    claimsRegistryContractAddress: string
  ): Promise<string>;
  isCredentialValid(
    address: string,
    serializedCredential: string,
    claimsRegistryContractAddress: string
  ): Promise<boolean>;
  getAttestationRequest(
    address: string,
    level: string,
    serializedProperties: string
  ): Promise<string>;
  getStakingDetails(
    address: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string
  ): Promise<string>;
  approveStake(
    address: string,
    amount: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string
  ): Promise<string | undefined>;
  getAllowedAmount(
    address: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string
  ): Promise<string>;
  stake(
    address: string,
    amount: string,
    serializedCredential: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string
  ): Promise<string>;
  withdraw(
    address: string,
    stakingTokenContractAddress: string
  ): Promise<string>;
}
