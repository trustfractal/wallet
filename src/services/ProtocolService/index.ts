import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { AccountData } from "@polkadot/types/interfaces";
import { DataHost } from "@services/DataHost";

import Environment from "@environment/index";

import types from "./types";

export * from "./context";

export default class ProtocolService {
  public api: ApiPromise;
  public signer: KeyringPair;

  public static async create(uri: string): Promise<ProtocolService> {
    const provider = new WsProvider(Environment.PROTOCOL_RPC_ENDPOINT);
    const api = await ApiPromise.create({ provider, types });

    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromUri(uri);

    return new ProtocolService(api, signer);
  }

  public constructor(api: ApiPromise, signer: KeyringPair) {
    this.api = api;
    this.signer = signer;
  }

  public async registerForMinting(): Promise<void> {
    const dataHost = DataHost.instance();
    const extensionProof = await dataHost.extensionProof();
    if (extensionProof == null) return;
    const [length, proof] = extensionProof;

    await this.submitMintingExtrinsic(proof);
    await dataHost.setLastProofLength(length);
  }

  private async submitMintingExtrinsic(proof: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.tx.fractalMinting
        .registerForMinting(null, proof)
        .signAndSend(this.signer, ({ status, dispatchError }) => {
          if (status.isFinalized) return resolve();

          if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = this.api.registry.findMetaError(
                dispatchError.asModule,
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

  public async getBalance(accountId: string): Promise<AccountData> {
    return await this.api.query.balances.account(accountId);
  }
}
