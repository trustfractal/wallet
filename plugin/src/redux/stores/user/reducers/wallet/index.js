import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["SET_ACCOUNT"]);

export const creators = createActions(types.SET_ACCOUNT);

export const initialState = {
  account: "",
};

export const reducer = handleActions(
  {
    [types.SET_ACCOUNT]: (state, { payload: account }) =>
      Object.freeze({
        ...state,
        account,
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
