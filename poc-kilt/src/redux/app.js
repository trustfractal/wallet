import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["STARTUP", "SET_LAUNCHED"]);

export const creators = createActions(types.STARTUP, types.SET_LAUNCHED);

export const initialState = {
  launched: false,
};

export const reducer = handleActions(
  {
    [types.SET_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
  },
  initialState,
);

export async function restore() {
  return initialState;
}

export async function store() {
  return {};
}

export const appTypes = types;

export default creators;
