import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "ADD_DATA_ENTRY",
  "REMOVE_DATA_ENTRY",
  "SET_DATA",
]);

export const creators = createActions(
  types.ADD_DATA_ENTRY,
  types.REMOVE_DATA_ENTRY,
  types.SET_DATA,
);

export const initialState = {
  data: "[]",
};

export const reducer = handleActions(
  {
    [types.SET_DATA]: (state, { payload: data }) =>
      Object.freeze({
        ...state,
        data: data.serialize(),
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
    data: state.data,
  };
}

export const dataTypes = types;

export default creators;
