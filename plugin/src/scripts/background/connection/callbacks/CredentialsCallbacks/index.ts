import AuthMiddleware from "@models/Connection/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

import UserStore from "@redux/stores/user";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

export const hasCredential = ([id]: [string]) =>
  new Promise((resolve, reject) => {
    try {
      const credentials: CredentialsCollection = getCredentials(
        UserStore.getStore().getState(),
      );

      const credential = credentials.getByField("id", id);

      resolve(credential !== undefined);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.HAS_CREDENTIAL]: {
    callback: hasCredential,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
