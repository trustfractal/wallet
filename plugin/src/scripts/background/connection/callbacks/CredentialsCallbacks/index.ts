import Credential from "@models/Credential";

import UserStore from "@redux/stores/user";
import AppStore from "@redux/stores/application";

import ContentScriptConnection from "@background/connection";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import FractalWebpageMiddleware from "@models/Connection/middlewares/FractalWebpageMiddleware";
import ConnectionTypes from "@models/Connection/types";

import credentialsActions from "@redux/stores/user/reducers/credentials";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import TransactionDetails from "@models/Transaction/TransactionDetails";

import { ERROR_CREDENTIAL_NOT_FOUND } from "@background/Errors";
import { getClaimsRegistryContractAddress } from "@redux/stores/application/reducers/app/selectors";

export const credentialStore = (
  [serializedCredential]: [string],
  port: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());
      const claimsRegistryContractAddress: string = getClaimsRegistryContractAddress(
        AppStore.getStore().getState(),
      );

      // redirect request to the inpage fractal provider
      const serializedTransactionDetails = await ContentScriptConnection.invoke(
        ConnectionTypes.CREDENTIAL_STORE_INPAGE,
        [address, serializedCredential, claimsRegistryContractAddress],
        port,
      );

      // parse transaction details
      const parsedTransactionDetails = TransactionDetails.parse(
        serializedTransactionDetails,
      );

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

export const getAttestationRequest = (
  [level, serializedProperties]: [string, string],
  port: string,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const address: string = getAccount(UserStore.getStore().getState());

      // redirect request to the inpage fractal provider
      const serializedRequest = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_ATTESTATION_REQUEST_INPAGE,
        [address, level, serializedProperties],
        port,
      );

      resolve(serializedRequest);
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
        reject(ERROR_CREDENTIAL_NOT_FOUND(id));
        return;
      }

      const claimsRegistryContractAddress: string = getClaimsRegistryContractAddress(
        AppStore.getStore().getState(),
      );

      // redirect request to the inpage fractal provider
      const isValid = await ContentScriptConnection.invoke(
        ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE,
        [address, credential.serialize(), claimsRegistryContractAddress],
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
    middlewares: [new FractalWebpageMiddleware(), new AuthMiddleware()],
  },
  [ConnectionTypes.GET_ATTESTATION_REQUEST_BACKGROUND]: {
    callback: getAttestationRequest,
    middlewares: [new FractalWebpageMiddleware(), new AuthMiddleware()],
  },
  [ConnectionTypes.HAS_CREDENTIAL_BACKGROUND]: {
    callback: hasCredential,
    middlewares: [new FractalWebpageMiddleware(), new AuthMiddleware()],
  },
  [ConnectionTypes.IS_CREDENTIAL_VALID_BACKGROUND]: {
    callback: isCredentialValid,
    middlewares: [new FractalWebpageMiddleware(), new AuthMiddleware()],
  },
};

export default Callbacks;
