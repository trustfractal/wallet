import appActions from "@redux/stores/application/reducers/app";
import authActions, {
  authTypes,
} from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";

import Store, { UserStore } from "@redux/stores/user";
import {
  getRegisterAccount,
  getRegisterPassword,
} from "@redux/stores/application/reducers/register/selectors";
import { getHashedPassword } from "@redux/stores/application/reducers/auth/selectors";

export const signUp = () => {
  return async (dispatch, getState) => {
    dispatch(authActions.signUpPending(true));

    try {
      // Get registered data
      const registeredAccount = getRegisterAccount(getState());
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

      // save the selected account information
      dispatch(appActions.setAccount(registeredAccount));

      // reset register state
      dispatch(registerActions.resetRegister());

      dispatch(authActions.signUpSuccess());
    } catch (error) {
      console.error(error);
      dispatch(authActions.signUpFailed(error.message));
    }
  };
};

export const signIn = ({ payload: attemptedPassword }) => {
  return async (dispatch, getState) => {
    dispatch(authActions.signInPending(true));

    try {
      const hashedPassword = getHashedPassword(getState());

      // Hash attempted password
      const hashedAttemptedPassword = (
        await UserStore.getHashedPassword(attemptedPassword).then(
          UserStore.getHashedPassword,
        )
      ).toString();

      // Compare passwords hashes
      if (hashedAttemptedPassword === hashedPassword) {
        // init the encrypted user store
        await Store.init(attemptedPassword);

        dispatch(authActions.signInSuccess());
      } else {
        dispatch(authActions.signInFailed("Password incorrect."));
      }
    } catch (error) {
      console.error(error);
      dispatch(authActions.signInFailed(error.message));
    }
  };
};

const Aliases = {
  [authTypes.SIGN_UP_REQUEST]: signUp,
  [authTypes.SIGN_IN_REQUEST]: signIn,
};

export default Aliases;
