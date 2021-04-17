/*
 * Inpage -> Content Script : ExtensionConnection
 * Script -> Inpage :  InpageConnection
 *
 * Script -> Background : Background Connection
 * Background -> Script : ContentScriptConnection
 */

import ConnectionNames from "@models/Connection/names";

import { ConnectionParams } from "@fractalwallet/types";

export const inpage: ConnectionParams = {
  name: ConnectionNames.CONTENT_SCRIPT,
  target: ConnectionNames.INPAGE,
};

export const extension: ConnectionParams = {
  name: ConnectionNames.INPAGE,
  target: ConnectionNames.CONTENT_SCRIPT,
};

export const background: ConnectionParams = {
  name: ConnectionNames.BACKGROUND,
};
