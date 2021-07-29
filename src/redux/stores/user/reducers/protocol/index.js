import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_MNEMONIC",
  "SET_SIGNING_KEY",
  "SET_REGISTERED_FOR_MINTING",
]);

export const creators = createActions(
  types.SET_MNEMONIC,
  types.SET_SIGNING_KEY,
  types.SET_REGISTERED_FOR_MINTING,
);

export const initialState = {
  mnemonic: null,
  signingKey: null,
  registeredForMinting: false,
};

export const reducer = handleActions(
  {
    [types.SET_MNEMONIC]: (state, { payload: mnemonic }) =>
      Object.freeze({
        ...state,
        mnemonic,
      }),

    [types.SET_SIGNING_KEY]: (state, { payload: signingKey }) =>
      Object.freeze({
        ...state,
        signingKey,
      }),

    [types.SET_REGISTERED_FOR_MINTING]: (
      state,
      { payload: registeredForMinting },
    ) =>
      Object.freeze({
        ...state,
        registeredForMinting,
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
    mnemonic: state.mnemonic,
    signingKey: state.signingKey,
    registeredForMinting: state.registeredForMinting,
  };
}

export const protocolTypes = types;

export default creators;
