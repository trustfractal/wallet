import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { Hash } from "@polkadot/types/interfaces";

import Environment from "@environment/index";

import types from "./types";

export default class ProtocolService {
  public api: ApiPromise;
  public signer: KeyringPair;

  public static async create(signingKey: string): Promise<ProtocolService> {
    const provider = new WsProvider(Environment.PROTOCOL_RPC_ENDPOINT);
    const api = await ApiPromise.create({ provider, types });

    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromUri(signingKey);

    return new ProtocolService(api, signer);
  }

  public constructor(api: ApiPromise, signer: KeyringPair) {
    this.api = api;
    this.signer = signer;
  }

  public async registerForMinting(
    accountId: string,
    proof: string,
  ): Promise<Hash> {
    return await this.api.tx.fractalMinting
      .registerForMinting(accountId, proof)
      .signAndSend(this.signer);
  }
}
