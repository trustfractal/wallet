import { createSelector } from "reselect";

export const getEmails = createSelector(
  (state) => state.profile,
  (profile) => profile.emails,
);

export const getPhoneNumbers = createSelector(
  (state) => state.profile,
  (profile) => profile.phoneNumbers,
);
