import environment from "@environment/index";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { DataHost } from "@services/DataHost";
import { MaguroService } from "@services/MaguroService";
import { MegalodonService } from "@services/MegalodonService";
import { CatfishService } from "@services/CatfishService";
import { MintingRegistrar } from "@services/MintingRegistrar";
import { MnemonicSave } from "@services/MnemonicSave";
import { ProtocolOptIn } from "@services/ProtocolOptIn";
import { ProtocolService } from "@services/ProtocolService";
import types from "@services/ProtocolService/types";
import { StorageService } from "@services/StorageService";
import { WindowsService } from "@services/WindowsService";
import { UserAlerts } from "@popup/Alerts";
import { MultiContext, AggregateMultiContext } from "@utils/MultiContext";
import { FractalAccountConnector } from "@services/FractalAccount";
import { ValueCache } from "@utils/ReactHooks";

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

let protocol: ProtocolService;
export function getProtocolService(mnemonic?: string) {
  if (protocol === undefined) {
    const signer = mnemonic
      ? ProtocolService.signerFromMnemonic(mnemonic)
      : null;
    protocol = new ProtocolService(
      getApi(),
      signer,
      getMaguroService(),
      getDataHost(),
    );

    getProtocolOptIn()
      .getMnemonic()
      .then(async (mnemonic) => {
        if (mnemonic) {
          getProtocolService().signer =
            ProtocolService.signerFromMnemonic(mnemonic);
        }
      });
  }

  return protocol;
}

let maguro: MaguroService;
export function getMaguroService() {
  if (maguro === undefined) {
    maguro = new MaguroService(
      getStorageService(),
      getFractalAccountConnector(),
      getCatfishService(),
    );
  }
  return maguro;
}

let catfish: CatfishService;
function getCatfishService() {
  if (catfish === undefined) {
    catfish = new CatfishService(getFractalAccountConnector());
  }
  return catfish;
}

let megalodon: MegalodonService;
export function getMegalodonService() {
  if (megalodon === undefined) {
    megalodon = new MegalodonService(
      getFractalAccountConnector(),
      getCatfishService(),
    );
  }
  return megalodon;
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
    protocolOptIn.postOptInCallbacks.push(async (mnemonic) => {
      getProtocolService().signer =
        ProtocolService.signerFromMnemonic(mnemonic);
    });
  }
  return protocolOptIn;
}

let mnemonicSave: MnemonicSave;
export function getMnemonicSave() {
  if (mnemonicSave === undefined) {
    mnemonicSave = new MnemonicSave(getStorageService());
  }
  return mnemonicSave;
}

let userAlerts: UserAlerts;
export function getUserAlerts() {
  if (userAlerts == null) {
    userAlerts = new UserAlerts();
  }
  return userAlerts;
}

let fractalAccountConnector: FractalAccountConnector;
export function getFractalAccountConnector() {
  if (fractalAccountConnector == null) {
    fractalAccountConnector = new FractalAccountConnector(getStorageService());
  }
  return fractalAccountConnector;
}

let multiContext: MultiContext;
export function getMultiContext() {
  if (multiContext == null) {
    multiContext = new AggregateMultiContext([getFractalAccountConnector()]);
  }
  return multiContext;
}

let valueCache: ValueCache;
export function getValueCache() {
  if (valueCache == null) {
    valueCache = new ValueCache(getStorageService());
  }
  return valueCache;
}
