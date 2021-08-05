import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "STARTUP",
  "SET_LAUNCHED",
  "SET_SETUP",
  "SET_STATUS",
  "SET_VERSION",
  "SET_PROTOCOL_OPT_IN",
  "SET_POPUP_SIZE",
]);

export const creators = createActions(
  types.STARTUP,
  types.SET_LAUNCHED,
  types.SET_SETUP,
  types.SET_STATUS,
  types.SET_VERSION,
  types.SET_PROTOCOL_OPT_IN,
  types.SET_POPUP_SIZE,
);

export const initialState = {
  launched: false,
  setup: false,
  version: "",
  protocolOptIn: false,
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
    [types.SET_VERSION]: (state, { payload: version }) =>
      Object.freeze({
        ...state,
        version,
      }),
    [types.SET_PROTOCOL_OPT_IN]: (state, { payload: protocolOptIn }) =>
      Object.freeze({
        ...state,
        protocolOptIn,
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
    protocolOptIn: state.protocolOptIn,
  };
}

export const appTypes = types;

export default creators;
