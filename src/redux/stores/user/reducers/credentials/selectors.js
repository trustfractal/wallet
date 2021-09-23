import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCaseStatus from "@models/VerificationCase/status";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";
import KYCTypes from "@models/KYCTypes";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);

export const getUpcomingCredentials = createSelector(
  (state) => state.credentials,
  (credentials) =>
    VerificationCasesCollection.parse(credentials.verificationCases).filter(
      ({ status, level }) =>
        KYCTypes.isSupported(level) &&
        status === VerificationCaseStatus.PENDING &&
        status === VerificationCaseStatus.CONTACTED &&
        status === VerificationCaseStatus.ISSUING,
    ),
);
