import { BigNumber } from "ethers";

import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "@sdk/InpageProvider/Errors";

import {
  IFractalInpageProvider,
  ICredential,
  IStakingDetails,
  ITransactionDetails,
  IConnectionStatus,
} from "@fractalwallet/types";
import { IClaimProperties } from "@fractalwallet/sdk/src/types";

import ExtensionConnection from "@sdk/InpageProvider/connection";
import TokenTypes from "@models/Token/types";

import AttestationRequest from "@models/AttestationRequest";
import StakingDetails from "@models/Staking/StakingDetails";
import ConnectionStatus from "@models/Connection/ConnectionStatus";
import TransactionDetails from "@models/Transaction/TransactionDetails";

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

  public async getTransactionEstimationTime(
    gasPrice: BigNumber,
  ): Promise<BigNumber | undefined> {
    this.ensureFractalIsInitialized();

    const serializedEstimatedTime = await ExtensionConnection.invoke(
      ConnectionTypes.GET_TRANSACTION_ESTIMATION_TIME_BACKGROUND,
      [gasPrice.toJSON()],
    );

    if (serializedEstimatedTime) return BigNumber.from(serializedEstimatedTime);
  }

  public async approveStake(
    amount: string,
    token: TokenTypes,
  ): Promise<ITransactionDetails | undefined> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.APPROVE_STAKE_BACKGROUND,
      [amount, token],
    );

    if (serializedTransactionDetails)
      return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async stake(
    amount: string,
    token: TokenTypes,
    credentialId: string,
  ): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.STAKE_BACKGROUND,
      [amount, token, credentialId],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async getAllowedAmount(token: string): Promise<BigNumber> {
    this.ensureFractalIsInitialized();

    const serializedAllowedAmount = await ExtensionConnection.invoke(
      ConnectionTypes.GET_ALLOWED_AMOUNT_BACKGROUND,
      [token],
    );

    return BigNumber.from(serializedAllowedAmount);
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

  public async storeCredential(
    credential: ICredential,
  ): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.CREDENTIAL_STORE_BACKGROUND,
      [credential.serialize()],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public hasCredential(id: string): Promise<boolean> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.HAS_CREDENTIAL_BACKGROUND,
      [id],
    );
  }

  public isCredentialValid(id: string): Promise<boolean> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.IS_CREDENTIAL_VALID_BACKGROUND,
      [id],
    );
  }

  public async getStakingDetails(token: string): Promise<IStakingDetails> {
    this.ensureFractalIsInitialized();

    const detailsString = await ExtensionConnection.invoke(
      ConnectionTypes.GET_STAKING_DETAILS_BACKGROUND,
      [token],
    );

    return StakingDetails.parse(detailsString);
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
