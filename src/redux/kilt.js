import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

import Mnemonic from "@models/Mnemonic";

const types = mirrorCreator([
  "ADD_CREDENTIAL",
  "CREATE_CREDENTIAL",
  "GENERATE_IDENTITY",
  "SET_BALANCE",
  "SET_MNEMONIC",
  "SET_CREDENTIALS",
  "VERIFY_CREDENTIAL",
  "REMOVE_CREDENTIAL",
]);

export const creators = createActions(
  types.ADD_CREDENTIAL,
  types.CREATE_CREDENTIAL,
  types.GENERATE_IDENTITY,
  types.SET_BALANCE,
  types.SET_MNEMONIC,
  types.SET_CREDENTIALS,
  types.VERIFY_CREDENTIAL,
  types.REMOVE_CREDENTIAL,
);

export const initialState = {
  mnemonic: { mnemonic: "", identity: {} },
  balance: 0,
  credentials: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_BALANCE]: (state, { payload: balance }) =>
      Object.freeze({
        ...state,
        balance,
      }),
    [types.SET_CREDENTIALS]: (state, { payload: credentials }) =>
      Object.freeze({
        ...state,
        credentials: credentials.serialize(),
      }),
    [types.SET_MNEMONIC]: (state, { payload: mnemonic }) =>
      Object.freeze({
        ...state,
        mnemonic,
      }),
  },
  initialState,
);

export async function restore(state = {}) {
  return {
    ...initialState,
    ...state,
    mnemonic: state.mnemonic
      ? await Mnemonic.parse(state.mnemonic)
      : initialState.mnemonic,
  };
}

export async function store(state) {
  return {
    mnemonic: state.mnemonic.mnemonic,
    balance: state.balance.toString(),
    credentials: state.credentials,
  };
}

export const kiltTypes = types;

export default creators;
