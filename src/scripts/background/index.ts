import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";

import ContentScriptConnection from "@background/connection";

import environment from "@environment/index";
import MaguroService from "@services/MaguroService";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

// remove logs on prod
if (!environment.IS_DEV) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

(async () => {
  ContentScriptConnection.init();
  (await AppStore.init()).dispatch(appActions.startup());

  let protocolEnabled = false;
  let interval: ReturnType<typeof setInterval>;

  // Load the config every minute until the protocol is enabled
  interval = setInterval(async () => {
    const extIsSetup = isSetup(AppStore.getStore().getState());
    if (!extIsSetup) return;

    let response = await MaguroService.getConfig();
    protocolEnabled = response.protocol_enabled;

    if (protocolEnabled) {
      AppStore.getInstance().dispatch(appActions.setProtocolEnabled(true));
      clearInterval(interval);
    }
  }, 60 * 1000);
})();

// Listen to extension install/update event
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    const { reason, previousVersion } = details;

    // check if the reason is an update
    if (reason === "update") {
      // check if previous version is lower than 0.1.0
      const [major, minor] = previousVersion!.split(".");

      if (Number.parseInt(major) > 0) {
        return;
      }

      if (Number.parseInt(minor) > 0) {
        return;
      }

      AppStore.getStore().dispatch(appActions.setSetup(false));
    }
  },
);
