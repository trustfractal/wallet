import { createSelector } from "reselect";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const isSetup = createSelector(
  (state) => state.app,
  (app) => app.setup,
);

export const getVersion = createSelector(
  (state) => state.app,
  (app) => app.version,
);

export const getProtocolOptIn = createSelector(
  (state) => state.app,
  (app) => app.protocolOptIn,
);
