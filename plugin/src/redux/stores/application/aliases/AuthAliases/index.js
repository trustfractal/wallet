import authActions, {
  authTypes,
} from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";

import Store, { UserStore } from "@redux/stores/user";
import { getRegisterPassword } from "@redux/stores/application/reducers/register/selectors";
import { getHashedPassword } from "@redux/stores/application/reducers/auth/selectors";

export const signUp = () => {
  return async (dispatch, getState) => {
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
        const isInitialized = await Store.isInitialized();

        if (!isInitialized) {
          // init the encrypted user store
          await Store.init(attemptedPassword);
        }

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
