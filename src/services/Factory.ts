import environment from "@environment/index";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { DataHost } from "@services/DataHost";
import { MaguroService } from "@services/MaguroService";
import { MintingRegistrar } from "@services/MintingRegistrar";
import { ProtocolOptIn } from "@services/ProtocolOptIn";
import { ProtocolService } from "@services/ProtocolService";
import types from "@services/ProtocolService/types";
import { StorageService } from "@services/StorageService";
import { WindowsService } from "@services/WindowsService";

let storageService: StorageService;
export function getStorageService() {
  if (storageService === undefined) {
    storageService = new StorageService();
  }
  return storageService;
}

let mintingRegistrar: MintingRegistrar;
export function getMintingRegistrar() {
  if (mintingRegistrar === undefined) {
    const sleep = environment.IS_DEV ? 5 : 30 * 60;
    mintingRegistrar = new MintingRegistrar(storageService, sleep);
  }
  return mintingRegistrar;
}

let dataHost: DataHost;
export function getDataHost() {
  if (dataHost === undefined) {
    dataHost = new DataHost(storageService, storageService);
  }
  return dataHost;
}

async function getApi() {
  try {
    const url = (await getMaguroService().getConfig()).blockchain_url;
    const provider = new WsProvider(url);
    return await ApiPromise.create({ provider, types });
  } catch (e) {
    console.error(e);
    const provider = new WsProvider(environment.PROTOCOL_RPC_ENDPOINT);
    return await ApiPromise.create({ provider, types });
  }
}

let protocolFailed = false;
let protocol: Promise<ProtocolService>;
export async function getProtocolService(mnemonic?: string) {
  if (protocol === undefined || protocolFailed) {
    protocolFailed = false;

    protocol = (async () => {
      let signer;
      if (mnemonic == null) {
        try {
          signer = await ProtocolService.signerFromStorage(getStorageService());
        } catch (e) {
          protocolFailed = true;
          signer = null;
        }
      } else {
        signer = ProtocolService.signerFromMnemonic(mnemonic);
      }
      return new ProtocolService(
        getApi(),
        signer,
        getMaguroService(),
        getDataHost(),
      );
    })();
  }

  return await protocol;
}

let maguro: MaguroService;
export function getMaguroService() {
  if (maguro === undefined) {
    maguro = new MaguroService();
  }
  return maguro;
}

let windows: WindowsService;
export function getWindowsService() {
  if (windows === undefined) {
    windows = new WindowsService();
  }
  return windows;
}

let protocolOptIn: ProtocolOptIn;
export function getProtocolOptIn() {
  if (protocolOptIn === undefined) {
    protocolOptIn = new ProtocolOptIn(
      getStorageService(),
      getMaguroService(),
      getProtocolService(),
      getWindowsService(),
      environment.PROTOCOL_JOURNEY_URL,
    );

    protocolOptIn.postOptInCallbacks.push(async () => {
      await getDataHost().enable();
    });
  }
  return protocolOptIn;
}
