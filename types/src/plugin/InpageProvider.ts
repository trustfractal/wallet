import { BigNumber } from "@ethersproject/bignumber";
import {
  IClaimProperties,
  IClaimPseudoSchema,
} from "@fractalwallet/sdk/src/types";

import { IConnectionStatus } from "./Connection";
import { ICredential } from "./Credential";
import { IStakingDetails } from "./Staking";
import { ITransactionDetails } from "./Transaction";

export interface IFractalInpageProvider {
  init: () => Promise<void>;
  approveStake(
    amount: string,
    token: string
  ): Promise<ITransactionDetails | undefined>;
  stake(
    amount: string,
    token: string,
    credentialId: string
  ): Promise<ITransactionDetails>;
  withdraw(token: string): Promise<ITransactionDetails>;
  getAllowedAmount(token: string): Promise<BigNumber>;
  getAttestationRequest(credentialId: string): Promise<ICredential>;
  getTransactionEstimationTime(
    gasPrice: BigNumber
  ): Promise<BigNumber | undefined>;
  storeCredential(credential: ICredential): Promise<ITransactionDetails>;
  hasCredential(id: string): Promise<boolean>;
  isCredentialValid(id: string): Promise<boolean>;
  getStakingDetails(token: string): Promise<IStakingDetails>;
  setupPlugin(): Promise<IConnectionStatus>;
  verifyConnection(): Promise<IConnectionStatus>;
}
