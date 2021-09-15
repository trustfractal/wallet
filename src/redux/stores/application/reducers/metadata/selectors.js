import { createSelector } from "reselect";

export const getMigrations = createSelector(
  (state) => state.metadata,
  (metadata) => metadata.migrations,
);
