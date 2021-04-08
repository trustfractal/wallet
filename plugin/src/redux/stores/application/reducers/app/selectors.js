import { createSelector } from "reselect";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const getAccount = createSelector(
  (state) => state.app,
  (app) => app.account,
);
