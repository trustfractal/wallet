import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { u64 } from "@polkadot/types";

import type { KeyringPair } from "@polkadot/keyring/types";
import type { AccountData } from "@polkadot/types/interfaces";
import { MaguroService } from "@services/MaguroService";
import { DataHost } from "@services/DataHost";
import { Storage } from "@utils/StorageArray";

export * from "./context";

export class ProtocolService {
  constructor(
    private readonly api: Promise<ApiPromise>,
    public signer: KeyringPair | null,
    private readonly maguro: MaguroService,
    private readonly dataHost: DataHost,
  ) {}

  public async registerForMinting(): Promise<string | undefined> {
    const latestProof = await this.latestExtensionProof();
    console.log(`Latest proof from chain ${latestProof}`);

    const extensionProof = await this.dataHost.extensionProof(latestProof);
    if (extensionProof == null) return;

    return await this.submitMintingExtrinsic(extensionProof);
  }

  private async latestExtensionProof(): Promise<string | null> {
    const fractalId = await this.registeredFractalId();
    if (fractalId == null) return null;

    // Blue-green strategy handling migration of blockchain storage.
    try {
      // Will be long-term code.
      const dataset = await (
        await this.api
      ).query.fractalMinting.accountIdDatasets(this.address(), fractalId);
      return dataset.toHuman() as string | null;
    } catch (e) {
      // TODO(shelbyd): Delete this after rollout of storage change.
      const dataset = await (
        await this.api
      ).query.fractalMinting.idDatasets(fractalId);
      return dataset.toHuman() as string | null;
    }
  }

  private async submitMintingExtrinsic(proof: string): Promise<string> {
    console.log(`Submitting proof ${proof}`);
    const txn = (await this.api).tx.fractalMinting.registerForMinting(
      null,
      proof,
    );

    return new Promise(async (resolve, reject) => {
      const unsub = await txn.signAndSend(
        this.requireSigner(),
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

  private requireSigner(): KeyringPair {
    if (this.signer == null) {
      throw new Error("Method requires signer to be defined");
    } else {
      return this.signer;
    }
  }

  public async isRegisteredForMinting(): Promise<boolean> {
    const fractalId = await this.registeredFractalId();
    if (fractalId == null) return false;

    const storageSize = await (
      await this.api
    ).query.fractalMinting.nextMintingRewards.size(fractalId);
    return storageSize.toNumber() !== 0;
  }

  private async registeredFractalId(): Promise<u64 | null> {
    const keys = await (
      await this.api
    ).query.fractalMinting.accountIds.keys(this.address());
    if (keys.length !== 1) return null;
    const fractalId = keys[0].args[1];
    return fractalId as u64;
  }

  public async ensureIdentityRegistered(): Promise<void> {
    if (await this.isIdentityRegistered()) return;

    console.log("Identity is not registered, trying to register");
    await this.maguro.registerIdentity(this.address());
    console.log("Identity successfully registered");
  }

  public async isIdentityRegistered(): Promise<boolean> {
    const fractalId = await this.registeredFractalId();
    return fractalId != null;
  }

  public address() {
    return this.requireSigner().address;
  }

  public async getBalance(accountId: string): Promise<AccountData> {
    const { data } = await (await this.api).query.system.account(accountId);

    return data;
  }

  public addressForMnemonic(mnemonic: string): string {
    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromUri(mnemonic);
    return signer.address;
  }

  async saveSigner(storage: Storage) {
    await storage.setItem(
      "protocol/signer",
      JSON.stringify(this.requireSigner().toJson()),
    );
  }

  static signerFromMnemonic(mnemonic: string) {
    const keyring = new Keyring({ type: "sr25519" });
    return keyring.addFromUri(mnemonic);
  }

  static async saveSignerMnemonic(storage: Storage, mnemonic: string) {
    await storage.setItem(
      "protocol/signer",
      JSON.stringify(ProtocolService.signerFromMnemonic(mnemonic).toJson()),
    );
  }

  static async signerFromStorage(storage: Storage) {
    const maybeSigner = await storage.getItem("protocol/signer");
    if (maybeSigner == null)
      throw new Error("No signer in the provided storage");
    const parsedSigner = JSON.parse(maybeSigner);

    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromJson(parsedSigner);
    signer.unlock();
    return signer;
  }
}
