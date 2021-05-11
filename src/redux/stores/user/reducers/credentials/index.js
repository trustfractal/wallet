import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_CREDENTIAL",
  "UPDATE_CREDENTIAL",
  "REMOVE_CREDENTIAL",
  "SET_CREDENTIALS",
  "SET_CREDENTIAL_STATUS",
  "FETCH_CREDENTIAL_STATUS",
]);

export const creators = createActions(
  types.ADD_CREDENTIAL,
  types.UPDATE_CREDENTIAL,
  types.REMOVE_CREDENTIAL,
  types.SET_CREDENTIALS,
  types.SET_CREDENTIAL_STATUS,
  types.FETCH_CREDENTIAL_STATUS,
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
