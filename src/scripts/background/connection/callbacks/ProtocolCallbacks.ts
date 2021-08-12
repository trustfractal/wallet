import ConnectionTypes from "@models/Connection/types";

import { DataHost } from "@services/DataHost";

export async function addWebpage([url]: [string]): Promise<void> {
  await DataHost.instance().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });
}

const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
};

export default Callbacks;
