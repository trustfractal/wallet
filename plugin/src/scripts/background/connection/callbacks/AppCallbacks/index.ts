import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import FractalWebpageMiddleware from "@models/Connection/middlewares/FractalWebpageMiddleware";
import ConnectionTypes from "@models/Connection/types";

import AppStore from "@redux/stores/application";

import {
  isLoggedIn,
  isRegistered,
} from "@redux/stores/application/reducers/auth/selectors";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

export const verifyConnection = () =>
  new Promise((resolve, reject) => {
    try {
      const { version } = chrome.runtime.getManifest();

      const registered = isRegistered(AppStore.getStore().getState());
      const loggedIn = isLoggedIn(AppStore.getStore().getState());

      const setup = isSetup(AppStore.getStore().getState());

      resolve({
        version,
        registered,
        locked: !loggedIn,
        setup,
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.SETUP_PLUGIN]: {
    callback: verifyConnection,
    middlewares: [new FractalWebpageMiddleware(), new AuthMiddleware()],
  },
  [ConnectionTypes.VERIFY_CONNECTION]: { callback: verifyConnection },
};

export default Callbacks;
