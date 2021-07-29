import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["SET_MNEMONIC"]);

export const creators = createActions(types.SET_MNEMONIC);

export const initialState = {
  mnemonic: null,
};

export const reducer = handleActions(
  {
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
  };
}

export async function store(state) {
  return {
    mnemonic: state.mnemonic,
  };
}

export const protocolTypes = types;

export default creators;
