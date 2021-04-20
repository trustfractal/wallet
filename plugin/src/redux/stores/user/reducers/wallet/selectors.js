import { createSelector } from "reselect";

export const getAccount = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.account,
);

export const isConnectWalletLoading = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.connect.loading,
);

export const getConnectWalletError = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.connect.error,
);

export const isConnectWalletSuccess = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.connect.success,
);
