import environment from "@environment/index";
import { DataHost } from "@services/DataHost";
import { MintingRegistrar } from "@services/MintingRegistrar";
import { ProtocolService } from "@services/ProtocolService";
import { StorageService } from "@services/StorageService";

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

let protocolFailed = false;
let protocol: Promise<ProtocolService>;
export async function getProtocolService(mnemonic?: string) {
  if (protocol === undefined || protocolFailed) {
    protocolFailed = false;

    protocol = (async () => {
      try {
        return await ProtocolService.fromStorage(getStorageService());
      } catch (e) {
        if (mnemonic != null) {
          await ProtocolService.saveSignerMnemonic(
            getStorageService(),
            mnemonic,
          );
          return await ProtocolService.fromStorage(getStorageService());
        }
        protocolFailed = true;
        throw e;
      }
    })();
  }

  return await protocol;
}
