import { createSelector } from "reselect";

import StakingDetails from "@models/Staking/StakingDetails";

export const getAccount = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.account,
);

export const getStakingDetails = createSelector(
  (state) => state.wallet,
  (wallet) =>
    Object.keys(wallet.staking.details).reduce(
      (memo, token) => ({
        ...memo,
        [token]: StakingDetails.parse(wallet.staking.details[token]),
      }),
      {},
    ),
);

export const getStakingStatus = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.staking.status,
);

export const getStakingAllowedAmount = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.staking.allowedAmount,
);

export const getStakingLastUpdated = createSelector(
  (state) => state.wallet,
  (wallet) => wallet.staking.lastUpdated,
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
