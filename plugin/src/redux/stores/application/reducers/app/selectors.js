import { createSelector } from "reselect";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const isWalletAvailable = createSelector(
  (state) => state.app,
  (app) => app.wallet,
);
