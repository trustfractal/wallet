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
} from "@pluginTypes/index";

import ExtensionConnection from "@sdk/InpageProvider/connection";
import TokenTypes from "@models/Token/types";

import AttestationRequest from "@models/AttestationRequest";
import ConnectionStatus from "@models/Connection/ConnectionStatus";
import StakingDetails from "@models/Staking/StakingDetails";
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

  public async credentialStore(
    credentialJSON: ICredential,
    id: string,
    level: string,
  ): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const sdkCredential = new SDKAttestedClaim(credentialJSON);

    const credential = new Credential(sdkCredential, `${id}:${level}`, level);

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

  public isCredentialValid(id: string, level: string): Promise<boolean> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.IS_CREDENTIAL_VALID_BACKGROUND,
      [`${id}:${level}`],
    );
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
