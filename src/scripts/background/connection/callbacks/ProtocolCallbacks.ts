import ConnectionTypes from "@models/Connection/types";
import { IFact } from "@pluginTypes/plugin";
import {
  getProtocolOptIn,
  getDataHost,
  getMintingRegistrar,
} from "@services/Factory";

const FACT_ACCESS_WHITELIST: string[] = ["explorer.fractalprotocol.com"];

async function addWebpage([url]: [string]): Promise<void> {
  await getProtocolOptIn().checkOptIn();
  await getDataHost().storeFact({
    pageView: {
      url,
      timestampMs: new Date().getTime(),
    },
  });

  await getMintingRegistrar().maybeTryRegister();
}

async function requireWhitelisted(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabArray) {
        if (tabArray.length === 0) {
          reject("No active tabs.");
        }

        let currentUrl = new URL(tabArray[0].url as string);
        if (FACT_ACCESS_WHITELIST.includes(currentUrl.host)) {
          resolve();
        } else {
          reject("Access denied.");
        }
      },
    );
  });
}

async function getTotalFactsCount(): Promise<number> {
  await requireWhitelisted();
  return getDataHost().length();
}

async function getFact(index: number): Promise<IFact> {
  await requireWhitelisted();
  return getDataHost().array().get(index);
}
const Callbacks = {
  [ConnectionTypes.WEBPAGE_VIEW]: {
    callback: addWebpage,
  },
  [ConnectionTypes.GET_TOTAL_FACTS_COUNT]: {
    callback: getTotalFactsCount,
  },
  [ConnectionTypes.GET_FACT]: {
    callback: getFact,
  },
};

export default Callbacks;
