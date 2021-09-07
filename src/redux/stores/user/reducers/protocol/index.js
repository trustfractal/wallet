import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_MNEMONIC",
  "SET_REGISTERED_FOR_MINTING",
  "SET_REGISTRATION_STATE",
  "SET_REGISTRATION_ERROR",
  "CREATE_WALLET",
  "IMPORT_WALLET",
]);

const registrationTypes = {
  STARTED: "STARTED",
  ADDRESS_GENERATED: "ADDRESS_GENERATED",
  IDENTITY_REGISTERED: "IDENTITY_REGISTERED",
  MINTING_REGISTERED: "MINTING_REGISTERED",
  COMPLETED: "COMPLETED",
};

export const creators = createActions(
  types.SET_MNEMONIC,
  types.SET_REGISTERED_FOR_MINTING,
  types.SET_REGISTRATION_STATE,
  types.SET_REGISTRATION_ERROR,
  types.CREATE_WALLET,
  types.IMPORT_WALLET,
);

export const initialState = {
  mnemonic: null,
  isRegisteredForMinting: false,
  registrationState: null,
  registrationError: false,
};

export const reducer = handleActions(
  {
    [types.SET_MNEMONIC]: (state, { payload: mnemonic }) =>
      Object.freeze({
        ...state,
        mnemonic,
      }),

    [types.SET_REGISTERED_FOR_MINTING]: (
      state,
      { payload: isRegisteredForMinting },
    ) =>
      Object.freeze({
        ...state,
        isRegisteredForMinting,
      }),

    [types.SET_REGISTRATION_STATE]: (state, { payload: registrationState }) =>
      Object.freeze({
        ...state,
        registrationState,
      }),

    [types.SET_REGISTRATION_ERROR]: (state, { payload: registrationError }) =>
      Object.freeze({
        ...state,
        registrationError,
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
    mnemonic: state.mnemonic,
    isRegisteredForMinting: state.isRegisteredForMinting,
    registrationState: state.registrationState,
    registrationError: state.registrationError,
  };
}

export const protocolTypes = types;

export const protocolRegistrationTypes = registrationTypes;

export default creators;
