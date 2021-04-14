/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import ProxyConnection from "@models/Connection/ProxyConnection";

import { inpage, background } from "@models/Connection/params";
import types from "@models/Connection/types";

import { injectScript } from "./injector";

const sdk = chrome.runtime.getURL("sdk.bundle.js");
injectScript(sdk);

const inpageConnection = new InpageConnection(inpage);
const backgroundConnection = new BackgroundConnection(background);
const proxyConnection = new ProxyConnection(
  inpageConnection,
  backgroundConnection,
);

inpageConnection.on(types.VERIFY_CONNECTION, () => {
  const { version } = chrome.runtime.getManifest();
  return version;
});

proxyConnection
  .proxy(types.CONFIRM_CREDENTIAL)
  .proxy(types.REQUEST_CREDENTIAL)
  .reversedProxy(types.COMMIT_CREDENTIAL);
