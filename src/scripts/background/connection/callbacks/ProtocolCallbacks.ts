import ConnectionTypes from "@models/Connection/types";

import { DataHost } from "@services/DataHost";
import storageService from '@services/StorageService';
import {MintingRegistrar} from '@services/MintingRegistrar';

export async function addWebpage([url]: [string]): Promise<void> {
  await DataHost.instance().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });
  await (new MintingRegistrar(storageService, 30)).maybeTryRegister();
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
