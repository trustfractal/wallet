import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "STARTUP",
  "SET_ADDRESSES",
  "SET_LAUNCHED",
  "SET_SETUP",
  "SET_STATUS",
  "SET_VERSION",
]);

export const creators = createActions(
  types.STARTUP,
  types.SET_ADDRESSES,
  types.SET_LAUNCHED,
  types.SET_SETUP,
  types.SET_STATUS,
  types.SET_VERSION,
);

export const initialState = {
  launched: false,
  setup: false,
  addresses: {
    staking: {
      FCL: "",
      FCL_ETH_LP: "",
      enabled: false,
    },
    erc20: {
      FCL: "",
      FCL_ETH_LP: "",
    },
    claimsRegistry: "",
    issuerAddress: "",
  },
  version: "",
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
    [types.SET_ADDRESSES]: (state, { payload: addresses }) =>
      Object.freeze({
        ...state,
        addresses,
      }),
    [types.SET_VERSION]: (state, { payload: version }) =>
      Object.freeze({
        ...state,
        version,
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
