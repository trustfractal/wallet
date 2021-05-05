import { Callback } from "./Common";
import { IStakingDetails } from "./Staking";

export interface IWeb3ProviderService {
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

export interface IRPCProviderService {
  isAvailable(): boolean;
  waitForTransaction(
    transactionHash: string,
    callback: Callback
  ): Promise<void>;
  fetchStakingDetails(
    address: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string
  ): Promise<IStakingDetails>;
  fetchCredentialValidity(
    serializedCredential: string,
    claimsRegistryContractAddress: string
  ): Promise<boolean>;
}
