import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);
