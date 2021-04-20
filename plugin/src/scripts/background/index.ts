import AppStore from "@redux/application";

import appActions from "@redux/application/reducers/app";

import ContentScriptConnection from "@background/connection";

(async () => {
  ContentScriptConnection.init();
  (await AppStore.init()).dispatch(appActions.startup());
})();
