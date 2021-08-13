import ConnectionTypes from "@models/Connection/types";

import { DataHost } from "@services/DataHost";
import storageService from "@services/StorageService";
import { MintingRegistrar } from "@services/MintingRegistrar";
import environment from "@environment/index";

export async function addWebpage([url]: [string]): Promise<void> {
  await DataHost.instance().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });

  const sleep = environment.IS_DEV ? 30 : 30 * 60;
  await new MintingRegistrar(storageService, sleep).maybeTryRegister();
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
