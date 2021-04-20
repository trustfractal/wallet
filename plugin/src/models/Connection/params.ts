/*
 * Inpage -> Content Script : ExtensionConnection
 * Script -> Inpage :  InpageConnection
 *
 * Script -> Background : Background Connection
 * Background -> Script : ContentScriptConnection
 */

import ConnectionNames from "@models/Connection/names";

import { DuplexConnectionParams } from "@fractalwallet/types";

export const inpage: DuplexConnectionParams = {
  name: ConnectionNames.CONTENT_SCRIPT,
  target: ConnectionNames.INPAGE,
};

export const extension: DuplexConnectionParams = {
  name: ConnectionNames.INPAGE,
  target: ConnectionNames.CONTENT_SCRIPT,
};

export const background: chrome.runtime.ConnectInfo = {
  name: ConnectionNames.BACKGROUND,
};
