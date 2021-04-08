import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_REGISTER_ACCOUNT",
  "SET_REGISTER_PASSWORD",
  "RESET_REGISTER",
]);

export const creators = createActions(
  types.SET_REGISTER_ACCOUNT,
  types.SET_REGISTER_PASSWORD,
  types.RESET_REGISTER,
);

export const initialState = {
  account: "",
  password: "",
};

export const reducer = handleActions(
  {
    [types.SET_REGISTER_ACCOUNT]: (state, { payload: account }) =>
      Object.freeze({
        ...state,
        account,
      }),
    [types.SET_REGISTER_PASSWORD]: (state, { payload: password }) =>
      Object.freeze({
        ...state,
        password,
      }),
    [types.RESET_REGISTER]: (state) =>
      Object.freeze({
        ...initialState,
      }),
  },
  initialState,
);

export const appTypes = types;

export default creators;
