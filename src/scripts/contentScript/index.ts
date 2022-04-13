/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import ProxyConnection from "@models/Connection/ProxyConnection";

import { inpage, background } from "@models/Connection/params";
import ConnectionTypes from "@models/Connection/types";

import { injectScript } from "./injector";
import ConnectionNames from "@models/Connection/names";
import { getMultiContext } from "@services/Factory";

const sdk = chrome.runtime.getURL("sdk.bundle.js");
injectScript(sdk);

const inpageConnection = new InpageConnection(inpage);
const backgroundConnection = new BackgroundConnection(background);
const proxyConnection = new ProxyConnection(
  inpageConnection,
  ConnectionNames.INPAGE,
  backgroundConnection,
  ConnectionNames.BACKGROUND,
);

proxyConnection
  .proxy(ConnectionTypes.GET_VERIFICATION_REQUEST_BACKGROUND)
  .proxy(ConnectionTypes.SETUP_PLUGIN_BACKGROUND)
  .proxy(ConnectionTypes.VERIFY_CONNECTION_BACKGROUND)
  .proxy(ConnectionTypes.GET_TOTAL_FACTS_COUNT)
  .proxy(ConnectionTypes.GET_FACT)
  .reversedProxy(ConnectionTypes.GET_BACKEND_SESSIONS_INPAGE);

backgroundConnection.invoke(ConnectionTypes.WEBPAGE_VIEW, [
  window.location.toString(),
]);

getMultiContext().inInjectedScript();
