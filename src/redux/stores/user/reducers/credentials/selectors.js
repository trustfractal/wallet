import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) =>
    new CredentialsCollection(
      ...CredentialsCollection.parse(credentials.selfAttestedClaims),
      ...CredentialsCollection.parse(credentials.attestedClaims),
    ),
);

export const getSelfAttestedClaims = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.selfAttestedClaims),
);

export const getAttestedClaims = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.attestedClaims),
);
