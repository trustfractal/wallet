import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["STARTUP", "SET_LAUNCHED", "SET_SIGN_IN"]);

export const creators = createActions(
  types.STARTUP,
  types.SET_LAUNCHED,
  types.SET_SIGN_IN,
);

export const initialState = {
  launched: false,
  signIn: false,
};

export const reducer = handleActions(
  {
    [types.SET_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
    [types.SET_SIGN_IN]: (state, { payload: signIn }) =>
      Object.freeze({
        ...state,
        signIn,
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
    signIn: state.signIn,
  };
}

export const appTypes = types;

export default creators;
