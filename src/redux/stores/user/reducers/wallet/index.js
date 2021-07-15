import { BigNumber } from "ethers";

import StakingStatus from "@models/Staking/status";
import TokenTypes from "@models/Token/types";
import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "CONNECT_WALLET_REQUEST",
  "CONNECT_WALLET_PENDING",
  "CONNECT_WALLET_FAILED",
  "CONNECT_WALLET_SUCCESS",
  "CONNECT_WALLET_RESET",
  "FETCH_STAKING_DETAILS",
  "FETCH_TOKEN_STAKING_DETAILS",
  "UPDATE_STAKING_DETAILS",
  "SET_ACCOUNT",
  "SET_STAKING_DETAILS",
  "SET_STAKING_STATUS",
  "SET_STAKING_ALLOWED_AMOUNT",
  "SET_STAKING_LAST_UPDATED",
]);

export const creators = createActions(
  types.CONNECT_WALLET_REQUEST,
  types.CONNECT_WALLET_PENDING,
  types.CONNECT_WALLET_FAILED,
  types.CONNECT_WALLET_SUCCESS,
  types.CONNECT_WALLET_RESET,
  types.FETCH_STAKING_DETAILS,
  types.FETCH_TOKEN_STAKING_DETAILS,
  types.UPDATE_STAKING_DETAILS,
  types.SET_ACCOUNT,
  types.SET_STAKING_DETAILS,
  types.SET_STAKING_STATUS,
  types.SET_STAKING_ALLOWED_AMOUNT,
  types.SET_STAKING_LAST_UPDATED,
);

export const initialState = {
  account: "",
  connect: {
    success: false,
    loading: false,
    error: "",
  },
  staking: {
    details: {
      [TokenTypes.FCL]: "{}",
      [TokenTypes.FCL_ETH_LP]: "{}",
    },
    status: {
      [TokenTypes.FCL]: StakingStatus.START,
      [TokenTypes.FCL_ETH_LP]: StakingStatus.START,
    },
    allowedAmount: BigNumber.from(0),
    lastUpdated: new Date().getTime(),
  },
};

export const reducer = handleActions(
  {
    [types.CONNECT_WALLET_RESET]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.CONNECT_WALLET_REQUEST]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error: "",
        },
      }),
    [types.CONNECT_WALLET_PENDING]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: true,
          error: "",
        },
      }),
    [types.CONNECT_WALLET_FAILED]: (state, { payload: error }) =>
      Object.freeze({
        ...state,
        connect: {
          success: false,
          loading: false,
          error,
        },
      }),
    [types.CONNECT_WALLET_SUCCESS]: (state) =>
      Object.freeze({
        ...state,
        connect: {
          success: true,
          loading: false,
          error: "",
        },
      }),
    [types.SET_ACCOUNT]: (state, { payload: account }) =>
      Object.freeze({
        ...state,
        account,
      }),
    [types.SET_STAKING_DETAILS]: (state, { payload: { details, token } }) =>
      Object.freeze({
        ...state,
        staking: {
          ...state.staking,
          details: {
            ...state.staking.details,
            [token]: details.serialize(),
          },
        },
      }),
    [types.SET_STAKING_STATUS]: (state, { payload: { status, token } }) =>
      Object.freeze({
        ...state,
        staking: {
          ...state.staking,
          status: {
            ...state.staking.status,
            [token]: status,
          },
        },
      }),
    [types.SET_STAKING_LAST_UPDATED]: (state, { payload: lastUpdated }) =>
      Object.freeze({
        ...state,
        staking: {
          ...state.staking,
          lastUpdated,
        },
      }),
    [types.SET_STAKING_ALLOWED_AMOUNT]: (state, { payload: allowedAmount }) =>
      Object.freeze({
        ...state,
        staking: {
          ...state.staking,
          allowedAmount,
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
    account: state.account,
    staking: state.staking,
  };
}

export const walletTypes = types;

export default creators;
