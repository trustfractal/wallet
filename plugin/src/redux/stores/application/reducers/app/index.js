import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["STARTUP", "SET_LAUNCHED", "SET_SETUP"]);

export const creators = createActions(
  types.STARTUP,
  types.SET_LAUNCHED,
  types.SET_SETUP,
);

export const initialState = {
  launched: false,
  setup: false,
};

export const reducer = handleActions(
  {
    [types.SET_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
    [types.SET_SETUP]: (state, { payload: setup }) =>
      Object.freeze({
        ...state,
        setup,
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
    setup: state.setup,
  };
}

export const appTypes = types;

export default creators;
