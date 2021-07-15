import AppStore from "@redux/stores/application";
import {
  SelfAttestedClaim as SDKSelfAttestedClaim,
  Byte,
} from "@trustfractal/sdk";

import ContentScriptConnection from "@background/connection";
import ConnectionTypes from "@models/Connection/types";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import Credential from "@models/Credential";
import SelfAttestedClaim from "@models/Credential/SelfAttestedClaim";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import CredentialsVersions from "@models/Credential/versions";

import { getClaimsRegistryContractAddress } from "@redux/stores/application/reducers/app/selectors";

import MaguroService from "@services/MaguroService";

export const addCredential = ({ payload: serializedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const credential = Credential.fromString(serializedCredential);

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const addCredentials = ({ payload: serializedCredentials }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const newCredentials = CredentialsCollection.parse(serializedCredentials);

    // append credentials
    newCredentials.forEach((credential) => {
      if (credentials.hasByField("id", credential.id)) {
        credentials.updateByField("id", credential.id, credential);
      } else {
        credentials.push(credential);
      }
    });

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const updateCredential = ({ payload: serializedUpdatedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = Credential.fromString(serializedUpdatedCredential);

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

export const fetchCredentialStatus = ({ payload: id }) => {
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
    const status = await ContentScriptConnection.invoke(
      ConnectionTypes.GET_CREDENTIAL_STATUS_INPAGE,
      [address, credential.serialize(), claimsRegistryContractAddress],
      activeTab.id,
    );

    // update redux store
    dispatch(credentialsActions.setCredentialStatus({ id, status }));
  };
};

export const setCredentialStatus = ({ payload: { id, status } }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = credentials.getByField("id", id);

    // update credential
    credential.status = status;

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

export const fetchCredentialsList = () => {
  return async (dispatch) => {
    const { credentials } = await MaguroService.getCredentials();

    const formattedCredentials = credentials.reduce((memo, credential) => {
      memo.push(
        new SelfAttestedClaim(
          new SDKSelfAttestedClaim({
            claim: credential.data.claim,
            claimTypeHash: credential.data.claimTypeHash,
            claimHashTree: credential.data.claimHashTree,
            rootHash: credential.data.rootHash,
            claimerAddress: credential.data.claimerAddress,
            attesterAddress: credential.data.attesterAddress,
            attesterSignature: credential.data.attesterSignature,
            countryOfIDIssuance: new Byte(
              Number(credential.data.countryOfIDIssuance),
            ),
            countryOfResidence: new Byte(
              Number(credential.data.countryOfResidence),
            ),
            kycType: new Byte(Number(credential.data.kycType)),
          }),
          `${credential.verification_case_id}:${credential.level}:${CredentialsVersions.VERSION_TWO}`,
          credential.level,
        ),
      );

      return memo;
    }, new CredentialsCollection());

    dispatch(
      credentialsActions.addCredentials(formattedCredentials.serialize()),
    );
  };
};

const Aliases = {
  [credentialsTypes.ADD_CREDENTIAL]: addCredential,
  [credentialsTypes.ADD_CREDENTIALS]: addCredentials,
  [credentialsTypes.UPDATE_CREDENTIAL]: updateCredential,
  [credentialsTypes.REMOVE_CREDENTIAL]: removeCredential,
  [credentialsTypes.FETCH_CREDENTIAL_STATUS]: fetchCredentialStatus,
  [credentialsTypes.FETCH_CREDENTIALS_LIST]: fetchCredentialsList,
  [credentialsTypes.SET_CREDENTIAL_STATUS]: setCredentialStatus,
};

export default Aliases;
