import { createSelector } from "reselect";

export const getAccount = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.account,
);
