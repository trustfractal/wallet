import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";

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
})();
