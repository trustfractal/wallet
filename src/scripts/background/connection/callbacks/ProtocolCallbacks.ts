import ConnectionTypes from "@models/Connection/types";
import { getDataHost, getMintingRegistrar } from "@services/Factory";

export async function addWebpage([url]: [string]): Promise<void> {
  await getDataHost().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });

  await getMintingRegistrar().maybeTryRegister();
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
