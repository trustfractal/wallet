import { createSelector } from "reselect";

import { KYCTypes } from "@trustfractal/sdk";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCaseStatus from "@models/VerificationCase/status";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);

export const getProtocolVerificationCases = createSelector(
  (state) => state.credentials,
  (credentials) =>
    VerificationCasesCollection.parse(credentials.verificationCases).filter(
      ({ level }) => level.split("+").includes("protocol"),
    ),
);

export const getApprovedProtocolVerificationCases = createSelector(
  (state) => state.credentials,
  (credentials) =>
    VerificationCasesCollection.parse(credentials.verificationCases).filter(
      ({ status, level }) =>
        status === VerificationCaseStatus.APPROVED &&
        level.split("+").includes("protocol"),
    ),
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
