import Credential from "@models/Credential";

import UserStore from "@redux/stores/user";

import ContentScriptConnection from "@background/connection";
import AuthMiddleware from "@models/Connection/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

import credentialsActions from "@redux/stores/user/reducers/credentials";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

export const credentialStore = (
  [serializedCredential]: [string],
  port: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());

      // redirect request to the inpage fractal provider
      const storedSerializedCredential = await ContentScriptConnection.invoke(
        ConnectionTypes.CREDENTIAL_STORE_INPAGE,
        [address, serializedCredential],
        port,
      );

      // parse the string credential
      const parsedCredential = Credential.parse(storedSerializedCredential);

      // get all credentials
      const credentials = getCredentials(UserStore.getStore().getState());

      // append new credential
      credentials.push(parsedCredential);

      // store the credential
      await UserStore.getStore().dispatch(
        credentialsActions.setCredentials(credentials),
      );

      resolve(parsedCredential.transactionHash);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

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

export const isCredentialValid = ([id]: [string], port: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());
      const credentials: CredentialsCollection = getCredentials(
        UserStore.getStore().getState(),
      );

      const credential = credentials.getByField("id", id);

      if (!credential) {
        throw new Error(`Credential ${id} could not be found`);
      }

      // redirect request to the inpage fractal provider
      const isValid = await ContentScriptConnection.invoke(
        ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE,
        [address, credential.serialize()],
        port,
      );

      // update credential data
      credential.valid = isValid;
      credentials.removeByField("id", id);
      credentials.push(credential);

      // store the credential
      await UserStore.getStore().dispatch(
        credentialsActions.setCredentials(credentials),
      );

      resolve(isValid);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_BACKGROUND]: {
    callback: credentialStore,
    middlewares: [new AuthMiddleware()],
  },
  [ConnectionTypes.HAS_CREDENTIAL_BACKGROUND]: {
    callback: hasCredential,
    middlewares: [new AuthMiddleware()],
  },
  [ConnectionTypes.IS_CREDENTIAL_VALID_BACKGROUND]: {
    callback: isCredentialValid,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
