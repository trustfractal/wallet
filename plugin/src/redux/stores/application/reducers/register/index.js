import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "RESET_REGISTER",
  "SET_REGISTER_ACCOUNT",
  "SET_REGISTER_PASSWORD",
  "WALLET_SETUP_REQUEST",
  "WALLET_SETUP_PENDING",
  "WALLET_SETUP_FAILED",
  "WALLET_SETUP_SUCCESS",
]);

export const creators = createActions(
  types.RESET_REGISTER,
  types.SET_REGISTER_ACCOUNT,
  types.SET_REGISTER_PASSWORD,
  types.WALLET_SETUP_REQUEST,
  types.WALLET_SETUP_PENDING,
  types.WALLET_SETUP_FAILED,
  types.WALLET_SETUP_SUCCESS,
);

export const initialState = {
  account: "",
  password: "",
  wallet: {
    success: false,
    loading: false,
    error: "",
  },
};

export const reducer = handleActions(
  {
    [types.RESET_REGISTER]: () =>
      Object.freeze({
        ...initialState,
      }),
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
    [types.WALLET_SETUP_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        wallet: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.WALLET_SETUP_PENDING]: (state) =>
      Object.freeze({
        ...state,
        wallet: {
          success: false,
          loading: true,
          error: "",
        },
      }),
    [types.WALLET_SETUP_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        wallet: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.WALLET_SETUP_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        wallet: {
          success: true,
          loading: false,
          error: "",
        },
      }),
  },
  initialState,
);

export const registerTypes = types;

export default creators;
