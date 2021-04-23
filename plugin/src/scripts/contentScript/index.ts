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
  .proxy(ConnectionTypes.CREDENTIAL_STORE_BACKGROUND)
  .proxy(ConnectionTypes.HAS_CREDENTIAL_BACKGROUND)
  .proxy(ConnectionTypes.IS_CREDENTIAL_VALID_BACKGROUND)
  .proxy(ConnectionTypes.SETUP_PLUGIN_BACKGROUND)
  .proxy(ConnectionTypes.STAKE_BACKGROUND)
  .proxy(ConnectionTypes.VERIFY_CONNECTION_BACKGROUND)
  .proxy(ConnectionTypes.WITHDRAW_BACKGROUND)

  .reversedProxy(ConnectionTypes.CREDENTIAL_STORE_INPAGE)
  .reversedProxy(ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE)
  .reversedProxy(ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE)
  .reversedProxy(ConnectionTypes.STAKE_INPAGE)
  .reversedProxy(ConnectionTypes.WITHDRAW_INPAGE);
