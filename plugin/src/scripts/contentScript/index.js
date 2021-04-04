/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import { inpage } from "@models/Connection/params";
import types from "@models/Connection/types";

import { injectScript } from "./injector";

const sdk = chrome.runtime.getURL("sdk.bundle.js");
injectScript(sdk);

const backgroundConnection = new BackgroundConnection();
const inpageConnection = new InpageConnection(inpage, backgroundConnection);

inpageConnection
  .on(types.VERIFY_CONNECTION, () => {
    const { version } = chrome.runtime.getManifest();
    return version;
  })
  .proxy(types.CONFIRM_CREDENTIAL)
  .proxy(types.REQUEST_CREDENTIAL);

backgroundConnection.on(types.COMMIT_CREDENTIAL, async (credential) => {
  console.log("Commiting the credential", credential);

  // Dummy wait for simulating credential transaction commit
  await new Promise((resolve) => setTimeout(() => resolve(), 3000));

  const transactionHash =
    "0x9ed9d53fddb685493ef99f4ce622f15573966dbb6031ff55a828b76445cdb7ba";

  return transactionHash;
});
