import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_VERIFICATION_REQUEST",
  "ACCEPT_VERIFICATION_REQUEST",
  "DECLINE_VERIFICATION_REQUEST",
  "REQUEST_ACCEPTED",
  "REQUEST_DECLINED",
  "SET_REQUESTS",
]);

const creators = createActions(
  types.ADD_VERIFICATION_REQUEST,
  types.ACCEPT_VERIFICATION_REQUEST,
  types.DECLINE_VERIFICATION_REQUEST,
  types.REQUEST_ACCEPTED,
  types.REQUEST_DECLINED,
  types.SET_REQUESTS,
);

const initialState = {
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
