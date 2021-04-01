import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import RequestsCollection from "@models/Request/RequestsCollection";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const isSignedIn = createSelector(
  (state) => state.app,
  (app) => app.signIn,
);

export const getCredentials = createSelector(
  (state) => state.credentials,
  (credentials) => CredentialsCollection.parse(credentials.credentials),
);

export const getRequests = createSelector(
  (state) => state.requests,
  (requests) => RequestsCollection.parse(requests.requests),
);

export const getAcceptedRequests = createSelector(
  (state) => state.requests,
  (requests) => {
    return RequestsCollection.parse(requests.requests).getAccepted();
  },
);

export const getDeclinedRequests = createSelector(
  (state) => state.requests,
  (requests) => {
    return RequestsCollection.parse(requests.requests).getDeclined();
  },
);

export const getPendingRequests = createSelector(
  (state) => state.requests,
  (requests) => {
    return RequestsCollection.parse(requests.requests).getPending();
  },
);

const selectors = {
  isSignedIn,
  getCredentials,
  getRequests,
  getAcceptedRequests,
  getDeclinedRequests,
  getPendingRequests,
};

export default selectors;
