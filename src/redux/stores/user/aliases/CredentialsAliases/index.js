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
import {
  getAttestedClaims,
  getSelfAttestedClaims,
} from "@redux/stores/user/reducers/credentials/selectors";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import SelfAttestedClaim from "@models/Credential/SelfAttestedClaim";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import AttestedClaim from "@models/Credential/AttestedClaim";
import CredentialsVersions from "@models/Credential/versions";

import {
  getClaimsRegistryContractAddress,
  isSetup,
} from "@redux/stores/application/reducers/app/selectors";

import MaguroService from "@services/MaguroService";

export const addAttestedClaim = ({ payload: serializedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getAttestedClaims(getState());

    // create credential instance
    const credential = AttestedClaim.parse(serializedCredential);

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(credentialsActions.setAttestedClaims(credentials));
  };
};

export const updateAttestedClaim = ({
  payload: serializedUpdatedCredential,
}) => {
  return async (dispatch, getState) => {
    const credentials = getAttestedClaims(getState());

    const credential = AttestedClaim.parse(serializedUpdatedCredential);

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
    dispatch(credentialsActions.setAttestedClaims(credentials));
  };
};

export const removeAttestedClaim = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const credentials = getAttestedClaims(getState());

    // get credential
    const credential = credentials.getByField("id", id);

    if (!credential) {
      return;
    }

    // remove credential
    credentials.removeByField("id", credential.id);

    // update redux store
    dispatch(credentialsActions.setAttestedClaims(credentials));
  };
};

export const fetchAttestedClaimStatus = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const address = getAccount(getState());
    const credentials = getAttestedClaims(getState());

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
    dispatch(credentialsActions.setAttestedClaimStatus({ id, status }));
  };
};

export const setAttestedClaimStatus = ({ payload: { id, status } }) => {
  return async (dispatch, getState) => {
    const credentials = getAttestedClaims(getState());

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
    dispatch(credentialsActions.setAttestedClaims(credentials));
  };
};

export const fetchSelfAttestedClaims = () => {
  return async (dispatch) => {
    const setup = isSetup(AppStore.getStore().getState());

    if (!setup) {
      return;
    }

    const { credentials } = await MaguroService.getSelfAttestedClaims();

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

    dispatch(credentialsActions.setSelfAttestedClaims(formattedCredentials));
  };
};

export const setSelfAttestedClaims = ({ payload: selfAttestedClaims }) => {
  return async (dispatch, getState) => {
    const attestedClaims = getAttestedClaims(getState());

    dispatch(
      credentialsActions.setCredentials(
        new CredentialsCollection(
          ...[...selfAttestedClaims, ...attestedClaims],
        ),
      ),
    );
  };
};

export const setAttestedClaims = ({ payload: attestedClaims }) => {
  return async (dispatch, getState) => {
    const selfAttestedClaims = getSelfAttestedClaims(getState());

    dispatch(
      credentialsActions.setCredentials(
        new CredentialsCollection(
          ...[...selfAttestedClaims, ...attestedClaims],
        ),
      ),
    );
  };
};

const Aliases = {
  [credentialsTypes.ADD_ATTESTED_CLAIM]: addAttestedClaim,
  [credentialsTypes.UPDATE_ATTESTED_CLAIM]: updateAttestedClaim,
  [credentialsTypes.REMOVE_ATTESTED_CLAIM]: removeAttestedClaim,
  [credentialsTypes.FETCH_ATTESTED_CLAIM_STATUS]: fetchAttestedClaimStatus,
  [credentialsTypes.SET_ATTESTED_CLAIM_STATUS]: setAttestedClaimStatus,
  [credentialsTypes.FETCH_SELF_ATTESTED_CLAIMS]: fetchSelfAttestedClaims,
  [credentialsTypes.SET_SELF_ATTESTED_CLAIMS]: setSelfAttestedClaims,
  [credentialsTypes.SET_ATTESTED_CLAIMS]: setAttestedClaims,
};

export default Aliases;
