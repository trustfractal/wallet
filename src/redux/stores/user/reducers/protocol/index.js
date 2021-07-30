import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_MNEMONIC",
  "SET_REGISTERED_FOR_MINTING",
  "CREATE_WALLET",
]);

export const creators = createActions(
  types.SET_MNEMONIC,
  types.SET_REGISTERED_FOR_MINTING,
  types.CREATE_WALLET,
);

export const initialState = {
  mnemonic: null,
  registeredForMinting: false,
};

export const reducer = handleActions(
  {
    [types.SET_MNEMONIC]: (state, { payload: mnemonic }) =>
      Object.freeze({
        ...state,
        mnemonic,
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
    registeredForMinting: state.registeredForMinting,
  };
}

export const protocolTypes = types;

export default creators;
