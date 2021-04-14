import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_HASHED_PASSWORD",
  "SIGN_IN_REQUEST",
  "SIGN_IN_PENDING",
  "SIGN_IN_FAILED",
  "SIGN_IN_SUCCESS",
  "SIGN_UP_REQUEST",
  "SIGN_UP_PENDING",
  "SIGN_UP_FAILED",
  "SIGN_UP_SUCCESS",
]);

export const creators = createActions(
  types.SET_HASHED_PASSWORD,
  types.SIGN_IN_REQUEST,
  types.SIGN_IN_PENDING,
  types.SIGN_IN_FAILED,
  types.SIGN_IN_SUCCESS,
  types.SIGN_UP_REQUEST,
  types.SIGN_UP_PENDING,
  types.SIGN_UP_FAILED,
  types.SIGN_UP_SUCCESS,
);

export const initialState = {
  signIn: {
    success: false,
    loading: false,
    error: "",
  },
  signUp: {
    success: false,
    loading: false,
    error: "",
  },
  hashedPassword: "",
  loggedIn: false,
  registered: false,
};

export const reducer = handleActions(
  {
    [types.SET_HASHED_PASSWORD]: (state, { payload: hashedPassword }) =>
      Object.freeze({
        ...state,
        hashedPassword,
      }),
    [types.SIGN_IN_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        signIn: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.SIGN_IN_PENDING]: (state) =>
      Object.freeze({
        ...state,
        signIn: {
          success: true,
          loading: true,
          error: "",
        },
      }),
    [types.SIGN_IN_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        signIn: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.SIGN_IN_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        signIn: {
          success: true,
          loading: false,
          error: "",
        },
        loggedIn: true,
      }),
    [types.SIGN_UP_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        signUp: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.SIGN_UP_PENDING]: (state) =>
      Object.freeze({
        ...state,
        signUp: {
          success: false,
          loading: true,
          error: "",
        },
      }),
    [types.SIGN_UP_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        signUp: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.SIGN_UP_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        signUp: {
          success: true,
          loading: false,
          error: "",
        },
        registered: true,
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
    hashedPassword: state.hashedPassword,
    registered: state.registered,
  };
}

export const authTypes = types;

export default creators;
