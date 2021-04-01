import { createSelector } from "reselect";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import DataCollection from "@models/Data/DataCollection";
import RequestsCollection from "@models/Request/RequestsCollection";

export const isLaunched = createSelector(
  (state) => state.app,
  (app) => app.launched,
);

export const isSignedIn = createSelector(
  (state) => state.kilt,
  (kilt) => kilt.mnemonic.mnemonic.length > 0,
);

export const getBalance = createSelector(
  (state) => state.kilt,
  (kilt) => kilt.balance,
);

export const getCredentials = createSelector(
  (state) => state.kilt,
  (kilt) => CredentialsCollection.parse(kilt.credentials),
);

export const getData = createSelector(
  (state) => state.data,
  (data) => DataCollection.parse(data.data),
);

export const getIdentity = createSelector(
  (state) => state.kilt,
  (kilt) => kilt.mnemonic.identity,
);

export const getMnemonic = createSelector(
  (state) => state.kilt,
  (kilt) => kilt.mnemonic.mnemonic,
);

export const getPublicIdentity = createSelector(
  (state) => state.kilt,
  (kilt) => kilt.mnemonic.identity.getPublicIdentity(),
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
  getPublicIdentity,
  getBalance,
  getCredentials,
  getData,
  getIdentity,
  getMnemonic,
  getRequests,
  getAcceptedRequests,
  getDeclinedRequests,
  getPendingRequests,
};

export default selectors;
