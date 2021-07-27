/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import ProxyConnection from "@models/Connection/ProxyConnection";

import { inpage, background } from "@models/Connection/params";
import ConnectionTypes from "@models/Connection/types";

import { injectScript } from "./injector";
import ConnectionNames from "@models/Connection/names";

import environment from "@environment/index";

// remove logs on prod
if (!environment.IS_DEV) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

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
  .reversedProxy(ConnectionTypes.GET_BACKEND_SESSIONS_INPAGE);
