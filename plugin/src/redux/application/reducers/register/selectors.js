import { createSelector } from "reselect";

export const getRegisterPassword = createSelector(
  (state) => state.register,
  (register) => register.password,
);
