import { createSelector } from "reselect";

export const getRegisterAccount = createSelector(
  (state) => state.register,
  (register) => register.account,
);

export const getRegisterPassword = createSelector(
  (state) => state.register,
  (register) => register.password,
);

export const isWalletSetupLoading = createSelector(
  (state) => state.register,
  (register) => register.wallet.loading,
);

export const getWalletSetupError = createSelector(
  (state) => state.register,
  (register) => register.wallet.error,
);

export const isWalletSetupSuccess = createSelector(
  (state) => state.register,
  (register) => register.wallet.success,
);
