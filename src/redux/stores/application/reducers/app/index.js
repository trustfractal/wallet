import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

export const NETWORKS = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
};

const types = mirrorCreator([
  "STARTUP",
  "SET_LAUNCHED",
  "SET_SETUP",
  "SET_STATUS",
  "SET_VERSION",
  "SET_PROTOCOL_ENABLED",
  "SET_PROTOCOL_OPT_IN",
  "SET_WALLET_GENERATED",
  "SET_POPUP_SIZE",
  "SET_NETWORK",
]);

export const creators = createActions(
  types.STARTUP,
  types.SET_LAUNCHED,
  types.SET_SETUP,
  types.SET_STATUS,
  types.SET_VERSION,
  types.SET_PROTOCOL_ENABLED,
  types.SET_PROTOCOL_OPT_IN,
  types.SET_WALLET_GENERATED,
  types.SET_POPUP_SIZE,
  types.SET_NETWORK,
);

export const initialState = {
  launched: false,
  setup: false,
  version: "",
  protocolOptIn: false,
  protocolEnabled: false,
  walletGenerated: false,
  network: NETWORKS.TESTNET,
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
    [types.SET_PROTOCOL_ENABLED]: (state, { payload: protocolEnabled }) =>
      Object.freeze({
        ...state,
        protocolEnabled,
      }),
    [types.SET_PROTOCOL_OPT_IN]: (state, { payload: protocolOptIn }) =>
      Object.freeze({
        ...state,
        protocolOptIn,
      }),
    [types.SET_WALLET_GENERATED]: (state, { payload: walletGenerated }) =>
      Object.freeze({
        ...state,
        walletGenerated,
      }),
    [types.SET_NETWORK]: (state, { payload: network }) =>
      Object.freeze({
        ...state,
        network,
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
    protocolEnabled: state.protocolEnabled,
    walletGenerated: state.walletGenerated,
    network: state.network,
  };
}

export const appTypes = types;

export default creators;
