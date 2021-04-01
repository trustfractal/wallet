import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_CREDENTIAL",
  "REMOVE_CREDENTIAL",
  "SET_CREDENTIALS",
]);

export const creators = createActions(
  types.ADD_CREDENTIAL,
  types.REMOVE_CREDENTIAL,
  types.SET_CREDENTIALS,
);

export const initialState = {
  credentials: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_CREDENTIALS]: (state, { payload: credentials }) =>
      Object.freeze({
        ...state,
        credentials: credentials.serialize(),
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
    credentials: state.credentials,
  };
}

export const credentialsTypes = types;

export default creators;
