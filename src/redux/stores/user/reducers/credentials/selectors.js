import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);

export const getApprovedProtocolVerificationCases = createSelector(
  (state) => state.credentials,
  (credentials) =>
    VerificationCasesCollection.parse(
      credentials.verificationCases,
    ).filterApprovedProtocolVerificationCases(),
);

export const getUpcomingCredentials = createSelector(
  (state) => state.credentials,
  (credentials) =>
    VerificationCasesCollection.parse(
      credentials.verificationCases,
    ).filterPendingOrContactedOrIssuingSupportedVerificationCases(),
);
