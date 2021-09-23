import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["SET_EMAILS", "SET_PHONE_NUMBERS"]);

export const creators = createActions(
  types.SET_EMAILS,
  types.SET_PHONE_NUMBERS,
);

export const initialState = {
  emails: "[]",
  phoneNumbers: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_EMAILS]: (state, { payload: emails }) =>
      Object.freeze({
        ...state,
        emails,
      }),

    [types.SET_PHONE_NUMBERS]: (state, { payload: phoneNumbers }) =>
      Object.freeze({
        ...state,
        phoneNumbers,
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
    emails: state.emails,
    phoneNumbers: state.phoneNumbers,
  };
}

export default creators;
