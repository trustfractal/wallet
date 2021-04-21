/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import ProxyConnection from "@models/Connection/ProxyConnection";

import { inpage, background } from "@models/Connection/params";
import ConnectionTypes from "@models/Connection/types";

import { injectScript } from "./injector";
import ConnectionNames from "@models/Connection/names";

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
  .proxy(ConnectionTypes.CREDENTIAL_STORE_REQUEST)
  .proxy(ConnectionTypes.HAS_CREDENTIAL_REQUEST)
  .proxy(ConnectionTypes.SETUP_PLUGIN_REQUEST)
  .proxy(ConnectionTypes.STAKE_REQUEST)
  .proxy(ConnectionTypes.VERIFY_CONNECTION_REQUEST)
  .proxy(ConnectionTypes.WITHDRAW_REQUEST)

  .reversedProxy(ConnectionTypes.CREDENTIAL_STORE_COMMIT)
  .reversedProxy(ConnectionTypes.GET_ACCOUNT_ADDRESS)
  .reversedProxy(ConnectionTypes.STAKE_COMMIT)
  .reversedProxy(ConnectionTypes.WITHDRAW_COMMIT);
