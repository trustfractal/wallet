import ConnectionTypes from "@models/Connection/types";

import AppStore from "@redux/stores/application";
import UserStore from "@redux/stores/user";
import { getProtocolOptIn } from "@redux/stores/application/reducers/app/selectors";
import protocolActions from "@redux/stores/user/reducers/protocol";

export const addWebpage = ([webpage]: [Location]): Promise<void> =>
  new Promise(async (resolve, reject) => {
    try {
      const optedIn = getProtocolOptIn(AppStore.getStore().getState());

      if (!optedIn) return resolve();

      await UserStore.getStore().dispatch(protocolActions.addWebpage(webpage));

      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.ADD_WEBPAGE]: {
    callback: addWebpage,
  },
};

export default Callbacks;
