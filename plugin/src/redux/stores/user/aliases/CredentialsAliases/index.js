import AppStore from "@redux/stores/application";

import ContentScriptConnection from "@background/connection";
import ConnectionTypes from "@models/Connection/types";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import Credential from "@models/Credential";
import { getClaimsRegistryContractAddress } from "@redux/stores/application/reducers/app/selectors";
import { getAccount } from "../../reducers/wallet/selectors";

export const addCredential = ({ payload: serializedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const credential = Credential.parse(serializedCredential);

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const updateCredential = ({ payload: serializedUpdatedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = Credential.parse(serializedUpdatedCredential);

    // update credential
    const updatedCredential = credentials.updateByField(
      "id",
      credential.id,
      credential,
    );

    if (!updatedCredential) {
      return;
    }

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const removeCredential = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // get credential
    const credential = credentials.getByField("id", id);

    if (!credential) {
      return;
    }

    // remove credential
    credentials.removeByField("id", credential.id);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const fetchCredentialValidity = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const address = getAccount(getState());
    const credentials = getCredentials(getState());

    const credential = credentials.getByField("id", id);
    const claimsRegistryContractAddress = getClaimsRegistryContractAddress(
      AppStore.getStore().getState(),
    );

    const activeTab = await ContentScriptConnection.getActiveConnectionPort();
    if (activeTab === undefined) {
      return;
    }

    // fetch credential validity
    const valid = await ContentScriptConnection.invoke(
      ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE,
      [address, credential.serialize(), claimsRegistryContractAddress],
      activeTab.id,
    );

    // update redux store
    dispatch(credentialsActions.setCredentialValidity({ id, valid }));
  };
};

export const setCredentialValidity = ({ payload: { id, valid } }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = credentials.getByField("id", id);

    // update credential
    credential.valid = valid;
    const updatedCredential = credentials.updateByField(
      "id",
      credential.id,
      credential,
    );

    if (!updatedCredential) {
      return;
    }

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

const Aliases = {
  [credentialsTypes.ADD_CREDENTIAL]: addCredential,
  [credentialsTypes.UPDATE_CREDENTIAL]: updateCredential,
  [credentialsTypes.REMOVE_CREDENTIAL]: removeCredential,
  [credentialsTypes.FETCH_CREDENTIAL_VALIDITY]: fetchCredentialValidity,
  [credentialsTypes.SET_CREDENTIAL_VALIDITY]: setCredentialValidity,
};

export default Aliases;
