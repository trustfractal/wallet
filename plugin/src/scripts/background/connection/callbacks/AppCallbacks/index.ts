import ConnectionTypes from "@models/Connection/types";

import AppStore from "@redux/application";
import UserStore from "@redux/user";

import {
  isLoggedIn,
  isRegistered,
} from "@redux/application/reducers/auth/selectors";
import { getAccount } from "@redux/user/reducers/wallet/selectors";

export const verifyConnection = () =>
  new Promise((resolve, reject) => {
    try {
      const { version } = chrome.runtime.getManifest();

      const registered = isRegistered(AppStore.getStore().getState());
      const loggedIn = isLoggedIn(AppStore.getStore().getState());

      let account = "";

      if (loggedIn) {
        account = getAccount(UserStore.getStore().getState());
      }

      resolve({
        version,
        registered,
        locked: !loggedIn,
        setup: account.length > 0,
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.VERIFY_CONNECTION]: verifyConnection,
};

export default Callbacks;
