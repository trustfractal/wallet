import ConnectionTypes from "@models/Connection/types";

import { getMintingRegistrar, getDataHost } from "@services/Factory";
import {
  getProtocolOptIn,
  getWalletGenerated,
} from "@redux/stores/application/reducers/app/selectors";
import AppStore from "@redux/stores/application";

export async function addWebpage([url]: [string]): Promise<void> {
  const optedIn = getProtocolOptIn(AppStore.getStore().getState());
  if (!optedIn) return;

  await getDataHost().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });

  const walletGenerated = getWalletGenerated(AppStore.getStore().getState());
  if (!walletGenerated) return;

  await getMintingRegistrar().maybeTryRegister();
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
