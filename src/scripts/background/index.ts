import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";
import metadataActions, {
  MIGRATIONS,
  LASTEST_MIGRATION,
} from "@redux/stores/application/reducers/metadata";

import ContentScriptConnection from "@background/connection";

import environment from "@environment/index";

// remove logs on prod
if (!environment.IS_DEV) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

(async () => {
  ContentScriptConnection.init();
  (await AppStore.init()).dispatch(appActions.startup());

  // Listen to extension install/update event
  chrome.runtime.onInstalled.addListener(
    (details: chrome.runtime.InstalledDetails) => {
      const { reason, previousVersion } = details;

      // check if is a fresh install
      if (reason === "install") {
        AppStore.getStore().dispatch(
          metadataActions.setLastMigration(LASTEST_MIGRATION),
        );
        return;
      }

      // check if the reason is an update
      if (reason === "update") {
        // check if previous version is lower than 0.3.7
        const [major, minor, patch] = previousVersion!.split(".");

        if (Number.parseInt(major) > 0) {
          return;
        }

        if (Number.parseInt(minor) > 3) {
          return;
        }

        if (Number.parseInt(patch) > 7) {
          return;
        }

        // Set latest migration to be exectuded when user store is unlocked
        AppStore.getStore().dispatch(
          metadataActions.setLastMigration(MIGRATIONS["0.3.7"] - 1),
        );
      }
    },
  );
})();
