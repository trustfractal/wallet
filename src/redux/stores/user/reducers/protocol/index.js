import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["SET_WALLET"]);

export const creators = createActions(types.SET_WALLET);

export const initialState = {
  wallet: null,
};

export const reducer = handleActions(
  {
    [types.SET_WALLET]: (state, { payload: wallet }) =>
      Object.freeze({
        ...state,
        wallet,
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
    wallet: state.wallet,
  };
}

export const protocolTypes = types;

export default creators;
