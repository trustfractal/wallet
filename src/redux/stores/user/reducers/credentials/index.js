import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_ATTESTED_CLAIM",
  "UPDATE_ATTESTED_CLAIM",
  "REMOVE_ATTESTED_CLAIM",
  "SET_SELF_ATTESTED_CLAIMS",
  "SET_ATTESTED_CLAIMS",
  "SET_ATTESTED_CLAIM_STATUS",
  "FETCH_ATTESTED_CLAIM_STATUS",
  "FETCH_SELF_ATTESTED_CLAIMS",
]);

export const creators = createActions(
  types.ADD_ATTESTED_CLAIM,
  types.UPDATE_ATTESTED_CLAIM,
  types.REMOVE_ATTESTED_CLAIM,
  types.SET_SELF_ATTESTED_CLAIMS,
  types.SET_ATTESTED_CLAIMS,
  types.SET_ATTESTED_CLAIM_STATUS,
  types.FETCH_ATTESTED_CLAIM_STATUS,
  types.FETCH_SELF_ATTESTED_CLAIMS,
);

export const initialState = {
  selfAttestedClaims: "[]",
  attestedClaims: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_SELF_ATTESTED_CLAIMS]: (
      state,
      { payload: selfAttestedClaims },
    ) =>
      Object.freeze({
        ...state,
        selfAttestedClaims: selfAttestedClaims.serialize(),
      }),
    [types.SET_ATTESTED_CLAIMS]: (state, { payload: attestedClaims }) =>
      Object.freeze({
        ...state,
        attestedClaims: attestedClaims.serialize(),
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
    selfAttestedClaims: state.selfAttestedClaims,
    attestedClaims: state.attestedClaims,
  };
}

export const credentialsTypes = types;

export default creators;
