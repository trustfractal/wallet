import AuthMiddleware from "@models/Connection/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";

import ContentScriptConnection from "@background/connection";

import UserStore from "@redux/stores/user";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

export const stakeRequest = ([amount]: [number], port: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());

      const transaction = await ContentScriptConnection.invoke(
        ConnectionTypes.STAKE_COMMIT,
        [address, amount],
        port,
      );

      resolve(transaction);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.STAKE_REQUEST]: {
    callback: stakeRequest,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
