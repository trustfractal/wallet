import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";
import metadataActions, {
  MIGRATIONS,
} from "@redux/stores/application/reducers/metadata";

import ContentScriptConnection from "@background/connection";
import { getMultiContext } from "@services/Factory";

(async () => {
  ContentScriptConnection.init();
  (await AppStore.init()).dispatch(appActions.startup());
})();

getMultiContext().inBackground();

// Listen to extension install/update event
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    const { reason, previousVersion } = details;

    // check if the reason is an update
    if (reason === "update") {
      // check if previous version is lower than 0.3.8
      const [major, minor, patch] = previousVersion!.split(".");

      if (Number.parseInt(major) > 0) {
        return;
      }

      if (Number.parseInt(minor) > 3) {
        return;
      }

      if (Number.parseInt(patch) > 8) {
        return;
      }

      // Add generated wallet data migration
      AppStore.getStore().dispatch(
        metadataActions.addMigration(MIGRATIONS.GENERATED_WALLET_MIGRATION),
      );
    }
  },
);
