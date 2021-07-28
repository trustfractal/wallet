import { createSelector } from "reselect";

export const getWallet = createSelector(
  (state) => state.protocol,
  (protocol) => protocol.wallet,
);
