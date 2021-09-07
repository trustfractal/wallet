import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator(["SET_LAST_MIGRATION"]);

export const creators = createActions(types.SET_LAST_MIGRATION);

export const initialState = {
  lastMigration: null,
};

export const reducer = handleActions(
  {
    [types.SET_LAST_MIGRATION]: (state, { payload: lastMigration }) =>
      Object.freeze({
        ...state,
        lastMigration,
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
    lastMigration: state.lastMigration,
  };
}

export default creators;
