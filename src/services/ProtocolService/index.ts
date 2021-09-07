import { ApiPromise, WsProvider } from "@polkadot/api";
import { u64 } from "@polkadot/types";
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

  public async disconnect() {
    await this.api.disconnect();
  }

  public constructor(api: ApiPromise, signer: KeyringPair) {
    this.api = api;
    this.signer = signer;
  }

  public async registerForMinting(): Promise<string | undefined> {
    const latestProof = await this.latestExtensionProof();
    console.log(`Latest proof from chain ${latestProof}`);

    const dataHost = DataHost.instance();
    const extensionProof = await dataHost.extensionProof(latestProof);
    if (extensionProof == null) return;

    return await this.submitMintingExtrinsic(extensionProof);
  }

  private async latestExtensionProof(): Promise<string | null> {
    const fractalId = await this.registeredFractalId();
    if (fractalId == null) return null;

    // Blue-green strategy handling migration of blockchain storage.
    try {
      // Will be long-term code.
      const dataset = await this.api.query.fractalMinting.idDatasets(
        this.address(),
        fractalId,
      );
      return dataset.toHuman() as string | null;
    } catch (e) {
      // TODO(shelbyd): Delete this after rollout of storage change.
      const dataset = await this.api.query.fractalMinting.idDatasets(fractalId);
      return dataset.toHuman() as string | null;
    }
  }

  private async submitMintingExtrinsic(proof: string): Promise<string> {
    console.log(`Submitting proof ${proof}`);
    const txn = this.api.tx.fractalMinting.registerForMinting(null, proof);

    return new Promise(async (resolve, reject) => {
      const unsub = await txn.signAndSend(
        this.signer,
        ({ events = [], status }) => {
          console.log(`Extrinsic status: ${status}`);
          if (!status.isFinalized) return;

          events.forEach(({ event: { data, method, section } }) => {
            if (section !== "system") return;

            if (method === "ExtrinsicSuccess") {
              resolve(status.asFinalized.toHuman() as string);
            }
            if (method === "ExtrinsicFailed") {
              reject(data);
            }
          });

          unsub();
        },
      );
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
    const keys = await this.api.query.fractalMinting.accountIds.keys(
      this.address(),
    );
    if (keys.length !== 1) return null;
    const fractalId = keys[0].args[1];
    return fractalId as u64;
  }

  public async ensureIdentityRegistered(): Promise<void> {
    if (await this.isIdentityRegistered()) return;

    console.log("Identity is not registered, trying to register");
    await MaguroService.registerIdentity(this.address());
    console.log("Identity successfully registered");
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
