import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_REQUEST",
  "ACCEPT_SHARE_CREDENTIAL_REQUEST",
  "ACCEPT_SHARE_DATA_REQUEST",
  "ACCEPT_STORE_CREDENTIAL_REQUEST",
  "IGNORE_REQUEST",
  "REQUEST_ACCEPTED",
  "REMOVE_REQUEST",
  "DECLINE_REQUEST",
  "REQUEST_DECLINED",
  "SET_REQUESTS",
]);

export const creators = createActions(
  types.ADD_REQUEST,
  types.ACCEPT_SHARE_CREDENTIAL_REQUEST,
  types.ACCEPT_SHARE_DATA_REQUEST,
  types.ACCEPT_STORE_CREDENTIAL_REQUEST,
  types.IGNORE_REQUEST,
  types.REQUEST_ACCEPTED,
  types.REMOVE_REQUEST,
  types.DECLINE_REQUEST,
  types.REQUEST_DECLINED,
  types.SET_REQUESTS,
);

export const initialState = {
  requests: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_REQUESTS]: (state, { payload: requests }) =>
      Object.freeze({
        ...state,
        requests: requests.serialize(),
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
    requests: state.requests,
  };
}

export const requestsTypes = types;

export default creators;
