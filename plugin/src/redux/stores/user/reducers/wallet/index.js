import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "CONNECT_WALLET_REQUEST",
  "CONNECT_WALLET_PENDING",
  "CONNECT_WALLET_FAILED",
  "CONNECT_WALLET_SUCCESS",
  "SET_ACCOUNT",
]);

export const creators = createActions(
  types.CONNECT_WALLET_REQUEST,
  types.CONNECT_WALLET_PENDING,
  types.CONNECT_WALLET_FAILED,
  types.CONNECT_WALLET_SUCCESS,
  types.SET_ACCOUNT,
);

export const initialState = {
  account: "",
  connect: {
    success: false,
    loading: false,
    error: "",
  },
};

export const reducer = handleActions(
  {
    [types.SET_ACCOUNT]: (state, { payload: account }) =>
      Object.freeze({
        ...state,
        account,
      }),
    [types.CONNECT_WALLET_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.CONNECT_WALLET_PENDING]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: true,
          loading: true,
          error: "",
        },
      }),
    [types.CONNECT_WALLET_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.CONNECT_WALLET_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: true,
          loading: false,
          error: "",
        },
      }),
  },
  initialState,
);

export async function restore(state = {}) {
  return {
    ...initialState,
    ...state,
  };
}

export async function store(state) {
  return {
    account: state.account,
  };
}

export const walletTypes = types;

export default creators;
