import { ApiPromise, WsProvider } from "@polkadot/api";
import { u64 } from '@polkadot/types';
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { AccountData } from "@polkadot/types/interfaces";
import { DataHost } from "@services/DataHost";
import MaguroService from "@services/MaguroService";
import { Storage } from "@utils/StorageArray";

import Environment from "@environment/index";

import types from "./types";

export * from "./context";

export default class ProtocolService {
  public api: ApiPromise;
  public signer: KeyringPair;

  public static async create(uri: string): Promise<ProtocolService> {
    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromUri(uri);

    return await ProtocolService.withSigner(signer);
  }

  private static async withSigner(signer: KeyringPair) {
    let api;
    try {
      const url = (await MaguroService.getConfig()).blockchain_url;
      const provider = new WsProvider(url);
      api = await ApiPromise.create({ provider, types });
    } catch (e) {
      console.error(e);
      const provider = new WsProvider(Environment.PROTOCOL_RPC_ENDPOINT);
      api = await ApiPromise.create({ provider, types });
    }

    return new ProtocolService(api, signer);
  }

  public constructor(api: ApiPromise, signer: KeyringPair) {
    this.api = api;
    this.signer = signer;
  }

  public async registerForMinting(): Promise<string | undefined> {
    const dataHost = DataHost.instance();
    const extensionProof = await dataHost.extensionProof();
    if (extensionProof == null) return;
    const [length, proof] = extensionProof;

    const hash = await this.submitMintingExtrinsic(proof);
    await dataHost.setLastProofLength(length);
    return hash;
  }

  private async submitMintingExtrinsic(proof: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const txn = this.api.tx.fractalMinting.registerForMinting(null, proof);
      txn.signAndSend(this.signer, (result) => {
        if (result.status.isFinalized)
          return resolve(txn.hash.toHuman() as string);

        if (result.dispatchError) {
          if (result.dispatchError.isModule) {
            const decoded = this.api.registry.findMetaError(
              result.dispatchError.asModule,
            );
            const { name, section } = decoded;
            const error = `ProtocolService.registerForMinting error: ${section}.${name}`;

            console.error(error);

            reject(error);
          }
        }
      });
    });
  }

  public async isRegisteredForMinting(): Promise<boolean> {
    const fractalId = await this.registeredFractalId();
    if (fractalId == null) return false;

    const storageSize =
      await this.api.query.fractalMinting.nextMintingRewards.size(fractalId);
    return storageSize.toNumber() !== 0;
  }

  private async registeredFractalId(): Promise<u64 | null> {
    const keys = await this.api.query.fractalMinting.accountIds.keys(this.address());
    if (keys.length === 0) return null;
    const fractalId = keys[0].args[1];
    return fractalId as u64;
  }

  public async ensureIdentityRegistered(): Promise<void> {
    if (await this.isIdentityRegistered()) return;

    console.log('Identity is not registered, trying to register');
    await MaguroService.registerIdentity(this.address());
    console.log('Identity successfully registered');
  }

  private async isIdentityRegistered(): Promise<boolean> {
    const fractalId = await this.registeredFractalId();
    return fractalId != null;
  }

  public address() {
    return this.signer.address;
  }

  public async getBalance(accountId: string): Promise<AccountData> {
    const { data } = await this.api.query.system.account(accountId);

    return data;
  }

  async saveSigner(storage: Storage) {
    await storage.setItem(
      "protocol/signer",
      JSON.stringify(this.signer.toJson()),
    );
  }

  static async fromStorage(storage: Storage) {
    const maybeSigner = await storage.getItem("protocol/signer");
    if (maybeSigner == null)
      throw new Error("No signer in the provided storage");
    const parsedSigner = JSON.parse(maybeSigner);

    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromJson(parsedSigner);
    signer.unlock();
    return await ProtocolService.withSigner(signer);
  }
}
