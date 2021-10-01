import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";

import AppStore from "@redux/stores/application";

import {
  isLoggedIn,
  isRegistered,
} from "@redux/stores/application/reducers/auth/selectors";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import ConnectionStatus from "@models/Connection/ConnectionStatus";

const verifyConnection = () =>
  new Promise((resolve, reject) => {
    try {
      const { version } = chrome.runtime.getManifest();

      const registered = isRegistered(AppStore.getStore().getState());
      const loggedIn = isLoggedIn(AppStore.getStore().getState());

      const setup = isSetup(AppStore.getStore().getState());

      const status = new ConnectionStatus(
        version,
        registered,
        !loggedIn,
        setup,
      );

      resolve(status.serialize());
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.SETUP_PLUGIN_BACKGROUND]: {
    callback: verifyConnection,
    middlewares: [new AuthMiddleware()],
  },
  [ConnectionTypes.VERIFY_CONNECTION_BACKGROUND]: {
    callback: verifyConnection,
  },
};

export default Callbacks;
