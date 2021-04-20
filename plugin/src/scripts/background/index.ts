import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";

import ContentScriptConnection from "@background/connection";

(async () => {
  ContentScriptConnection.init();
  (await AppStore.init()).dispatch(appActions.startup());
})();
