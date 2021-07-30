import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { AccountData } from "@polkadot/types/interfaces";

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

  public async registerForMinting(proof: string): Promise<string> {
    console.log("register for minting");

    return (
      await this.api.tx.fractalMinting
        .registerForMinting(null, proof)
        .signAndSend(this.signer)
    ).toHex();
  }

  public async getBalance(accountId: string): Promise<AccountData> {
    return await this.api.query.balances.account(accountId);
  }
}
