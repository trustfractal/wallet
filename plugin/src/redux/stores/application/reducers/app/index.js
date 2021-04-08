import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["STARTUP", "SET_ACCOUNT", "SET_LAUNCHED"]);

export const creators = createActions(
  types.STARTUP,
  types.SET_ACCOUNT,
  types.SET_LAUNCHED,
);

export const initialState = {
  account: "",
  launched: false,
};

export const reducer = handleActions(
  {
    [types.SET_ACCOUNT]: (state, { payload: account }) =>
      Object.freeze({
        ...state,
        account,
      }),
    [types.SET_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
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

export const appTypes = types;

export default creators;
