/* global chrome */

import InpageConnection from "@models/Connection/InpageConnection";
import BackgroundConnection from "@models/Connection/BackgroundConnection";
import { inpage_attester, inpage_publisher } from "@models/Connection/params";

import { injectScript } from "./injector";

const sdk = chrome.runtime.getURL("sdk.bundle.js");
injectScript(sdk);

const background = new BackgroundConnection();
const inpageAttester = new InpageConnection(inpage_attester, background);
const inpagePublisher = new InpageConnection(inpage_publisher, background);

inpageAttester
  .on("verifyConnection", () => {
    const { version } = chrome.runtime.getManifest();
    return version;
  })
  .proxy("broadcastCredential")
  .proxy("getProperties")
  .proxy("getPublicIdentity")
  .proxy("requestAttestation");

inpagePublisher
  .on("verifyConnection", () => {
    const { version } = chrome.runtime.getManifest();
    return version;
  })
  .proxy("getPublicIdentity")
  .proxy("getCredential");
