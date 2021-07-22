import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import CredentialsVersions from "@models/Credential/versions";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);

export const getSelfAttestedClaims = createSelector(
  (state) => state.credentials,
  (credentials) =>
    new CredentialsCollection(
      ...CredentialsCollection.parse(credentials.credentials).filter(
        (credential) => credential.version === CredentialsVersions.VERSION_TWO,
      ),
    ),
);

export const getAttestedClaims = createSelector(
  (state) => state.credentials,
  (credentials) =>
    new CredentialsCollection(
      ...CredentialsCollection.parse(credentials.credentials).filter(
        (credential) => credential.version === CredentialsVersions.VERSION_ONE,
      ),
    ),
);
