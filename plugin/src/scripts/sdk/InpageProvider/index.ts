import {
  Wallet,
  Contract,
  utils as ethersUtils,
  providers as ethersProviders,
} from "ethers";
import Credential from "@models/Credential";
import { AttestationRequest, Claim, ClaimType } from "@fractalwallet/sdk";

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

import ExtensionConnection from "@sdk/InpageProvider/connection";
import TokenTypes from "@models/Token/types";

import ContractsAddresses from "@contracts/addresses.json";
import ClaimsRegistry from "@contracts/ClaimsRegistry.json";
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

  public async withdraw(token: TokenTypes): Promise<ITransactionDetails> {
    this.ensureFractalIsInitialized();

    const serializedTransactionDetails = await ExtensionConnection.invoke(
      ConnectionTypes.WITHDRAW_BACKGROUND,
      [token],
    );

    return TransactionDetails.parse(serializedTransactionDetails);
  }

  public async getSignedCredential(): Promise<ICredential> {
    // create the necessary ethereum accounts
    const claimerWallet = Wallet.fromMnemonic(
      "planet universe gather keen dream kind pony lonely question nut essay verb",
    );
    const attesterWallet = Wallet.fromMnemonic(
      "pizza job meadow mammal cake initial gain gym family banana steel favorite",
      "m/44'/60'/0'/0/1",
    );

    // init claims registry smart contract
    const claimsRegistryContract = new Contract(
      ContractsAddresses.CLAIMS_REGISTRY,
      ClaimsRegistry.abi,
      new ethersProviders.Web3Provider(window.ethereum!),
    );

    // Generate a claim type
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(
      pseudoSchema,
      claimerWallet.publicKey,
    );

    // Create a claim with our data
    const properties = { name: "Foo", age: 20 };
    const claim = new Claim(claimType, properties, claimerWallet.address);

    // Generate an AttestationRequest
    const request = AttestationRequest.fromClaim(claim);

    const claimerSignature = await claimerWallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    // As an attester generate a credential
    const credential = new Credential(Credential.fromRequest(request), "12");
    credential.attesterAddress = attesterWallet.address;

    // sign the signable hash with attester's wallet
    const signableHash = await claimsRegistryContract.computeSignableKey(
      credential.claimerAddress,
      ethersUtils.arrayify(credential.rootHash),
    );

    const attesterSignature = await attesterWallet.signMessage(
      ethersUtils.arrayify(signableHash),
    );
    credential.attesterSignature = attesterSignature;

    return credential;
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
