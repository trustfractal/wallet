import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_HASHED_PASSWORD",
  "SET_BACKEND_SESSIONS",
  "SET_BACKEND_CATFISH_SESSION",
  "SET_BACKEND_MEGALODON_SESSION",
  "SET_BACKEND_SCOPES",
  "SIGN_IN_REQUEST",
  "SIGN_IN_PENDING",
  "SIGN_IN_FAILED",
  "SIGN_IN_SUCCESS",
  "SIGN_UP_REQUEST",
  "SIGN_UP_PENDING",
  "SIGN_UP_FAILED",
  "SIGN_UP_SUCCESS",
  "CONNECT_FRACTAL_REQUEST",
  "CONNECT_FRACTAL_PENDING",
  "CONNECT_FRACTAL_FAILED",
  "CONNECT_FRACTAL_SUCCESS",
]);

export const creators = createActions(
  types.SET_HASHED_PASSWORD,
  types.SET_BACKEND_SESSIONS,
  types.SET_BACKEND_CATFISH_SESSION,
  types.SET_BACKEND_MEGALODON_SESSION,
  types.SET_BACKEND_SCOPES,
  types.SIGN_IN_REQUEST,
  types.SIGN_IN_PENDING,
  types.SIGN_IN_FAILED,
  types.SIGN_IN_SUCCESS,
  types.SIGN_UP_REQUEST,
  types.SIGN_UP_PENDING,
  types.SIGN_UP_FAILED,
  types.SIGN_UP_SUCCESS,
  types.CONNECT_FRACTAL_REQUEST,
  types.CONNECT_FRACTAL_PENDING,
  types.CONNECT_FRACTAL_FAILED,
  types.CONNECT_FRACTAL_SUCCESS,
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
  connect: {
    success: false,
    loading: false,
    error: "",
  },
  sessions: {
    catfish: "",
    megalodon: "",
    scopes: "",
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
    [types.SET_BACKEND_SESSIONS]: (state, { payload: sessions }) =>
      Object.freeze({
        ...state,
        sessions,
      }),
    [types.SET_BACKEND_CATFISH_SESSION]: (state, { payload: catfish }) =>
      Object.freeze({
        ...state,
        sessions: {
          ...state.sessions,
          catfish,
        },
      }),
    [types.SET_BACKEND_MEGALODON_SESSION]: (state, { payload: megalodon }) =>
      Object.freeze({
        ...state,
        sessions: {
          ...state.sessions,
          megalodon,
        },
      }),
    [types.SET_BACKEND_SCOPES]: (state, { payload: scopes }) =>
      Object.freeze({
        ...state,
        scopes,
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
          success: false,
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
    [types.CONNECT_FRACTAL_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.CONNECT_FRACTAL_PENDING]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: true,
          error: "",
        },
      }),
    [types.CONNECT_FRACTAL_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.CONNECT_FRACTAL_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: true,
          loading: false,
          error: "",
        },
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
    sessions: state.sessions,
  };
}

export const authTypes = types;

export default creators;
