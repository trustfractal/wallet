import { createSelector } from "reselect";

export const getRegisterAccount = createSelector(
  (state) => state.register,
  (register) => register.account,
);

export const getRegisterPassword = createSelector(
  (state) => state.register,
  (register) => register.password,
);
