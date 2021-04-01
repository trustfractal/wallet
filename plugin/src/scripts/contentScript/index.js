/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import { inpage } from "@models/Connection/params";

import { injectScript } from "./injector";

const sdk = chrome.runtime.getURL("sdk.bundle.js");
injectScript(sdk);

const background = new BackgroundConnection();
const inpageConnection = new InpageConnection(inpage, background);

inpageConnection
  .on("verifyConnection", () => {
    const { version } = chrome.runtime.getManifest();
    return version;
  })
  .proxy("requestCredential");
