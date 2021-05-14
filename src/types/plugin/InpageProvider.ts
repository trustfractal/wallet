import {
  IClaimProperties,
  IAttestationRequest,
  IAttestedClaim,
} from "@trustfractal/sdk";

import { IConnectionStatus } from "./Connection";
import { IStakingDetails } from "./Staking";
import { ITransactionDetails } from "./Transaction";
import { IVerificationRequest } from "./Request";
import { SignedNounce } from "./Common";

export interface IFractalInpageProvider {
  init: () => Promise<void>;
  approveStake(
    amount: string,
    token: string,
  ): Promise<ITransactionDetails | undefined>;
  stake(
    amount: string,
    token: string,
    id: string,
    level: string,
  ): Promise<ITransactionDetails>;
  withdraw(token: string): Promise<ITransactionDetails>;
  resetStaking(token: string): Promise<void>;
  getAttestationRequest(
    level: string,
    properties: IClaimProperties,
  ): Promise<IAttestationRequest>;
  credentialStore(
    credential: IAttestedClaim,
    id: string,
    level: string,
  ): Promise<ITransactionDetails>;
  hasCredential(id: string, level: string): Promise<boolean>;
  isCredentialValid(id: string, level: string): Promise<boolean>;
  getSignedNounce(nounce?: string): Promise<SignedNounce>;
  getVerificationRequest(
    level: string,
    requester: { name: string; url: string; icon: string },
  ): Promise<IVerificationRequest>;
  getStakingDetails(token: string): Promise<IStakingDetails>;
  setupPlugin(): Promise<IConnectionStatus>;
  verifyConnection(): Promise<IConnectionStatus>;
}
