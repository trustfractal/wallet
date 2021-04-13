import { createSelector } from "reselect";

import RequestsCollection from "@models/Request/RequestsCollection";

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
