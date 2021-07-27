import AppStore from "@redux/stores/application";
import {
  SelfAttestedClaim as SDKSelfAttestedClaim,
  Byte,
} from "@trustfractal/sdk";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";
import {
  getAttestedClaims,
  getSelfAttestedClaims,
} from "@redux/stores/user/reducers/credentials/selectors";

import AttestedClaim from "@models/Credential/AttestedClaim";
import SelfAttestedClaim from "@models/Credential/SelfAttestedClaim";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import CredentialsVersions from "@models/Credential/versions";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

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
  [credentialsTypes.FETCH_SELF_ATTESTED_CLAIMS]: fetchSelfAttestedClaims,
  [credentialsTypes.SET_SELF_ATTESTED_CLAIMS]: setSelfAttestedClaims,
  [credentialsTypes.SET_ATTESTED_CLAIMS]: setAttestedClaims,
  [credentialsTypes.ADD_ATTESTED_CLAIM]: addAttestedClaim,
};

export default Aliases;
