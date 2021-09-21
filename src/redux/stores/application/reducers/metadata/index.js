import mirrorCreator from "mirror-creator";
import { createActions, handleActions } from "redux-actions";

const types = mirrorCreator([
  "SET_MIGRATIONS",
  "ADD_MIGRATION",
  "RUN_MIGRATIONS",
]);

export const MIGRATIONS = {
  GENERATED_WALLET_MIGRATION: 1,
  NETWORK_MAINNET_MIGRATION: 2,
};

export const creators = createActions(
  types.SET_MIGRATIONS,
  types.ADD_MIGRATION,
  types.RUN_MIGRATIONS,
);

export const initialState = {
  migrations: [],
};

export const reducer = handleActions(
  {
    [types.SET_MIGRATIONS]: (state, { payload: migrations }) =>
      Object.freeze({
        ...state,
        migrations,
      }),
    [types.ADD_MIGRATION]: (state, { payload: migration }) =>
      Object.freeze({
        ...state,
        migrations: state.migrations.includes(migration)
          ? state.migrations
          : [...state.migrations, migration],
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
    migrations: state.migrations,
  };
}

export const metadataTypes = types;

export default creators;
