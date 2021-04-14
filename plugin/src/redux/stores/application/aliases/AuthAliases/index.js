import walletActions from "@redux/stores/user/reducers/wallet";
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
    dispatch(authActions.signUpPending());

    try {
      // get registered data
      const registeredAccount = getRegisterAccount(getState());
      const registeredPassword = getRegisterPassword(getState());

      // init the encrypted user store
      const userStore = await Store.init(registeredPassword);

      // save a double hash password for authentication purposes
      const hashedPassword = (
        await UserStore.getHashedPassword(registeredPassword).then(
          UserStore.getHashedPassword,
        )
      ).toString();
      dispatch(authActions.setHashedPassword(hashedPassword));

      // save the selected account information in the user store
      userStore.dispatch(walletActions.setAccount(registeredAccount));

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
    dispatch(authActions.signInPending());

    try {
      const hashedPassword = getHashedPassword(getState());

      // hash attempted password
      const hashedAttemptedPassword = (
        await UserStore.getHashedPassword(attemptedPassword).then(
          UserStore.getHashedPassword,
        )
      ).toString();

      // compare passwords hashes
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
