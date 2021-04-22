import AuthMiddleware from "@models/Connection/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";

import ContentScriptConnection from "@background/connection";

import UserStore from "@redux/stores/user";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import TokenTypes from "@models/Token/types";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

export const stakeRequest = (
  [amount, token, credentialId]: [string, TokenTypes, string],
  port: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const address = getAccount(UserStore.getStore().getState());
      const credentials = getCredentials(UserStore.getStore().getState());

      // find credential
      const credential = credentials.getByField("id", credentialId);

      if (!credential) {
        throw new Error(`Credential '${credentialId}' could not be found`);
      }

      const transaction = await ContentScriptConnection.invoke(
        ConnectionTypes.STAKE_INPAGE,
        [address, amount, token, credential.serialize()],
        port,
      );

      resolve(transaction);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

export const withdrawRequest = ([token]: [TokenTypes], port: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const address = getAccount(UserStore.getStore().getState());

      const transaction = await ContentScriptConnection.invoke(
        ConnectionTypes.WITHDRAW_INPAGE,
        [address, token],
        port,
      );

      resolve(transaction);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.STAKE_BACKGROUND]: {
    callback: stakeRequest,
    middlewares: [new AuthMiddleware()],
  },
  [ConnectionTypes.WITHDRAW_BACKGROUND]: {
    callback: withdrawRequest,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
