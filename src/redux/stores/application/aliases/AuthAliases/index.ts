import { Action } from "redux-actions";
import {
  SelfAttestedClaim as SDKSelfAttestedClaim,
  Byte,
} from "@trustfractal/sdk";

import authActions, {
  authTypes,
} from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";
import { getRegisterPassword } from "@redux/stores/application/reducers/register/selectors";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import {
  getBackendSession,
  getHashedPassword,
} from "@redux/stores/application/reducers/auth/selectors";

import {
  AppStoreError,
  ErrorCode,
  ERROR_STORE_PASSWORD_INCORRECT,
} from "@redux/stores/application/Errors";

import Store, { UserStore } from "@redux/stores/user";
import credentialsActions from "@redux/stores/user/reducers/credentials";

import MaguroService from "@services/MaguroService";

import StableCredential from "@models/Credential/StableCredential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

export const signUp = () => {
  return async (dispatch: (arg: Action<any>) => void, getState: () => any) => {
    dispatch(authActions.signUpPending());

    try {
      // get registered data
      const registeredPassword = getRegisterPassword(getState());

      // init the encrypted user store
      await Store.init(registeredPassword);

      // save a double hash password for authentication purposes
      const hashedPassword = (
        await UserStore.getHashedPassword(registeredPassword).then(
          UserStore.getHashedPassword,
        )
      ).toString();
      dispatch(authActions.setHashedPassword(hashedPassword));

      // reset register state
      dispatch(registerActions.resetRegister());

      dispatch(authActions.signUpSuccess());
    } catch (error) {
      console.error(error);
      dispatch(authActions.signUpFailed(error.message));
    }
  };
};

export const signIn = ({ payload: attemptedPassword }: { payload: string }) => {
  return async (dispatch: (arg: Action<any>) => void, getState: () => any) => {
    dispatch(authActions.signInPending());

    try {
      const hashedPassword = getHashedPassword(getState());
      const setup = isSetup(getState());

      // hash attempted password
      const hashedAttemptedPassword = (
        await UserStore.getHashedPassword(attemptedPassword).then(
          UserStore.getHashedPassword,
        )
      ).toString();

      // compare passwords hashes
      if (hashedAttemptedPassword !== hashedPassword) {
        throw ERROR_STORE_PASSWORD_INCORRECT();
      }

      const isInitialized = await Store.isInitialized();

      if (!isInitialized) {
        // init the encrypted user store
        await Store.init(attemptedPassword);
      }

      // get user stable credentials
      if (setup) {
        const session = getBackendSession(getState());
        const { credentials } = await MaguroService.getCredentials(session);

        const formattedCredentials: CredentialsCollection = credentials.reduce(
          (memo: CredentialsCollection, credential: any) => {
            memo.push(
              new StableCredential(
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
                `${credential.user_id}:${credential.level}`,
                credential.level,
              ),
            );

            return memo;
          },
          new CredentialsCollection(),
        );

        Store.getStore().dispatch(
          credentialsActions.addCredentials(formattedCredentials.serialize()),
        );
      }

      dispatch(authActions.signInSuccess());
    } catch (error) {
      if (error instanceof AppStoreError) {
        if (error.errorCode === ErrorCode.ERROR_STORE_PASSWORD_INCORRECT) {
          dispatch(authActions.signInFailed("Password is incorrect."));
          return;
        }
      }
    }
  };
};

const Aliases = {
  [authTypes.SIGN_UP_REQUEST]: signUp,
  [authTypes.SIGN_IN_REQUEST]: signIn,
};

export default Aliases;
