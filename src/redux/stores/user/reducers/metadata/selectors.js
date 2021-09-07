import { createSelector } from "reselect";

export const getLastMigration = createSelector(
  (state) => state.metadata,
  (metadata) => metadata.lastMigration,
);
