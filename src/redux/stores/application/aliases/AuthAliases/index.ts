import { Action } from "redux-actions";

import ContentScriptConnection from "@background/connection";

import authActions, {
  authTypes,
} from "@redux/stores/application/reducers/auth";
import appActions from "@redux/stores/application/reducers/app";
import registerActions from "@redux/stores/application/reducers/register";
import { getRegisterPassword } from "@redux/stores/application/reducers/register/selectors";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import { getHashedPassword } from "@redux/stores/application/reducers/auth/selectors";

import {
  AppStoreError,
  ErrorCode,
  ERROR_STORE_PASSWORD_INCORRECT,
} from "@redux/stores/application/Errors";

import {
  ERROR_NOT_ON_FRACTAL,
  ERROR_USER_NOT_LOGGED_IN,
} from "@models/Connection/Errors";

import Store, { UserStore } from "@redux/stores/user";
import credentialsActions from "@redux/stores/user/reducers/credentials";

import FractalWebpageMiddleware from "@models/Connection/middlewares/FractalWebpageMiddleware";
import ConnectionTypes from "@models/Connection/types";

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

      if (setup) {
        // get user credentials
        Store.getStore().dispatch(credentialsActions.fetchCredentials());
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

export const connectFractal = () => {
  return async (dispatch: (arg: Action<any>) => void, _getState: () => any) => {
    dispatch(authActions.connectFractalPending());

    try {
      // ensure that the active port is on the fractal domain
      await new FractalWebpageMiddleware().apply();

      // get active connected chrome port
      const fractalPort = await ContentScriptConnection.getConnectedPort();

      if (!fractalPort) throw ERROR_NOT_ON_FRACTAL();

      // get megalodon session
      const sessions = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_BACKEND_SESSIONS_INPAGE,
        [],
        fractalPort.id,
      );

      if (!sessions.megalodon) throw ERROR_USER_NOT_LOGGED_IN();

      // save app setup flag
      dispatch(appActions.setSetup(true));

      // save session
      dispatch(authActions.setBackendSessions(sessions));

      // get user's credentials
      Store.getStore().dispatch(credentialsActions.fetchCredentials());
      dispatch(authActions.connectFractalSuccess());
    } catch (error) {
      console.error(error);
      dispatch(authActions.connectFractalFailed(error.message));
    }
  };
};

const Aliases = {
  [authTypes.SIGN_UP_REQUEST]: signUp,
  [authTypes.SIGN_IN_REQUEST]: signIn,
  [authTypes.CONNECT_FRACTAL_REQUEST]: connectFractal,
};

export default Aliases;
