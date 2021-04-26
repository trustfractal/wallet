import Credential from "@models/Credential";

import UserStore from "@redux/stores/user";

import ContentScriptConnection from "@background/connection";
import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

import credentialsActions from "@redux/stores/user/reducers/credentials";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import TransactionDetails from "@models/Transaction/TransactionDetails";
import EtherscanService from "@services/EtherscanService";

export const credentialStore = (
  [serializedCredential]: [string],
  port: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());

      // redirect request to the inpage fractal provider
      const serializedTransactionDetails = await ContentScriptConnection.invoke(
        ConnectionTypes.CREDENTIAL_STORE_INPAGE,
        [address, serializedCredential],
        port,
      );

      // parse transaction details
      const parsedTransactionDetails = TransactionDetails.parse(
        serializedTransactionDetails,
      );

      // calculate estimated confirmation time
      const estimatedTime = await EtherscanService.getEstimationOfConfirmationTime(
        parsedTransactionDetails.gasPrice,
      );

      // update transaction details
      parsedTransactionDetails.estimatedTime = estimatedTime;

      // parse the string credential
      const parsedCredential = Credential.parse(serializedCredential);

      // get all credentials
      const credentials = getCredentials(UserStore.getStore().getState());

      // update parsed credentials
      parsedCredential.transaction = parsedTransactionDetails;

      // append new credential
      credentials.push(parsedCredential);

      // store the credential
      await UserStore.getStore().dispatch(
        credentialsActions.setCredentials(credentials),
      );

      resolve(serializedTransactionDetails);
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
