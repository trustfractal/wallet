import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "STARTUP",
  "SET_LAUNCHED",
  "SET_WALLET_AVAILABILITY",
]);

export const creators = createActions(
  types.STARTUP,
  types.SET_LAUNCHED,
  types.SET_WALLET_AVAILABILITY,
);

export const initialState = {
  launched: false,
  wallet: false,
};

export const reducer = handleActions(
  {
    [types.SET_LAUNCHED]: (state, { payload: launched }) =>
      Object.freeze({
        ...state,
        launched,
      }),
    [types.SET_WALLET_AVAILABILITY]: (state, { payload: wallet }) =>
      Object.freeze({
        ...state,
        wallet,
      }),
  },
  initialState,
);

export const appTypes = types;

export default creators;
