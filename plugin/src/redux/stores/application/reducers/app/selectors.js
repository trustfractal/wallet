import { createSelector } from "reselect";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const isSetup = createSelector(
  (state) => state.app,
  (app) => app.setup,
);
