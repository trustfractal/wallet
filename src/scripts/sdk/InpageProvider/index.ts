import { BigNumber } from "ethers";

import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService/Web3ProviderService";
import Credential from "@models/Credential";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "@sdk/InpageProvider/Errors";

import {
  IClaimProperties,
  AttestedClaim as SDKAttestedClaim,
} from "@trustfractal/sdk";

import {
  IFractalInpageProvider,
  ICredential,
  IStakingDetails,
  ITransactionDetails,
  IConnectionStatus,
  IVerificationRequest,
  SignedNonce,
} from "@pluginTypes/index";

import ExtensionConnection from "@sdk/InpageProvider/connection";

import TokenTypes from "@models/Token/types";
import Requester from "@models/Request/Requester";
import AttestationRequest from "@models/AttestationRequest";
import ConnectionStatus from "@models/Connection/ConnectionStatus";
import StakingDetails from "@models/Staking/StakingDetails";
import TransactionDetails from "@models/Transaction/TransactionDetails";
import VerificationRequest from "@models/VerificationRequest";
import CredentialStatus from "@models/Credential/status";

import { getRandomBytes } from "@utils/CryptoUtils";

export default class InpageProvider implements IFractalInpageProvider {
  private initialized: boolean = false;

  public async init(): Promise<void> {
    // init application connection
    ExtensionConnection.init();

    // init ethereum provider service
    try {
      await EthereumProviderService.init();
    } catch (error) {
      console.error(error);
    }

    this.initialized = true;
  }

  private ensureFractalIsInitialized() {
    if (!this.initialized) {
      throw ERROR_FRACTAL_NOT_INITIALIZED();
    }
  }

  public async resetStaking(token: TokenTypes): Promise<void> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.RESET_STAKING_BACKGROUND,
      [token],
    );
  }

  public async approveStake(
    amount: string | BigNumber,
    token: TokenTypes,
  ): Promise<ITransactionDetails | undefined> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.APPROVE_STAKE_BACKGROUND,
      [BigNumber.from(amount).toJSON(), token],
    );

    if (serializedTransactionDetails)
      return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async getVerificationRequest(
    level: string,
    requester: { name: string; url: string; icon: string },
    fields: Record<string, boolean> = {},
  ): Promise<IVerificationRequest> {
    this.ensureFractalIsInitialized();

    const parsedRequester = new Requester(
      requester.name,
      requester.url,
      requester.icon,
    );

    const serializedRequest = await ExtensionConnection.invoke(
      ConnectionTypes.GET_VERIFICATION_REQUEST_BACKGROUND,
      [level, parsedRequester.serialize(), fields],
    );

    // parse request
    const request: VerificationRequest = VerificationRequest.parse(
      serializedRequest,
    );

    return request;
  }

  public async stake(
    amount: string | BigNumber,
    token: TokenTypes,
    id: string,
    level: string,
  ): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.STAKE_BACKGROUND,
      [BigNumber.from(amount).toJSON(), token, `${id}:${level}`],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async withdraw(token: TokenTypes): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.WITHDRAW_BACKGROUND,
      [token],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async getAttestationRequest(
    level: string,
    properties: IClaimProperties,
  ): Promise<AttestationRequest> {
    this.ensureFractalIsInitialized();

    // call the signer
    const serializedRequest = await ExtensionConnection.invoke(
      ConnectionTypes.GET_ATTESTATION_REQUEST_BACKGROUND,
      [level, JSON.stringify(properties)],
    );

    // parse request
    const request: AttestationRequest = AttestationRequest.parse(
      serializedRequest,
    );

    return request;
  }

  public getSignedNonce(nonce: string): Promise<SignedNonce> {
    this.ensureFractalIsInitialized();

    // call the signer
    return ExtensionConnection.invoke(
      ConnectionTypes.GET_SIGNED_NONCE_BACKGROUND,
      [nonce || getRandomBytes(64)],
    );
  }

  public async credentialStore(
    credentialJSON: ICredential,
    id: string,
    level: string,
  ): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const sdkCredential = new SDKAttestedClaim(credentialJSON);

    const credential = new Credential(
      sdkCredential,
      `${id}:${level}`,
      level,
      CredentialStatus.PENDING,
    );

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.CREDENTIAL_STORE_BACKGROUND,
      [credential.serialize()],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public hasCredential(id: string, level: string): Promise<boolean> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.HAS_CREDENTIAL_BACKGROUND,
      [`${id}:${level}`],
    );
  }

  public async isCredentialValid(id: string, level: string): Promise<boolean> {
    this.ensureFractalIsInitialized();

    const status = await ExtensionConnection.invoke(
      ConnectionTypes.GET_CREDENTIAL_STATUS_BACKGROUND,
      [`${id}:${level}`],
    );

    return status === CredentialStatus.VALID;
  }

  public async getStakingDetails(token: string): Promise<IStakingDetails> {
    this.ensureFractalIsInitialized();

    const serializedStakingDetails = await ExtensionConnection.invoke(
      ConnectionTypes.GET_STAKING_DETAILS_BACKGROUND,
      [token],
    );

    return StakingDetails.parse(serializedStakingDetails);
  }

  public async setupPlugin(): Promise<IConnectionStatus> {
    this.ensureFractalIsInitialized();

    const connectionStatus = await ExtensionConnection.invoke(
      ConnectionTypes.SETUP_PLUGIN_BACKGROUND,
    );

    return ConnectionStatus.parse(connectionStatus);
  }

  public async verifyConnection(): Promise<IConnectionStatus> {
    this.ensureFractalIsInitialized();

    const connectionStatus = await ExtensionConnection.invoke(
      ConnectionTypes.VERIFY_CONNECTION_BACKGROUND,
    );

    return ConnectionStatus.parse(connectionStatus);
  }
}
