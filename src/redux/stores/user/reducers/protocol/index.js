import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_MNEMONIC",
  "SET_REGISTERED_FOR_MINTING",
  "SET_REGISTRATION_SUCCESS",
  "CREATE_WALLET",
]);

export const creators = createActions(
  types.SET_MNEMONIC,
  types.SET_REGISTERED_FOR_MINTING,
  types.SET_REGISTRATION_SUCCESS,
  types.CREATE_WALLET,
);

export const initialState = {
  mnemonic: null,
  isRegisteredForMinting: false,
  registrationSuccess: true,
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

    [types.SET_REGISTRATION_SUCCESS]: (
      state,
      { payload: registrationSuccess },
    ) =>
      Object.freeze({
        ...state,
        registrationSuccess,
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
    registrationSuccess: state.registrationSuccess,
  };
}

export const protocolTypes = types;

export default creators;
