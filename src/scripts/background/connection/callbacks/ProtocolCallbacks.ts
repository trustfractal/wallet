import ConnectionTypes from "@models/Connection/types";

import { DataHost } from "@services/DataHost";
import storageService from "@services/StorageService";
import { MintingRegistrar } from "@services/MintingRegistrar";
import environment from "@environment/index";
import {
  getProtocolOptIn,
  getWalletGenerated,
} from "@redux/stores/application/reducers/app/selectors";
import AppStore from "@redux/stores/application";

export async function addWebpage([url]: [string]): Promise<void> {
  const optedIn = getProtocolOptIn(AppStore.getStore().getState());
  if (!optedIn) return;

  await DataHost.instance().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });

  const walletGenerated = getWalletGenerated(AppStore.getStore().getState());
  if (!walletGenerated) return;

  const sleep = environment.IS_DEV ? 5 : 30 * 60;
  await new MintingRegistrar(storageService, sleep).maybeTryRegister();
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
