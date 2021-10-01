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

export const getProtocolEnabled = createSelector(
  (state) => state.app,
  (app) => app.protocolEnabled,
);

export const getNetwork = createSelector(
  (state) => state.app,
  (app) => app.network,
);

export const isLivenessEnabled = createSelector(
  (state) => state.app,
  (app) => app.livenessEnabled,
);
