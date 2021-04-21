import { Wallet, utils as ethersUtils } from "ethers";

import Credential from "@models/Credential";
import { AttestationRequest, Claim, ClaimType } from "@fractalwallet/sdk";

import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";
import { ERROR_FRACTAL_NOT_INITIALIZED } from "@sdk/InpageProvider/Errors";

import { IFractalInpageProvider, ICredential } from "@fractalwallet/types";

import ExtensionConnection from "@sdk/InpageProvider/connection";

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

  public stake(amount: number): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.STAKE_REQUEST, [amount]);
  }

  public withdraw(): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.WITHDRAW_REQUEST);
  }

  public hash(types: ReadonlyArray<string>, values: ReadonlyArray<any>) {
    return ethersUtils.solidityKeccak256(types, values);
  }

  public async getSignedCredential() {
    // create the necessary ethereum accounts
    const claimerWallet = Wallet.fromMnemonic(
      "pizza job meadow mammal cake initial gain gym family banana steel favorite",
    );
    const attesterWallet = Wallet.fromMnemonic(
      "planet universe gather keen dream kind pony lonely question nut essay verb",
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
    const credential = new Credential(Credential.fromRequest(request));
    const attesterSignature = await attesterWallet.signMessage(
      credential.rootHash,
    );

    credential.id = "12";
    credential.attesterAddress = attesterWallet.address;
    credential.attesterSignature = attesterSignature;

    return credential;
  }

  public storeCredential(credential: ICredential): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.CREDENTIAL_STORE_REQUEST,
      [credential.serialize()],
    );
  }

  public hasCredential(id: string): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.HAS_CREDENTIAL_REQUEST, [
      id,
    ]);
  }

  public setupPlugin(): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(ConnectionTypes.SETUP_PLUGIN_REQUEST);
  }

  public verifyConnection(): Promise<any> {
    this.ensureFractalIsInitialized();

    return ExtensionConnection.invoke(
      ConnectionTypes.VERIFY_CONNECTION_REQUEST,
    );
  }
}
